# Known Issues & Debug Log
> **AI Instruction:** Before suggesting any complex code fixes or logic structures, consult this document. YOU MUST NOT suggest any fix documented as a "Failed Attempt" here.

This document exists to prevent AI models from falling into repetition loops, or proposing solutions we have already discovered do not work in this specific codebase.

## 2026-05-14: [debug]
- Problem / goal: Diagnose Vercel production `POST /api/match` 502.
- Decision / action: Inspected route, model registry, resume loader, env docs. 502 comes from final catch around `loadDefaultResume()` and `generateObject()`.
- Status: Done. Likely causes: invalid `RESUME_PATH`.

***

## 2026-05-14: [debug]
### The Issue
Dependency install needed before build verification.

**We Tried:**
1. `npm install` in sandbox -> process produced no output for an extended period.
2. `pkill -f "npm install"` -> blocked by sandbox process-list restriction.

**Current Solution / Workaround:**
Stopped stuck install with approved process-control command, reran `npm install` with approved network access, then built successfully.

***

## [Component / File Name]
### The Issue 
[Describe the bug or architectural limitation]

**We Tried:**
1. [Failed fix 1] -> Resulted in [Error A]
2. [Failed fix 2] -> Resulted in [Error B]

**Current Solution / Workaround:**
We are explicitly doing `[Current Approach]` because `[Reason why everything else failed]`. Do not attempt to revert to a standard implementation.

***

*(Add a new section delimited by `***` whenever a stubborn bug takes more than 3 AI turns to resolve)*
