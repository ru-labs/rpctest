
import { IPGeoData, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import maxmind, { CityResponse } from 'maxmind';
import path from 'path';

const absolutePath = path.resolve(process.cwd(), 'src/lib/vendor', 'city.mmdb');
const dbReader = await maxmind.open<CityResponse>(absolutePath);
function lookup(ip: string): [CityResponse | null, number] {
  return dbReader.getWithPrefixLength(ip);
}

const runs = await prisma.run.findMany(
  {
    where: {
      OR: [
        {
          srcGeoData: {
            is: null
          }
        },
        {
          dstGeoData: {
            is: null
          }
        }
      ]
    }
  }
)

for (const run of runs) {
  const [srcGeoInfo, srcPrefix] = lookup(run.requestIp)
  const [dstGeoInfo, dstPrefix] = lookup(run.providerIp)

  let subdivision = srcGeoInfo?.subdivisions?.[0]?.names.en

  let srcGeoData: IPGeoData | undefined = undefined;
  let dstGeoData: IPGeoData | undefined = undefined;

  if (srcGeoInfo) {

    srcGeoData = await prisma.iPGeoData.create({
      data: {
        subdivision,
        ip: run.requestIp,
        city: srcGeoInfo.city?.names.en,
        country: srcGeoInfo.country?.names.en,
        countryCode: srcGeoInfo.country?.iso_code,
        latitude: srcGeoInfo.location?.latitude,
        longitude: srcGeoInfo.location?.longitude,
        timezone: srcGeoInfo.location?.time_zone,
        region: srcGeoInfo.continent?.names.en,
        regionCode: srcGeoInfo.continent?.code,
      }
    })
  }


  if (dstGeoInfo) {
    dstGeoData = await prisma.iPGeoData.create({
      data: {
        subdivision,
        ip: run.providerIp,
        city: dstGeoInfo.city?.names.en,
        country: dstGeoInfo.country?.names.en,
        countryCode: dstGeoInfo.country?.iso_code,
        latitude: dstGeoInfo.location?.latitude,
        longitude: dstGeoInfo.location?.longitude,
        timezone: dstGeoInfo.location?.time_zone,
        region: dstGeoInfo.continent?.names.en,
        regionCode: dstGeoInfo.continent?.code,
      }
    })
  }

  let updateStatement = {
    where: {
      id: run.id
    },
    data: {}
  }

  if (srcGeoData) {
    updateStatement.data = {
      ...updateStatement.data,
      srcGeoData: {
        connect: {
          id: srcGeoData.id
        }
      }
    };
  }

  if (dstGeoData) {
    updateStatement.data = {
      ...updateStatement.data,
      dstGeoData: {
        connect: {
          id: dstGeoData.id
        }
      }
    };
  }


  await prisma.run.update({
    ...updateStatement
  })

  console.log(`Updated run ${run.id}`)
}