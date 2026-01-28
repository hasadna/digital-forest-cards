import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { HeadObjectCommand, S3Client } from "npm:@aws-sdk/client-s3";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const FALLBACK_REGION = "us-east-1";

const requiredEnvVars = [
  "S3_ENDPOINT_URL",
  "BUCKET_NAME",
  "AWS_ACCESS_KEY_ID_UPLOADER",
  "AWS_SECRET_ACCESS_KEY_UPLOADER",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
];

const env = Object.fromEntries(
  requiredEnvVars.map((key) => {
    const value = Deno.env.get(key);
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return [key, value];
  }),
);

const s3Region = Deno.env.get("S3_REGION") ?? FALLBACK_REGION;
const s3Client = new S3Client({
  region: s3Region,
  endpoint: env.S3_ENDPOINT_URL,
  forcePathStyle: true,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID_UPLOADER,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY_UPLOADER,
  },
});

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

const buildResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    ...init,
  });

const getRequesterIp = (req: Request) => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim();
  }
  return req.headers.get("x-real-ip") ?? req.headers.get("cf-connecting-ip") ?? undefined;
};

const compactObject = (input: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined && value !== null));

export const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      treeId,
      s3Key,
      mimeType,
      fileSizeBytes,
      originalFileName,
      metadata = {},
      uploadedBy,
      status,
    } = await req.json();

    if (typeof treeId !== "string" || treeId.trim().length === 0) {
      return buildResponse({ error: "treeId is required" }, { status: 400 });
    }

    if (typeof s3Key !== "string" || s3Key.trim().length === 0) {
      return buildResponse({ error: "s3Key is required" }, { status: 400 });
    }

    if (typeof mimeType !== "string" || !mimeType.startsWith("image/")) {
      return buildResponse({ error: "mimeType must be an image" }, { status: 400 });
    }

    if (typeof fileSizeBytes !== "number" || fileSizeBytes <= 0 || fileSizeBytes > MAX_FILE_SIZE) {
      return buildResponse({ error: `fileSizeBytes must be between 1 and ${MAX_FILE_SIZE}` }, { status: 400 });
    }

    if (typeof metadata !== "object" || metadata === null || Array.isArray(metadata)) {
      return buildResponse({ error: "metadata must be an object" }, { status: 400 });
    }

    const allowedStatuses = ["approved", "flagged", "deleted", "test", "pending", "skipped"];
    const statusValue = status && typeof status === "string" ? status : "pending";
    if (!allowedStatuses.includes(statusValue)) {
      return buildResponse({ error: "invalid status" }, { status: 400 });
    }

    try {
      await s3Client.send(new HeadObjectCommand({ Bucket: env.BUCKET_NAME, Key: s3Key }));
    } catch (error) {
      console.error("S3 object verification failed", error);
      return buildResponse({ error: "Uploaded object could not be verified" }, { status: 400 });
    }

    const requesterIp = getRequesterIp(req);
    const metadataPayload = compactObject({
      ...metadata,
      originalFileName,
      uploaderIp: requesterIp,
      userAgent: req.headers.get("user-agent") ?? undefined,
    });

    const { data, error } = await supabase
      .from("tree_media")
      .insert({
        tree_id: treeId,
        s3_key: s3Key,
        mime_type: mimeType,
        file_size_bytes: fileSizeBytes,
        status: statusValue,
        metadata: metadataPayload,
        uploaded_by: typeof uploadedBy === "string" ? uploadedBy : null,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to persist tree_media", error);
      return buildResponse({ error: "Unable to save media record" }, { status: 500 });
    }

    return buildResponse({ media: data });
  } catch (error) {
    console.error("record-upload failed", error);
    return buildResponse({ error: "Unable to record upload" }, { status: 500 });
  }
};

if (import.meta.main) {
  Deno.serve(handler);
}
