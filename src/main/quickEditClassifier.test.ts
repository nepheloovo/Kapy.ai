import { describe, expect, it } from 'vitest';

import { classifyQuickEdit, type QuickEditInput } from './quickEditClassifier.js';

const ready: Omit<QuickEditInput, 'prompt'> = {
  hasImplementerThread: true,
  lastStatus: 'completed',
  imageRequirement: { state: 'trusted-and-referenced', relativePath: 'public/assets/images/hero.png' },
  audioRequirement: { state: 'not-required' },
};

describe('quick edit classification', () => {
  it.each([
    '把开始按钮改成红色',
    '标题字体大一点',
    '敌人速度慢一点',
    '倒计时延长到 90 秒',
    'Make the score text bigger',
  ])('treats "%s" on a finished game as a quick edit', (prompt) => {
    expect(classifyQuickEdit({ ...ready, prompt }).quick).toBe(true);
  });

  it.each([
    ['做一个新游戏', '新内容'],
    ['加一个新关卡和 boss', '新内容'],
    ['把背景音乐换成欢快一点的', '新内容'],
    ['把画风改成赛博朋克', '新内容'],
    ['优化一下手感', '不确定'],
    ['1. 按钮改成红色\n2. 速度快一点', '多项'],
  ])('sends "%s" through the full pipeline', (prompt, reasonPart) => {
    const decision = classifyQuickEdit({ ...ready, prompt });
    expect(decision.quick).toBe(false);
    expect(decision.reason).toContain(reasonPart);
  });

  it('requires an existing, finished game with confirmed assets', () => {
    const prompt = '把开始按钮改成红色';
    expect(classifyQuickEdit({ ...ready, prompt, hasImplementerThread: false }).reason).toContain('第一次制作');
    expect(classifyQuickEdit({ ...ready, prompt, lastStatus: 'failed' }).reason).toContain('没有顺利完成');
    expect(classifyQuickEdit({ ...ready, prompt, workspaceRestored: true }).reason).toContain('之前的版本');
    expect(classifyQuickEdit({
      ...ready,
      prompt,
      imageRequirement: { state: 'fresh-generation-required' },
    }).reason).toContain('图片素材');
    expect(classifyQuickEdit({
      ...ready,
      prompt,
      audioRequirement: { state: 'fresh-generation-required' },
    }).reason).toContain('音乐');
  });

  it('sends long requests through the full pipeline', () => {
    const prompt = `把按钮改成红色，${'并且仔细检查每一个界面细节'.repeat(8)}`;
    expect(classifyQuickEdit({ ...ready, prompt }).quick).toBe(false);
  });
});
