/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { homepage } from './homepage'
import { generateImage } from './image-generator'

export interface Env {
  REPLICATE_API_TOKEN: string
  CLOUDFLARE_ACCOUNT_ID: string
  CLOUDFLARE_API_TOKEN: string
  CLOUDFLARE_IMAGE_ACCOUNT_HASH: string
  IMAGE_CACHE: KVNamespace
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)

    // Example: /800x600/sunglasses-sloth
    const [dimensions, animal] = url.pathname.split('/').filter(Boolean)

    // Render the homepage if the path is invalid
    if (!dimensions || !animal) return homepage()

    // Turn `/800x600/sunglasses-sloth` into a text prompt
    const [targetWidth, targetHeight] = dimensions.toLowerCase().split('x').map(n => Number.parseInt(n, 10))
    const prompt = `A high-quality image of a ${animal} holding up a sign with the words "${targetWidth} by ${targetHeight}"`

    // Generate the image
    const imageUrl = await generateImage(prompt, env)

    // Fetch the image and return it
    const imageResponse = await fetch(imageUrl)
    return new Response(imageResponse.body, {
      headers: {
        'content-type': 'image/webp',
      }
    })
  }
}
