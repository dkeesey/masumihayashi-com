# Context System Guide

> **How to maintain context across Claude sessions and bridge the gap between mobile and Claude Code**

---

## The Problem

When working with Claude across different environments (mobile, desktop, Code), each session starts fresh with no memory of previous conversations. This creates a gap where decisions, requirements, and context get lost.

**Example**:
- Mobile: Spend 30 minutes discussing homepage design
- Claude Code: Start fresh, unaware of those decisions
- You: Have to re-explain everything or forget important details

---

## The Solution: Context Files

By maintaining markdown files in your git repo, you create a **persistent memory** that any Claude session can read.

Think of these files as:
- 📝 Shared notebook between all Claude sessions
- 🧠 External memory for the project
- 📚 Documentation that grows with your project
- 🔗 Bridge between mobile discussions and code implementation

---

## The Context Files

We've created 5 template files to capture different types of context:

### 1. **DESIGN-SPEC.md** - Visual & UX Decisions
**When to use**: After discussing design, layouts, components, or user experience

**Captures**:
- Color palettes and typography
- Component patterns (cards, navigation, buttons)
- Page layouts
- Interaction patterns
- Mobile-first considerations

**Example use case**:
> Mobile: Discuss homepage hero design (full-width, dark overlay, left-aligned text)
>
> You: Update DESIGN-SPEC.md with those decisions
>
> Code: "Read DESIGN-SPEC.md homepage section and build the hero component"

---

### 2. **CONTENT-PLAN.md** - Content Structure & Editorial
**When to use**: After planning content, collections, page structure, or writing guidelines

**Captures**:
- Content collection schemas
- Page structures and sections
- Editorial voice and tone
- Content migration plans
- Launch checklists

**Example use case**:
> Mobile: Decide exhibitions should show year, location, curator, and 3 featured artworks
>
> You: Update CONTENT-PLAN.md exhibition schema
>
> Code: "Read the exhibition schema in CONTENT-PLAN.md and create the collection config"

---

### 3. **MOBILE-CHAT-NOTES.md** - Session Summaries
**When to use**: After any productive mobile conversation

**Captures**:
- Key decisions from mobile chats
- Rationale for choices
- Implementation notes
- Action items

**Example use case**:
> Mobile: Long discussion about gallery interaction patterns
>
> You: Copy session template, fill in key points, commit
>
> Code: "Check MOBILE-CHAT-NOTES.md session from [date] and implement the gallery"

---

### 4. **REQUIREMENTS.md** - Features & Specifications
**When to use**: When defining what needs to be built

**Captures**:
- MVP vs Phase 2 features
- User stories
- Acceptance criteria
- Non-functional requirements
- User journeys

**Example use case**:
> Mobile: Brainstorm all features needed for launch
>
> You: Add to REQUIREMENTS.md MVP section
>
> Code: "Review MVP requirements and let's prioritize implementation order"

---

### 5. **ARCHITECTURE.md** - Technical Decisions
**When to use**: When making technical architecture or stack decisions

**Captures**:
- Tech stack choices and rationale
- Architecture patterns
- Build and deployment strategy
- Performance optimizations
- Security considerations
- ADRs (Architecture Decision Records)

**Example use case**:
> Mobile: Debate whether to use SSG or SSR
>
> You: Document decision in ARCHITECTURE.md with ADR
>
> Code: "Following the SSG architecture in ARCHITECTURE.md, let's optimize the build"

---

## Workflow Examples

### Workflow 1: Mobile Design → Code Implementation

```
1. MOBILE (Morning):
   You: "I'm thinking the homepage needs a big hero image..."
   Claude: [Discusses options, you settle on full-width with overlay]

2. YOU (Afternoon):
   - Open DESIGN-SPEC.md
   - Fill in "Homepage > Hero Section" with decisions
   - Commit and push

3. CODE (Evening):
   You: "Read DESIGN-SPEC.md homepage section and implement the hero"
   Claude: [Reads file, builds component matching your specs]

✅ No context lost! Design discussion preserved and implemented correctly.
```

---

### Workflow 2: Mobile Planning → Code Execution

```
1. MOBILE (During commute):
   You: "Let's plan the exhibition archive page..."
   Claude: [Discusses filtering, sorting, layout, content needs]

2. YOU (When you get home):
   - Open MOBILE-CHAT-NOTES.md
   - Create new session entry with date
   - Copy key decisions (3-column grid, sort by year, show 5 metadata fields)
   - Commit

3. CODE (Same session):
   You: "Read today's session in MOBILE-CHAT-NOTES.md and build the archive page"
   Claude: [Reads notes, implements exactly as discussed]

✅ Seamless transition from planning to implementation!
```

---

### Workflow 3: Iterative Refinement

```
1. CODE (Session 1):
   You: "Build the exhibition card component"
   Claude: [Builds component]

2. MOBILE (Later):
   You: "The cards need more padding and rounded corners"
   Claude: [Discusses, settles on specific values]

3. YOU:
   - Update DESIGN-SPEC.md > "Cards" section
   - Note: "Update 10/22: Changed padding to 1.5rem, border-radius to 0.75rem"

4. CODE (Session 2):
   You: "Update exhibition cards per latest DESIGN-SPEC.md"
   Claude: [Reads updated spec, adjusts component]

✅ Design evolution is tracked and applied!
```

---

### Workflow 4: Complex Feature Development

```
1. MOBILE (Brainstorming):
   Discuss image zoom feature in detail
   - Pinch to zoom on mobile
   - Keyboard navigation
   - Next/prev in galleries
   - Metadata overlay

2. YOU:
   Update REQUIREMENTS.md:
   - Add "Image Zoom/Lightbox" feature spec
   - Define must-have vs nice-to-have
   - Write acceptance criteria

3. CODE:
   You: "Read the Image Zoom feature in REQUIREMENTS.md and implement it"
   Claude: [Reads spec, asks clarifying questions, implements with all requirements]

4. YOU:
   After implementation, update REQUIREMENTS.md:
   - Mark acceptance criteria as complete
   - Note what was built, what was deferred

✅ Complex feature fully specified and tracked!
```

---

## Best Practices

### 1. **Update Files After Decisions, Not During**

Don't interrupt your mobile flow to update files. Have the discussion, then summarize afterwards.

**Good**:
```
1. Mobile: Full discussion (30 min)
2. Update: Summarize to file (5 min)
3. Code: Implement (Claude reads file)
```

**Bad**:
```
1. Mobile: Discuss point 1
2. Switch to update file
3. Back to mobile for point 2
4. Switch to update file again
[Breaks flow, feels fragmented]
```

---

### 2. **Be Specific, Not Verbose**

You don't need to copy the entire conversation. Extract the **decisions**.

**Too Verbose**:
```
Mobile Chat:
Me: "What do you think about blue?"
Claude: "Blue can work well for..."
Me: "Yeah but maybe green?"
Claude: "Green is also a good choice because..."
[500 more lines]
```

**Just Right**:
```
Color Decision:
- Primary: #2E7D32 (green)
- Rationale: Evokes nature, calms viewers, good contrast
- Use: Primary CTAs, links, active states
```

---

### 3. **Link Related Decisions**

Help future Claude sessions understand connections:

```markdown
### Navigation Design
- Fixed header on scroll
- Related: See ARCHITECTURE.md for View Transitions implementation
- Related: See DESIGN-SPEC.md > Accessibility for keyboard nav requirements
```

---

### 4. **Use Templates Consistently**

The templates have structure for a reason - they make it easier for Claude to parse and understand.

Don't create freeform notes when a template section exists.

---

### 5. **Commit Often**

Every time you update context files, commit them:

```bash
git add DESIGN-SPEC.md
git commit -m "Add homepage hero design decisions"
git push
```

This ensures:
- Changes are backed up
- Claude Code can pull latest
- You have history of decisions

---

### 6. **Review Before Major Sessions**

Before starting a big Claude Code session:

```
You: "Before we start, I want to make sure you have full context.
Please read:
- REQUIREMENTS.md (MVP section)
- DESIGN-SPEC.md (Homepage and Exhibitions pages)
- MOBILE-CHAT-NOTES.md (last 2 sessions)

Then let's discuss implementation approach."
```

---

## File Usage Matrix

| Situation | File to Update | What to Capture |
|-----------|----------------|-----------------|
| Discussed colors, fonts, layouts | DESIGN-SPEC.md | Visual decisions, component patterns |
| Planned page structure, content needs | CONTENT-PLAN.md | Schemas, sections, editorial guidelines |
| Had productive mobile chat | MOBILE-CHAT-NOTES.md | Key decisions, action items |
| Defined a new feature | REQUIREMENTS.md | User story, acceptance criteria |
| Chose a technology or pattern | ARCHITECTURE.md | Decision, rationale, trade-offs |
| Made a temporary note | MOBILE-CHAT-NOTES.md | Use "Questions to Resolve" section |

---

## Maintaining the System

### Weekly Review (5 minutes)

1. Review what was built this week
2. Update relevant files with any undocumented decisions
3. Clean up completed action items
4. Move archived mobile sessions to "Archived" section

### Monthly Audit (15 minutes)

1. Read through all context files
2. Remove outdated information
3. Consolidate duplicate information
4. Update "Last Updated" dates
5. Ensure consistency across files

### When Starting New Features

1. Check REQUIREMENTS.md - is it already defined?
2. Check DESIGN-SPEC.md - are there relevant patterns?
3. Check ARCHITECTURE.md - are there technical constraints?
4. Check MOBILE-CHAT-NOTES.md - was this discussed?

---

## Tips for Mobile → Code Transfer

### What Claude Code Needs to Know

**For Design Work**:
- Specific colors (hex codes, not "blue-ish")
- Exact spacing (1rem, 2rem, not "some space")
- Breakpoints (640px, 1024px, not "tablet size")
- Component states (hover, focus, active)

**For Features**:
- User story (who, what, why)
- Acceptance criteria (specific, testable)
- Edge cases to handle
- Related features/pages

**For Content**:
- Schema fields and types
- Required vs optional
- Validation rules
- Example content

### What You Can Be Vague About

Claude Code can figure out:
- Exact implementation details (let it choose the approach)
- File organization (it knows the structure)
- Naming conventions (follows project patterns)
- Testing approach (it will ask if unclear)

---

## Example: Complete Workflow

Let's walk through a complete example:

### Monday Morning - Mobile Chat

```
You: "I need to plan the About page for masumihayashi.com"

Claude: [Discusses biography structure, photo placement, timeline options]

You: "Let's go with a split layout - portrait on left, bio essay on right.
      Include a timeline of major life events below."

Claude: [Discusses timeline format, interactive vs static]

You: "Start with static, we can make it interactive later."

[30 minute discussion about content, structure, design]
```

### Monday Afternoon - Document Decisions

**Update CONTENT-PLAN.md**:
```markdown
### About/Biography (/about)
**Status**: Planning

**Structure**:
1. **Hero Section**
   - Portrait photo: TBD (need high-res from family)
   - Years: 1945-2006

2. **Biography Essay**
   - Length: 800-1000 words
   - Tone: Accessible, respectful
   - Sections: Early Life, Education, Artistic Development, Teaching

3. **Timeline**
   - Static for MVP
   - Interactive in Phase 2
   - Events: Birth, education milestones, major exhibitions, awards, etc.
```

**Update DESIGN-SPEC.md**:
```markdown
### About/Biography
**Layout**:
- Desktop: Split (portrait left, content right)
- Mobile: Stacked (portrait top, content below)

**Portrait**:
- Size: 400x500px on desktop
- Position: Sticky (stays visible while scrolling)
- Border: 4px primary color

**Timeline**:
- Style: Vertical line with year markers
- Items: Year + brief description
- Hover: Expand to show more detail (Phase 2)
```

**Update MOBILE-CHAT-NOTES.md**:
```markdown
### Session: 2025-10-22 (Monday AM)
**Topic**: About Page Structure and Design
**Duration**: 30 min
**Outcome**: Defined complete page structure, ready to implement

**Key Decisions**:
1. Split layout (portrait + bio essay)
   - Rationale: Professional, showcases photo while providing context
   - Impact: Affects responsive design, image requirements

2. Static timeline for MVP
   - Rationale: Simpler to build, content is historical (doesn't change)
   - Impact: Can enhance to interactive later without major refactor

**Action Items**:
- [ ] Get high-res portrait photo from family
- [ ] Compile timeline events (birth, education, awards, etc.)
- [ ] Write or compile 800-1000 word biography
- [ ] Implement page in Claude Code session
```

**Commit**:
```bash
git add CONTENT-PLAN.md DESIGN-SPEC.md MOBILE-CHAT-NOTES.md
git commit -m "Plan About page structure and design"
git push
```

### Monday Evening - Claude Code Session

```
You: "I've planned the About page. Please read:
     - CONTENT-PLAN.md > About/Biography section
     - DESIGN-SPEC.md > About/Biography section
     - MOBILE-CHAT-NOTES.md > Today's session

     Then implement the About page structure (we can add real content later)."

Claude Code:
[Reads all three files]
"I see you've planned a split layout with portrait, bio essay, and timeline.
 I'll implement the page structure with:
 - Responsive split → stacked layout
 - Placeholder for portrait
 - Sections for bio essay
 - Static timeline component

 I'll use the existing shadcn components and follow the design patterns
 in DESIGN-SPEC.md. Ready to proceed?"

You: "Yes, go ahead."

Claude Code:
[Creates src/pages/about.astro]
[Implements layout with placeholder content]
[Adds to navigation]
[Tests responsive breakpoints]
[Commits and pushes]

"Done! About page structure is ready at /about.
 Next steps: Add real content as per CONTENT-PLAN.md action items."
```

**Result**: Zero context lost. Clean handoff from planning to implementation.

---

## Troubleshooting

### "Claude Code didn't follow my mobile discussion"

**Problem**: Context wasn't captured in files

**Solution**:
- Review MOBILE-CHAT-NOTES.md - did you document it?
- Explicitly tell Claude Code which file to read
- Be specific about what was decided

---

### "Files are getting too long"

**Problem**: Accumulating too much detail

**Solution**:
- Archive old sessions in MOBILE-CHAT-NOTES.md
- Create sub-pages for complex features
- Summarize rather than transcribe

---

### "I forgot to update files after mobile chat"

**Problem**: Decision is lost

**Solution**:
- Update now based on what you remember
- Mark uncertain items with "TODO: Verify this decision"
- Ask in next Claude session if unclear

---

### "Conflicting information across files"

**Problem**: Updated one file but not others

**Solution**:
- Use search to find related mentions
- Update all relevant files
- Add cross-references
- Note the change in each file's change log

---

## Advanced Patterns

### Pattern: Design System Evolution

As your design solidifies, DESIGN-SPEC.md becomes your design system documentation.

**Phase 1**: Ad-hoc decisions per component
**Phase 2**: Extract patterns into reusable styles
**Phase 3**: Document the system for consistency

---

### Pattern: Feature Flags

Use REQUIREMENTS.md to track feature status:

```markdown
### Features Status

| Feature | Status | File | Notes |
|---------|--------|------|-------|
| Homepage | ✅ Complete | src/pages/index.astro | |
| About | 🚧 In Progress | src/pages/about.astro | Need real content |
| Exhibitions | 📋 Planned | REQUIREMENTS.md | Specced, not started |
| Search | 💡 Idea | - | Phase 2 |
```

---

### Pattern: Cross-File References

Link related context across files:

```markdown
# In REQUIREMENTS.md
### Feature: Image Zoom
See ARCHITECTURE.md > ADR-003 for library choice decision
See DESIGN-SPEC.md > Image Viewers for UX patterns

# In ARCHITECTURE.md
### ADR-003: PhotoSwipe for Image Lightbox
Related to REQUIREMENTS.md > Image Zoom feature

# In DESIGN-SPEC.md
### Image Viewers
Implementation: See ARCHITECTURE.md > ADR-003
```

---

## Summary

The context system bridges the gap between:
- **Different Claudes** (mobile, desktop, code)
- **Different sessions** (today vs next week)
- **Different people** (you now vs you in 6 months)

**Key principles**:
1. Document decisions, not discussions
2. Be specific and actionable
3. Update files after productive sessions
4. Commit changes to git
5. Reference files explicitly in Claude Code sessions

**The workflow**:
```
Discuss → Document → Commit → Reference → Implement → Update
   ↑                                                      ↓
   └──────────────────────────────────────────────────────┘
                    (Iterate)
```

Start using the system today, and it will become your project's persistent memory!
