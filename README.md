# Short URL Service on Cloudflare Workers

## Quick Start

1. Install wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Create KV namespace:
```bash
wrangler kv:namespace create "SHORT_URLS"
```

4. Update the KV namespace ID in wrangler.toml:
```toml
[[kv_namespaces]]
binding = "SHORT_URLS"
id = "your-actual-namespace-id"
preview_id = "your-actual-preview-id"
```

5. Add short URL to KV:
```bash
wrangler kv:key put --binding=SHORT_URLS "abc" '{"url":"https://example.com","type":"301"}'
```

6. Deploy:
```bash
npm run deploy
```

## Configuration

### KV Storage Format
Each key is the short URL code, value is a JSON object:
```json
{
  "url": "https://target-url.com",
  "type": "301"
}
```
- `url`: The target redirect URL
- `type`: HTTP redirect status code (301 for permanent, 302 for temporary). Defaults to 302 if not specified.

### Environment Variables
- `DEFAULT_REDIRECT_TYPE`: Default redirect type (301 or 302)
- `FALLBACK_URL`: URL to redirect to when short URL not found
