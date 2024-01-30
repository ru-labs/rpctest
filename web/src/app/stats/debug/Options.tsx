'use client'

import { RpcProvider } from "@prisma/client";
import { DebugViewProps } from "./View";

type OptionsProps = DebugViewProps & { setSelectedProviders: (providers: RpcProvider[]) => void };
export default function Options(props: OptionsProps) {
  const { providers, setSelectedProviders, traces } = props;

  const regions = traces ? traces.map((trace) => { return Array.from(trace.keys()) }).flat() : [];
  const uniqueRegions = [...new Set(regions)];

  const handleSelectedChange = (e: any) => {
    const selected = Array.from(e.target.selectedOptions, (option: any) => option.value);
    const provider = providers.filter((provider) => { return selected.includes(provider.id) });
    setSelectedProviders(provider);
  }

  return (
    <div className="flex-none w-56 h-screen bg-base-200 p-3 flex flex-col gap-1">
      <div className="text-bold">Options</div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Provider:</span>
        </label>
        <select className="select select-xs select-bordered" onChange={handleSelectedChange}>
          {providers.map((provider) => (
            <option key={provider.id} value={provider.id}>{provider.name}</option>
          ))}
        </select>
      </div>
      <div className="form-control w-full max-w-xs gap-2">
        <label className="label">
          <span className="label-text">Source Locations ({uniqueRegions.length}):</span>
        </label>
        {uniqueRegions && uniqueRegions.map((region) => (
          <div key={region as string} className="flex flex-row gap-2 items-center justify-start">
            <input type="checkbox" className="toggle toggle-xs" defaultChecked={true} />
            {region as string}
          </div>
        ))}
      </div>
    </div>
  )
}