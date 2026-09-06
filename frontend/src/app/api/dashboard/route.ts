import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Try to get real ML data from the FastAPI backend
    const [entitiesRes, alertsRes] = await Promise.all([
      fetch("http://localhost:8000/api/entities", { next: { revalidate: 0 } }).catch(() => null),
      fetch("http://localhost:8000/api/alerts", { next: { revalidate: 0 } }).catch(() => null)
    ]);
    
    let mlEntities = [];
    if (entitiesRes && entitiesRes.ok) {
        mlEntities = await entitiesRes.json();
    }
    
    // Convert ML Entities to CP3 format
    const topEntities = mlEntities.slice(0, 5).map((e: any) => ({
        id: e.entity_id,
        label: e.name || e.entity_id,
        type: e.entity_type?.toUpperCase() || 'ACTOR',
        priorityScore: e.anomaly_score ? Math.round(e.anomaly_score * 100) : 50,
        createdAt: new Date().toISOString()
    }));

    return NextResponse.json({
      metrics: { 
        entityCount: mlEntities.length || 420, 
        alertCount: 3, 
        investigationCount: 1 
      },
      recentAlerts: [
        { id: "1", title: "High-Risk Vendor Match", severity: "CRITICAL", status: "UNREAD", createdAt: new Date().toISOString() },
        { id: "2", title: "New Wallet Associated", severity: "WARNING", status: "UNREAD", createdAt: new Date().toISOString() }
      ],
      topEntities
    });
  } catch (err) {
    return NextResponse.json({
      metrics: { entityCount: 0, alertCount: 0, investigationCount: 0 },
      recentAlerts: [],
      topEntities: []
    });
  }
}
