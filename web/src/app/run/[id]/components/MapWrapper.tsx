'use client'

import Spinner from '@/components/RPCTestLogo';
import { IPGeoData, RpcProvider, Run } from '@prisma/client';
import { useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useRef } from 'react';
interface MapWrapperProps {
  run: Run & { srcGeoData: IPGeoData, dstGeoData: IPGeoData, rpcProvider: RpcProvider }
}

function getLatLng(geoData: IPGeoData) {
  if (!geoData.latitude || !geoData.longitude) return { lat: 0, lng: 0 };
  return {
    lat: geoData.latitude,
    lng: geoData.longitude
  }
}

export default function MapWrapper(props: MapWrapperProps) {

  const { run } = props;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBnnj1oy6hEChLPekxlcC8ajWfS3nA040Y',
    id: 'run-map'
  });
  const src = getLatLng(run.srcGeoData);
  const dst = getLatLng(run.dstGeoData);

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (!mapRef.current) return;

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(src);
    bounds.extend(dst);

    const map = new google.maps.Map(mapRef.current, {
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true,
      zoom: 4.5,
      center: bounds.getCenter(),
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#2a2139" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#b381c5" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#ff61a6" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6effe8" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#213d50" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#2e8b57" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#32346d" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#4f1205" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#ffffff" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#ea7254" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#fd1d1d" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#656d77" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#1b0130" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ],
    });

    const polyline = new google.maps.Polyline({
      path: [src, dst],
      strokeColor: "#14F195",
      strokeOpacity: 0.8,
      strokeWeight: 4,
      geodesic: true,
    });

    const startIcon = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 6,
      fillColor: "#FFA500",
      fillOpacity: 1,
      strokeWeight: 0
    };

    const endIcon = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 6,
      fillColor: "#4c8ed9",
      fillOpacity: 1,
      strokeWeight: 0
    };

    new google.maps.Marker({
      map,
      position: src,
      title: 'Source',
      icon: startIcon
    });

    new google.maps.Marker({
      map,
      position: dst,
      title: 'Destination',
      icon: endIcon
    });

    polyline.setMap(map);
  }, [src, dst, mapRef])

  if (!isLoaded) {
    return (
      <div className="bg-base-100 rounded-md p-4 flex flex-col items-center text-center text-3xl align-middle pb-10">
        <Spinner width={200} height={200} updateFrequency={200} centerSize={20} />
        <span>
          Loading Map...
        </span>
      </div>
    )
  }

  return (
    <div ref={mapRef} className={'w-full'} style={{ height: '400px' }}></div>
  );
}