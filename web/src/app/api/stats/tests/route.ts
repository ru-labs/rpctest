import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export const revalidate = true;
export async function GET() {
  const averageDurations = await prisma.testResult.groupBy({
    by: ['test'],
    _avg: {
      duration: true
    }
  });

  return NextResponse.json(averageDurations)
}