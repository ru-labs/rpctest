export default async function getEndpointDetails(endpoint: string) {
  return {
    dns: await resolveDns(endpoint),
  }
}

async function resolveDns(endpoint: string) {
  const url = new URL(endpoint);
  const hostname = url.hostname;

  const response = await fetch(`https://dns.google/resolve?name=${hostname}&type=A`);
  const data = await response.json();

  const ip = data.Answer.slice(-1)[0].data;

  try {
    const result = {
      ip,
      answer: data.Answer,
      authority: data.Comment.split("Response from")[1].slice(0, -1)
    }
    return result;
  } catch (e) {
    console.error(e);
    return {
      ip,
      answer: data.Answer,
      authority: data.Comment
    }
  }
}