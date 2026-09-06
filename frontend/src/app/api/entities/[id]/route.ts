import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ id: "1", label: "Target", type: "ACTOR", priorityScore: 99, sourceRelations: [], targetRelations: [], events: [], notes: [] }); }
