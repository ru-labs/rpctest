export function baseConfig() {
  return {
    globeImageUrl: "//unpkg.com/three-globe/example/img/earth-night.jpg",
    bumpImageUrl: '//unpkg.com/three-globe/example/img/earth-topology.png',
    backgroundColor: 'rgba(0,0,0,0)',
    animateIn: true,
    height: 1024,
    enablePointerInteraction: false,
    pointsData: [],
    pointsMerge: true,
    pathsData: [],
  }
}

export function nodesConfig(nodes: any[]) {

  const pointColor = (p: any) => {
    if (p.rpc && p.tpu && p.gossip) {
      return 'rgba(0, 255, 0, 0.5)'
    }

    if (p.rpc && p.tpu) {
      return 'rgba(0, 0, 255, 0.5)'
    }

    if (!p.gossip) {
      return 'rgba(255, 255, 0, 0.5)';
    }

    return 'rgba(255, 0, 0, 0.5)';
  }

  const pointsData = nodes.map((point) => ({
    ...point,
    color: pointColor(point)
  }))

  return {
    pointsData: pointsData,
    pointLabel: (p: any) => p.pubkey,
    pointColor: 'color',
    pointAltitude: 0.02,
    pointRadius: 0.1,
  }
}

export function pathsConfig(nodes: any[]) {
  const pathData = nodes.map((point) => {
    return {
      lat: point.lat,
      lng: point.lng,
      color: '#FF0000'
    }
  });

  return {
    pathsData: [pathData],
    pathColor: ['rgba(255, 0, 0, 0.5)', 'rgba(0, 0, 255, 0.5)'],
    pathPointLat: 'lat',
    pathPointLng: 'lng'
  }
}