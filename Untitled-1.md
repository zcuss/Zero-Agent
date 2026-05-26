Benar. Ini **plan sampai tuntas**, bukan cuma step dekat.

## Target akhir

Struktur `/dashboard/providers/[id]` jadi modular penuh:

- ProviderDetailClient.js hanya orchestration + render.
- Logic dipindah ke:
  - `state/`
  - `hooks/`
  - `providers/<provider>/`
  - `components/`
  - `modals/`
- Codex auth/API jadi prioritas utama dan bersih.
- Kiro ikut pola yang sama.
- Provider lain tetap aman lewat fallback/registry.

---

## Final folder target

```text
src/app/(dashboard)/dashboard/providers/[id]/
  page.js
  ProviderDetailClient.js

  state/
    providerInfo.js
    providerAuthModes.js
    providerDisplay.js
    providerStorage.js

  hooks/
    useProviderBootstrap.js
    useProviderConnections.js
    useProviderModels.js
    useProviderDisabledModels.js
    useProviderAliases.js
    useProviderProxyPools.js
    useProviderStrategy.js
    useProviderThinking.js
    useProviderAuthActions.js
    useProviderBulkProxy.js
    useProviderOneByOneTest.js

  providers/
    index.js

    codex/
      auth.js
      api.js
      ui.js
      index.js

    kiro/
      auth.js
      api.js
      ui.js
      index.js

    xai/
      auth.js
      ui.js
      index.js

    cursor/
      auth.js
      ui.js
      index.js

    iflow/
      auth.js
      ui.js
      index.js

    gitlab/
      auth.js
      ui.js
      index.js

  components/
    ProviderHeader.js
    ProviderConnectionActions.js
    ProviderConnectionsSection.js
    ProviderModelsSection.js
    ProviderSettingsSection.js
    ProviderBulkActions.js
    ProviderAuthChoice.js
    ProviderStatusBadges.js
    ModelRow.js
    ConnectionRow.js
    PassthroughModelsSection.js
    CompatibleModelsSection.js

  modals/
    AddApiKeyModal.js
    AddCustomModelModal.js
    EditCompatibleNodeModal.js
```

---

## Phase 1 — Stabilize current refactor

**Goal:** pastikan perubahan terakhir tidak ngerusak.

1. Cek import unused di ProviderDetailClient.js.
2. Cek providerInfo.js dipakai benar.
3. Cek providerAuthModes.js dipakai benar.
4. Jalankan diagnostics:
   - ProviderDetailClient.js
   - providerInfo.js
   - providerAuthModes.js
   - `codex/auth.js`
   - `codex/api.js`
   - `kiro/auth.js`
   - `kiro/api.js`
5. Jangan lanjut ekstraksi kalau ada error.

**Done when:**
- Semua touched files no error.
- Page masih compile secara static.

---

## Phase 2 — Provider registry

**Goal:** hapus branching provider-specific dari page.

Buat:

```text
providers/index.js
providers/codex/index.js
providers/kiro/index.js
providers/xai/index.js
providers/cursor/index.js
providers/iflow/index.js
providers/gitlab/index.js
```

Isi registry minimal:

- `id`
- `auth`
- `api`
- `ui`
- `isProvider(providerId)`
- `getProviderModule(providerId)`

Contoh behavior:

- Codex:
  - dual auth
  - OAuth proxy
  - access token import
- Kiro:
  - device code
  - social login
  - import refresh token
- xAI:
  - Grok OAuth label
  - API key label
- Cursor/IFlow/GitLab:
  - custom modal/auth label wrappers

**Done when:**
- ProviderDetailClient.js tidak perlu `providerId === "codex"` langsung kecuali fallback minimal.
- Provider-specific labels datang dari registry.

---

## Phase 3 — Codex selesai total

**Goal:** `/dashboard/providers/codex` modular dan clean.

Files:

```text
providers/codex/auth.js
providers/codex/api.js
providers/codex/ui.js
providers/codex/index.js
```

auth.js harus handle:

- `CODEX_AUTH_MODES.oauth`
- `CODEX_AUTH_MODES.api`
- `isCodexProvider()`
- `getCodexAuthLabels()`
- `getCodexDefaultAuthType()`
- `resolveCodexAuthAction()`

api.js harus jadi satu-satunya tempat untuk:

- `importCodexToken(accessToken, name)`
- `startCodexOAuthProxy(...)`
- `pollCodexOAuthStatus(state)`

`ui.js` handle:

- title
- subtitle/help text
- API token placeholder
- modal copy
- warning/description

**Done when:**
- ProviderDetailClient.js tidak punya detail implementasi Codex API.
- Add token Codex tetap masuk via `importCodexToken`.
- OAuth Codex tetap jalan via API module.
- Modal `AddApiKeyModal` tetap generic.

---

## Phase 4 — Kiro selesai mengikuti Codex pattern

**Goal:** Kiro tidak cuma punya file auth/api, tapi punya module lengkap.

Files:

```text
providers/kiro/auth.js
providers/kiro/api.js
providers/kiro/ui.js
providers/kiro/index.js
```

auth.js handle:

- AWS Builder ID
- AWS IDC
- Google Social
- GitHub Social
- Import Refresh Token

api.js handle wrapper ke Kiro OAuth endpoints.

`ui.js` handle label/copy modal.

**Done when:**
- Semua Kiro label/method tidak hardcode di ProviderDetailClient.js.
- `KiroOAuthWrapper` tetap bisa dipakai, tapi config-nya datang dari Kiro module.

---

## Phase 5 — Extract state utilities

**Goal:** computed values keluar dari page.

Files:

```text
state/providerDisplay.js
state/providerStorage.js
```

Move logic:

- `providerStorageAlias`
- `providerDisplayAlias`
- compatible provider display name
- icon/color fallback
- compatible provider type helpers
- thinking config resolver

**Done when:**
- Bagian atas ProviderDetailClient.js tidak lagi penuh computed constants.

---

## Phase 6 — Extract data hooks

**Goal:** semua fetch/load/update logic keluar dari page.

Buat bertahap:

### `useProviderConnections.js`

Handles:

- fetch connections
- active connection
- add connection
- update connection
- delete connection
- refresh connections

### `useProviderModels.js`

Handles:

- base models
- suggested models
- custom models
- kilo free models
- passthrough models
- test model result state

### `useProviderDisabledModels.js`

Handles:

- fetch disabled models
- disable model
- enable model
- disable all
- enable all

### `useProviderAliases.js`

Handles:

- fetch aliases
- save alias
- delete alias

### `useProviderProxyPools.js`

Handles:

- fetch proxy pools
- selected proxy pool
- proxy pool assignment

### `useProviderStrategy.js`

Handles:

- fallback strategy
- sticky limit
- save provider strategy

### `useProviderThinking.js`

Handles:

- thinking mode
- provider thinking config
- save thinking override

**Done when:**
- ProviderDetailClient.js state count turun drastis.
- Hooks return explicit handlers + state.
- Tidak ada JSX di hooks.

---

## Phase 7 — Extract action hooks

**Goal:** complex flows keluar dari page.

### `useProviderAuthActions.js`

Handles:

- `triggerOAuthConnection`
- `triggerApiKeyConnection`
- `triggerAddConnection`
- `handleAgRiskConfirm`
- provider-specific auth action routing via registry

### `useProviderBulkProxy.js`

Handles:

- selected connection IDs
- bulk proxy modal
- bulk proxy update

### `useProviderOneByOneTest.js`

Handles:

- one-by-one testing state
- stop flag
- current connection
- results
- summary

**Done when:**
- ProviderDetailClient.js tidak lagi punya long async action functions.

---

## Phase 8 — Extract UI components

**Goal:** JSX panjang dipecah.

Components:

### `ProviderHeader.js`

- icon/image
- title
- provider badges
- endpoint/copy action
- compatible provider meta

### `ProviderConnectionActions.js`

- Add OAuth/API buttons
- dual auth choice UI
- no-auth proxy action

### `ProviderConnectionsSection.js`

- connection list
- empty states
- connection row mapping

### `ProviderModelsSection.js`

- models tabs/sections
- passthrough/compatible/custom models

### `ProviderSettingsSection.js`

- provider strategy
- thinking config
- proxy settings

### `ProviderBulkActions.js`

- bulk select
- bulk proxy
- one-by-one test

### `ProviderAuthChoice.js`

- `OAuth` vs `API / Access Token` UI

**Done when:**
- ProviderDetailClient.js mostly reads:

```js
return (
  <ProviderDetailView
    provider={...}
    connections={...}
    models={...}
    actions={...}
  />
);
```

---

## Phase 9 — Rename final structure

Optional final split:

```text
ProviderDetailClient.js
ProviderDetailView.js
ProviderDetailModals.js
```

- ProviderDetailClient.js: hooks + orchestration.
- `ProviderDetailView.js`: layout JSX.
- `ProviderDetailModals.js`: all modal rendering.

**Done when:**
- File length sane.
- No giant page component.

---

## Phase 10 — Validation final

Run:

1. diagnostics for all changed files.
2. lint.
3. build if lint clean.
4. manual smoke test.

Smoke test checklist:

- `/dashboard/providers/codex`
  - OAuth button visible.
  - API/access-token button visible.
  - Add token modal label correct.
  - Token import calls Codex API wrapper.
  - OAuth proxy path still works.
- `/dashboard/providers/kiro`
  - auth method list still visible.
  - AWS/social/import options still work.
- xAI/Grok
  - Grok OAuth label remains correct.
  - API key label remains correct.
- OpenAI compatible
  - node details still render.
  - compatible models still render.
- Anthropic compatible
  - node details still render.
- Generic API key providers
  - Add API key still works.
- Free/no-auth providers
  - no-auth proxy card still works.

---

## Completion criteria

Refactor dianggap selesai kalau:

- ProviderDetailClient.js tidak berisi provider-specific implementation detail.
- Codex auth/API modular penuh.
- Kiro modular penuh.
- Provider registry ada.
- Data fetching pindah ke hooks.
- JSX besar pindah ke components.
- All touched files no diagnostics.
- Lint/build pass atau error existing terdokumentasi.
- Compatibility shims tetap aman.

