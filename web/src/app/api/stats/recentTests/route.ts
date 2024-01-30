import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {

  const latestRuns = await prisma.run.findMany({
    orderBy: {
      start: 'desc'
    },
    include: {
      srcGeoData: true,
      dstGeoData: true,
    },
    take: 1000
  })

  let runSrcDst = []

  for (const run of latestRuns) {
    try {

      const src = [run.srcGeoData?.latitude, run.srcGeoData?.longitude]
      const dst = [run.dstGeoData?.latitude, run.dstGeoData?.longitude]

      if (src[0] === null || src[1] === null) {
        console.log("rejecting null src entry");
        continue;
      }

      if (dst[0] === null || dst[1] === null) {
        console.log("rejecting null dst entry");
        continue;
      }

      runSrcDst.push({ src, dst })
    } catch (e) {
      continue;
    }
  }

  return new Response(JSON.stringify(runSrcDst), {
    headers: { 'content-type': 'application/json' },
  })
}