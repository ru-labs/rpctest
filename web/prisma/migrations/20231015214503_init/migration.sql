-- CreateTable
CREATE TABLE "RpcProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,

    CONSTRAINT "RpcProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL,
    "requestIp" INET NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "providerIp" INET NOT NULL,
    "rpcProviderId" TEXT NOT NULL,
    "srcGeoDataId" TEXT,
    "dstGeoDataId" TEXT,

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IPGeoData" (
    "id" TEXT NOT NULL,
    "ip" INET NOT NULL,
    "city" TEXT,
    "country" TEXT,
    "countryCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "region" TEXT,
    "regionCode" TEXT,
    "timezone" TEXT,
    "subdivision" TEXT,

    CONSTRAINT "IPGeoData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestResult" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "test" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "result" JSONB,
    "start" TIMESTAMP(3) NOT NULL,
    "successful" BOOLEAN NOT NULL,
    "endpoint" TEXT NOT NULL,

    CONSTRAINT "TestResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Run_srcGeoDataId_key" ON "Run"("srcGeoDataId");

-- CreateIndex
CREATE UNIQUE INDEX "Run_dstGeoDataId_key" ON "Run"("dstGeoDataId");

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_dstGeoDataId_fkey" FOREIGN KEY ("dstGeoDataId") REFERENCES "IPGeoData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_rpcProviderId_fkey" FOREIGN KEY ("rpcProviderId") REFERENCES "RpcProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_srcGeoDataId_fkey" FOREIGN KEY ("srcGeoDataId") REFERENCES "IPGeoData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;
