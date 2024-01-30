'use client'

import { useEffect, useRef } from 'react';
import Globe, { GlobeMethods, GlobeProps } from 'react-globe.gl';

interface ClusterMapProps {
  points: any[];
  mapConfig: GlobeProps;
}

export default function ClusterMap(props: ClusterMapProps) {

  const { points, mapConfig } = props;

  const pointsData = points.map((point) => ({
    ...point,
    color: 'orange',
    altitude: 0.2,
    text: point.name
  }))

  const globeEl = useRef<GlobeMethods>()

  useEffect(() => {

    if (!globeEl.current) return;

    const controls = globeEl.current.controls();

    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enabled = true;

  }, [globeEl, points])

  return (
    <Globe {...mapConfig} />
  )
}