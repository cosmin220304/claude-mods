export type Repo = string

declare module 'claude-code' {
  interface PluginState {
    'prompt-info': { repo: Repo }
  }
}
