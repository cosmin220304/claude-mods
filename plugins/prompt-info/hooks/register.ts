import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

// "pdf-signer · main · PR #142": git and gh are slow, so refreshed off the render path
const repo = atom({ plugin: 'prompt-info', key: 'repo' } as const, '')

async function refresh($: EngineInterface) {
  const cwd = await $.session.cwd()
  let text = cwd.split('/').filter(Boolean).at(-1) ?? cwd
  const branch = (await $.process.run(['git', 'branch', '--show-current'], { cwd, timeoutMs: 3000 })).stdout.trim()
  if (branch) {
    text += ` · ${branch}`
    const pr = await $.process.run(['gh', 'pr', 'view', '--json', 'number', '-q', '.number'], { cwd, timeoutMs: 10000 })
    if (pr.exitCode === 0 && pr.stdout.trim()) text += ` · PR #${pr.stdout.trim()}`
  }
  await update($, repo, () => text)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    refresh($)
    $.clock.every(60_000, () => refresh($))
    return result
  })

  on('turn.complete', async ($, e, next) => {
    refresh($)
    return next(e)
  })

  on('ui.render', { component: 'PromptHint' }, async ($, e, next) => {
    const { context } = await $.session.usage()
    const model = (await $.session.model()).replace(/^claude-/, '')
    const k = (n: number) => `${Math.round(n / 1000)}k`
    const tail = `${await read($, repo)} · ${k(context.tokens ?? 0)}/${k(context.window)} (${model})`
    return next({ ...e, props: { ...e.props, tail } })
  })
}
