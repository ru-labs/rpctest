import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

const currentProviders = await prisma.rpcProvider.findMany()

if (currentProviders.length > 0) {
  console.log('Providers already exist, skipping seed')
  process.exit(0)
}

await prisma.rpcProvider.create({
  data: {
    name: 'QuickNode',
    endpoint: 'https://damp-practical-asphalt.solana-mainnet.quiknode.pro/caaf35b070c02adbfd59d5c1ef4914be7875f51a/',
  }
})

await prisma.rpcProvider.create({
  data: {
    name: 'HelloMoon',
    endpoint: 'https://global.rpc.hellomoon.io/5222ae38-21fa-4b4e-8867-7c5eb473ea8c',
  }
})

await prisma.rpcProvider.create({
  data: {
    name: 'Solana Foundation',
    endpoint: 'https://api.mainnet-beta.solana.com',
  }
})