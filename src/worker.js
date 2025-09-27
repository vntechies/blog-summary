const worker = {
  async fetch(request, env) {
    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      })
    }

    try {
      const { content } = await request.json()

      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return new Response(JSON.stringify({ error: 'Nội dung không được để trống' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        })
      }

      // Trim and clean the content
      const cleanContent = content.trim().replace(/\s+/g, ' ').slice(0, 5000) // Limit to 5000 chars

      // Use Workers AI to generate summary
      const messages = [
        {
          role: 'system',
          content:
            'You are a helpful assistant that summarizes text content in Vietnamese. Always respond in Vietnamese with proper diacritical marks. Keep the summary concise but informative.',
        },
        {
          role: 'user',
          content: `Hãy tóm tắt nội dung sau đây trong 2-3 câu bằng tiếng Việt:\n\n${cleanContent}`,
        },
      ]

      const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
        messages,
        stream: false,
        max_tokens: 250,
      })

      return new Response(JSON.stringify({ summary: response.response }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    } catch (error) {
      console.error('Error:', error)
      return new Response(
        JSON.stringify({
          error: 'Không thể tạo tóm tắt. Vui lòng thử lại sau.',
          details: error.message,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }
  },
}

export default worker
