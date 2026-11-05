# Godot Engine — Version Reference

| Field | Value |
|-------|-------|
| **Engine Version** | Godot 4.7 |
| **Installed editor** | Not recorded here — run `godot --version` in this project before relying on a version-specific claim. |
| **Release Date** | June 2026 (latest patch: 4.7.2, August 2026) |
| **Project Pinned** | 2026-10-17 |
| **Last Docs Verified** | 2026-10-17 (release timeline and 4.7 changes); 2026-02-12 (4.4-4.6 content) |
| **Model knowledge** | Usually stops around Godot 4.3 |

## Knowledge Gap Warning

The model's training data likely covers Godot up to ~4.3. Versions 4.5, 4.6
and 4.7 were released after the cutoff and introduced significant changes that
the model does NOT know about; 4.4 came out shortly before it and may be thinly
covered. Always cross-reference this directory before suggesting Godot API calls.

## Installed-Version Gap Warning

The warning above is one-directional — it covers the **model** knowing less than
this reference. The reverse gap is also real: this reference describes Godot 4.7
and can sit **ahead of the editor installed on this machine**. Code that follows
it correctly can then fail to compile locally. Run `godot --version` first and,
when the installed editor is older than a version-qualified claim, follow the
installed version's API instead.

## Post-Cutoff Version Timeline

| Version | Release | Risk Level | Key Theme |
|---------|---------|------------|-----------|
| 4.5 | Sep 2025 | HIGH | Accessibility (AccessKit), variadic args, @abstract, shader baker, SMAA |
| 4.6 | Jan 2026 | HIGH | Jolt default, glow rework, D3D12 default on Windows, IK restored |
| 4.7 | Jun 2026 | HIGH | AreaLight3D, HDR output, Asset Store replaces the Asset Library, VirtualJoystick, Jolt soft-body and world-boundary changes, typed-return overrides |

## Before the Cutoff

4.4 (Mar 2025, Jolt option, FileAccess return types) predates the May 2025
cutoff; the Knowledge Gap Warning still applies to it.

Dates from https://github.com/godotengine/godot/releases, checked 2026-10-17:
4.4 Mar 3 2025, 4.5 Sep 15 2025, 4.6 Jan 26 2026, 4.7 Jun 18 2026, 4.7.2 Aug 18
2026. Migration guides and release notes: `breaking-changes.md` § Sources.
