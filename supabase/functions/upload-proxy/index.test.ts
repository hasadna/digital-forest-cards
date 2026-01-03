import { assertEquals } from "jsr:@std/assert@1.0.8";
import { handler } from "./index.ts";

const makeMultipart = (parts: Record<string, string | Blob>) => {
  const form = new FormData();
  for (const [k, v] of Object.entries(parts)) {
    form.append(k, v);
  }
  return new Request("http://localhost/functions/v1/upload-proxy", {
    method: "POST",
    body: form,
  });
};

Deno.test("upload-proxy rejects missing file", async () => {
  const res = await handler(makeMultipart({ treeId: "T1" }));
  assertEquals(res.status, 400);
});

Deno.test("upload-proxy rejects non-image file", async () => {
  const blob = new Blob(["hello"], { type: "text/plain" });
  const res = await handler(makeMultipart({ treeId: "T1", file: blob, fileName: "a.txt", mimeType: "text/plain" }));
  assertEquals(res.status, 400);
});

Deno.test("upload-proxy rejects oversize", async () => {
  const large = new Blob([new Uint8Array(51 * 1024 * 1024)], { type: "image/png" });
  const res = await handler(makeMultipart({ treeId: "T1", file: large, fileName: "big.png", mimeType: "image/png" }));
  assertEquals(res.status, 400);
});

