import prisma from '@/lib/prisma'
import NewView from './view'

export default async function NewPage() {

  const providers = await prisma.rpcProvider.findMany({})

  return (
    <NewView providers={providers} />
  )
}