import { NextResponse, connection } from "next/server";

globalThis.mesures = globalThis.mesures || [];

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ erreur: "JSON invalide" }, { status: 400 });
  }

  const { temperature } = body;
  if (typeof temperature !== "number") {
    return NextResponse.json(
      { erreur: "temperature doit être un nombre" },
      { status: 400 }
    );
  }

  globalThis.mesures.push({ temperature, date: new Date().toISOString() });
  if (globalThis.mesures.length > 50) globalThis.mesures.shift();

  return NextResponse.json({ message: "Données reçues" });
}

export async function GET() {
  await connection();
  return NextResponse.json(globalThis.mesures);
}