
interface TracePath {
  points: any[];
  color: string;
  size: number;
  name: string;
}

export default function buildPaths(traces: any[]): TracePath[] {
  if (!traces) return [];

  let paths = []
  let colors = generatePalette('#14F195', '#9945FF', traces.length);
  for (const trace of traces) {
    let path = []
    let dstRtt = 0;
    let maxRtt = 0;

    if (!trace.hops) {
      // @ts-ignore
      console.log("Non iterable hops:", trace);
      trace.hops = trace.trace;
      continue;
    }

    for (const hop of trace.hops) {
      if (hop.geo?.location) {

        dstRtt = hop.rtt1;

        if (hop.rtt1 > maxRtt) {
          maxRtt = hop.rtt1;
        }

        path.push({
          lat: hop.geo.location.latitude,
          lng: hop.geo.location.longitude,
        });
      }
    }

    let strokeSize = 2;

    if (dstRtt > 10) {
      strokeSize = 4;
    }

    paths.push({
      points: path,
      color: colors.shift() || 'blue',
      size: strokeSize,
      dstRtt,
      maxRtt,
      name: `${trace.provider.name} from ${trace.location}`
    });
  }
  return paths;
}

function hexToRGB(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
}

function RGBToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function RGBToHSL(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = 0;
    s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function HSLToRGB(h: number, s: number, l: number) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function generatePalette(color1: string, color2: string, steps: number) {
  const [r1, g1, b1] = hexToRGB(color1);
  const [r2, g2, b2] = hexToRGB(color2);
  const [h1, s1, l1] = RGBToHSL(r1, g1, b1);
  const [h2, s2, l2] = RGBToHSL(r2, g2, b2);
  const palette = [];

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const h = h1 + (h2 - h1) * t;
    const s = s1 + (s2 - s1) * t;
    const l = l1 + (l2 - l1) * t;
    const [r, g, b] = HSLToRGB(h / 360, s / 100, l / 100);
    palette.push(RGBToHex(r, g, b));
  }

  return palette;
}
