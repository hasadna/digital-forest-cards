import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { PutObjectCommand, S3Client } from "npm:@aws-sdk/client-s3";
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner";

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

const extensionFromMime = (mimeType: string) => {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "image/heic": "heic",
    "image/heif": "heif",
    "image/svg+xml": "svg",
  };
  return map[mimeType] ?? mimeType.split("/")[1]?.replace(/[^\w]/g, "");
};

const resolveExtension = (fileName: string | undefined, mimeType: string) => {
  if (fileName?.includes(".")) {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext && /^[a-z0-9]+$/.test(ext)) {
      return ext;
    }
  }
  return extensionFromMime(mimeType) ?? "img";
};

const sanitizeTreeId = (treeId: string) => {
  const cleaned = treeId.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_]/g, "");
  return cleaned.length > 0 ? cleaned : "tree";
};

const buildResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    ...init,
  });

export const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { treeId, fileName, mimeType, fileSizeBytes } = await req.json();

    if (typeof treeId !== "string" || treeId.trim().length === 0) {
      return buildResponse({ error: "treeId is required" }, { status: 400 });
    }

    if (typeof mimeType !== "string" || !mimeType.startsWith("image/")) {
      return buildResponse({ error: "Only image uploads are supported" }, { status: 400 });
    }

    if (typeof fileSizeBytes !== "number" || fileSizeBytes <= 0 || fileSizeBytes > MAX_FILE_SIZE) {
      return buildResponse({ error: `fileSizeBytes must be between 1 and ${MAX_FILE_SIZE}` }, { status: 400 });
    }

    const normalizedTreeId = sanitizeTreeId(treeId);
    const fileExtension = resolveExtension(fileName, mimeType);
    const objectKey = `tree-media/${normalizedTreeId}/${crypto.randomUUID()}${fileExtension ? `.${fileExtension}` : ""}`;

    const command = new PutObjectCommand({
      Bucket: env.BUCKET_NAME,
      Key: objectKey,
      ContentType: mimeType,
    });

    const expiresIn = 60 * 5;
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });

    return buildResponse({
      uploadUrl,
      s3Key: objectKey,
      expiresIn,
      bucket: env.BUCKET_NAME,
      maxFileSize: MAX_FILE_SIZE,
      headers: {
        "Content-Type": mimeType,
      },
    });
  } catch (error) {
    console.error("Failed to create upload URL", error);
    return buildResponse({ error: "Unable to create upload URL" }, { status: 500 });
  }
};

if (import.meta.main) {
  Deno.serve(handler);
}
