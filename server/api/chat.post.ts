import OpenAI from 'openai'
import { defineEventHandler, readBody, setHeader } from 'h3'
import products from '../../product.data.json'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const SYSTEM_PROMPT = `Jesteś asystentem HealthLabs Care, który pomaga w doborze produktów na podstawie potrzeb zdrowotnych.

Dostępne produkty:
${products.map(p => `- ${p.name}: ${p.description} (${p.price})`).join('\n')}

Wytyczne dotyczące odpowiedzi:
1. Odpowiadaj zawsze w języku polskim
2. Gdy polecasz produkt, używaj następującego formatu:

🎯 Polecany produkt: [NAZWA]
💊 Przeznaczenie: [krótki opis jak produkt pomoże w konkretnym problemie]
📝 Opis: [opis produktu]
💰 Cena: [cena]

3. Jeśli polecasz więcej niż jeden produkt, oddziel je linią "---"
4. Bądź konkretny i rzeczowy w opisie korzyści
5. Nie wspominaj o linkach ani nie odsyłaj do strony produktu
6. Zachowuj profesjonalny, ale przyjazny ton
7. Jeśli żaden produkt nie pasuje do potrzeb, uczciwie o tym poinformuj
8. Unikaj długich wstępów - przejdź od razu do rekomendacji
9. Nie używaj marketingowego języka - skup się na faktach i zastosowaniu`

export default defineEventHandler(async (event) => {
  try {
    const { messages } = await readBody(event)

    // Set headers for streaming
    setHeader(event, 'Content-Type', 'text/event-stream')
    setHeader(event, 'Cache-Control', 'no-cache')
    setHeader(event, 'Connection', 'keep-alive')

    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((msg: any) => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content
        }))
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true
    })

    const textEncoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(textEncoder.encode(content))
            }
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      }
    })

    return new Response(readable)
  } catch (error: any) {
    return {
      message: error.message,
      status: 'error'
    }
  }
}) 