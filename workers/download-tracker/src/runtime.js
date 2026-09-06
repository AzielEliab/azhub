/**
 * AZHub hosted runtime: /v1 ops, OpenAPI, MCP pointer, FragGate door proxy.
 * /v1 never touches DOWNLOADS KV. Dual surface — not UI-only.
 *
 * Door paths (`/v1/fraggate/*`, `/v1/runtime/*`) PROXY to aziel-runtime.
 * Local ops are single-segment `/v1/{op}` only.
 */
import {
  ALIASES,
  AZINTERFACE,
  FRAGGATE,
  FRAGGATE_CALL,
  FRAGGATE_MCP,
  HOST,
  IDENTITY,
  LIMITATION,
  LIVE_OPS,
  OPS,
  PRODUCT,
  RUNTIME,
  SKILL_MD,
  STUB_OPS,
  VERSION,
  dispatch,
} from "./engine.js";
import { classifyV1Path, doorTargetUrl } from "./door.js";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, MCP-Protocol-Version, mcp-session-id, User-Agent, Authorization",
  };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders() },
  });
}

function originOf(request) {
  try {
    return new URL(request.url).origin;
  } catch {
    return HOST;
  }
}

const OP_DESC = {
  health: "Liveness. Does not increment downloads.",
  skill: "Return AZHub skill markdown.",
  region_list: "Geometry regions + inert occupancy. No ranking.",
  place_module: "Custody-of-placement. Region, z-order, optional bound. Never unlocks.",
  remove_module: "Withdraw a placed module. Cuts attached tethers.",
  tether_declare: "Declare a visible, cuttable, session-scoped corridor. Never auto-wire.",
  tether_cut: "Cut a declared tether corridor.",
  tether_list: "List declared tethers.",
  blank_key_status: "Blank Key: geometry without intent; co-presence inert.",
};

function toolDefs() {
  return LIVE_OPS.map((name) => ({
    name: "azhub_" + name,
    description: OP_DESC[name] || name,
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string" },
        kind: { type: "string", enum: ["app", "lock"] },
        region: { type: "string" },
        z: { type: "integer" },
        bound: { type: "boolean" },
        id: { type: "string" },
        from: { type: "string" },
        to: { type: "string" },
        session_id: { type: "string" },
        x: { type: "number" },
        y: { type: "number" },
      },
    },
  }));
}

function openapiSpec(origin) {
  const paths = {
    "/v1/health": { get: { operationId: "azhub_health", summary: "Liveness. Does not increment downloads.", responses: { "200": { description: "ok" } } } },
    "/v1/skill": { get: { operationId: "azhub_skill", summary: "Skill markdown.", responses: { "200": { description: "markdown" } } } },
    "/openapi.json": { get: { operationId: "azhub_openapi", summary: "OpenAPI 3.1 — first-class backend. Safe ops doubled for MCP/UI.", responses: { "200": { description: "spec" } } } },
    "/mcp": {
      get: { operationId: "azhub_mcp_docs", summary: "MCP docs + FragGate pointer. Safe ops listed.", responses: { "200": { description: "docs" } } },
      post: { operationId: "azhub_mcp", summary: "Pointer to FragGate (slug=azhub). Not a second MCP.", responses: { "200": { description: "rpc pointer" } } },
    },
  };
  for (const op of LIVE_OPS) {
    if (op === "health" || op === "skill") continue;
    paths["/v1/" + op] = {
      post: {
        operationId: "azhub_" + op,
        summary: (ALIASES[op] ? "Alias of " + ALIASES[op] + ". " : "") + (OP_DESC[op] || "UI action + MCP/FragGate op."),
        requestBody: { content: { "application/json": { schema: { type: "object" } } } },
        responses: { "200": { description: "display + result" } },
      },
    };
  }
  paths["/v1/fraggate/call"] = {
    post: {
      operationId: "azhub_fraggate_call_proxy",
      summary: "PROXY to aziel-runtime POST /v1/fraggate/call. Not a local op.",
      requestBody: { content: { "application/json": { schema: { type: "object" } } } },
      responses: { "200": { description: "FragGate ResultEnvelope" } },
    },
  };
  paths["/v1/fraggate/list"] = {
    get: {
      operationId: "azhub_fraggate_list_proxy",
      summary: "PROXY to aziel-runtime GET /v1/fraggate/list. Not a local op.",
      responses: { "200": { description: "hashed registry" } },
    },
  };
  paths["/v1/runtime/call"] = {
    post: {
      operationId: "azhub_runtime_call_proxy",
      summary: "Alias PROXY → origin /v1/fraggate/call. Not a local op.",
      requestBody: { content: { "application/json": { schema: { type: "object" } } } },
      responses: { "200": { description: "FragGate ResultEnvelope" } },
    },
  };
  paths["/v1/runtime/list"] = {
    get: {
      operationId: "azhub_runtime_list_proxy",
      summary: "Alias PROXY → origin /v1/fraggate/list. Not a local op.",
      responses: { "200": { description: "hashed registry" } },
    },
  };
  return {
    openapi: "3.1.0",
    info: {
      title: "AZHub runtime",
      version: VERSION,
      summary: "Dual surface. Human UI is this Worker /v1. AI / MCP path is FragGate only (slug=azhub). Parent wires the engine later.",
      description: LIMITATION + " Agent door is FragGate only: POST " + FRAGGATE_CALL + " {slug:azhub,op,payload}. Catalog MCP: POST " + FRAGGATE_MCP + ". This host /mcp is a pointer, not a second agent brand. Human chrome uses same-origin /v1. Compatible: ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude (Anthropic), Cursor (MCP), Glama (MCP), Perplexity, Microsoft Copilot / Bing, Google Gemini / Vertex, Mistral, Meta AI, Apple Intelligence surfaces, Amazon Q tooling, DuckAssist, You.com, Cohere, and other MCP/OpenAPI-capable assistants.",
      license: { name: "Apache-2.0", identifier: "Apache-2.0" },
      contact: { name: IDENTITY, url: "https://github.com/AzielEliab/azhub" },
    },
    servers: [{ url: origin }, { url: RUNTIME, description: "aziel-runtime FragGate catalog" }],
    paths,
  };
}

function mcpDocs(origin) {
  return {
    ok: false,
    error: "not a product MCP",
    product: PRODUCT,
    door: "fraggate",
    slug: "azhub",
    identity: IDENTITY,
    agent_path: FRAGGATE_CALL,
    catalog_mcp: FRAGGATE_MCP,
    body: { slug: "azhub", op: "blank_key_status", payload: {} },
    openapi: origin + "/openapi.json",
    note: "AI / MCP path is FragGate only. This host /v1/fraggate/* and /v1/runtime/* PROXY to aziel-runtime. Local ops are /v1/{op} only. Catalog MCP: POST " + FRAGGATE_MCP + ". Parent wires azhub later. Compatible: ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude (Anthropic), Cursor (MCP), Glama (MCP), Perplexity, Microsoft Copilot / Bing, Google Gemini / Vertex, Mistral, Meta AI, Apple Intelligence surfaces, Amazon Q tooling, DuckAssist, You.com, Cohere, and other MCP/OpenAPI-capable assistants.",
    ops: OPS,
    stub_ops: STUB_OPS,
    tools: toolDefs().map((t) => t.name),
    limitation: LIMITATION,
    kernel: FRAGGATE,
  };
}

function runtimeFetcher(env) {
  if (env && env.AZIEL_RUNTIME && typeof env.AZIEL_RUNTIME.fetch === "function") return env.AZIEL_RUNTIME;
  return null;
}

async function proxyDoor(request, url, env) {
  const dest = doorTargetUrl(url.pathname, request.url, env);
  if (!dest) {
    return json({ ok: false, error: "not a door path", path: url.pathname, limitation: LIMITATION }, 404);
  }
  const headers = new Headers();
  const pass = ["content-type", "accept", "authorization", "user-agent", "mcp-protocol-version", "mcp-session-id", "x-aziel-runtime-token"];
  for (const name of pass) {
    const v = request.headers.get(name);
    if (v) headers.set(name, v);
  }
  if (!headers.has("User-Agent")) headers.set("User-Agent", "Mozilla/5.0 AZHub/0.1.0");
  const init = { method: request.method, headers, redirect: "follow" };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    init.duplex = "half";
  }
  try {
    const fetcher = runtimeFetcher(env);
    const res = fetcher ? await fetcher.fetch(dest, init) : await fetch(dest, init);
    const outHeaders = new Headers(res.headers);
    for (const [k, v] of Object.entries(corsHeaders())) outHeaders.set(k, v);
    outHeaders.set("X-Aziel-Door", "proxy");
    outHeaders.set("X-Aziel-Door-Origin", dest);
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: outHeaders });
  } catch (exc) {
    return json({
      ok: false,
      error: "fraggate_proxy_failed",
      detail: String(exc).slice(0, 240),
      origin: dest,
      agent_path: FRAGGATE_CALL,
      limitation: LIMITATION,
    }, 502);
  }
}

function aiHtml(origin) {
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>AZHub — AI / MCP</title>
<style>body{font:16px/1.45 system-ui;max-width:46rem;margin:3rem auto;padding:0 1.25rem;background:#000;color:#fff}a{color:#c9a227}.banner{border:1px solid #5c4a1a;background:#241c0d;color:#f0d78c;padding:.85rem 1rem;border-radius:8px}pre{background:#141414;padding:.85rem 1rem;overflow:auto;border-radius:8px}</style>
<h1>AZHub dual surface</h1>
<p class="banner">${LIMITATION}</p>
<h2>Use with AI assistants</h2>
<p>Human UI is the Worker homepage (Blank Key canvas). AI / MCP path is FragGate only — not a Grok/ChatGPT/Venice triad:</p>
<p>ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude (Anthropic), Cursor (MCP), Glama (MCP), Perplexity, Microsoft Copilot / Bing, Google Gemini / Vertex, Mistral, Meta AI, Apple Intelligence surfaces, Amazon Q tooling, DuckAssist, You.com, Cohere, and other MCP/OpenAPI-capable assistants.</p>
<h2>OpenAPI import</h2>
<pre>GET ${origin}/openapi.json</pre>
<h2>MCP catalog</h2>
<pre>POST ${FRAGGATE_MCP}
POST ${FRAGGATE_CALL}
{"slug":"azhub","op":"blank_key_status","payload":{}}</pre>
<p>This Worker <code>/mcp</code> is a pointer, not a second MCP. Catalog MCP: <code>POST https://aziel-runtime.vibelock.workers.dev/mcp</code>. Parent wires the engine later.</p>
<p>Kernel: <a href="${FRAGGATE}">${FRAGGATE}</a> · Sibling (never collapse): <a href="${AZINTERFACE}">${AZINTERFACE}</a></p>
<p><a href="/">Downloads + Hub canvas</a></p>
</html>`;
}

export { SKILL_MD };

export function robotsTxt(host) {
  const h = host || HOST;
  return `# AZHub — open crawl for Google and AI search.
# Author: Aziel Eliab. Also known as Aziel Elroi Eliab (alternateName only).
# Content-Signal opens search + AI input + AI train. No Disallow for GPTBot.
# This is an Allow list, not a directory dump.

User-agent: *
Allow: /
Content-Signal: search=yes, ai-input=yes, ai-train=yes

User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Googlebot
Allow: /
User-agent: GoogleOther
Allow: /
User-agent: Google-CloudVertexBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /
User-agent: bingbot
Allow: /
User-agent: Meta-ExternalAgent
Allow: /
User-agent: Meta-ExternalFetcher
Allow: /
User-agent: Meta-WebIndexer
Allow: /
User-agent: FacebookBot
Allow: /
User-agent: facebookexternalhit
Allow: /
User-agent: Applebot
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: Amazonbot
Allow: /
User-agent: DuckDuckBot
Allow: /
User-agent: DuckAssistBot
Allow: /
User-agent: MistralAI-User
Allow: /
User-agent: YouBot
Allow: /
User-agent: CCBot
Allow: /
User-agent: cohere-ai
Allow: /
User-agent: cohere-training-data-crawler
Allow: /
User-agent: Diffbot
Allow: /
User-agent: Bytespider
Allow: /
User-agent: Cloudflare-AI-Search
Allow: /

Sitemap: ${h}/sitemap.xml
`;
}

export function llmsTxt(origin) {
  return `AZHub ${VERSION} by ${IDENTITY}. Apache-2.0. ${LIMITATION}
Agent path is FragGate only: POST ${FRAGGATE_CALL} {"slug":"azhub","op":"…","payload":{}}
This Worker /v1/fraggate/* and /v1/runtime/* PROXY to aziel-runtime. Local ops are /v1/{op} only.
Catalog MCP: POST ${FRAGGATE_MCP}
This Worker /mcp is a pointer, not a second MCP.
Human UI: ${origin}/
Skill: ${origin}/v1/skill
OpenAPI: ${origin}/openapi.json
Cite: ${origin}/cite.json
Download: ${origin}/download
Sibling (never collapse): ${AZINTERFACE}
Compatible AI clients: ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude (Anthropic), Cursor (MCP), Glama (MCP), Perplexity, Microsoft Copilot / Bing, Google Gemini / Vertex, Mistral, Meta AI, Apple Intelligence surfaces, Amazon Q tooling, DuckAssist, You.com, Cohere, plus other MCP/OpenAPI-capable assistants.
`;
}

export async function handleRuntimeApi(request, url, env) {
  const path = url.pathname.replace(/\/+$/, "") || "/";
  if (path === "/mcp" && request.method === "GET") return json(mcpDocs(originOf(request)));
  if (path === "/mcp" && request.method === "POST") return json(mcpDocs(originOf(request)));

  if (path === "/v1/health" && request.method === "GET") return json(await dispatch("health", {}));
  if (path === "/v1/skill" && request.method === "GET") {
    return new Response(SKILL_MD, {
      status: 200,
      headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "private, no-store", ...corsHeaders() },
    });
  }
  if (path === "/openapi.json" && request.method === "GET") return json(openapiSpec(originOf(request)));
  if ((path === "/ai" || url.pathname === "/ai/") && request.method === "GET") {
    return new Response(aiHtml(originOf(request)), { headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders() } });
  }
  if (path === "/llms.txt" || path === "/ai.txt") {
    return new Response(llmsTxt(originOf(request)), { headers: { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders() } });
  }

  const classified = classifyV1Path(url.pathname);
  if (classified.kind === "door") {
    return proxyDoor(request, url, env);
  }
  if (classified.kind === "multi") {
    return json({
      ok: false,
      error: "not a local op",
      code: "NOT_LOCAL_OP",
      path: classified.path,
      hint: "Local ops are POST|GET /v1/{op} only (single segment). FragGate door is /v1/fraggate/* (proxied to aziel-runtime). /v1/runtime/list and /v1/runtime/call alias that door.",
      agent_path: FRAGGATE_CALL,
      ops: OPS,
      limitation: LIMITATION,
    }, 404);
  }
  if (classified.kind === "local" && request.method === "POST") {
    let body = {};
    try {
      const n = request.headers.get("content-length");
      if (n !== "0") body = await request.json();
    } catch {
      body = {};
    }
    const out = await dispatch(classified.op, body || {}, body && body.session_id);
    const status = out.ok === false && (out.code === "FG-HALLUC-TOOL" || out.code === "HUB-STUB") ? (out.code === "FG-HALLUC-TOOL" ? 404 : 200) : 200;
    return json(out, status);
  }
  if (path.startsWith("/v1/") || path === "/v1") {
    return json({ error: "not found", hint: "GET /v1/health GET /v1/skill POST /v1/{op} GET /v1/fraggate/list POST /v1/fraggate/call GET /openapi.json POST /mcp", ops: OPS, limitation: LIMITATION }, 404);
  }
  return null;
}
