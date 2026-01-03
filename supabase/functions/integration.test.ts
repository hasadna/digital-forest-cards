// Integration smoke tests against deployed Supabase Edge Functions.
// Requires network and env: SUPABASE_URL, SUPABASE_ANON_KEY, BUCKET_NAME.

import { assertEquals } from "jsr:@std/assert@1.0.8";

const env = {
  supabaseUrl: Deno.env.get("SUPABASE_URL"),
  anonKey: Deno.env.get("SUPABASE_ANON_KEY"),
  bucket: Deno.env.get("BUCKET_NAME") ?? "digital-forest-ugc",
};

if (!env.supabaseUrl || !env.anonKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY for integration tests");
}

const fnUrl = (name: string) => `${env.supabaseUrl}/functions/v1/${name}`;
const authHeaders = { Authorization: `Bearer ${env.anonKey}` };

const tinyPng = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00,
  0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde, 0x00, 0x00, 0x00, 0x0a, 0x49,
  0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00,
  0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);

const uniqueSuffix = crypto.randomUUID().slice(0, 8);

Deno.test("create-upload-url -> PUT -> record-upload", async () => {
  const treeId = `TEST_INTEGRATION_${uniqueSuffix}`;
  const fileName = `int-test-${uniqueSuffix}.png`;

  // 1) Create presigned URL
  const createRes = await fetch(fnUrl("create-upload-url"), {
    method: "POST",
    headers: {
      ...authHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      treeId,
      fileName,
      mimeType: "image/png",
      fileSizeBytes: tinyPng.byteLength,
      status: "test",
    }),
  });
  assertEquals(createRes.status, 200);
  const uploadSpec = await createRes.json();
  if (!uploadSpec?.uploadUrl || !uploadSpec?.s3Key) {
    throw new Error("Missing uploadUrl or s3Key in response");
  }

  // 2) Upload to S3 via presigned URL (server-side fetch, no CORS)
  const putRes = await fetch(uploadSpec.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "image/png" },
    body: tinyPng,
  });
  assertEquals(putRes.status, 200);
  // Consume body to avoid resource leak warnings
  await putRes.arrayBuffer();

  // 3) Record the upload
  const recordRes = await fetch(fnUrl("record-upload"), {
    method: "POST",
    headers: {
      ...authHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      treeId,
      s3Key: uploadSpec.s3Key,
      mimeType: "image/png",
      fileSizeBytes: tinyPng.byteLength,
      originalFileName: fileName,
      status: "test",
    }),
  });
  assertEquals(recordRes.status, 200);
  const recordBody = await recordRes.json();
  if (!recordBody?.media?.id) {
    throw new Error("record-upload did not return media");
  }
});

Deno.test("upload-proxy uploads and records", async () => {
  const treeId = `TEST_PROXY_${uniqueSuffix}`;
  const fileName = `proxy-${uniqueSuffix}.png`;

  const form = new FormData();
  form.append("treeId", treeId);
  form.append("file", new Blob([tinyPng], { type: "image/png" }), fileName);
  form.append("fileName", fileName);
  form.append("mimeType", "image/png");
  form.append("fileSizeBytes", tinyPng.byteLength.toString());
  form.append("status", "test");

  const res = await fetch(fnUrl("upload-proxy"), {
    method: "POST",
    headers: authHeaders,
    body: form,
  });
  assertEquals(res.status, 200);
  const body = await res.json();
  if (!body?.media?.id) {
    throw new Error("upload-proxy did not return media");
  }
});

