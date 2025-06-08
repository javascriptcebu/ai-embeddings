import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { v4 as uuidv4 } from 'uuid'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const { query } = await req.json()

  // query is the text to be embedded

  async function chunkText(text: string, maxTokens = 500): Promise<string[]> {
    const sentences = text.split('. ')
    const chunks: string[] = []
    let chunk = ''

    for (const sentence of sentences) {
      if ((chunk + sentence).split(' ').length > maxTokens) {
        chunks.push(chunk)
        chunk = ''
      }
      chunk += sentence + '. '
    }

    if (chunk) chunks.push(chunk)
    return chunks
  }

  const chunks = await chunkText(query)
  const allEmbeddings: number[][] = []

  for (const chunk of chunks) {
    const embeddingResponse = await openai.embeddings.create({
      input: chunk,
      model: 'text-embedding-3-small', // or 'text-embedding-ada-002'
    })

    const embedding = embeddingResponse.data[0].embedding
    allEmbeddings.push(embedding)

    const { error } = await supabase.from('documents').insert([
      {
        id: uuidv4(),
        content: chunk,
        embedding,
      },
    ])

    if (error) console.error('Insert error:', error)
    else console.log('✅ Inserted chunk.')
  }

  return NextResponse.json({
    message: 'success',
    embedding: JSON.stringify(allEmbeddings)
  })
}
