import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3";
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
  "SUPABASE_SERVICE_ROLE_KEY",
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

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const buildResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    ...init,
  });

export const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return buildResponse({ error: "multipart/form-data required" }, { status: 400 });
    }

    const form = await req.formData();
    const file = form.get("file");
    const treeId = form.get("treeId");
    const fileName = (form.get("fileName") as string) || (file instanceof File ? file.name : "upload");
    const mimeType = (form.get("mimeType") as string) || (file instanceof File ? file.type : "application/octet-stream");
    const fileSizeBytes =
      typeof form.get("fileSizeBytes") === "string"
        ? Number(form.get("fileSizeBytes"))
        : file instanceof File
          ? file.size
          : 0;
    const status = form.get("status");

    if (typeof treeId !== "string" || treeId.trim().length === 0) {
      return buildResponse({ error: "treeId is required" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return buildResponse({ error: "file is required" }, { status: 400 });
    }
    if (fileSizeBytes <= 0 || fileSizeBytes > MAX_FILE_SIZE) {
      return buildResponse({ error: `fileSizeBytes must be between 1 and ${MAX_FILE_SIZE}` }, { status: 400 });
    }
    if (!mimeType.startsWith("image/")) {
      return buildResponse({ error: "Only image uploads are supported" }, { status: 400 });
    }

    const allowedStatuses = ["approved", "flagged", "deleted", "test", "pending", "skipped"];
    const statusValue = typeof status === "string" && allowedStatuses.includes(status)
      ? status
      : "pending";

    const ext = fileName.includes(".") ? fileName.split(".").pop() : undefined;
    const safeExt = ext && /^[a-zA-Z0-9]+$/.test(ext) ? `.${ext}` : "";
    const objectKey = `tree-media/${treeId}/${crypto.randomUUID()}${safeExt}`;

    const buffer = new Uint8Array(await file.arrayBuffer());
    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: objectKey,
        ContentType: mimeType,
        Body: buffer,
      }),
    );

    const { data, error } = await supabase
      .from("tree_media")
      .insert({
        tree_id: treeId,
        s3_key: objectKey,
        mime_type: mimeType,
        file_size_bytes: fileSizeBytes,
        status: statusValue,
        metadata: { originalFileName: fileName },
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to persist tree_media", error);
      return buildResponse({ error: "Unable to save media record" }, { status: 500 });
    }

    return buildResponse({ media: data });
  } catch (error) {
    console.error("upload-proxy failed", error);
    return buildResponse({ error: "Upload proxy failed" }, { status: 500 });
  }
};

if (import.meta.main) {
  Deno.serve(handler);
}

