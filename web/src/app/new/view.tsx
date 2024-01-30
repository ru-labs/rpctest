'use client'

import RunInProgress from '@/app/new/components/RunInProgress'
import { RPCTest } from '@/types/RPCTest'
import { getActiveTests } from '@/utils/getActiveTests'
import { RpcProvider } from '@prisma/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import saveRun from './hooks/saveRun'
import startRun from './hooks/startRun'

interface NewViewProps {
  providers: RpcProvider[]
}

export default function NewView(props: NewViewProps) {
  const { providers } = props

  const tests = getActiveTests()

  const [provider, setProvider] = useState<RpcProvider>(providers[0])
  const [start, setStart] = useState<boolean>(false)
  const [running, setRunning] = useState(false)
  const [completedTests, setCompletedTests] = useState<RPCTest[]>([])
  const [lastTest, setLastTest] = useState<RPCTest>()

  const { push } = useRouter()

  const onTestCompleted = useCallback(
    async (test: RPCTest) => {
      setCompletedTests(currentCompletedTests => [...currentCompletedTests, test]);
      setLastTest(test);
    },
    []
  );

  const startTests = useCallback(
    async () => {
      const run = await startRun(provider, onTestCompleted);
      const result = await saveRun(run);
      push(`/run/${result.id}`)
    },
    [provider, onTestCompleted, push]
  );

  useEffect(() => {
    if (start && !running) {
      setRunning(true)
      console.log("Starting run")
      startTests()
    }
  }, [start, running, startTests, push])

  return (
    <div className="flex min-h-screen flex-col items-center space-y-4 p-24">
      <Image
        className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] mb-2"
        src="/solana-sol-logo.svg"
        alt="Solana Logo"
        width={180}
        height={37}
        priority
      />
      <h1 className="text-5xl text-primary-content font-bold">Solana RPC Test</h1>
      {!start && (
        <div className="flex flex-col items-center">
          <p className="py-6 prose">Select a provider to start the test:</p>
          <label htmlFor="providerInputId" className="hidden">Provider Selection</label>
          <CreatableSelect
            isClearable={false}
            inputId='providerInputId'
            className="w-full"
            onChange={(newVal) => {
              if (newVal) {
                setProvider(providers.find((provider) => provider.id === newVal.value) as RpcProvider)
              }
            }}
            classNames={{
              container: () => 'w-full border-primary border-2 rounded-md text-white',
              control: () => 'w-full',
              input: () => 'text-white',
              singleValue: () => 'text-white',
            }}
            styles={{
              control: (base, content) => ({
                ...base,
                border: 'none',
                backgroundColor: 'rgba(0, 0, 0, 0)'
              }),
              singleValue: (base, content) => ({
                ...base,
                color: 'white'
              }),
              menu: (base, content) => ({
                ...base,
                // color: 'white',
              }),
              menuList: (base, content) => ({
                ...base,
                backgroundColor: 'rgba(0, 0, 0, 1)',
                border: '1px solid rgba(255, 255, 255, 1)',
                color: 'white'
              }),
              option: (base, { isFocused }) => ({
                ...base,
                color: 'white',
                ":hover": {
                  backgroundColor: 'rgba(220, 31, 255, 0.9)'
                },
                backgroundColor: isFocused ? 'rgba(220, 31, 255, 0.9)' : 'rgba(0, 0, 0, 1)',
              }),
              placeholder: (base, content) => ({
                ...base,
                color: 'white'
              }),
              indicatorSeparator: (base, content) => ({
                ...base,
                backgroundColor: 'white'
              }),
              dropdownIndicator: (base, content) => ({
                ...base,
                color: 'white'
              }),
            }}
            options={
              providers.map((provider) => ({
                label: provider.name,
                value: provider.id
              }
              ))
            } />
          <br />
          <button className="btn btn-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-150 hover:bg-secondary duration-300" onClick={() => setStart(true)}>Run Test</button>
        </div>
      )}
      {running && (
        <RunInProgress completed={completedTests} last={lastTest} total={tests.size} />
      )}
    </div>
  )
}