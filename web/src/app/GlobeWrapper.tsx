'use client'

import dynamic from 'next/dynamic';

interface GlobeWrapperProps {
  children?: React.ReactNode
}


export default function GlobeWrapper(props: GlobeWrapperProps) {
  const GlobeRender = dynamic(() => import('@/app/GlobeRender'), { ssr: false });

  return (
    <div className="w-screen h-screen -z-10">
      <GlobeRender />
    </div>
  )
}