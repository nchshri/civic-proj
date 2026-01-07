# Civic Engineering Team - Fullstack Project Assignment

## Project Overview

This project implements a dual-mode rich text editor with AI-powered content rewriting capabilities. Built with Next.js, Plate.js, and TypeScript, it features two distinct editor modes (happy/sad), real-time AI integration, local storage persistence, and custom interactive text elements.

## Live Demo

[\[Click Here!\]](https://civic-proj.vercel.app/)


## Features Implemented

### 1. Dual-Mode Editor Pages
- **`/happy` page**: AI rewrites content to be positive, uplifting, and optimistic
- **`/sad` page**: AI rewrites content to be negative, melancholic, and pessimistic
- Shared editor component with page-specific AI behavior

### 2. AI Integration
- **AI Gateway**: Uses `@ai-sdk/gateway` for flexible AI provider management
- **Context-Aware Rewriting**: System prompts automatically adjust based on page type
- **AI Menu Commands**: 
  - Press `Cmd+J` (Mac) or `Ctrl+J` (Windows) to open AI menu
  - Select text and choose "Rewrite" to transform tone
  - Additional commands: Improve writing, Fix spelling, Make longer/shorter, etc.

### 3. Custom Interactive Elements
- **Happy/Sad Text Elements**: 
  - Type "happy " or "sad " (with space) to create clickable elements
  - Automatic conversion via custom transform plugin
  - Distinct visual styling (yellow for happy, blue for sad)
  - Pointer cursor on hover
- **Interactive Popovers**:
  - Click any happy/sad element to view random inspirational quotes
  - Shadcn/ui popover components
  - Quotes sourced from curated collections

### 4. Data Persistence
- **Local Storage**: Editor content auto-saves to browser storage
- **Per-Page Storage**: Separate storage keys for `/happy` and `/sad` pages
- **Auto-Restore**: Content restored on page refresh
- **Debounced Saves**: Optimized to prevent excessive writes

### 5. Rich Text Editing
- Full Plate.js editor with extensive plugin support
- Markdown support with autoformatting
- Basic formatting: Bold, italic, underline
- Headings (H1, H2, H3)
- Blockquotes
- Code blocks with syntax highlighting
- Links and mentions
- Tables
- Media embeds (images, audio, files)
- Emoji picker
- Drag & drop functionality

## Technical Architecture

### Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Editor**: Plate.js (Slate-based rich text editor)
- **AI Provider**: AI SDK with Gateway (@ai-sdk/gateway)
- **Language**: TypeScript
- **UI Components**: Shadcn/ui
- **Styling**: Tailwind CSS

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- AI Gateway API key

### Setup Steps

1. **Clone the repository**
```bash
git clone [repo-url]
cd civic-proj
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env.local` file in the root directory:
```env
AI_GATEWAY_API_KEY=your_ai_gateway_key_here
```

4. **Run development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to:
- `http://localhost:3000/` - Landing page
- `http://localhost:3000/happy` - Happy mode editor
- `http://localhost:3000/sad` - Sad mode editor

## Usage Guide

### Basic Editing
1. Type content in the editor
2. Use toolbar buttons for formatting (H1, H2, H3, Quote, Bold, Italic, Underline)
3. Content auto-saves to local storage

### AI Rewriting
1. Type or paste content into the editor
2. Select the text you want to rewrite
3. Press `Cmd+J` (Mac) or `Ctrl+J` (Windows)
4. Click "Rewrite" from the AI menu
5. AI will transform the text based on page type (happy/sad)

### Interactive Elements
1. Type "happy " (with space after) → Creates yellow clickable "happy" element
2. Type "sad " (with space after) → Creates blue clickable "sad" element
3. Click any happy/sad element → View random inspirational quote

### Other AI Commands
- **Improve writing**: Enhance clarity and flow
- **Fix spelling & grammar**: Correct errors
- **Make longer**: Expand content
- **Make shorter**: Condense content
- **Simplify language**: Use simpler words
- **Continue writing**: Generate next sentence

## Key Implementation Details

### Custom Element Plugins

**Plugin Definition** (`src/lib/happy-sad-plugins.ts`):
```typescript
export const HappyPlugin = createPlatePlugin({
  key: 'happy-text',
  node: {
    isElement: true,
    isInline: true,
    component: HappyElement,
  },
});

export const SadPlugin = createPlatePlugin({
  key: 'sad-text',
  node: {
    isElement: true,
    isInline: true,
    component: SadElement,
  },
});
```

**Auto-Transform** (`src/lib/transform.ts`):
- Intercepts text insertion
- Detects "happy " or "sad " patterns
- Converts to custom inline elements
- Ensures cursor positioning outside element

### AI Integration

**API Route** (`src/app/api/ai/command/route.ts`):
- Receives `pageType` from editor
- Sets system prompt based on happy/sad mode
- Streams responses via AI SDK
- Supports multiple AI operations (generate, edit, comment)

**Editor Configuration** (`src/components/editor/plate-editor.tsx`):
- Dynamically injects `pageType` into AI plugin options
- Uses `useEffect` to update plugin configuration
- Maintains type safety with proper TypeScript casting

### Local Storage

**Implementation**:
- Automatic save on content change (300ms debounce)
- Per-page storage keys: `happy-editor`, `sad-editor`
- SSR-safe with `typeof window` checks
- JSON serialization/deserialization

## Dependencies

### Core
- `next`: 16.1.1
- `react`: 19.0.0
- `typescript`: ^5

### Editor
- `platejs`: Latest
- `@platejs/ai`: Latest
- `@platejs/basic-nodes`: Latest
- `@platejs/autoformat`: Latest
- `slate`: 0.103.0
- `slate-react`: 0.110.1

### AI
- `ai`: Latest
- `@ai-sdk/gateway`: Latest

### UI
- `@radix-ui/react-popover`: Latest
- `tailwindcss`: Latest
- `lucide-react`: Latest

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add `AI_GATEWAY_API_KEY` environment variable
4. Deploy

### Environment Variables (Production)
Ensure these are set in your deployment platform:
```
AI_GATEWAY_API_KEY=your_key_here
```

## Requirements Checklist

- **Next.js Setup**: App Router with TypeScript
- **Plate.js Integration**: Full rich text editor
- **AI Slash Commands**: Cmd+J menu with Rewrite command
- **Data Persistence**: Local storage with auto-save
- **Custom Interactive Elements**: Clickable happy/sad text with popovers
- **TypeScript**: Fully typed throughout
- **Code Quality**: Clean, maintainable, DRY code

## Design Decisions

1. **AI Gateway over Direct API**: Provides flexibility to switch AI providers
2. **Single Editor Component**: Reused across pages with prop-based configuration
3. **Plugin-Based Architecture**: Leverages Plate.js plugin system for extensibility
4. **Transform Plugin**: Automatic element conversion for better UX
5. **Debounced Saves**: Optimized local storage writes

## Known Limitations

- Local storage only (no backend database)
- Single-user experience (no real-time collaboration implemented)
- AI Gateway requires valid API key
- Browser storage limits apply (~5MB)

## Future Enhancements

- Real-time collaboration with Yjs
- Cloud storage integration
- User authentication

## License

MIT

## Author

Shriya Nichenametla

---

**Note**: This project was created as part of the Civic Engineering Team technical assessment.