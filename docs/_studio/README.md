# Read-only mirror — change nothing here

A byte-for-byte mirror of studio framework `v3.1.0` (commit `0d54aa5`).

**CI verifies it. Editing it turns the build red, and no explanation will be accepted.**

To change the framework: open a PR in the studio repo, cut a release, then raise
`.studio-version` here. See `docs/_studio/docs/05-studio/versioning.md`.

The reason for the rule: if every project could patch the framework in place, within
a few months every project would have its own incompatible copy and the studio would
have stopped existing.
