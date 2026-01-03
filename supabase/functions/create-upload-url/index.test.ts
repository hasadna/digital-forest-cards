import { assertEquals } from "jsr:@std/assert@1.0.8";
import { handler } from "./index.ts";

const makeReq = (body: unknown, method = "POST") =>
  new Request("http://localhost/functions/v1/create-upload-url", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

Deno.test("create-upload-url rejects missing treeId", async () => {
  const res = await handler(makeReq({ fileName: "a.jpg", mimeType: "image/jpeg", fileSizeBytes: 10 }));
  assertEquals(res.status, 400);
});

Deno.test("create-upload-url rejects non-image mime", async () => {
  const res = await handler(makeReq({ treeId: "T1", fileName: "a.jpg", mimeType: "application/pdf", fileSizeBytes: 10 }));
  assertEquals(res.status, 400);
});

Deno.test("create-upload-url rejects oversize", async () => {
  const res = await handler(
    makeReq({ treeId: "T1", fileName: "a.jpg", mimeType: "image/jpeg", fileSizeBytes: 51 * 1024 * 1024 }),
  );
  assertEquals(res.status, 400);
});

