# Tailwind CSS Configuration Guide

## Setup Complete ✅

Tailwind CSS has been successfully configured for the PowerMapChess project.

### Files Created/Modified:

1. **tailwind.config.js** - Main Tailwind configuration

   - Configured content paths to scan JSX/TSX files
   - Extended theme with custom colors (primary, destructive)
   - Added custom font-family (headline)

2. **postcss.config.js** - PostCSS configuration

   - Configured Tailwind and Autoprefixer plugins

3. **src/index.css** - Updated with Tailwind directives
   - Added @tailwind directives for base, components, and utilities
   - Wrapped base styles in @layer for proper cascade

### Installed Packages:

- `tailwindcss` (v4.1.16) - Core utility-first CSS framework
- `postcss` (v8.5.6) - CSS transformation tool
- `autoprefixer` (v10.4.21) - Automatic vendor prefixes

### Usage Examples:

#### Spacing & Layout:

```tsx
<div className="p-6 bg-white rounded-lg shadow-md">
  <h1 className="text-3xl font-bold mb-4">Title</h1>
  <p className="text-lg text-gray-600">Content here</p>
</div>
```

#### Flexbox:

```tsx
<div className="flex items-center justify-center gap-4">
  <button className="px-4 py-2 bg-primary-500 text-white rounded">
    Primary
  </button>
  <button className="px-4 py-2 bg-destructive-500 text-white rounded">
    Danger
  </button>
</div>
```

#### Responsive Design:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items automatically stack on mobile, 2 cols on tablet, 3 on desktop */}
</div>
```

#### Custom Colors (Configured):

```tsx
<div className="bg-primary-50">Light primary background</div>
<div className="text-destructive-600">Red text</div>
<div className="border-2 border-primary-500">Primary border</div>
```

#### Hover & Active States:

```tsx
<button className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 transition-colors">
  Hover me
</button>
```

### Custom Configuration:

- **Theme Colors**: Extended in `tailwind.config.js` with primary (indigo) and destructive (red) palettes
- **Font Family**: Added 'headline' family matching project fonts
- **Content Paths**: Configured to scan `./src/**/*.{js,ts,jsx,tsx}` for class usage

### Next Steps:

1. Replace inline styles and custom CSS classes with Tailwind utilities
2. Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:, 2xl:) for responsive design
3. Leverage Tailwind's color palette and spacing scale for consistency
4. Consider extracting component classes using @apply if needed

### Starting Development:

```bash
npm run dev          # Start dev server with Tailwind CSS
npm run build        # Build with Tailwind CSS optimization
```

### VS Code Extension (Recommended):

Install "Tailwind CSS IntelliSense" by Tailwind Labs for autocomplete and hover previews.

---

**Note**: The linter warnings about @tailwind at-rules in VSCode can be ignored - they're just informational and don't affect functionality. CSS processing works correctly.
