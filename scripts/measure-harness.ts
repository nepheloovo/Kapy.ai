/**
 * Offline measurement of what the harness sends to the AI for two typical
 * requests. No network, no Codex: a fake runtime answers every turn instantly.
 *
 *   npx tsx scripts/measure-harness.ts
 */
import { EventEmitter } from 'node:events';
import type { CodexAppServer, StartThreadOptions, StartTurnOptions } from '../src/main/codexAppServer.js';
import { GameHarness, type GameHarnessRunOptions } from '../src/main/gameHarness.js';

type Role = 'planner' | 'implementer' | 'reviewer';

class FakeRuntime extends EventEmitter {
  readonly roles = new Map<string, Role>();
  readonly turns: Array<{ role: Role; chars: number }> = [];
  #thread = 0;
  #reviews: string[];

  constructor(reviews: string[]) {
    super();
    this.#reviews = [...reviews];
  }

  async startThread(options: StartThreadOptions): Promise<string> {
    this.#thread += 1;
    const id = `thread-${this.#thread}`;
    const text = options.developerInstructions ?? '';
    this.roles.set(id, /Planner/u.test(text.slice(0, 80)) ? 'planner' : /Reviewer/u.test(text.slice(0, 80)) ? 'reviewer' : 'implementer');
    return id;
  }

  async resumeThread(threadId: string): Promise<string> {
    this.roles.set(threadId, 'implementer');
    return threadId;
  }

  async startTurn(options: StartTurnOptions): Promise<string> {
    const role = this.roles.get(options.threadId) ?? 'implementer';
    const turnId = `turn-${this.turns.length + 1}`;
    this.turns.push({ role, chars: options.prompt.length });
    const text = role === 'reviewer'
      ? this.#reviews.shift() ?? JSON.stringify({ verdict: 'pass', summary: 'ok', findings: [] })
      : role === 'planner' ? 'Plan: change the requested detail.' : 'Done.';
    queueMicrotask(() => {
      this.emit('notification', { method: 'item/completed', params: { threadId: options.threadId, turnId, item: { type: 'agentMessage', text } } });
      this.emit('notification', { method: 'turn/completed', params: { threadId: options.threadId, turnId, turn: { id: turnId, status: 'completed' } } });
    });
    return turnId;
  }

  async unsubscribeThread(): Promise<void> {}
  async interruptTurn(): Promise<void> {}
  async stop(): Promise<void> {}
}

async function measure(name: string, reviews: string[], options: Partial<GameHarnessRunOptions> & { prompt: string }) {
  const runtime = new FakeRuntime(reviews);
  const harness = new GameHarness(runtime as unknown as CodexAppServer);
  await harness.run({
    projectId: 'measure',
    cwd: '/tmp/measure',
    targetFrameRate: 60,
    imageGenerationSkill: { name: 'imagegen', path: '/tmp/imagegen/SKILL.md' },
    validateHostDelivery: async () => ({ ok: true, findings: [] }),
    ...options,
  });
  const total = runtime.turns.reduce((sum, turn) => sum + turn.chars, 0);
  return {
    scenario: name,
    aiTurns: runtime.turns.length,
    turns: runtime.turns.map((turn) => `${turn.role}:${turn.chars}`),
    totalPromptChars: total,
    approxTokens: Math.round(total / 4),
  };
}

const repairThenPass = [
  JSON.stringify({ verdict: 'repair', summary: 'Restart is broken.', findings: ['Fix restart.'] }),
  JSON.stringify({ verdict: 'pass', summary: 'Fixed.', findings: [] }),
  JSON.stringify({ verdict: 'pass', summary: 'Evidence ok.', findings: [] }),
];

const results = [
  await measure('small-edit', [], {
    prompt: '把开始按钮改成红色',
    threadId: 'existing-implementer',
    imageGenerationRequirement: { state: 'trusted-and-referenced', relativePath: 'public/assets/images/hero.png' },
    // Ignored by harness versions that predate quick edit.
    ...({ quickEdit: true } as Record<string, unknown>),
  }),
  await measure('new-game-one-repair', repairThenPass, {
    prompt: '做一个收集能量节点的像素躲避小游戏，失败后可以立即重玩。',
  }),
];

process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
