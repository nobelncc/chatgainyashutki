import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET all site settings (returns as key-value object)
export async function GET() {
  const settings = await prisma.siteSetting.findMany();

  const settingsObject: Record<string, string> = {};
  settings.forEach((s) => {
    settingsObject[s.key] = s.value;
  });

  return NextResponse.json(settingsObject);
}

// CREATE or UPDATE a setting (upsert — admin will call this repeatedly)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { key, value } = body;

  if (!key || value === undefined) {
    return NextResponse.json(
      { error: "key and value are required" },
      { status: 400 }
    );
  }

  const setting = await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  return NextResponse.json(setting, { status: 201 });
}