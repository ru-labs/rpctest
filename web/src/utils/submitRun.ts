import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export default async function submitRun(result: Prisma.RunCreateInput) {

  try {
    const newRun = await prisma.run.create({
      data: result,
    })
    return newRun;
  } catch (error) {
    console.error(error)
  }
}