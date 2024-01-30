import RPCTestLogo from "@/components/RPCTestLogo";
import { RPCTest } from "@/types/RPCTest";
import { useEffect, useState } from "react";


interface RunInProgressProps {
  total: number
  completed: RPCTest[]
  last: RPCTest | undefined
}

export default function RunInProgress({ completed, last, total }: RunInProgressProps) {

  const [currentValue, setCurrentValue] = useState<number>(0)

  const runningMessage = () => {
    if (completed.length === 0) {
      return 'Preparing Ion Cannons...'
    } else if (completed.length === total) {
      return 'Analyzing Results...'
    } else if (last) {
      return (
        <div className="flex flex-col">
          <div className="flex flex-row">
            <code>
              Running{' '}
              {last.name}
            </code>
          </div>
        </div>
      )
    }
  }

  useEffect(() => {
    const percentage = (completed.length / total) * 100
    setCurrentValue(percentage)
  }, [completed, total])

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <RPCTestLogo width={250} height={250} rotateRing={true} centerSize={15} />
        <div className="text-primary-content font-bold text-lg">{currentValue}%</div>
        <span className="text-2xl font-bold mt-6">{runningMessage()}</span>
      </div>
    </>
  )
}