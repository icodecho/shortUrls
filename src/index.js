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
    const config = '{}'
    try {
      config = await env.SHORT_URLS.get(path)
    } catch (e) {
      // redirect to the fallback URL if short URL not found
      return Response.redirect(env.FALLBACK_URL, env.DEFAULT_REDIRECT_TYPE)
    }

    if (!config) {
      // redirect to the fallback URL if short URL not found
      return Response.redirect(env.FALLBACK_URL, env.DEFAULT_REDIRECT_TYPE)
    }

    // Parse the configuration
    let redirectConfig
    try {
      redirectConfig = JSON.parse(config)
    } catch (e) {
      // If config is not valid JSON, treat it as the URL directly
      return Response.redirect(config, env.DEFAULT_REDIRECT_TYPE)
    }

    // Extract redirect URL and type
    const targetUrl = redirectConfig.url
    const redirectType = redirectConfig.type || env.DEFAULT_REDIRECT_TYPE || '302'

    if (!targetUrl) {
      // redirect to the fallback URL if target URL is empty
      return Response.redirect(env.FALLBACK_URL, env.DEFAULT_REDIRECT_TYPE)
    }

    // Perform the redirect with the specified status code
    return Response.redirect(targetUrl, parseInt(redirectType))
  }
}
