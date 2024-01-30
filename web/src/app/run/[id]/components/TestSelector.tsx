'use client'

import { RpcProvider, Run, TestResult } from "@prisma/client";

interface TestSelectorProps {
  run: Run & { results: TestResult[], rpcProvider: RpcProvider }
  selectedTest: TestResult | undefined;
  setSelectedTest: (result: TestResult) => void;
}

export default function TestSelector(props: TestSelectorProps) {

  const { run, selectedTest, setSelectedTest } = props;

  const handleSelectedTestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const result = run.results.find((result) => result.test === e.target.value);
    if (!result) return;
    setSelectedTest(result);
  }

  return (
    <div className="flex flex-row gap-1 items-center h-min">
      <div className="text-sm font-bold w-min hidden md:inline">Test: </div>
      <select className="select select-bordered select-sm w-full max-w-xs" onChange={handleSelectedTestChange}>
        {run.results.map((result) => (
          <option key={result.id} defaultChecked={result === selectedTest}>
            {result.test}
          </option>
        )
        )}
      </select>
    </div>
  )
}