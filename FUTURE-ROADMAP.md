# Future Feature Roadmap

**Purpose**: Plan for advanced features beyond initial launch
**Timeline**: 3-12 months post-launch
**Goal**: Transform static site into interactive digital museum experience

---

## Phase 1: Search & Discovery (Months 1-3)

### Full-Text Search
**Problem**: 138 artworks across 8 series - users need to find specific works

**Solution**: Pagefind or Algolia search integration

#### Option A: Pagefind (Recommended - Static Site Friendly)
```bash
npm install --save-dev pagefind
```

**Features**:
- Zero-config static site search
- Indexes all pages at build time
- Fast client-side search (<1kb bundle)
- No API keys or external service

**Implementation**:
```typescript
// astro.config.mjs
export default defineConfig({
  integrations: [
    pagefind()
  ]
})
```

**Search UI**:
```astro
---
// src/components/Search.astro
---
<div class="search-container">
  <input
    type="search"
    id="search"
    placeholder="Search artworks, series, locations..."
    class="search-input"
  />
  <div id="search-results"></div>
</div>

<script>
  import Pagefind from 'pagefind'

  const search = document.getElementById('search')
  const results = document.getElementById('search-results')

  search.addEventListener('input', async (e) => {
    const query = e.target.value
    if (query.length < 2) return

    const searchResults = await Pagefind.search(query)
    // Render results...
  })
</script>
```

**Search Filters**:
- Series (dropdown)
- Date range (slider)
- Location (autocomplete)
- Medium (checkbox)

---

### Faceted Search
**User Story**: "Show me all Chromogenic prints from 1990-1995 in the Internment Camps series"

**Implementation**: Algolia InstantSearch
```tsx
// src/components/FacetedSearch.tsx
import { InstantSearch, SearchBox, RefinementList, Hits } from 'react-instantsearch-hooks-web'

<InstantSearch searchClient={algoliasearch(APP_ID, API_KEY)} indexName="artworks">
  <SearchBox placeholder="Search 138 artworks..." />

  <div className="filters">
    <RefinementList attribute="series" />
    <RefinementList attribute="year" />
    <RefinementList attribute="location" />
    <RefinementList attribute="medium" />
  </div>

  <Hits hitComponent={ArtworkCard} />
</InstantSearch>
```

**Data Structure**:
```json
{
  "objectID": "manzanar-monument",
  "title": "Manzanar Monument: South View",
  "series": "American Concentration Camps",
  "year": 1995,
  "location": "Manzanar, California",
  "medium": "Chromogenic color print",
  "dimensions": "72 x 36 inches",
  "keywords": ["internment", "WWII", "memorial", "California"],
  "image": "https://res.cloudinary.com/.../manzanar.jpg"
}
```

**Cost**: Algolia free tier (10K searches/month)

---

## Phase 2: Tag System & Taxonomy (Months 2-4)

### Multi-Dimensional Tagging
**Purpose**: Connect artworks across series by themes, subjects, techniques

#### Tag Hierarchies

**Themes** (Conceptual):
```
Themes/
├── Memory & History
│   ├── Japanese American Internment
│   ├── Cold War
│   └── Industrial Decline
├── Place & Landscape
│   ├── American West
│   ├── Urban Environments
│   └── Sacred Sites
├── Justice & Rights
│   ├── Incarceration
│   ├── Environmental Justice
│   └── Civil Liberties
└── Cultural Heritage
    ├── Asian American Identity
    ├── Religious Architecture
    └── Community Memory
```

**Subjects** (Literal):
```
Subjects/
├── Architecture
│   ├── Monuments
│   ├── Barracks
│   ├── Temples
│   └── Industrial Buildings
├── Landscape Features
│   ├── Mountains
│   ├── Desert
│   ├── Urban Decay
│   └── Water Features
└── Human Elements
    ├── Fences & Barriers
    ├── Signage
    └── Artifacts
```

**Techniques** (Artistic):
```
Techniques/
├── Panoramic Photography
├── Photo Collage
├── Multiple Exposures
├── Color Photography
└── Large Format
```

**Geographic** (Searchable):
```
Geographic/
├── California
│   ├── Manzanar
│   ├── Tule Lake
│   └── Sacramento
├── Wyoming (Heart Mountain)
├── Utah (Topaz)
├── Ohio (Cleveland)
├── Cambodia (Angkor Wat)
└── Japan (Kyoto)
```

#### Tag UI Components

**Tag Cloud** (Series landing pages):
```tsx
// src/components/TagCloud.tsx
<div className="tag-cloud">
  {tags.map(tag => (
    <a
      href={`/tags/${tag.slug}/`}
      className="tag"
      style={{ fontSize: `${tag.count}px` }}
    >
      {tag.name} ({tag.count})
    </a>
  ))}
</div>
```

**Tag Filters** (Artwork gallery):
```tsx
// src/components/TagFilter.tsx
<div className="tag-filters">
  <h4>Filter by Theme</h4>
  <TagGroup tags={themeTags} onChange={handleFilter} />

  <h4>Filter by Location</h4>
  <TagGroup tags={locationTags} onChange={handleFilter} />

  <h4>Filter by Technique</h4>
  <TagGroup tags={techniqueTags} onChange={handleFilter} />
</div>
```

**Related by Tags**:
```html
<!-- On Manzanar artwork page -->
<aside class="related-by-tags">
  <h4>Similar Themes</h4>
  <ul>
    <li><a href="/tags/japanese-american-internment/">Japanese American Internment (37)</a></li>
    <li><a href="/tags/monuments/">Monuments (12)</a></li>
    <li><a href="/tags/california/">California (24)</a></li>
  </ul>
</aside>
```

#### Content Collections Schema
```typescript
// src/content/config.ts
const artworkCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    series: z.string(),
    date: z.string(),

    // Multi-dimensional tags
    themes: z.array(z.enum([
      'memory-history',
      'place-landscape',
      'justice-rights',
      'cultural-heritage'
    ])),

    subjects: z.array(z.enum([
      'architecture-monuments',
      'architecture-barracks',
      'landscape-mountains',
      'landscape-desert',
      'human-fences'
    ])),

    techniques: z.array(z.enum([
      'panoramic',
      'photo-collage',
      'multiple-exposure',
      'color',
      'large-format'
    ])),

    locations: z.array(z.string()),  // Free-form geographic

    keywords: z.array(z.string())    // Open-ended
  })
})
```

**SEO Benefit**: Tag pages create natural topical clusters, boosting authority for specific keywords

---

## Phase 3: AI Chat Docent (Months 6-12) 🤖

### Vision: Interactive Museum Guide
**User Experience**: Chat interface that acts as knowledgeable docent, guiding users through artwork while controlling image slideshow

**Example Interaction**:
```
User: "Show me works about Japanese American internment"

AI Docent: "I'll show you Masumi's American Concentration Camps series,
her most significant body of work. Let's start with Manzanar..."

[Slideshow displays Manzanar Monument]

AI Docent: "This is the memorial monument at Manzanar, photographed in 1995.
Notice how Masumi's panoramic technique captures both the monument and
the surrounding desert landscape, emphasizing the isolation these families
experienced. The Owens Valley mountains frame the scene..."

User: "What else did she photograph at Manzanar?"

AI Docent: "She created three panoramas of Manzanar..."
[Slideshow advances to next Manzanar work]
```

---

### Technical Architecture

#### Component Stack
```
┌─────────────────────────────────────────┐
│  Chat UI (React)                        │
│  - Message history                      │
│  - Input field                          │
│  - Suggested questions                  │
└─────────────────────────────────────────┘
           ↓ User message
┌─────────────────────────────────────────┐
│  AI Orchestrator (Server)               │
│  - Parse intent (query, navigation)     │
│  - Call OpenAI/Anthropic API            │
│  - Inject artwork context               │
└─────────────────────────────────────────┘
           ↓ Response + slideshow commands
┌─────────────────────────────────────────┐
│  Slideshow Controller                   │
│  - Display artwork                      │
│  - Zoom/pan controls                    │
│  - Artwork metadata overlay             │
└─────────────────────────────────────────┘
```

#### AI Context Injection
```typescript
// Server-side API route: /api/chat
import { OpenAI } from 'openai'
import { getArtworkByQuery } from '@lib/artwork-search'

export async function POST(request: Request) {
  const { message, artworkSlug } = await request.json()

  // Get current artwork context
  const artwork = await getArtwork(artworkSlug)

  // Build context for AI
  const systemPrompt = `You are a knowledgeable museum docent for the Masumi Hayashi digital archive.

Current artwork:
Title: ${artwork.title}
Series: ${artwork.series}
Date: ${artwork.date}
Location: ${artwork.location}
Description: ${artwork.description}

Artist background:
Masumi Hayashi (1945-2006) was a Japanese American artist known for panoramic photo collages.
She was born in an internment camp and later documented these sites as an adult.

Your role:
- Provide insightful, contextual information about the artwork
- Guide users through thematic connections
- Suggest related artworks to view next
- When showing other artworks, use the command: SHOW_ARTWORK:slug`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ]
  })

  // Parse response for slideshow commands
  const text = response.choices[0].message.content
  const showMatch = text.match(/SHOW_ARTWORK:(\S+)/)

  return {
    message: text.replace(/SHOW_ARTWORK:\S+/, ''),
    showArtwork: showMatch ? showMatch[1] : null
  }
}
```

#### Chat UI Component
```tsx
// src/components/AIChatDocent.tsx
import { useState, useEffect } from 'react'
import { Slideshow } from './Slideshow'

export function AIChatDocent({ initialArtwork }: { initialArtwork: string }) {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Welcome! I'm your guide to Masumi Hayashi's work. What would you like to explore?"
  }])
  const [currentArtwork, setCurrentArtwork] = useState(initialArtwork)
  const [input, setInput] = useState('')

  const sendMessage = async () => {
    const userMessage = { role: 'user', content: input }
    setMessages([...messages, userMessage])

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: input,
        artworkSlug: currentArtwork
      })
    })

    const data = await response.json()

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: data.message
    }])

    if (data.showArtwork) {
      setCurrentArtwork(data.showArtwork)
    }

    setInput('')
  }

  return (
    <div className="ai-docent">
      <div className="slideshow-panel">
        <Slideshow artwork={currentArtwork} />
      </div>

      <div className="chat-panel">
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message message-${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </div>

        <div className="input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about this artwork..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>

        <div className="suggested-questions">
          <button onClick={() => setInput("What other camps did Masumi photograph?")}>
            What other camps did Masumi photograph?
          </button>
          <button onClick={() => setInput("Tell me about the historical context")}>
            Tell me about the historical context
          </button>
          <button onClick={() => setInput("Show me her other series")}>
            Show me her other series
          </button>
        </div>
      </div>
    </div>
  )
}
```

#### Slideshow Controller
```tsx
// src/components/Slideshow.tsx
import { useState, useEffect } from 'react'
import { CloudinaryImage } from './CloudinaryImage'

export function Slideshow({ artwork }: { artwork: string }) {
  const [artworkData, setArtworkData] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Fetch artwork details
    fetch(`/api/artwork/${artwork}`)
      .then(res => res.json())
      .then(setArtworkData)
  }, [artwork])

  if (!artworkData) return <div>Loading...</div>

  return (
    <div className="slideshow">
      <div className="image-container"
           style={{
             transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`
           }}>
        <CloudinaryImage
          src={artworkData.image}
          alt={artworkData.title}
          width={2000}
          height={1000}
        />
      </div>

      <div className="controls">
        <button onClick={() => setZoom(zoom * 1.2)}>Zoom In</button>
        <button onClick={() => setZoom(zoom / 1.2)}>Zoom Out</button>
        <button onClick={() => setZoom(1)}>Reset</button>
      </div>

      <div className="metadata-overlay">
        <h3>{artworkData.title}</h3>
        <p>{artworkData.date} • {artworkData.dimensions}</p>
        <p>{artworkData.location}</p>
      </div>
    </div>
  )
}
```

---

### Advanced AI Features

#### Thematic Tours
**Pre-programmed guided experiences**:
```
"Incarceration and Memory" Tour:
1. Manzanar Monument → AI explains historical context
2. Eastern State Penitentiary → AI connects themes of confinement
3. Love Canal → AI discusses justice and memory

User can interrupt, ask questions, request detours
```

#### Visual Analysis
**AI describes what it "sees" in the image**:
```
User: "Describe the composition of this photograph"

AI: "This panoramic image is composed of multiple exposures stitched together,
creating a sense of breadth and space. The monument stands centrally,
drawing your eye, while the mountain range creates a dramatic backdrop.
Notice how Masumi used the natural framing of..."
```

#### Comparative Analysis
```
User: "Compare this to her prison photographs"

AI: "Both series explore sites of confinement, but with different intentions.
In the internment camps, she's documenting a personal and cultural history.
In the prisons, she examines institutional architecture of punishment.
Let me show you a comparison..."
[Split-screen slideshow]
```

---

### Implementation Considerations

#### Cost Estimation
- **OpenAI GPT-4**: ~$0.03 per conversation (10-15 messages)
- **Expected usage**: 100 conversations/day = $3/day = $90/month
- **Alternative**: GPT-3.5-Turbo ($10/month) or Claude Haiku ($20/month)

#### Privacy & Data
- No conversation storage (ephemeral)
- No personal data collection
- Optional: Anonymous usage analytics

#### Moderation
- Content filtering for inappropriate queries
- Graceful handling of off-topic questions
- Redirect to contact form for complex inquiries

#### Accessibility
- Keyboard navigation
- Screen reader friendly
- Alternative text-only mode

---

## Implementation Timeline

### Months 1-3: Search & Tags
- Week 1-2: Pagefind integration
- Week 3-4: Search UI design
- Week 5-8: Tag taxonomy design
- Week 9-12: Tag filtering implementation

### Months 4-6: Advanced Search
- Faceted search with Algolia
- Tag-based browse pages
- Related content recommendations

### Months 6-12: AI Docent
- Month 6-7: Slideshow component
- Month 8-9: Basic chat integration
- Month 10-11: AI context refinement
- Month 12: Thematic tours & advanced features

---

## Success Metrics

### Search (Month 3)
- 40% of users use search
- Average 3 searches per session
- 70% search→page click-through rate

### Tags (Month 6)
- 25% of users browse by tags
- Average 4 pages via tag navigation
- Reduced bounce rate on tag pages

### AI Docent (Month 12)
- 15% of users engage with chat
- Average 8 messages per conversation
- 60% positive feedback rating
- Increased time on site (+50%)

---

**Last Updated**: 2025-10-21
**Status**: Planning phase
**Priority**: Search (high), Tags (medium), AI (aspirational)
