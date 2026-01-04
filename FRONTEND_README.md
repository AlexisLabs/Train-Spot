# Frontend Setup - Next.js

## Getting Started

The frontend is a Next.js application located in the `frontend/` directory.

## Running the Frontend

1. **Make sure your backend API is running first:**
   ```bash
   # In the root directory
   npm run dev
   ```
   Your API should be running on http://localhost:3000

2. **Start the Next.js development server:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your browser:**
   - Frontend: http://localhost:3000 (Next.js default port is 3000, but it will use 3001 if 3000 is taken)
   - Check the terminal output for the actual URL

## Environment Variables

The frontend uses `.env.local` to configure the API URL. It's already set to:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

If your backend runs on a different port, update `.env.local` in the `frontend/` directory.

## Project Structure

```
frontend/
├── app/              # Next.js App Router pages
│   ├── page.tsx      # Main page displaying alerts
│   └── layout.tsx    # Root layout
├── lib/
│   └── api.ts        # API utility functions
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features

- ✅ Fetches real-time MTA alerts from your API
- ✅ Auto-refreshes every 30 seconds
- ✅ Displays alert types and affected lines
- ✅ Tailwind CSS for styling
- ✅ TypeScript for type safety

