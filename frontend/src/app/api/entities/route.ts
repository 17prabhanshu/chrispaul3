import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const mlEntities = await fetch("http://localhost:8000/api/entities").then(r => r.json()).catch(() => []);
    const topEntities = mlEntities.map((e: any) => ({
        id: e.entity_id,
        label: e.name || e.entity_id,
        type: e.entity_type?.toUpperCase() || 'ACTOR',
        priorityScore: e.anomaly_score ? Math.round(e.anomaly_score * 100) : 50,
        createdAt: new Date().toISOString()
    }));
    return NextResponse.json(topEntities);
  } catch (e) {
    return NextResponse.json([]);
  }
}
