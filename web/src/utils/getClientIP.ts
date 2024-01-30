export default async function getClientIP() {
  const response = await fetch('https://api.ipify.org/?format=json');
  const json = await response.json();
  return json.ip;
}