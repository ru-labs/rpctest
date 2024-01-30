export async function lookup(ip: string) {
  const response = await fetch(`https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_TOKEN}`);
  const json = await response.json();
  return json;
}