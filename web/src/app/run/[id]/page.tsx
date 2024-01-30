import prisma from "@/lib/prisma";
import RunPageHeader from "./PageHeader";
import TabWrapper from "./Tabs";

export const metadata = {
  title: 'Test Results - RPCTest.com',
  description: 'Realtime Solana RPC provider performance comparison and metrics.',
}
export default async function RunView({ params }: { params: { id: string } }) {

  const run: any = await prisma.run.findUnique({
    where: {
      id: params.id
    },
    include: {
      results: true,
      rpcProvider: true,
      srcGeoData: true,
      dstGeoData: true
    }
  })

  if (!run) {
    return <div>Run Not Found</div>
  }

  return (
    <div className="w-full bg-base-300 flex flex-col">
      <RunPageHeader run={run} />
      <TabWrapper run={run} />
    </div>
  )
}
