'use client'

import { useRef } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";


export default function GlobeRenderer({ points }: { points: any }) {

  const globeEl = useRef<GlobeMethods>()

  const makeLabel = (d: any) => {
    return (
      `<div class='text-lg p-2 border-spacing-1 border-secondary rounded-md text-primary-content bg-secondary'>
        <div class='flex flex-col'>
          <span>${d.name}</span>
          <span>RTT: ${d.dstRtt}ms</span>
        </div>
      </div>`
    )
  }

  return (
    <div className="self-center h-screen w-full">
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl={'//unpkg.com/three-globe/example/img/earth-topology.png'}
        backgroundColor='rgba(0,0,0,0)'
        width={1024}
        animateIn={false}
        pathsData={points}
        pathPoints={'points'}
        pathPointLat={'lat'}
        pathPointLng={'lng'}
        pathColor={'color'}
        pathStroke={'size'}
        pathLabel={(d) => makeLabel(d)}
        showAtmosphere={false}
        atmosphereColor='orange'
        ref={globeEl}
      />
    </div>
  )
}