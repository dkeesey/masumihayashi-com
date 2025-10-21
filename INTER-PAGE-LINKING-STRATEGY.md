# Inter-Page Linking Strategy for SEO

**Purpose**: Strategic internal linking to boost search rankings and user engagement
**Priority**: High - Internal links are a top-3 ranking factor
**SEO Impact**: 20-30% improvement in page authority distribution

---

## Why Inter-Page Links Matter

### For Search Engines
1. **Crawl Discovery**: Helps Google find all pages
2. **Link Equity Distribution**: Passes authority from high-traffic pages to deep content
3. **Topical Relevance**: Signals content relationships
4. **Indexation**: Ensures all pages get crawled and indexed

### For AI Models
1. **Context Building**: AI understands content hierarchies
2. **Entity Relationships**: Maps connections between artworks, series, locations
3. **Citation Paths**: Creates logical paths for AI to cite sources

---

## Current Linking Structure

### Implemented ✅
1. **Top Navigation** → Curated high-priority pages
   - Homepage → About → Artworks → Exhibitions
2. **Footer** → Complete page inventory
   - All 8 series, exhibitions, resources, family album
3. **Mega Menu** → Series discovery
   - Artwork → 8 series with descriptions

### Missing (High Priority)
1. **Contextual Links** - In content, linking related artworks/series
2. **Breadcrumbs** - Series → Artwork → Individual piece
3. **Related Artworks** - "See Also" sections
4. **Series Navigation** - Previous/Next within series

---

## Linking Patterns to Implement

### 1. Breadcrumb Navigation (Critical)

**Add to all artwork pages**:
```
Home > Artwork > Internment Camps > Manzanar Monument
```

**Schema markup**:
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://masumihayashi.com/"},
    {"@type": "ListItem", "position": 2, "name": "Artwork", "item": "https://masumihayashi.com/artwork/"},
    {"@type": "ListItem", "position": 3, "name": "Internment Camps", "item": "https://masumihayashi.com/artwork/japanese-american-internment-camps/"},
    {"@type": "ListItem", "position": 4, "name": "Manzanar Monument"}
  ]
}
```

**SEO Benefit**: Google shows breadcrumbs in search results

---

### 2. Related Artworks (Same Series)

**Add to artwork pages**:
```html
<section class="related-artworks">
  <h3>More from American Concentration Camps Series</h3>
  <div class="grid grid-cols-3">
    <a href="/artwork/internment-camps/topaz-foundations/">Topaz Foundations</a>
    <a href="/artwork/internment-camps/heart-mountain/">Heart Mountain</a>
    <a href="/artwork/internment-camps/tule-lake/">Tule Lake</a>
  </div>
</section>
```

**Link Pattern**: Show 3-6 related artworks from same series

---

### 3. Cross-Series Thematic Links

**Example: Internment Camps ↔ Prisons**
On internment camp artwork pages:
```html
<aside class="thematic-connections">
  <h4>Related Themes</h4>
  <p>Masumi also explored sites of confinement in her
    <a href="/artwork/prisons/">Prisons & Institutions series</a>,
    examining connections between incarceration and civil rights.
  </p>
</aside>
```

**Thematic Clusters**:
- Confinement: Internment Camps ↔ Prisons
- Environment: EPA Superfund ↔ Post-Industrial
- Sacred/Spiritual: Sacred Architectures ↔ Commissions (memorial works)
- Urban: City Works ↔ Post-Industrial

---

### 4. Artist Statement → Artwork Examples

**On `/artist-statement/` page**, link to specific artworks mentioned:

```markdown
Hayashi's [American Concentration Camps series](/artwork/japanese-american-internment-camps/)
explores the physical remnants of Japanese American incarceration during World War II.
Her [Manzanar Monument](/artwork/internment-camps/manzanar-monument/) panorama...
```

**SEO Benefit**: High-authority page (artist statement) passes equity to artwork pages

---

### 5. Historical Context → Artworks

**On `/resources/historical-context/executive-order-9066/`**:

```markdown
Executive Order 9066 led to the forcible removal of 120,000 Japanese Americans.
Masumi Hayashi documented these sites in her [Internment Camps series](/artwork/japanese-american-internment-camps/),
including [Manzanar](/artwork/internment-camps/manzanar-monument/),
[Topaz](/artwork/internment-camps/topaz-foundations/), and
[Heart Mountain](/artwork/internment-camps/heart-mountain/).
```

**Link Pattern**: Resources → Series → Individual Artworks

---

### 6. Series Landing Page Navigation

**On `/artwork/japanese-american-internment-camps/`**:

```html
<!-- Previous/Next Series -->
<nav class="series-navigation">
  <a href="/artwork/sacred-architectures/">← Sacred Architectures</a>
  <a href="/artwork/post-industrial/">Post-Industrial →</a>
</nav>

<!-- Jump to Artworks -->
<section id="artworks-in-series">
  <h2>37 Artworks in This Series</h2>
  <!-- Alphabetical or chronological grid -->
  <div class="artwork-grid">
    <a href="/artwork/internment-camps/gila-river/">Gila River</a>
    <a href="/artwork/internment-camps/granada/">Granada (Amache)</a>
    <a href="/artwork/internment-camps/heart-mountain/">Heart Mountain</a>
    <!-- ... all 37 works -->
  </div>
</section>
```

---

### 7. Family Album → Internment Camps Cross-Links

**Strategic connection**: Family Album photographers documented camp life, Masumi documented camp sites decades later

**On `/family-album-project/`**:
```html
<p>These family photographers captured daily life inside the camps.
Decades later, Masumi Hayashi returned to document the
<a href="/artwork/japanese-american-internment-camps/">physical remnants of these sites</a>
in her American Concentration Camps series.</p>
```

**On `/artwork/japanese-american-internment-camps/`**:
```html
<p>While these panoramas show the camps as they appear today,
the <a href="/family-album-project/">Family Album Project</a>
preserves photographs taken by internees during their incarceration.</p>
```

---

### 8. Exhibition Pages → Artworks

**On `/exhibitions/current/sfmoma-2025/`**:
```html
<h3>Featured Artworks</h3>
<ul>
  <li><a href="/artwork/internment-camps/manzanar-monument/">Manzanar Monument</a> (1995)</li>
  <li><a href="/artwork/internment-camps/topaz-foundations/">Topaz Foundations</a> (1990)</li>
  <!-- Link all featured works -->
</ul>
```

---

## Link Anchor Text Strategy

### Good Anchor Text (Descriptive)
✅ "Masumi Hayashi's Internment Camps series"
✅ "panoramic photo collages of Manzanar"
✅ "American Concentration Camps artwork collection"

### Avoid (Generic/Over-Optimized)
❌ "click here"
❌ "internment camps internment camps Japanese American internment camps"
❌ "this link"

---

## Technical Implementation

### Component: Breadcrumbs.astro
```typescript
---
interface Props {
  path: {
    label: string
    href: string
  }[]
}

const { path } = Astro.props
---

<nav aria-label="Breadcrumb" class="breadcrumbs">
  <ol itemscope itemtype="https://schema.org/BreadcrumbList">
    {path.map((crumb, index) => (
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        {index < path.length - 1 ? (
          <a href={crumb.href} itemprop="item">
            <span itemprop="name">{crumb.label}</span>
          </a>
        ) : (
          <span itemprop="name">{crumb.label}</span>
        )}
        <meta itemprop="position" content={String(index + 1)} />
      </li>
    ))}
  </ol>
</nav>
```

### Component: RelatedArtworks.astro
```typescript
---
interface Artwork {
  title: string
  slug: string
  thumbnail: string
}

interface Props {
  artworks: Artwork[]
  seriesName: string
}

const { artworks, seriesName } = Astro.props
---

<section class="related-artworks">
  <h3>More from {seriesName}</h3>
  <div class="grid grid-cols-3 gap-4">
    {artworks.map(artwork => (
      <a href={`/artwork/${artwork.slug}/`} class="group">
        <img src={artwork.thumbnail} alt={artwork.title} />
        <p class="text-sm group-hover:underline">{artwork.title}</p>
      </a>
    ))}
  </div>
</section>
```

---

## Metrics to Track

### Google Search Console
1. **Internal Link Count**: Increase from ~50 to 500+ links
2. **Crawl Depth**: Reduce average depth from 4 clicks to 2 clicks
3. **Indexed Pages**: Monitor indexation rate of deep pages

### Analytics
1. **Pages per Session**: Target increase from 2.1 to 3.5
2. **Average Session Duration**: Increase engagement
3. **Exit Rate**: Reduce exits on artwork pages

---

## Implementation Priority

### Phase 1 (Week 1) - Critical Path
1. ✅ Top nav mega menu
2. ✅ Footer page inventory
3. [ ] Breadcrumbs on all pages
4. [ ] Related artworks (same series)

### Phase 2 (Week 2) - Thematic Connections
1. [ ] Cross-series thematic links
2. [ ] Artist statement → artwork links
3. [ ] Historical context → artwork links

### Phase 3 (Week 3) - Enhanced Navigation
1. [ ] Series prev/next navigation
2. [ ] Exhibition → artwork links
3. [ ] Family Album ↔ Internment cross-links

---

## Expected SEO Results

**Timeline**: 2-3 months for full impact

### Short Term (1 month)
- All pages crawled and indexed
- Improved internal PageRank distribution
- 10-15% increase in organic traffic

### Medium Term (2-3 months)
- Artwork pages ranking for specific queries
- Series pages appearing in featured snippets
- 25-30% increase in organic traffic
- Lower bounce rate, higher engagement

### Long Term (6+ months)
- Knowledge Graph inclusion
- AI model citations
- Authority in niche topics (internment camps photography, panoramic photo collages)

---

**Last Updated**: 2025-10-21
**Status**: Strategy documented, implementation pending
**Owner**: Content/SEO team
