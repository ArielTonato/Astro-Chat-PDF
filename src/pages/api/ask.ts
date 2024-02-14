import type { APIRoute } from 'Astro'
import {readFile} from 'fs/promises'

const openai = new OpenAI({
    apiKey: "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",
})

export const GET: APIRoute = async ({ request })=>{
    return new Response(JSON.stringify({
        response:''
    }))
}