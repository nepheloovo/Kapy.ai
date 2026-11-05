import { randomUUID } from 'node:crypto';
import { cp, lstat, mkdir, readdir, readFile, rm, rmdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

/**
 * Copy-based save points for a game workspace, kept outside the workspace so
 * the Agent never sees or edits them. A save point is taken before every AI
 * run; "undo" restores the newest one that has not been undone yet.
 */

export type WorkspaceSnapshotKind = 'before-run' | 'before-undo';

export interface WorkspaceSnapshot {
  id: string;
  projectId: string;
  kind: WorkspaceSnapshotKind;
  /** Short human label, such as the request that the following run worked on. */
  label: string;
  createdAt: string;
  fileCount: number;
  bytes: number;
  /** Set once this save point has been restored by an undo. */
  undoneAt: string | null;
}

export interface WorkspaceSnapshotStoreOptions {
  /** Directory that holds one sub-directory per project. */
  directory: string;
  /** Save points kept per project; older ones are deleted. */
  maxSnapshots?: number;
  /** Files larger than this are left out of a save point. */
  maxFileBytes?: number;
}

/** Generated, cached, or host-owned folders that are rebuilt rather than saved. */
const SKIPPED_DIRECTORIES = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  'artifacts',
  '.godot',
  '.import',
  '.vite',
  '.cache',
]);

const DEFAULT_MAX_SNAPSHOTS = 10;
const DEFAULT_MAX_FILE_BYTES = 50 * 1024 * 1024;
const LABEL_MAX_CHARS = 80;

export class WorkspaceSnapshotStore {
  readonly #directory: string;
  readonly #maxSnapshots: number;
  readonly #maxFileBytes: number;
  readonly #locks = new Map<string, Promise<unknown>>();

  constructor(options: WorkspaceSnapshotStoreOptions) {
    this.#directory = options.directory;
    this.#maxSnapshots = Math.max(1, options.maxSnapshots ?? DEFAULT_MAX_SNAPSHOTS);
    this.#maxFileBytes = options.maxFileBytes ?? DEFAULT_MAX_FILE_BYTES;
  }

  /** Newest first. */
  async list(projectId: string): Promise<WorkspaceSnapshot[]> {
    const index = await this.#readIndex(projectId);
    return [...index].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  /** The save point that "回到上一版" would restore, if any. */
  async nextUndo(projectId: string): Promise<WorkspaceSnapshot | null> {
    return (await this.list(projectId)).find(
      (snapshot) => snapshot.kind === 'before-run' && !snapshot.undoneAt,
    ) ?? null;
  }

  create(
    projectId: string,
    root: string,
    kind: WorkspaceSnapshotKind,
    label: string,
  ): Promise<WorkspaceSnapshot> {
    return this.#withLock(projectId, () => this.#create(projectId, root, kind, label));
  }

  /**
   * Restores the newest save point taken before an AI run that has not been
   * undone yet. The current files are saved first, so an undo is never lossy.
   */
  undo(projectId: string, root: string): Promise<WorkspaceSnapshot> {
    return this.#withLock(projectId, async () => {
      const target = (await this.list(projectId)).find(
        (snapshot) => snapshot.kind === 'before-run' && !snapshot.undoneAt,
      );
      if (!target) throw new Error('没有可以回退的版本');
      await this.#create(projectId, root, 'before-undo', `撤回前自动保存：${target.label}`, target.id);
      await this.#restoreFiles(projectId, root, target.id);
      const index = await this.#readIndex(projectId);
      const undoneAt = new Date().toISOString();
      const updated = index.map((snapshot) => (
        snapshot.id === target.id ? { ...snapshot, undoneAt } : snapshot
      ));
      await this.#writeIndex(projectId, updated);
      return { ...target, undoneAt };
    });
  }

  async removeProject(projectId: string): Promise<void> {
    await rm(this.#projectDirectory(projectId), { recursive: true, force: true });
  }

  async #create(
    projectId: string,
    root: string,
    kind: WorkspaceSnapshotKind,
    label: string,
    protectedId: string | null = null,
  ): Promise<WorkspaceSnapshot> {
    const id = `${Date.now().toString(36)}-${randomUUID().slice(0, 8)}`;
    const target = join(this.#projectDirectory(projectId), id);
    const files = await this.#listWorkspaceFiles(root);
    let bytes = 0;
    for (const file of files) {
      await mkdir(join(target, relative(root, file.path), '..'), { recursive: true });
      await cp(file.path, join(target, relative(root, file.path)), { preserveTimestamps: true });
      bytes += file.size;
    }
    await mkdir(target, { recursive: true });
    const snapshot: WorkspaceSnapshot = {
      id,
      projectId,
      kind,
      label: clipLabel(label),
      createdAt: new Date().toISOString(),
      fileCount: files.length,
      bytes,
      undoneAt: null,
    };
    const sorted = [...await this.#readIndex(projectId), snapshot]
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
    // Drop the oldest save points, but never the one an undo is about to restore.
    let excess = sorted.length - this.#maxSnapshots;
    const removed: WorkspaceSnapshot[] = [];
    const kept: WorkspaceSnapshot[] = [];
    for (const item of sorted) {
      if (excess > 0 && item.id !== protectedId && item.id !== snapshot.id) {
        removed.push(item);
        excess -= 1;
      } else {
        kept.push(item);
      }
    }
    await this.#writeIndex(projectId, kept);
    await Promise.all(removed.map((old) => rm(
      join(this.#projectDirectory(projectId), old.id),
      { recursive: true, force: true },
    )));
    return snapshot;
  }

  async #restoreFiles(projectId: string, root: string, snapshotId: string): Promise<void> {
    const source = join(this.#projectDirectory(projectId), snapshotId);
    const current = await this.#listWorkspaceFiles(root, { includeOversized: false });
    for (const file of current) await rm(file.path, { force: true });
    await removeEmptyDirectories(root);
    await cp(source, root, { recursive: true, force: true, preserveTimestamps: true });
  }

  async #listWorkspaceFiles(
    root: string,
    options: { includeOversized?: boolean } = {},
  ): Promise<Array<{ path: string; size: number }>> {
    const files: Array<{ path: string; size: number }> = [];
    const walk = async (directory: string): Promise<void> => {
      let entries;
      try {
        entries = await readdir(directory, { withFileTypes: true });
      } catch {
        return;
      }
      for (const entry of entries) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) {
          if (SKIPPED_DIRECTORIES.has(entry.name)) continue;
          await walk(path);
        } else if (entry.isFile()) {
          const info = await lstat(path);
          if (info.size > this.#maxFileBytes && !options.includeOversized) continue;
          files.push({ path, size: info.size });
        }
        // Symbolic links are deliberately left alone: they may point outside the workspace.
      }
    };
    await walk(root);
    return files;
  }

  #projectDirectory(projectId: string): string {
    if (!/^[A-Za-z0-9_-]{1,128}$/u.test(projectId)) throw new Error('无效的项目编号');
    return join(this.#directory, projectId);
  }

  async #readIndex(projectId: string): Promise<WorkspaceSnapshot[]> {
    try {
      const parsed = JSON.parse(await readFile(join(this.#projectDirectory(projectId), 'index.json'), 'utf8'));
      return Array.isArray(parsed) ? parsed as WorkspaceSnapshot[] : [];
    } catch {
      return [];
    }
  }

  async #writeIndex(projectId: string, index: WorkspaceSnapshot[]): Promise<void> {
    const directory = this.#projectDirectory(projectId);
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, 'index.json'), `${JSON.stringify(index, null, 2)}\n`, 'utf8');
  }

  async #withLock<T>(projectId: string, task: () => Promise<T>): Promise<T> {
    const previous = this.#locks.get(projectId) ?? Promise.resolve();
    const next = previous.catch(() => undefined).then(task);
    this.#locks.set(projectId, next);
    try {
      return await next;
    } finally {
      if (this.#locks.get(projectId) === next) this.#locks.delete(projectId);
    }
  }
}

function clipLabel(label: string): string {
  const flat = label.replace(/\s+/gu, ' ').trim() || '未命名修改';
  const chars = Array.from(flat);
  return chars.length > LABEL_MAX_CHARS ? `${chars.slice(0, LABEL_MAX_CHARS).join('')}…` : flat;
}

async function removeEmptyDirectories(root: string): Promise<void> {
  const visit = async (directory: string): Promise<boolean> => {
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch {
      return false;
    }
    let empty = true;
    for (const entry of entries) {
      if (!entry.isDirectory() || SKIPPED_DIRECTORIES.has(entry.name)) {
        empty = false;
        continue;
      }
      const child = join(directory, entry.name);
      if (await visit(child)) {
        await rmdir(child).catch(() => undefined);
      } else {
        empty = false;
      }
    }
    return empty;
  };
  await visit(root);
}
