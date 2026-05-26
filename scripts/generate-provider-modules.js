const fs = require('fs');
const path = require('path');

const base = path.join(
  __dirname,
  '..',
  'src',
  'app',
  '(dashboard)',
  'dashboard',
  'providers',
  '[id]',
  'providers'
);

const providers = [
  'claude', 'antigravity', 'github', 'kilocode', 'cline',
  'gemini-cli', 'opencode', 'openrouter', 'nvidia', 'ollama', 'vertex', 'gemini', 'cloudflare-ai', 'byteplus',
  'alicode', 'alicode-intl', 'anthropic', 'azure', 'blackbox', 'cerebras', 'chutes', 'cohere', 'commandcode', 'deepseek', 'fireworks', 'glm-cn', 'glm', 'groq', 'hyperbolic', 'kimi', 'minimax-cn', 'minimax', 'mistral', 'nebius', 'ollama-local', 'openai', 'opencode-go', 'perplexity', 'siliconflow', 'together', 'vercel-ai-gateway', 'vertex-partner', 'volcengine-ark', 'xiaomi-mimo', 'xiaomi-tokenplan'
];

function toPascalCase(id) {
  return id
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

function toConstName(id) {
  return `${id.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}_PROVIDER_ID`;
}

for (const id of providers) {
  const dir = path.join(base, id);
  fs.mkdirSync(dir, { recursive: true });

  const name = toPascalCase(id);
  const constName = toConstName(id);

  fs.writeFileSync(
    path.join(dir, 'auth.js'),
    `export const ${constName} = "${id}";\n\nexport function is${name}Provider(providerId) {\n  return providerId === "${id}";\n}\n\nexport function get${name}AuthActions() {\n  return [];\n}\n\nexport function get${name}DefaultAuthType() {\n  return "apikey";\n}\n`
  );

  fs.writeFileSync(
    path.join(dir, 'api.js'),
    `export function get${name}Api() {\n  return {\n    importToken: null,\n    startOAuth: null,\n    pollOAuth: null,\n  };\n}\n`
  );

  fs.writeFileSync(
    path.join(dir, 'ui.js'),
    `export function get${name}UiConfig() {\n  return {\n    providerId: "${id}",\n    oauthLabel: "OAuth",\n    apiLabel: "API Key",\n    apiPlaceholder: "API key",\n  };\n}\n\nexport function getUiConfig() {\n  return get${name}UiConfig();\n}\n`
  );

  fs.writeFileSync(
    path.join(dir, 'index.js'),
    `export * from "./auth";\nexport * from "./api";\nexport * from "./ui";\n`
  );
}

console.log(`generated ${providers.length} provider modules`);
