import type { HostAudioGenerationRequirement, HostImageGenerationRequirement } from './gameHarness.js';

/**
 * Decides on the host, without asking the AI, whether a request is a small
 * tweak to a game that already works. Small tweaks skip the Planner and the
 * separate Reviewer pass; the host playtest still checks the result.
 *
 * The rules are deliberately conservative: anything that could need new
 * systems, new generated media, or a broad redesign takes the full pipeline.
 */

export interface QuickEditInput {
  prompt: string;
  /** The project already has a durable Implementer thread from an earlier run. */
  hasImplementerThread: boolean;
  /** Status of the project's latest run. Only a finished, passing game qualifies. */
  lastStatus: string;
  imageRequirement: HostImageGenerationRequirement;
  audioRequirement: HostAudioGenerationRequirement;
  /** The user restored an earlier save point since the last run. */
  workspaceRestored?: boolean;
}

export interface QuickEditDecision {
  quick: boolean;
  /** Plain-language reason, shown to the user. */
  reason: string;
}

const MAX_QUICK_EDIT_CHARS = 80;

const BROAD_CHANGE = new RegExp([
  '新游戏', '重做', '重新做', '重写', '从头', '推翻', '大改', '改版',
  '关卡', '新角色', '新敌人', '新玩法', '新模式', '新系统', '新功能', '新增',
  '联机', '多人', '对战', '排行榜', '存档', '商店', '背包', '技能树',
  '3d', '三维', '引擎', 'godot',
  '音乐', '配乐', '音效', '配音', '语音',
  '生成', '重新画', '画一', '美术', '画风', '风格', '素材', '贴图', '动画',
  'boss', '\\bai\\b', '人工智能',
  'new game', 'rewrite', 'redo', 'from scratch', 'redesign', 'multiplayer', 'level',
  'new feature', 'music', 'soundtrack', 'sound effect', 'art style', 'regenerate', 'animation',
].join('|'), 'iu');

const SMALL_CHANGE = new RegExp([
  '颜色', '红色', '蓝色', '绿色', '黄色', '紫色', '橙色', '黑色', '白色', '粉色', '灰色',
  '改成', '换成', '改为', '调成', '变成', '改一下', '调一下',
  '字体', '字号', '文字', '文案', '标题', '名字', '改名', '错别字', '提示语',
  '按钮', '大小', '调大', '调小', '放大', '缩小', '大一点', '小一点', '粗一点', '细一点',
  '速度', '快一点', '慢一点', '加快', '减慢', '变快', '变慢',
  '位置', '间距', '边距', '居中', '靠左', '靠右', '对齐',
  '透明', '亮一点', '暗一点', '亮度', '音量',
  '分数', '血量', '生命', '次数', '倒计时', '时间', '延长', '缩短', '难度',
  'colou?r', 'font', 'text', 'title', 'label', 'button', 'bigger', 'smaller', 'faster', 'slower',
  'speed', 'rename', 'typo', 'size', 'position', 'spacing', 'align', 'opacity', 'volume',
].join('|'), 'iu');

export function classifyQuickEdit(input: QuickEditInput): QuickEditDecision {
  const prompt = input.prompt.trim();
  const full = (reason: string): QuickEditDecision => ({ quick: false, reason });

  if (!input.hasImplementerThread) return full('这是第一次制作，需要完整流程。');
  if (input.lastStatus !== 'completed') return full('上一次制作没有顺利完成，需要完整流程。');
  if (input.workspaceRestored) return full('刚回到过之前的版本，需要完整流程重新确认。');
  if (input.imageRequirement.state !== 'trusted-and-referenced') {
    return full('游戏还缺少已确认的图片素材，需要完整流程。');
  }
  if (
    input.audioRequirement.state !== 'not-required'
    && input.audioRequirement.state !== 'trusted-and-referenced'
  ) {
    return full('游戏还缺少已确认的音乐，需要完整流程。');
  }
  if (!prompt) return full('没有修改内容。');
  if (Array.from(prompt).length > MAX_QUICK_EDIT_CHARS) return full('改动描述比较长，按完整流程处理。');
  if (/\n\s*\S/u.test(prompt) || /(?:^|\s)(?:\d+[.、)]|[-*•])\s/u.test(prompt)) {
    return full('一次提了多项改动，按完整流程处理。');
  }
  if (BROAD_CHANGE.test(prompt)) return full('改动可能涉及新内容或新素材，按完整流程处理。');
  if (!SMALL_CHANGE.test(prompt)) return full('不确定是不是小改动，稳妥起见按完整流程处理。');
  return { quick: true, reason: '这是对现有游戏的小改动，走快速修改。' };
}
