/**
 * Authenticated funnel persistence API.
 * - GET: load the signed-in user's funnel list (same JSON shape as localStorage).
 * - PUT: replace the stored funnel list for that user (full document write).
 * Session cookie is read by auth(); browser fetch must include credentials (default for same-origin).
 */
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Funnel } from "@/types/funnel";

type SaveFunnelsPayload = {
  funnels: Funnel[];
};

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return unauthorizedResponse();
  }

  // One row per user email; funnels column is JSON (JSONB in Postgres).
  const userState = await prisma.userFunnelState.findUnique({
    where: { userEmail },
    select: { funnels: true },
  });

  if (!userState) {
    return NextResponse.json({ funnels: [] as Funnel[] });
  }

  // Defensive: DB Json might not always be a parsed array at runtime edge cases.
  const funnels = Array.isArray(userState.funnels)
    ? (userState.funnels as Funnel[])
    : [];

  return NextResponse.json({ funnels });
}

export async function PUT(request: Request) {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return unauthorizedResponse();
  }

  const payload = (await request.json()) as Partial<SaveFunnelsPayload>;
  if (!Array.isArray(payload.funnels)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Insert first save, update on subsequent saves (last-write-wins for this user).
  await prisma.userFunnelState.upsert({
    where: { userEmail },
    create: {
      userEmail,
      funnels: payload.funnels,
    },
    update: {
      funnels: payload.funnels,
    },
  });

  return NextResponse.json({ ok: true });
}
