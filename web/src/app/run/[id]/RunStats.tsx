import { RpcProvider, Run, TestResult } from "@prisma/client";

interface RunStatsProps {
  run: Run & { results: TestResult[], rpcProvider: RpcProvider }
}
export default function RunStats(props: RunStatsProps) {
  const { run } = props;

  return (
    <div className="flex flex-col">
      <div className="text-xl font-bold">
        <span className="text-primary">Provider:</span> {run.rpcProvider.name}
      </div>
      <div className="text-xl font-bold">
        <span className="text-primary">Total Duration:</span> {run.results.reduce((a, b) => a + b.duration, 0)}ms
      </div>
      <div className="text-xl font-bold">
        <span className="text-primary">Successful Tests:</span> {run.results.reduce((a, b) => a + (b.successful ? 1 : 0), 0)} of {run.results.length}
      </div>
    </div>
  )
}