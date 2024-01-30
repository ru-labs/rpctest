'use client'

import { useEffect, useRef, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';

const getLatestTests = async () => {
  const res = await fetch('/api/stats/recentTests');

  const json = await res.json();
  const tests = json.map((test: any) => ({
    startLat: test.src[0],
    startLng: test.src[1],
    endLat: test.dst[0],
    endLng: test.dst[1],
    color: ['green', 'red']
  }));

  return tests;
}


export default function GlobeRender() {

  const globeEl = useRef<GlobeMethods>()
  const [points, setPoints] = useState<any>()

  useEffect(() => {

    if (!points) {
      getLatestTests().then((tests) => {
        setPoints(tests);
      });
    }

    if (!globeEl.current || !points) return;

    const controls = globeEl.current.controls();

    const camera = globeEl.current.camera();

    controls.autoRotate = true;
    // controls.autoRotateSpeed = 0.9;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 2.0;

    globeEl.current.pointOfView({
      lat: points[0].startLat,
      lng: points[0].startLng,
      altitude: 1
    })
  }, [globeEl, points])

  if (!points) return (<div className="w-screen h-screen -z-10"></div>);

  return (
    <Globe
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      bumpImageUrl={'//unpkg.com/three-globe/example/img/earth-topology.png'}
      backgroundColor='rgba(0,0,0,0)'
      animateIn={true}
      arcsData={points}
      arcColor={'color'}
      showAtmosphere={true}
      atmosphereColor='orange'
      arcDashLength={0.005}
      arcDashGap={0.01}
      arcDashAnimateTime={30000}
      arcAltitudeAutoScale={0.2}
      arcStroke={0.2}
      arcsTransitionDuration={0.5}
      ref={globeEl}
      enablePointerInteraction={true}
    />
  )
}