import type { APIRoute } from 'astro'
import { readFile } from 'fs/promises'
import { OpenAI } from 'openai'
import path from 'path'

const openai = new OpenAI({
    apiKey: import.meta.env.OPENAI_API_KEY || "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",
})

export const POST: APIRoute = async ({ request }) => {
    try {
        const { id, question } = await request.json()

        if (!id || !question) {
            return new Response(JSON.stringify({
                error: 'ID del documento y pregunta son requeridos'
            }), { status: 400 })
        }

        // Leer el archivo de texto extraído
        const textFilePath = path.join(process.cwd(), "public/text", `${id}.txt`)

        let documentText: string
        try {
            documentText = await readFile(textFilePath, 'utf-8')
        } catch (error) {
            return new Response(JSON.stringify({
                error: 'Documento no encontrado'
            }), { status: 404 })
        }

        // Crear el prompt para ChatGPT
        const prompt = `Basándote en el siguiente documento, responde la pregunta de manera clara y concisa.

DOCUMENTO:
${documentText}

PREGUNTA: ${question}

RESPUESTA:`

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Eres un asistente experto en analizar documentos. Responde de manera clara y precisa basándote únicamente en el contenido del documento proporcionado."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 500,
            temperature: 0.7
        })

        const answer = completion.choices[0]?.message?.content || 'No se pudo generar una respuesta'

        return new Response(JSON.stringify({
            answer,
            question
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        })

    } catch (error) {
        console.error('Error en /api/ask:', error)
        return new Response(JSON.stringify({
            error: 'Error interno del servidor'
        }), { status: 500 })
    }
}