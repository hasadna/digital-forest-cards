import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const requiredEnvVars = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];

const env = Object.fromEntries(
  requiredEnvVars.map((key) => {
    const value = Deno.env.get(key);
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return [key, value];
  }),
);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
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

const allowedStatuses = ["approved", "flagged", "deleted", "test", "pending", "skipped"];

type ListPayload = {
  action?: "list";
  status?: string;
  limit?: number;
  offset?: number;
  treeIds?: string[];
};

type UpdatePayload = {
  action: "update";
  id: string;
  status: string;
};

export const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return buildResponse({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const payload = (await req.json()) as ListPayload | UpdatePayload;
    const action = payload?.action ?? "list";

    if (action === "update") {
      const { id, status } = payload as UpdatePayload;
      if (typeof id !== "string" || id.trim().length === 0) {
        return buildResponse({ error: "id is required" }, { status: 400 });
      }
      if (typeof status !== "string" || !allowedStatuses.includes(status)) {
        return buildResponse({ error: "invalid status" }, { status: 400 });
      }

      const { data, error } = await supabase
        .from("tree_media")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Failed to update tree_media status", error);
        return buildResponse({ error: "Failed to update status" }, { status: 500 });
      }

      return buildResponse({ media: data });
    }

    const { status, limit, offset, treeIds } = payload as ListPayload;
    const statusValue = typeof status === "string" && allowedStatuses.includes(status) ? status : "pending";
    const safeLimit = typeof limit === "number" && limit > 0 ? Math.min(limit, 200) : 50;
    const safeOffset = typeof offset === "number" && offset >= 0 ? offset : 0;

    let query = supabase
      .from("tree_media")
      .select("*", { count: "exact" })
      .eq("status", statusValue)
      .order("created_at", { ascending: false })
      .range(safeOffset, safeOffset + safeLimit - 1);

    if (Array.isArray(treeIds) && treeIds.length > 0) {
      query = query.in("tree_id", treeIds);
    }

    const { data, error, count } = await query;
    if (error) {
      console.error("Failed to list tree_media", error);
      return buildResponse(
        {
          error: "Failed to load media",
          details: error.message,
        },
        { status: 500 },
      );
    }

    return buildResponse({ items: data ?? [], count: count ?? 0, status: statusValue });
  } catch (error) {
    console.error("review-media failed", error);
    return buildResponse({ error: "Review media request failed" }, { status: 500 });
  }
};

if (import.meta.main) {
  Deno.serve(handler);
}
