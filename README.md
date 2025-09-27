# Blog AI Summary Worker

This Cloudflare Worker provides AI-powered summarization for blog posts using Cloudflare Workers AI.

## Setup and Deployment

1. Install dependencies:
```bash
npm install
```

2. Configure your Cloudflare account:
```bash
npx wrangler login
```

3. Update the worker name in `wrangler.toml` if needed.

4. Deploy the worker:
```bash
npm run deploy
```

5. After deployment, update the worker URL in the `SummaryButton.js` component:
```javascript
const response = await fetch('https://blog-summary-ai.your-worker-subdomain.workers.dev', {
```

Replace `your-worker-subdomain` with your actual Cloudflare Workers subdomain.

## Development

To run the worker locally:
```bash
npm run dev
```

## Features

- AI-powered text summarization using Cloudflare Workers AI
- Responsive UI with loading states and error handling
- CORS support for cross-origin requests
- Integration with Next.js blog layouts

## Notes

- The worker uses Cloudflare's Llama-2 model for summarization
- Make sure to enable Workers AI in your Cloudflare account
- The worker requires the AI binding in wrangler.toml
