# PWA Icons

The PWA manifest requires icon files to be present in the `/public` directory.

## Required Icons

You need to add the following icon files:

1. **icon-192x192.png** - 192x192 pixel PNG icon
2. **icon-512x512.png** - 512x512 pixel PNG icon

## Icon Design Recommendations

For this daily writing app:
- **Background color**: #3A4F41 (sage green from the app theme)
- **Icon color**: #F7F7FF (off-white from the app theme)
- **Style**: Simple, minimalist design
- **Suggested icon**: A pen, notebook, or abstract writing symbol

## Creating Icons

An SVG template (`icon.svg`) has been provided in this directory with the app's branding. You can convert it to PNG icons using:

**Option 1: Online converter**
- Upload `icon.svg` to https://cloudconvert.com/svg-to-png
- Convert to 192x192 and save as `icon-192x192.png`
- Convert to 512x512 and save as `icon-512x512.png`

**Option 2: Using ImageMagick (command line)**
```bash
magick icon.svg -resize 192x192 icon-192x192.png
magick icon.svg -resize 512x512 icon-512x512.png
```

**Option 3: Design tools**
- Open `icon.svg` in Figma, Sketch, or Adobe Illustrator
- Export at 192x192 and 512x512 sizes
- Or create custom icons from scratch

## Temporary Solution

Until you add proper icons, the PWA will work but won't show a custom icon when installed. The browser will use a default icon or screenshot.

## Icon Requirements for PWA

- Must be PNG format
- Should be square (1:1 aspect ratio)
- Should have sufficient contrast for visibility on different backgrounds
- The manifest specifies "purpose": "any maskable" which means:
  - "any" - icon can be used in any context
  - "maskable" - icon will be safe-zoned for adaptive icon masks on Android
