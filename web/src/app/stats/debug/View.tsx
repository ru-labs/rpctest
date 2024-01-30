'use client'

import { RpcProvider } from "@prisma/client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Options from "./Options";
import buildPaths from './hooks/buildPaths';

const GlobeRenderer = dynamic(() => import('./GlobeRenderer'), { ssr: false });

export interface DebugViewProps {
  providers: RpcProvider[];
  traces?: any[];
}

export default function DebugView(props: DebugViewProps) {
  const { providers, traces } = props;

  const [selectedProviders, setSelectedProviders] = useState<RpcProvider[]>([]);

  const [paths, setPaths] = useState<any[]>([]);

  useEffect(() => {
    if (!traces) return;
    if (!selectedProviders) return;

    let activeTraces = [];

    const selectedIds = selectedProviders.map((provider) => { return provider.id });

    for (const [region, providerTraces] of traces.entries()) {
      const theseTraces = Array.from(providerTraces.values()) as any[];
      if (selectedIds.includes(theseTraces[0].provider.id) === false) continue;
      activeTraces.push(theseTraces)
    }


    setPaths(buildPaths(activeTraces[0]));
  }, [selectedProviders, traces])

  return (
    <div className="flex flex-row gap-2 mx-auto">
      <Options providers={providers} setSelectedProviders={setSelectedProviders} traces={traces} />
      <GlobeRenderer points={paths || []} />
    </div>
  )
}