import { AntigravityExecutor } from "./providers/antigravity/index.js";
import { AzureExecutor } from "./providers/azure/index.js";
import { GeminiCLIExecutor } from "./providers/gemini-cli/index.js";
import { GithubExecutor } from "./providers/github/index.js";
import { IFlowExecutor } from "./providers/iflow/index.js";
import { QoderExecutor } from "./providers/qoder/index.js";
import { KiroExecutor } from "./providers/kiro/index.js";
import { CodexExecutor } from "./providers/codex/index.js";
import { CursorExecutor } from "./providers/cursor/index.js";
import { VertexExecutor } from "./providers/vertex/index.js";
import { QwenExecutor } from "./providers/qwen/index.js";
import { OpenCodeExecutor } from "./providers/opencode/index.js";
import { OpenCodeGoExecutor } from "./providers/opencode-go/index.js";
import { GrokWebExecutor } from "./providers/grok-web/index.js";
import { PerplexityWebExecutor } from "./providers/perplexity-web/index.js";
import { OllamaLocalExecutor } from "./providers/ollama-local/index.js";
import { CommandCodeExecutor } from "./providers/commandcode/index.js";
import { DefaultExecutor } from "./providers/default/index.js";

const executors = {
  antigravity: new AntigravityExecutor(),
  azure: new AzureExecutor(),
  "gemini-cli": new GeminiCLIExecutor(),
  github: new GithubExecutor(),
  iflow: new IFlowExecutor(),
  qoder: new QoderExecutor(),
  kiro: new KiroExecutor(),
  codex: new CodexExecutor(),
  cursor: new CursorExecutor(),
  cu: new CursorExecutor(), // Alias for cursor
  vertex: new VertexExecutor("vertex"),
  "vertex-partner": new VertexExecutor("vertex-partner"),
  qwen: new QwenExecutor(),
  opencode: new OpenCodeExecutor(),
  "opencode-go": new OpenCodeGoExecutor(),
  "grok-web": new GrokWebExecutor(),
  "perplexity-web": new PerplexityWebExecutor(),
  "ollama-local": new OllamaLocalExecutor(),
  commandcode: new CommandCodeExecutor(),
};

const defaultCache = new Map();

export function getExecutor(provider) {
  if (executors[provider]) return executors[provider];
  if (!defaultCache.has(provider)) defaultCache.set(provider, new DefaultExecutor(provider));
  return defaultCache.get(provider);
}

export function hasSpecializedExecutor(provider) {
  return !!executors[provider];
}

export { BaseExecutor } from "./shared/base.js";
export { AntigravityExecutor } from "./providers/antigravity/index.js";
export { AzureExecutor } from "./providers/azure/index.js";
export { GeminiCLIExecutor } from "./providers/gemini-cli/index.js";
export { GithubExecutor } from "./providers/github/index.js";
export { IFlowExecutor } from "./providers/iflow/index.js";
export { QoderExecutor } from "./providers/qoder/index.js";
export { KiroExecutor } from "./providers/kiro/index.js";
export { CodexExecutor } from "./providers/codex/index.js";
export { CursorExecutor } from "./providers/cursor/index.js";
export { VertexExecutor } from "./providers/vertex/index.js";
export { DefaultExecutor } from "./providers/default/index.js";
export { QwenExecutor } from "./providers/qwen/index.js";
export { OpenCodeExecutor } from "./providers/opencode/index.js";
export { OpenCodeGoExecutor } from "./providers/opencode-go/index.js";
export { GrokWebExecutor } from "./providers/grok-web/index.js";
export { PerplexityWebExecutor } from "./providers/perplexity-web/index.js";
export { OllamaLocalExecutor } from "./providers/ollama-local/index.js";
export { CommandCodeExecutor } from "./providers/commandcode/index.js";
