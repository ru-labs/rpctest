import prisma from "@/lib/prisma";
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const run = await prisma.run.findUnique({
    where: {
      id: params.id
    },
    include: {
      results: true,
      srcGeoData: true,
      dstGeoData: true,
    }
  })
  return new Response(JSON.stringify(run), {
    headers: { 'content-type': 'application/json' },
  })
}