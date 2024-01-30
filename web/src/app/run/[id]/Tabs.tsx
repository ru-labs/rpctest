'use client'

import { IPGeoData, RpcProvider, Run, TestResult } from "@prisma/client"
import { useEffect, useState } from "react"
import ProviderView from "./views/Provider"
import SummaryView from "./views/Summary"
import TestResults from "./views/TestResults"

interface TabWrapperProps {
  run: Run & { results: TestResult[], rpcProvider: RpcProvider, srcGeoData: IPGeoData, dstGeoData: IPGeoData }
}

export default function TabWrapper(props: TabWrapperProps) {

  const { run } = props;
  const [selectedTab, setSelectedTab] = useState<string>("summary");

  const handleTabClicked = (e: any) => {
    const tab = e.target as HTMLAnchorElement;
    setSelectedTab(tab.id);
  }

  const SelectedView = (tab: string) => {
    switch (tab) {
      case "summary":
        return <SummaryView run={run} />;
      case "rawResponses":
        return <TestResults run={run} />;
      case "provider":
        return <ProviderView run={run} />;
      default:
        return <div className="text-center p-4">Coming Soon!</div>
    }
  }

  useEffect(() => {
    document.getElementsByClassName("tab-active")[0]?.classList.remove("tab-active");
    document.getElementById(selectedTab)?.classList.add("tab-active");
  }, [selectedTab])

  return (
    <div className="pt-3 m-2">
      <div className="tabs px-3">
        <a id="summary" className="tab tab-sm sm:tab-md md:tab-lg tab-lifted tab-active" onClick={handleTabClicked}>Summary</a>
        <a id="metrics" className="tab tab-sm sm:tab-md md:tab-lg tab-lifted" onClick={handleTabClicked}>Metrics</a>
        <a id="provider" className="tab tab-sm sm:tab-md md:tab-lg tab-lifted" onClick={handleTabClicked}>Provider</a>
        <a id="rawResponses" className="tab tab-sm sm:tab-md md:tab-lg tab-lifted" onClick={handleTabClicked}>Responses</a>
      </div>
      <div className="tab-content">
        {SelectedView(selectedTab)}
      </div>
    </div >
  )
}