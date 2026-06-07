import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const response = await fetch('http://localhost:8000/api/upload-schedule', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', error: data.detail || 'Upload failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({ status: 'success', items_loaded: data.items_loaded });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
