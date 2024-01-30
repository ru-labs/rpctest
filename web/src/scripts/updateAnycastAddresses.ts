import { lookup } from '@/lib/ipinfoLookup';
import prisma from '@/lib/prisma';


async function main() {
  const geodata = await prisma.iPGeoData.findMany({
    where: {
      OR: [
        {
          latitude: {
            equals: null
          }
        },
        {
          longitude: {
            equals: null
          }
        }
      ]
    }
  })

  for (const geo of geodata) {
    const geoInfo = await lookup(geo.ip)

    if (geoInfo) {
      const [lat, lng] = geoInfo.loc.split(',').map(parseFloat)

      await prisma.iPGeoData.update({
        where: {
          id: geo.id
        },
        data: {
          latitude: lat,
          longitude: lng,
          anycast: geoInfo.anycast
        }
      })

      console.log(`Updated ${geo.ip} to ${lat}, ${lng}`)
    }
  }
}

(async () => {
  try {
    await main()
  } catch (error) {
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
})()