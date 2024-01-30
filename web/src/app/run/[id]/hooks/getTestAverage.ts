import prisma from "@/lib/prisma";

export default async function getTestAverage(name: string) {
  const averageDuration = await prisma.testResult.aggregate({
    where: {
      test: name
    },
    _avg: {
      duration: true
    }
  })

  return averageDuration._avg.duration
}