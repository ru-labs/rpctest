import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

async function getAverageForTest(testName: string) {
  const query = await prisma.testResult.aggregate({
    _avg: {
      duration: true,
    },
    where: {
      test: {
        equals: testName,
      },
    },
  });

  return query._avg.duration;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const run = await prisma.run.findUnique({
    where: {
      id,
    },
    include: {
      results: true,
      srcGeoData: true,
      dstGeoData: true,
      rpcProvider: true,
    },
  });

  return NextResponse.json(run)
}