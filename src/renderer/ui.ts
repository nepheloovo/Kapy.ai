import type {
  AgentEventKind,
  PipelineStage,
  ProjectStatus,
  RuntimeStatus,
  UiSkinId,
} from '../shared/contracts';

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: '待启动',
  running: '制作中',
  waiting: '待继续',
  completed: '已完成',
  failed: '需处理',
  stopped: '已停止',
};

export const EVENT_KIND_LABELS: Record<AgentEventKind, string> = {
  user: '用户',
  lifecycle: '状态',
  assistant: 'Agent',
  thought: '思考',
  tool: '工具',
  file: '文件',
  plan: '计划',
  approval: '审批',
  error: '异常',
};

export function runtimeLabel(runtime: RuntimeStatus): string {
  if (runtime.state === 'ready') {
    return runtime.account
      ? `${runtime.account.email ?? 'Codex 账号'} · 已就绪`
      : 'Codex 已就绪 · 未登录';
  }
  if (runtime.state === 'starting') return 'Codex 正在启动';
  if (runtime.state === 'error') return runtime.error ?? 'Codex 启动失败';
  return 'Codex 尚未启动';
}

export function stageProgress(stage: PipelineStage): number {
  const order: PipelineStage[] = [
    'brief',
    'scaffold',
    'gdd',
    'assets',
    'world',
    'code',
    'verify',
    'complete',
  ];
  return Math.max(0, order.indexOf(stage));
}

export function formatRelative(value: string): string {
  const time = Date.parse(value);
  if (!Number.isFinite(time)) return '—';
  const delta = Math.max(0, Date.now() - time);
  if (delta < 60_000) return '刚刚';
  if (delta < 3_600_000) return `${Math.floor(delta / 60_000)} 分钟前`;
  if (delta < 86_400_000) return `${Math.floor(delta / 3_600_000)} 小时前`;
  return `${Math.floor(delta / 86_400_000)} 天前`;
}

export function toMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(
    /^Error invoking remote method '[^']+':\s*(?:Error:\s*)?/,
    '',
  );
}

export interface UiSkinOption {
  label: string;
  description: string;
  /** Sky, stone and foliage colors used for the skin swatch and window chrome. */
  swatch: readonly [string, string, string];
}

export const UI_SKIN_OPTIONS: Record<UiSkinId, UiSkinOption> = {
  'sky-ruins': {
    label: '天空遗迹',
    description: '浅蓝雾、砖红石台与粉色花藤',
    swatch: ['#dceaf3', '#b9634f', '#e8897c'],
  },
  'blossom-bridge': {
    label: '花影石桥',
    description: '奶粉云、紫灰石砖与玫红叶',
    swatch: ['#f6dfdc', '#5d5872', '#c0476b'],
  },
  'dusk-wall': {
    label: '暮光古墙',
    description: '暖黄天空、灰石墙与墨绿树冠',
    swatch: ['#f1e3b3', '#6e6f73', '#3d4a3a'],
  },
  'jade-grove': {
    label: '翡翠秘林',
    description: '薄荷雾、苔绿石桥与朱红树冠',
    swatch: ['#bfe3cf', '#4d7259', '#d0473a'],
  },
};
