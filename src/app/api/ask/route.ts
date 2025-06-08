import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const { query } = await req.json()

  // query is the user's question

  // 1. Embed the user's query
  const embeddingResponse = await openai.embeddings.create({
    input: query,
    model: 'text-embedding-3-small',
  })

  const queryEmbedding = embeddingResponse.data[0].embedding

  // 2. Retrieve top 3 relevant chunks from Supabase
  const { data: matches, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: 0.78, // cosine similarity
    match_count: 3,
  })

  if (error) return NextResponse.json({ error }, { status: 500 })

  const context = matches.map((m: any) => m.content).join('\n---\n')

  // 3. Generate answer
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'Use the context below to answer the question.' },
      { role: 'user', content: `Context:\n${context}\n\nQuestion:\n${query}` },
    ],
  })

  const answer = completion.choices[0].message.content

  return NextResponse.json({ answer })
}
