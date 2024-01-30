import { IPGeoData, RpcProvider, Run, TestResult } from "@prisma/client";
import MapWrapper from "../components/MapWrapper";
import { haversine } from "../utils/haversine";

type FullRun = Run & { results: TestResult[], rpcProvider: RpcProvider, srcGeoData: IPGeoData, dstGeoData: IPGeoData }
interface ProviderViewProps {
  run: FullRun
}

const friendlyName = (geo: IPGeoData) => {
  if (!geo) return "🌎 Unknown Location"

  if (geo.countryCode === "US") {
    return `🇺🇸 ${geo.city}, ${geo.subdivision}`
  }

  return `🌎 ${geo.city}, ${geo.region}`
}

const distance = (run: FullRun) => {
  if (!run.dstGeoData || !run.srcGeoData) return "Unknown"

  if (!run.dstGeoData.latitude || !run.dstGeoData.longitude || !run.srcGeoData.latitude || !run.srcGeoData.longitude) return "Unknown"

  return haversine(run.srcGeoData.latitude, run.srcGeoData.longitude, run.dstGeoData.latitude, run.dstGeoData.longitude).toFixed(2)
}

export default function ProviderView(props: ProviderViewProps) {

  const { run } = props;

  return (
    <div className="flex flex-row bg-base-200">
      <div className="flex-none bg-base-300 m-2 p-3 h-min w-1/4 flex flex-col gap-2">
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="font-bold">
            Provider:
          </div>
          <div>
            {run.rpcProvider.name}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-2">
          <div className="font-bold">
            Anycast:
          </div>
          <div className="overflow-clip">
            {run.dstGeoData.anycast ? "Yes" : "No"}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-2">
          <div className="font-bold">
            IP Address:
          </div>
          <div className="overflow-clip">
            {run.providerIp}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-2">
          <div className="font-bold">
            Location:
          </div>
          <div className="overflow-clip">
            {friendlyName(run.dstGeoData)}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-2">
          <div className="font-bold">
            Distance:
          </div>
          <div className="overflow-clip">
            {distance(run)}km
          </div>
        </div>

      </div>

      <div className="flex-grow flex flex-col">
        <MapWrapper run={run} />
      </div>
    </div>
  )
}