import { assertEquals } from "jsr:@std/assert@1.0.8";
import { handler } from "./index.ts";

const makeReq = (body: unknown, method = "POST") =>
  new Request("http://localhost/functions/v1/record-upload", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

Deno.test("record-upload rejects missing treeId", async () => {
  const res = await handler(makeReq({ s3Key: "k", mimeType: "image/png", fileSizeBytes: 1 }));
  assertEquals(res.status, 400);
});

Deno.test("record-upload rejects missing s3Key", async () => {
  const res = await handler(makeReq({ treeId: "T1", mimeType: "image/png", fileSizeBytes: 1 }));
  assertEquals(res.status, 400);
});

Deno.test("record-upload rejects non-image mime", async () => {
  const res = await handler(makeReq({ treeId: "T1", s3Key: "k", mimeType: "application/pdf", fileSizeBytes: 1 }));
  assertEquals(res.status, 400);
});

Deno.test("record-upload rejects oversize", async () => {
  const res = await handler(
    makeReq({ treeId: "T1", s3Key: "k", mimeType: "image/png", fileSizeBytes: 51 * 1024 * 1024 }),
  );
  assertEquals(res.status, 400);
});

