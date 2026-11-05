# Godot 4 Reference for This Project

Model training data usually stops around Godot 4.3. Godot 4.4 to 4.7 renamed,
removed and changed many APIs, so code written from memory can fail to parse or
behave differently. These files list what changed. Kapy.ai keeps them up to date;
edits here are replaced the next time Kapy.ai refreshes the project.

## How to use

1. Read `VERSION.md`, then run `godot --version`. When the installed editor is
   older than a claim here, follow the installed version.
2. Check `deprecated-apis.md` before writing any engine API call.
3. Read the relevant `modules/*.md` (animation, audio, input, navigation,
   networking, physics, rendering, ui) for the subsystem you are touching.
4. Consult `breaking-changes.md` and `current-best-practices.md` when a call,
   property or signal does not behave as expected.
5. After editing GDScript, parse-check the changed scripts:

       godot --headless --path . --import
       godot --headless --path . -s res://docs/godot-reference/godot-parse-check.gd -- res://scripts/main.gd

   Exit code 0 means every listed script loads; 1 means at least one does not.

Read files by section when you only need one subsystem; do not paste them whole
into replies.
