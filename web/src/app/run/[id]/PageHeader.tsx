'use client'

import { IPGeoData, RpcProvider, Run, TestResult } from '@prisma/client';
import moment from 'moment';
import { GradientPurpleOrange } from '@visx/gradient'

interface RunPageHeaderProps {
  run: Run & { results: TestResult[], rpcProvider: RpcProvider, srcGeoData: IPGeoData, dstGeoData: IPGeoData };
};

const HeaderItem = (props: { label: string, value: any, tooltip?: string }) => (
  <div className="text-xs h-full flex flex-row w-full place-items-center min-w-1/4 px-5">
    <span className={`px-3 py-2 h-fit flex-initial shadow-md bg-base-200 rounded-l-xl font-bold text-center`}>{props.label}:</span>
    <span data-tip={props.tooltip ? props.tooltip : ''} className={`px-3 py-2 h-fit flex-grow rounded-r-xl bg-base-100 text-center ${props.tooltip ? 'tooltip tooltip-bottom' : ''}`}>{props.value as string}</span>
  </div >
)

export default function RunPageHeader(props: RunPageHeaderProps) {

  const { run } = props;

  const runSuccess = run.results.reduce((acc, result) => acc && result.successful, true);

  const totalDuration = run.results.reduce((acc, result) => acc + result.duration, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 bg-base-300 items-stretch py-2 border-primary">
      <div className="hidden lg:flex flex-col items-stretch gap-1 my-auto">
        <HeaderItem label="Provider" value={run.rpcProvider.name} />
        <HeaderItem label="Duration" value={totalDuration.toString() + "ms"} />
      </div>
      <div className="col-span-1 lg:col-span-2 items-center">
        <div className={`shadow-md h-16 mx-2 justify-center rounded-md flex flex-col ${runSuccess ? 'bg-success' : 'bg-error'} text-center lg:mx-5`}>
          <span className={`text-xl font-extrabold ${runSuccess ? 'text-success-content' : 'text-error-content'}`}>Run {runSuccess ? 'Passed' : 'Failed'}!</span>
          <span className={`hidden lg:block text-sm ${runSuccess ? 'text-success-content' : 'text-error-content'}`}></span>
        </div>
      </div>
      <div className="hidden lg:flex flex-col align-middle gap-1 my-auto">
        <HeaderItem label="Date" value={moment(run.start).format('ll')} />
        <HeaderItem label="Time" value={moment(run.start).format('LT')} />
      </div>
    </div>
  )
}