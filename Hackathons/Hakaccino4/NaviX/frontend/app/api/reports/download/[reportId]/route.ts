import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { reportId: string } }) {
  try {
    const { reportId } = params;
    const backendResponse = await fetch(`http://localhost:8000/api/reports/download/${reportId}`);

    if (!backendResponse.ok) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const blob = await backendResponse.blob();
    const filename = `navix_report_${reportId.slice(0, 8)}.docx`;

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error downloading report:', error);
    return NextResponse.json({ error: 'Failed to download report' }, { status: 500 });
  }
}
