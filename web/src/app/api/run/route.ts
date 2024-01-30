import { lookup } from "@/lib/maxmindLookup";
import prisma from "@/lib/prisma";
import { IPGeoData, Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json() as Prisma.RunCreateInput

  const [srcGeoInfo, srcPrefix] = lookup(body.requestIp)
  const [dstGeoInfo, dstPrefix] = lookup(body.providerIp)

  if (dstGeoInfo && !dstGeoInfo.location) {

  }

  if (srcGeoInfo) {
    let subdivision = srcGeoInfo.subdivisions?.[0]?.names.en

    body.srcGeoData = {
      create: {
        subdivision,
        ip: body.requestIp,
        city: srcGeoInfo.city?.names.en,
        country: srcGeoInfo.country?.names.en,
        countryCode: srcGeoInfo.country?.iso_code,
        latitude: srcGeoInfo.location?.latitude,
        longitude: srcGeoInfo.location?.longitude,
        timezone: srcGeoInfo.location?.time_zone,
        region: srcGeoInfo.continent?.names.en,
        regionCode: srcGeoInfo.continent?.code,
      } as IPGeoData
    }
  }

  if (dstGeoInfo) {
    let subdivision = dstGeoInfo.subdivisions?.[0]?.names.en

    body.dstGeoData = {
      create: {
        subdivision,
        ip: body.providerIp,
        city: dstGeoInfo.city?.names.en,
        country: dstGeoInfo.country?.names.en,
        countryCode: dstGeoInfo.country?.iso_code,
        latitude: dstGeoInfo.location?.latitude,
        longitude: dstGeoInfo.location?.longitude,
        timezone: dstGeoInfo.location?.time_zone,
        region: dstGeoInfo.continent?.names.en,
        regionCode: dstGeoInfo.continent?.code,
      } as IPGeoData
    }
  }

  const newRun = await prisma.run.create({
    data: body
  })

  return new Response(JSON.stringify(newRun), {
    headers: { 'content-type': 'application/json' },
  })
}
