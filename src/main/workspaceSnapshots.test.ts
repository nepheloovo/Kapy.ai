import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { WorkspaceSnapshotStore } from './workspaceSnapshots.js';

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

describe('workspace save points', () => {
  let base: string;
  let root: string;
  let store: WorkspaceSnapshotStore;

  beforeEach(async () => {
    base = await mkdtemp(join(tmpdir(), 'kapy-snapshots-'));
    root = join(base, 'game');
    await mkdir(join(root, 'src'), { recursive: true });
    await mkdir(join(root, 'node_modules', 'lib'), { recursive: true });
    await writeFile(join(root, 'src', 'main.js'), 'const color = "blue";\n');
    await writeFile(join(root, 'index.html'), '<canvas></canvas>\n');
    await writeFile(join(root, 'node_modules', 'lib', 'big.js'), 'dependency\n');
    store = new WorkspaceSnapshotStore({ directory: join(base, 'snapshots'), maxSnapshots: 3 });
  });

  afterEach(async () => {
    await rm(base, { recursive: true, force: true });
  });

  it('restores the files from before the last AI run and removes files the run added', async () => {
    await store.create('p1', root, 'before-run', '把按钮改成红色');
    await writeFile(join(root, 'src', 'main.js'), 'const color = "red";\n');
    await writeFile(join(root, 'src', 'extra.js'), 'added by the AI\n');
    await mkdir(join(root, 'public', 'new'), { recursive: true });
    await writeFile(join(root, 'public', 'new', 'sprite.png'), 'png');

    const restored = await store.undo('p1', root);

    expect(restored.label).toBe('把按钮改成红色');
    expect(await readFile(join(root, 'src', 'main.js'), 'utf8')).toBe('const color = "blue";\n');
    expect(await exists(join(root, 'src', 'extra.js'))).toBe(false);
    expect(await exists(join(root, 'public', 'new'))).toBe(false);
    // Dependency folders are never saved or deleted.
    expect(await readFile(join(root, 'node_modules', 'lib', 'big.js'), 'utf8')).toBe('dependency\n');
  });

  it('saves the current files before undoing, and each undo goes one version further back', async () => {
    await store.create('p1', root, 'before-run', '第一次修改');
    await writeFile(join(root, 'src', 'main.js'), 'v2\n');
    await store.create('p1', root, 'before-run', '第二次修改');
    await writeFile(join(root, 'src', 'main.js'), 'v3\n');

    expect((await store.nextUndo('p1'))?.label).toBe('第二次修改');
    await store.undo('p1', root);
    expect(await readFile(join(root, 'src', 'main.js'), 'utf8')).toBe('v2\n');

    expect((await store.nextUndo('p1'))?.label).toBe('第一次修改');
    await store.undo('p1', root);
    expect(await readFile(join(root, 'src', 'main.js'), 'utf8')).toBe('const color = "blue";\n');

    expect(await store.nextUndo('p1')).toBeNull();
    await expect(store.undo('p1', root)).rejects.toThrow('没有可以回退的版本');

    const safety = (await store.list('p1')).filter((snapshot) => snapshot.kind === 'before-undo');
    expect(safety.length).toBeGreaterThan(0);
  });

  it('keeps only the newest save points', async () => {
    for (let index = 1; index <= 5; index += 1) {
      await writeFile(join(root, 'src', 'main.js'), `v${index}\n`);
      await store.create('p1', root, 'before-run', `修改 ${index}`);
    }
    const snapshots = await store.list('p1');
    expect(snapshots.map((snapshot) => snapshot.label)).toEqual(['修改 5', '修改 4', '修改 3']);
    expect(snapshots[0]!.fileCount).toBe(2);
  });

  it('rejects unsafe project ids', async () => {
    await expect(store.create('../escape', root, 'before-run', 'x')).rejects.toThrow('无效的项目编号');
  });
});
