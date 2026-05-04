export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const path = url.pathname.substring(1) // Remove leading slash

    // Handle root path
    if (!path) {
      return new Response('Short URL Service is running!', {
        headers: { 'Content-Type': 'text/plain' }
      })
    }

    // Retrieve the redirect configuration from KV
    const config = await env.SHORT_URLS.get(path)

    if (!config) {
      // If short URL not found, redirect to fallback URL
      const fallbackUrl = env.FALLBACK_URL || '/'
      return Response.redirect(fallbackUrl, 302)
    }

    // Parse the configuration
    let redirectConfig
    try {
      redirectConfig = JSON.parse(config)
    } catch (e) {
      // If config is not valid JSON, treat it as the URL directly
      return Response.redirect(config, 302)
    }

    // Extract redirect URL and type
    const targetUrl = redirectConfig.url
    const redirectType = redirectConfig.type || env.DEFAULT_REDIRECT_TYPE || '302'

    if (!targetUrl) {
      return new Response('Invalid redirect configuration', { status: 500 })
    }

    // Perform the redirect with the specified status code
    return Response.redirect(targetUrl, parseInt(redirectType))
  }
}
