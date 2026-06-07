import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversation_id = searchParams.get('conversation_id');
    const session_id = searchParams.get('session_id');

    const params = new URLSearchParams();
    if (conversation_id) params.set('conversation_id', conversation_id);
    if (session_id) params.set('session_id', session_id);
    const query = params.toString() ? `?${params.toString()}` : '';

    const response = await fetch(`http://localhost:8000/api/heatmap${query}`);

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Heatmap API Error:', error);
    return NextResponse.json({ error: `Error retrieving heatmap data: ${error}` }, { status: 500 });
  }
}
