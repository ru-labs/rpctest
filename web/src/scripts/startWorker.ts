import { run as ProcessRemoteTrace } from '@/jobs/ProcessRemoteTrace';
import 'dotenv/config';
import faktory, { JobFunction } from 'faktory-worker';

faktory.register('ProcessRemoteTrace', ProcessRemoteTrace as JobFunction);

faktory.work().catch((err) => {
  console.error(err);
  process.exit(1);
});