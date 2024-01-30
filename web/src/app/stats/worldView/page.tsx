'use client'

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { GlobeProps } from "react-globe.gl";
import { baseConfig, nodesConfig, pathsConfig } from "./mapConfig";

const ClusterMap = dynamic(() => import('./ClusterMap'), { ssr: false });

export default function GlobalStatsPage() {

  const [clusterNodes, setClusterNodes] = useState<any[]>();
  const [mapConfig, setMapConfig] = useState<any>(baseConfig());

  const [showNodes, setShowNodes] = useState(false);
  const [showPaths, setShowPaths] = useState(false);
  const generateMapConfig = useMemo(() => {
    let newConfig: GlobeProps = baseConfig();
    if (clusterNodes) {
      if (showNodes) {
        newConfig = { ...newConfig, ...nodesConfig(clusterNodes) }
      }

      if (showPaths) {
        newConfig = { ...newConfig, ...pathsConfig(clusterNodes) }
      }
    }

    return newConfig;
  }, [clusterNodes, showNodes, showPaths])

  useEffect(() => {
    fetch('/api/stats/global/summary').then((res) => {
      res.json().then((json) => {
        setClusterNodes(json);
      })
    }
    )
  }, [])

  useEffect(() => {
    const newConfig = generateMapConfig;
    console.log("New Config", newConfig)

    setMapConfig(newConfig);
  }, [clusterNodes, showNodes, showPaths, generateMapConfig])

  if (!clusterNodes) return <div>Loading...</div>;

  return (
    <div className="flex flex-col w-full items-center h-max pt-5 gap-2">
      <div className="text-5xl">Solana Cluster World View</div>
      <div className="text-2xl py-2">
        <span className="mr-1">
          Total Active Nodes:
        </span>
        {clusterNodes.length.toString().split('').map((char, i) => {
          return <span key={i} className="text-lg kbd mx-1">{char}</span>
        }
        )}
      </div>
      <div className="flex flex-row gap-2">
        <div className="flex flex-row gap-1">
          <span className="text-xl font-bold">Show Paths</span>
          <input type="checkbox" className="toggle toggle-md" checked={showPaths} onChange={() => setShowPaths(!showPaths)} />
        </div>
        <div className="flex flex-row gap-1">
          <span className="text-xl font-bold">Show Nodes</span>
          <input type="checkbox" className="toggle toggle-md" checked={showNodes} onChange={() => setShowNodes(!showNodes)} />
        </div>
      </div>
      <ClusterMap points={clusterNodes} mapConfig={mapConfig} />
      <div className="flex flex-row pb-3 text-base-content animate-pulse">
        Live data from Solana Mainnet Cluster
      </div>
    </div>
  )
}