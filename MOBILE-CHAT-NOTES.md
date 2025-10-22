# Claude Mobile Chat Notes

> **Purpose**: Capture key decisions, ideas, and context from Claude Mobile conversations for use in Claude Code sessions
> **How to Use**: After a productive mobile chat, copy the important parts here so Claude Code can read and act on them
> **Last Updated**: 2025-10-22

---

## Quick Reference: What to Capture

When chatting with Claude Mobile, copy these types of things here:

✅ **Design decisions** - Colors, layouts, component choices
✅ **Feature requirements** - What you want built and how it should work
✅ **Content structure** - Page organization, navigation, information architecture
✅ **Technical choices** - Which libraries, approaches, patterns to use
✅ **Implementation details** - Specific code patterns or configurations discussed
✅ **User stories** - "As a visitor, I want to..."
✅ **Priorities** - What's MVP vs nice-to-have

❌ Don't need to capture:
- General explanations of concepts you already understand
- Exploratory "what if" discussions that didn't reach conclusions
- Off-topic conversations

---

## Session Template

Copy this template for each significant mobile chat:

```markdown
### Session: [Date]
**Topic**: [One-line summary]
**Duration**: [Rough time: 5 min / 30 min / 1 hour]
**Outcome**: [What was decided/learned?]

**Context**:
[Brief setup - what were you trying to figure out?]

**Key Decisions**:
1. [Decision 1]
   - Rationale: [Why this choice?]
   - Impact: [What does this affect?]

2. [Decision 2]
   - Rationale: [Why?]
   - Impact: [Affects what?]

**Implementation Notes**:
- [Technical detail 1]
- [Technical detail 2]
- [Gotcha or consideration]

**Action Items**:
- [ ] [Specific task for Claude Code or you]
- [ ] [Specific task]
- [ ] [Specific task]

**Related Files/Sections**:
- [File path or section this relates to]
- [Other relevant context]

**Code Snippets** (if any):
```language
// Code discussed in mobile chat
```

**Links/References**:
- [Any URLs, docs, or resources discussed]
```

---

## Active Sessions

<!-- Add your recent mobile chats below using the template above -->

### Session: [Date - Example]
**Topic**: Homepage Hero Design and Layout
**Duration**: 30 min
**Outcome**: Decided on full-width hero with overlay text

**Context**:
Discussing how to make the homepage impactful while staying elegant and not overwhelming visitors. Looking at similar artist portfolio sites for inspiration.

**Key Decisions**:
1. Full-width hero image with dark overlay
   - Rationale: Showcases artwork immediately, sets artistic tone
   - Impact: Affects homepage layout, image requirements, color scheme

2. Text overlay positioned left-aligned, vertically centered
   - Rationale: Better readability, follows western reading patterns
   - Impact: Text needs good contrast, heading hierarchy important

3. Single strong CTA: "View Exhibitions"
   - Rationale: Clear path for visitors, emphasizes main content
   - Impact: Need to build exhibitions page first

**Implementation Notes**:
- Hero image should be landscape format, high-res
- Overlay opacity: 0.4-0.5 for readability
- Use View Transitions API for smooth navigation
- Mobile: reduce text size, adjust overlay for touch targets

**Action Items**:
- [ ] Select hero image from archive (needs to be iconic work)
- [ ] Write concise headline (max 10 words)
- [ ] Build hero component in Layout.astro
- [ ] Test on mobile for readability

**Related Files/Sections**:
- `src/pages/index.astro` - Homepage
- `DESIGN-SPEC.md` - Add hero details to component patterns

---

### Session: [Date]
**Topic**:
**Duration**:
**Outcome**:

**Context**:


**Key Decisions**:
1.


**Implementation Notes**:
-

**Action Items**:
- [ ]

---

## Archived Sessions

<!-- Move completed sessions here to keep Active Sessions clean -->

### Session: [Date]
**Topic**:
**Status**: ✅ Completed / ⏸️ Paused / ❌ Abandoned

**Brief Summary**:
[What was accomplished or why it was abandoned]

**Learnings**:
- [What did you learn that's useful for future?]

---

## Pattern: Design Discussions

When discussing design in mobile, capture this info:

```markdown
**Visual Element**: [Button, card, nav, etc.]

**Appearance**:
- Colors: [Specific hex or theme variable]
- Size: [Dimensions or relative size]
- Typography: [Font, size, weight]
- Spacing: [Padding, margin values]

**Behavior**:
- Default state: [How it looks normally]
- Hover state: [What changes on hover]
- Active/focus: [Accessibility states]
- Mobile: [How it adapts]

**Example**:
[Link to similar pattern or description]
```

---

## Pattern: Feature Discussions

When discussing features in mobile, capture this info:

```markdown
**Feature Name**: [e.g., "Exhibition Filtering"]

**User Story**:
As a [type of user], I want to [goal], so that [benefit]

**Requirements**:
- Must have: [Core functionality]
- Should have: [Important but not critical]
- Could have: [Nice to have]
- Won't have: [Explicitly out of scope]

**Acceptance Criteria**:
- [ ] [Specific, testable criterion]
- [ ] [Another criterion]

**Technical Approach**:
[How to implement - libraries, patterns, etc.]

**Edge Cases**:
- [What if there are no results?]
- [What if there are 1000 results?]
- [What about accessibility?]
```

---

## Pattern: Content Discussions

When discussing content in mobile, capture this info:

```markdown
**Content Type**: [e.g., "Exhibition Description"]

**Purpose**: [Why this content exists]

**Structure**:
- Heading: [What it says]
- Body: [Rough length, key points to cover]
- Metadata: [Year, location, etc.]

**Tone**: [Academic, accessible, personal, etc.]

**Example**:
[Paste an example or link to reference]

**Who Writes It**: [Content source]

**Approval Process**: [Who needs to review?]
```

---

## Quick Decisions Log

Sometimes you just need to note a quick decision without full template:

| Date | Decision | Context | Action |
|------|----------|---------|--------|
| [date] | Use Cloudinary auto format | Discussed image optimization | Already implemented |
| [date] | Sort exhibitions by year descending | Natural expectation | Add to exhibitions page |
| [date] | Skip blog functionality for MVP | Not enough content yet | Document for phase 2 |
|  |  |  |  |
|  |  |  |  |

---

## Questions to Resolve

Questions that came up in mobile chat but need more thought:

- [ ] **Question**: [What needs to be decided?]
  - Context: [Why it matters]
  - Options: [Possible approaches]
  - Decision by: [Who decides? When?]

- [ ] **Question**:
  - Context:
  - Options:
  - Decision by:

---

## Ideas Parking Lot

Ideas discussed in mobile that are interesting but not immediate priorities:

- **Idea**: [Description]
  - Why interesting: [Potential value]
  - Challenges: [What makes it hard/later]
  - Revisit: [When to reconsider]

- **Idea**:
  - Why interesting:
  - Challenges:
  - Revisit:

---

## How to Use This File with Claude Code

### At the Start of a Claude Code Session

Paste this into chat:
```
I had a mobile chat about [topic]. The key decisions are in MOBILE-CHAT-NOTES.md under the [date] session. Please read that section and implement [specific request].
```

Or more simply:
```
Check MOBILE-CHAT-NOTES.md for [date] - implement the homepage hero we discussed.
```

### During a Claude Code Session

If you remember something from mobile:
```
I discussed [topic] in mobile a few days ago. Let me update MOBILE-CHAT-NOTES.md with the details...
[Add the session notes, commit]

Claude Code: Please read the latest session in MOBILE-CHAT-NOTES.md and proceed with implementation.
```

### After a Claude Code Session

Document what was built:
```markdown
### Session: [Date] - Mobile → Code Implementation
**Mobile Topic**: [Original discussion]
**Claude Code Implementation**:

**What was built**:
- [Feature/page/component]
- [Files created/modified]

**Status**: ✅ Complete

**Learnings**:
- [What worked well]
- [What to adjust next time]
```

---

## Tips for Effective Note-Taking

### Be Specific
❌ "Make it look good"
✅ "Use 0.4 opacity overlay on hero, white text, left-aligned"

### Capture Rationale
❌ "Use 3-column grid"
✅ "Use 3-column grid because it shows enough items without overwhelming, and adapts cleanly to 2 cols on tablet, 1 on mobile"

### Link Related Decisions
"This relates to the color scheme decision from [date session], where we chose [color] for primary"

### Update as Decisions Change
When you change your mind, update the note and add:
```
**Update [date]**: Changed from [old] to [new] because [reason]
```

### Use This File Often
The more you use it, the more valuable it becomes. Even quick notes help!

---

## Template for Code Snippets

If mobile chat produced code examples worth saving:

```markdown
### Code Snippet: [Purpose]
**From Session**: [Date]
**Context**: [When to use this]

```language
// Code here
```

**Notes**:
- [Important detail about the code]
- [Gotcha or consideration]
```

---

**Remember**: The goal is to bridge the gap between mobile chats and code sessions. You don't need to capture everything - just the decisions, requirements, and context that Claude Code will need to build what you envisioned!
