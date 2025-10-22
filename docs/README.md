# Documentation

> **Context templates and guides for working with Claude across sessions**

---

## Quick Start

### New to the Context System?

**Read this first**: [CONTEXT-SYSTEM.md](CONTEXT-SYSTEM.md) - Complete guide to using the context templates

### Ready to Document?

Pick the right template for what you're capturing:

| What You're Doing | Use This File | Located At |
|-------------------|---------------|------------|
| Discussing design, colors, layouts | **DESIGN-SPEC.md** | [../DESIGN-SPEC.md](../DESIGN-SPEC.md) |
| Planning content, pages, collections | **CONTENT-PLAN.md** | [../CONTENT-PLAN.md](../CONTENT-PLAN.md) |
| Summarizing mobile chat decisions | **MOBILE-CHAT-NOTES.md** | [../MOBILE-CHAT-NOTES.md](../MOBILE-CHAT-NOTES.md) |
| Defining features, requirements | **REQUIREMENTS.md** | [../REQUIREMENTS.md](../REQUIREMENTS.md) |
| Making technical/architecture decisions | **ARCHITECTURE.md** | [../ARCHITECTURE.md](../ARCHITECTURE.md) |

---

## File Purposes

### 📐 [DESIGN-SPEC.md](../DESIGN-SPEC.md)
**Visual design and UX patterns**

Capture:
- Color palettes, typography, spacing
- Component patterns (buttons, cards, navigation)
- Page layouts and responsive breakpoints
- Interaction patterns and animations
- Accessibility requirements

Use when:
- Discussing how things should look
- Defining component styles
- Planning responsive behavior
- Deciding on UX patterns

---

### 📝 [CONTENT-PLAN.md](../CONTENT-PLAN.md)
**Content structure and editorial guidelines**

Capture:
- Content collection schemas
- Page structures and sections
- Content sources and workflows
- Editorial voice and tone
- Launch checklists

Use when:
- Planning content collections
- Organizing page content
- Defining content workflows
- Setting editorial guidelines

---

### 💬 [MOBILE-CHAT-NOTES.md](../MOBILE-CHAT-NOTES.md)
**Session summaries from Claude Mobile**

Capture:
- Key decisions from mobile chats
- Implementation notes
- Action items
- Quick decision log

Use when:
- After productive mobile discussion
- Need to transfer context to Claude Code
- Want to remember what was decided

**This is your bridge file** - the main way to get mobile chat context into Code sessions.

---

### ✅ [REQUIREMENTS.md](../REQUIREMENTS.md)
**Features, user stories, and specifications**

Capture:
- MVP vs future features
- User stories and acceptance criteria
- Non-functional requirements
- User journeys
- Open questions

Use when:
- Defining what needs to be built
- Planning feature scope
- Writing specifications
- Tracking feature status

---

### 🏗️ [ARCHITECTURE.md](../ARCHITECTURE.md)
**Technical decisions and system design**

Capture:
- Tech stack choices and rationale
- Architecture patterns
- Build and deployment strategy
- Performance optimizations
- ADRs (Architecture Decision Records)

Use when:
- Choosing technologies or libraries
- Making architectural decisions
- Documenting technical patterns
- Recording significant technical choices

---

## Common Workflows

### Workflow 1: Mobile Design Discussion → Code Implementation

```
1. Mobile: Discuss homepage hero design
2. Update: DESIGN-SPEC.md > Homepage > Hero
3. Commit: git add DESIGN-SPEC.md && git commit -m "Add hero design"
4. Code: "Read DESIGN-SPEC.md homepage hero and implement it"
```

### Workflow 2: Feature Planning → Development

```
1. Mobile: Plan exhibition filtering feature
2. Update: REQUIREMENTS.md > Add feature spec with acceptance criteria
3. Update: DESIGN-SPEC.md > Add UI patterns for filters
4. Commit: Changes
5. Code: "Read exhibition filtering feature in REQUIREMENTS.md and implement"
```

### Workflow 3: Quick Decision Capture

```
1. Mobile: Decide on color: #2E7D32 for primary
2. Update: MOBILE-CHAT-NOTES.md > Quick Decisions Log
3. Commit: Quick commit
4. Later: Move to DESIGN-SPEC.md when solidified
```

---

## Tips

### For Claude Code Sessions

Start with context:
```
"Before we begin, please read:
 - REQUIREMENTS.md (MVP section)
 - DESIGN-SPEC.md (Homepage and About pages)
 - MOBILE-CHAT-NOTES.md (last session from [date])

Then let's discuss approach."
```

### After Mobile Chats

Quick checklist:
- [ ] What was decided? → Document it
- [ ] Which file fits best? → Update that file
- [ ] Any action items? → Add to relevant file
- [ ] Commit and push? → Don't forget!

### Before Major Development

Review:
- Read REQUIREMENTS.md for scope
- Read DESIGN-SPEC.md for visual/UX patterns
- Read ARCHITECTURE.md for technical constraints
- Check MOBILE-CHAT-NOTES.md for recent discussions

---

## File Locations

**Context Templates** (root level):
```
masumihayashi-com/
├── ARCHITECTURE.md       # Tech decisions
├── CONTENT-PLAN.md       # Content structure
├── DESIGN-SPEC.md        # Visual design
├── MOBILE-CHAT-NOTES.md  # Session summaries
└── REQUIREMENTS.md       # Features & specs
```

**Documentation** (docs folder):
```
docs/
├── README.md             # This file
├── CONTEXT-SYSTEM.md     # Complete guide
└── reference/            # Screenshots, mockups, etc.
```

**Project Documentation** (root level):
```
masumihayashi-com/
├── CLAUDE.md             # Project overview
├── PROJECT-STATUS.md     # Status tracking
└── README.md             # Full setup guide
```

---

## Reference Materials

Use `docs/reference/` for:
- Screenshots and mockups
- Design files (exported from Figma, etc.)
- Inspiration images
- Wireframes
- User research
- Any visual materials

Example structure:
```
docs/reference/
├── designs/
│   ├── homepage-mockup.png
│   └── exhibition-layout-v2.png
├── inspiration/
│   ├── similar-site-1.png
│   └── component-example.png
└── research/
    ├── user-feedback.md
    └── competitive-analysis.md
```

---

## Maintenance

### Weekly (5 minutes)
- Review completed action items
- Archive old mobile sessions
- Update "Last Updated" dates

### Monthly (15 minutes)
- Full read-through of all files
- Remove outdated information
- Consolidate duplicates
- Ensure cross-references are accurate

---

## Getting Help

**New to the system?**
→ Read [CONTEXT-SYSTEM.md](CONTEXT-SYSTEM.md)

**Not sure which file to use?**
→ See "File Purposes" above or the matrix in CONTEXT-SYSTEM.md

**Files getting messy?**
→ See "Maintenance" section in CONTEXT-SYSTEM.md

**Want examples?**
→ Check CONTEXT-SYSTEM.md > "Example: Complete Workflow"

---

## Philosophy

These files are:
- **Living documents** - Update them as the project evolves
- **Shared memory** - Context that persists across sessions
- **Decision records** - Why we chose what we chose
- **Implementation guides** - What Claude Code should build

They are NOT:
- Transcripts of conversations
- Exhaustive documentation of every detail
- Set in stone (update when plans change!)
- Busy work (only document what's useful)

**Goal**: Bridge the gap between planning and implementation, between different Claude sessions, between different time periods.

---

**Start using the context system today!** Even small notes help build project memory over time.
