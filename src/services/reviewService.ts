import { supabase } from "@/lib/supabaseClient";
import type { TreeMedia, TreeMediaStatus } from "@/types/tree";

const getClient = () => {
  if (!supabase) {
    throw new Error("Supabase client not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }
  return supabase;
};

const normalizeMedia = (item: any): TreeMedia => ({
  id: item.id,
  treeId: item.tree_id,
  s3Key: item.s3_key,
  publicUrl: item.public_url,
  mimeType: item.mime_type,
  fileSizeBytes: item.file_size_bytes,
  status: item.status,
  uploadedBy: item.uploaded_by,
  metadata: item.metadata,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});

export type ReviewListParams = {
  status?: TreeMediaStatus;
  limit?: number;
  offset?: number;
  treeIds?: string[];
};

export const listReviewMedia = async (params: ReviewListParams) => {
  const client = getClient();
  const { data, error } = await client.functions.invoke("review-media", {
    body: {
      action: "list",
      status: params.status,
      limit: params.limit,
      offset: params.offset,
      treeIds: params.treeIds,
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to load review media");
  }

  return {
    items: (data?.items ?? []).map(normalizeMedia),
    count: data?.count ?? 0,
    status: data?.status as TreeMediaStatus,
  };
};

export const updateReviewMediaStatus = async (id: string, status: TreeMediaStatus) => {
  const client = getClient();
  const { data, error } = await client.functions.invoke("review-media", {
    body: { action: "update", id, status },
  });
  if (error) {
    throw new Error(error.message || "Failed to update media status");
  }
  return normalizeMedia(data?.media);
};
