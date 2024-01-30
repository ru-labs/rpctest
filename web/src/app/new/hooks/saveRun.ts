import { Prisma } from '@prisma/client';
export default async function saveRun(run: Prisma.RunCreateInput) {
  const runResult = await fetch('/api/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(run),
  })

  const data: Prisma.RunFieldRefs = await runResult.json()
  return data
}