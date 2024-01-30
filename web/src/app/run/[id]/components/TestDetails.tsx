'use client'

import { TestResult } from "@prisma/client";
import { SyntheticEvent, useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { synthwave84 } from 'react-syntax-highlighter/dist/esm/styles/prism';
interface TestDetailsProps {
  result: TestResult | undefined;
}

export default function TestDetails({ result }: TestDetailsProps) {

  const [activeTab, setActiveTab] = useState('summary');

  const handleClickEvent = (e: SyntheticEvent, tab: string) => {

    const oldTab = document.getElementById(activeTab);

    const currentTab = e.target as HTMLElement;
    const tabButtons = (currentTab.parentElement as HTMLElement).getElementsByClassName('tab')
    for (let i = 0; i < tabButtons.length; i++) {
      tabButtons[i].classList.remove('tab-active');
    }

    currentTab.classList.add('tab-active');

    setActiveTab(tab);
    if (!oldTab) return;
    oldTab.classList.add('hidden');
  }

  useEffect(() => {
    const tab = document.getElementById(activeTab);
    if (!tab) return;
    tab.classList.remove('hidden');
  }, [activeTab])

  if (!result) return (
    <div className="mt-3 bg-base-300 p-3 rounded-md md:text-xl font-bold text-center col-span-2">
      Select a test to view the response we received.
    </div>
  )

  return (
    <div className="h-max w-auto lg:mockup-code lg:mx-4 lg:mb-2 col-span-2">
      <SyntaxHighlighter language="json" style={synthwave84} wrapLongLines={true}>
        {JSON.stringify(result.result, null, 2)}
      </SyntaxHighlighter>
    </div>
  )
}