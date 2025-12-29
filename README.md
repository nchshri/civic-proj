# Civic Project - AI-Powered Rich Text Editor

A full-stack Next.js application featuring a rich text editor with AI-powered tone rewriting and interactive custom elements.

## Features

### AI Tone Rewriting
- **Happy Editor** (`/happy`) - Rewrites text with positive, uplifting tone
- **Sad Editor** (`/sad`) - Rewrites text with melancholic, somber tone
- Use `/rewrite` command at the end of any text to transform it

### Interactive Custom Elements
- Type "happy" or "sad" followed by SPACE to create clickable elements
- Click any converted word to display a random inspirational quote
- Works seamlessly with AI rewriting and persistence

### Auto-Save with localStorage
- Content automatically saves as you type
- Persists across page refreshes
- Separate storage for each editor page

## Tech Stack

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety throughout
- **Slate.js** - Rich text editor foundation
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components (Popover)
- **Anthropic Claude API** - AI text rewriting

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Anthropic API key ([get one here](https://console.anthropic.com))

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd civic-editor-project
```

2. Install dependencies
```bash
npm install
```

3. Create `.env.local` file in project root
```bash
ANTHROPIC_API_KEY=your_api_key_here
```

4. Run development server
```bash
npm run dev
```

5. Open [http://localhost:3000/](http://localhost:3000/)

## Usage

### AI Rewriting
1. Type any text in the editor
2. Add `/rewrite` at the end
3. Press space or continue typing
4. AI transforms your text automatically

Example: `The weather is okay/rewrite` → "The weather is absolutely beautiful!"

### Clickable Words
1. Type "happy" or "sad" in your text
2. Press SPACE after the word
3. Word becomes clickable with styled appearance
4. Click to see a random quote

## Key Features Implementation

### Custom Inline Elements
- Implemented using Slate.js inline element API
- Auto-conversion on space keypress
- Persistent across saves and refreshes
- Click interaction with Shadcn Popover

### AI Integration
- Server-side API route for security
- Streaming responses from Anthropic Claude
- Debounced auto-save (500ms delay)
- Error handling with user feedback

### Data Persistence
- Custom `useLocalStorage` hook
- JSON serialization/deserialization
- Hydration handling for SSR
- Separate storage keys per page

## API Routes

### `POST /api/rewrite`
Rewrites text with specified emotional tone.

**Request:**
```json
{
  "text": "The meeting was fine",
  "tone": "happy" | "sad"
}
```

**Response:**
```json
{
  "text": "The meeting was fantastic and inspiring!"
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude | Yes |

## Known Limitations

- localStorage has ~5MB limit per domain
- AI API requires active internet connection
- Custom elements reset after AI rewriting

## Author

Built for Civic Engineering Team technical assessment.

---