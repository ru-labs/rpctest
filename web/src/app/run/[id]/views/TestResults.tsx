'use client'

import { RpcProvider, Run, TestResult } from "@prisma/client";
import { useState } from "react";
import TestDetails from "../components/TestDetails";
import TestSelector from "../components/TestSelector";

interface TestViewProps {
  run: Run & { results: TestResult[], rpcProvider: RpcProvider }
}
export default function TestResults(props: TestViewProps) {
  const { run } = props;
  const [selectedTest, setSelectedTest] = useState<TestResult>();

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-3 p-4 bg-base-100">
      <TestSelector run={run} selectedTest={selectedTest} setSelectedTest={setSelectedTest} />
      <TestDetails result={selectedTest} />
    </div>
  )
}