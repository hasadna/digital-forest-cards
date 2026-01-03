import { supabase } from "@/lib/supabaseClient";

const getClient = () => {
  if (!supabase) {
    throw new Error("Supabase client not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }
  return supabase;
};

export type UploadSpec = {
  uploadUrl: string;
  s3Key: string;
  headers: Record<string, string>;
};

export const requestUploadUrl = async (params: {
  treeId: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
}): Promise<UploadSpec> => {
  const client = getClient();
  const { data, error } = await client.functions.invoke("create-upload-url", { body: params });
  if (error) throw new Error(error.message || "Failed to get upload URL");
  return data as UploadSpec;
};

export const uploadFileToS3 = async (url: string, file: File, headers: Record<string, string>) => {
  const res = await fetch(url, {
    method: "PUT",
    headers,
    body: file,
  });
  if (!res.ok) {
    throw new Error("Upload to storage failed");
  }
};

export const recordUpload = async (params: {
  treeId: string;
  s3Key: string;
  mimeType: string;
  fileSizeBytes: number;
  originalFileName?: string;
}) => {
  const client = getClient();
  const { data, error } = await client.functions.invoke("record-upload", { body: params });
  if (error) throw new Error(error.message || "Failed to save media metadata");
  return data;
};

export const fetchTreeMedia = async (treeId: string) => {
  const client = getClient();
  const { data, error } = await client
    .from("tree_media")
    .select("*")
    .eq("tree_id", treeId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }
  return data;
};

export const uploadViaProxy = async (params: { treeId: string; file: File }) => {
  const client = getClient();
  const form = new FormData();
  form.append("treeId", params.treeId);
  form.append("file", params.file);
  form.append("fileName", params.file.name);
  form.append("mimeType", params.file.type);
  form.append("fileSizeBytes", params.file.size.toString());

  const { data, error } = await client.functions.invoke("upload-proxy", { body: form });
  if (error) throw new Error(error.message || "Failed to upload via proxy");
  return data;
};

