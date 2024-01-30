import prisma from "@/lib/prisma";

export const revalidate = 60 // 1 minute
export async function GET() {
  const rpcProviders = await prisma.rpcProvider.findMany()

  return new Response(JSON.stringify(rpcProviders), {
    headers: { 'content-type': 'application/json' },
  })
}