# Cloudinary ID Format Requirement

## Critical Format Rule

**ALL cloudinaryId fields in MDX frontmatter MUST start with a forward slash `/`**

## ✅ Correct Format
```yaml
cloudinaryId: /internment-camps/gila-river-internment-camp-foundations_aietu0
```

## ❌ Incorrect Format
```yaml
cloudinaryId: internment-camps/gila-river-internment-camp-foundations_aietu0
```

## Why This Matters

The CloudinaryThumbnail component builds URLs like this:
```
https://res.cloudinary.com/[cloud]/image/upload/[transformations]/[cloudinaryId]
```

If cloudinaryId is missing the leading `/`, the URL becomes:
```
.../upload/f_auto,q_auto:good,w_600internment-camps/image.jpg
                                 ^ missing slash = 400 error
```

## How to Check

Run this command to find any missing slashes:
```bash
grep -r "cloudinaryId:" src/content/artwork/ | grep -v "cloudinaryId: /"
```

## Fixed Issues

- ✅ **2025-10-22**: Fixed `granada-internment-camp-water-tank.mdx` (was missing leading `/`)

## Prevention

When adding new artworks, always include the leading `/` in cloudinaryId field.
