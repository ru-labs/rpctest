import { RPCTest } from "@/types/RPCTest";

interface GetActiveTestProps {
  includeDisabled?: boolean;
}

function isValid(testModule: RPCTest) {
  const { name, description, run } = testModule;
  return name && description && run;
}

let activeTests: Map<String, RPCTest> | null = null;

export function getActiveTests(props: GetActiveTestProps = { includeDisabled: false }) {
  if (activeTests) {
    return activeTests;
  }

  const testContext = require.context("@/tests/rpc", true, /\.(t|j)s$/);
  let tests = new Map<String, RPCTest>();

  for (const key of testContext.keys()) {
    if (key.startsWith(".")) {
      continue;
    }

    const testModule: RPCTest = testContext(key);

    if (!isValid(testModule)) {
      continue;
    }

    if (!props.includeDisabled && testModule.disabled) {
      continue;
    }

    tests.set(testModule.name, testModule);
  }

  activeTests = tests;
  return tests;
}