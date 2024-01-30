import crypto from 'crypto';
import dotenv from 'dotenv';
import { createWriteStream } from 'fs';
import fs from 'fs/promises';
import https from 'https';
import path from 'path';
import tar from 'tar';

dotenv.config({ path: '.env.local' });

const deletePath = async (path: string): Promise<void> => {
  try {
    if (await fs.lstat(path).then(stats => stats.isDirectory())) {
      await fs.rm(path, { recursive: true });
    } else {
      await fs.unlink(path);
    }
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      throw new Error(`Failed to delete ${path}: ${error.message}`);
    }
  }
};

const ensureDirectoryExists = async (directory: string): Promise<void> => {
  await fs.mkdir(directory, { recursive: true });
};

const downloadChecksum = async (editionId: string, checksumDestination: string): Promise<void> => {
  const url = `https://download.maxmind.com/app/geoip_download?edition_id=${editionId}&license_key=${process.env.MAXMIND_API_KEY}&suffix=tar.gz.sha256`;

  return new Promise((resolve, reject) => {
    https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }

      const file = createWriteStream(checksumDestination);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    })
      .on('error', error => {
        reject(new Error(`Failed to download MaxMind ${editionId} DB checksum: ${error.message}`));
      });
  });
};

const verifyChecksum = async (fileLocation: string, checksumLocation: string): Promise<void> => {
  const [expectedChecksum] = (await fs.readFile(checksumLocation, 'utf8')).trim().split(' ');
  const hash = crypto.createHash('sha256');
  const data = await fs.readFile(fileLocation);
  hash.update(data);

  if (hash.digest('hex') !== expectedChecksum) {
    throw new Error('Checksum verification failed.');
  }
  console.log("Checksum verified", fileLocation)
};

const downloadMaxMindDB = async (editionId: string, destination: string): Promise<void> => {
  await ensureDirectoryExists(path.dirname(destination));

  const url = `https://download.maxmind.com/app/geoip_download?edition_id=${editionId}&license_key=${process.env.MAXMIND_API_KEY}&suffix=tar.gz`;

  return new Promise((resolve, reject) => {
    const file = createWriteStream(destination);
    https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    })
      .on('error', async error => {
        await deletePath(destination);
        reject(new Error(`Failed to download MaxMind ${editionId} DB: ${error.message}`));
      });
  });
};

const untarFile = async (source: string, destination: string): Promise<void> => {
  await ensureDirectoryExists(destination);
  await tar.x({ file: source, cwd: destination });
};

const copyMMDBFiles = async (sourceFolder: string, destinationFile: string, dbName: string): Promise<void> => {
  const dirs = await fs.readdir(sourceFolder, { withFileTypes: true });
  for (const dirent of dirs) {
    if (dirent.isDirectory()) {
      const nestedDirPath = path.join(sourceFolder, dirent.name);
      const files = await fs.readdir(nestedDirPath, { withFileTypes: true });
      for (const file of files) {
        if (file.isFile() && file.name.endsWith('.mmdb')) {
          const mmdbFilePath = path.join(nestedDirPath, file.name);
          await fs.copyFile(mmdbFilePath, destinationFile);
          await deletePath(mmdbFilePath);
          return;
        }
      }
    }
  }
  throw new Error(`No ${dbName} MMDB file found in the source folder.`);
};

// Example usage
const baseDir = 'lib/data';
const downloadLocation = path.join(baseDir, 'GeoLite2.tar.gz');
const untarLocation = path.join(baseDir, 'tmp');
const finalCityDestination = path.join(baseDir, 'city.mmdb');
const finalAsnDestination = path.join(baseDir, 'asn.mmdb');

const processDB = async (editionId: string, finalDestination: string) => {
  await deletePath(downloadLocation);
  await deletePath(finalDestination);

  await downloadMaxMindDB(editionId, downloadLocation);

  const checksumLocation = path.join(baseDir, `${editionId.split('-')[1]}.sha256`);
  await downloadChecksum(editionId, checksumLocation);
  await verifyChecksum(downloadLocation, checksumLocation);


  await untarFile(downloadLocation, untarLocation);
  await copyMMDBFiles(untarLocation, finalDestination, editionId.split('-')[1]);

  await deletePath(downloadLocation);
  await deletePath(untarLocation);
  await deletePath(checksumLocation);
};

try {
  await processDB('GeoLite2-City', finalCityDestination);
  await processDB('GeoLite2-ASN', finalAsnDestination);
  console.log('Files were copied to destination');
} catch (error: any) {
  console.error(`An error occurred: ${error.message}`);
}