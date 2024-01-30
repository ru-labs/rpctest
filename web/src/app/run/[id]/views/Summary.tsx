'use client'

import { type RPCTest } from "@/types/RPCTest";
import { getActiveTests } from "@/utils/getActiveTests";
import { IPGeoData, RpcProvider, Run, TestResult } from "@prisma/client";
import { useEffect, useState } from "react";

type FullRun = Run & { results: TestResult[], rpcProvider: RpcProvider, srcGeoData: IPGeoData, dstGeoData: IPGeoData }
interface SummaryViewProps {
  run: FullRun
}
const activeTests = getActiveTests();

function getPassedTests(run: FullRun) {
  return run.results.reduce((acc, result) => acc + (result.successful ? 1 : 0), 0);
}

function getTotalDuration(run: FullRun) {
  return run.results.reduce((acc, result) => acc + result.duration, 0);
}



export default function SummaryView(props: SummaryViewProps) {

  const { run } = props;

  const [selectedTest, setSelectedTest] = useState<RPCTest>();
  const [selectedResult, setSelectedResult] = useState<TestResult>();

  const [metrics, setMetrics] = useState<any[]>([]);

  const handleTestClicked = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    const result = run.results.find((r) => r.id === id);
    if (result) {
      const test = activeTests.get(result.test);
      setSelectedTest(test);
      setSelectedResult(result);
    }

    const parent = (e.target as HTMLButtonElement).parentElement?.parentElement;
    if (!parent) return;

    const parentSibs = parent.parentElement?.children || [];

    const classes = ['w-3/4', 'selected', 'shadow', 'font-bold', 'bg-primary', 'text-primary-content']

    for (let i = 0; i < parentSibs.length; i++) {
      const sib = parentSibs[i];
      if (sib === parent) continue;
      classes.forEach((c) => {
        sib.classList.remove(c);
      })
    }

    classes.forEach((c) => {
      parent.classList.add(c);
    })
  }

  const passedTests = getPassedTests(run);
  const totalTests = run.results.length;

  useEffect(() => {
    const getMetrics = async () => {
      const res = await fetch(`/api/stats/tests`);
      const data = await res.json();
      setMetrics(data);
    }

    getMetrics();
  }, [])

  return (
    <div className="flex flex-col bg-base">
      <div className="flex-none w-full p-3 text-center bg-secondary-focus text-secondary-content">
        {totalTests} tests ran against {run.rpcProvider.name} in {getTotalDuration(run)}ms.
        <br />
        There were {passedTests} successful tests and {totalTests - passedTests} failed tests, for a pass rate of {Math.round(passedTests / totalTests * 100)}%.
      </div>
      <div className="flex flex-col md:flex-row bg-base-200">
        <div className="flex-initial w-full md:w-1/4 flex-col py-2 pr-2 gap-2 items-start">
          {run.results.map((result) => {
            return (
              <div key={result.id} className={`my-2 flex pl-2 pr-4 hover:bg-primary/30 w-full md:w-fit bg-base-300 transition-all py-2 md:rounded-r-xl`}>
                <div className="flex flex-row gap-1.5 items-center text-xs lg:text-md 2xl:text-lg">
                  {result.successful ? '✅' : '❌'}
                  <button className="self-stretch" onClick={(e) => handleTestClicked(e, result.id)}>
                    {result.test}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex flex-col md:flex-row">
          {selectedTest && (
            <div id="summary-details" className="shadow-xl rounded-md m-5 flex-auto p-2 bg-base-100 items-stretch">
              <div className="prose lg:prose-xl dark:prose-invert">
                <h3 className="text-current-content">
                  {selectedTest.name}
                </h3>
                <div className="flex flex-row gap-2 pb-2">
                  <div className="badge badge-outline hover:badge-primary hover:text-white">
                    Successful:
                    {selectedResult?.successful ? ' Yes' : ' No'}
                  </div>
                  <span className="badge badge-outline">Duration:{' '}
                    {selectedResult?.duration}ms
                  </span>
                </div>
                <section className="p-2">
                  {selectedTest.description}
                </section>
              </div>
            </div>
          )}
          <div className={`hidden lg:flex flex-initial w-1/4 flex-col m-5 p-2 gap-2 items-stretch`}>
            {selectedResult && (
              <>
                <div className="text-xl font-bold">
                  Test Metrics
                </div>
                <div className="flex flex-row gap-2 self-auto w-full">
                  <span>Test Average:</span>
                  <span className="w-1/4 flex-1 bg-accent/20 rounded-md px-2">
                    {parseInt(metrics.find((m) => m.test === selectedResult.test)?._avg.duration) + "ms" || "Loading..."}
                  </span>
                </div>
                <div className="flex flex-row gap-3">
                  <span>Provider Average:</span>
                  <span className="w-1/4 flex-1 bg-accent/20 rounded-md animate-pulse px-2">
                    N/A
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div >
  )
}