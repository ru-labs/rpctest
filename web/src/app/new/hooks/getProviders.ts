

export default async function getProviders() {
  const data = await fetch('/api/provider')
  return await data.json()
}