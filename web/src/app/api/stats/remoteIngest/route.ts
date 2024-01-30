import { ProcessRemoteTraceJob, createAsync } from '@/jobs/ProcessRemoteTrace';
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const trace = await request.json() as ProcessRemoteTraceJob;
  await createAsync(trace)
  return new Response("OK");
}