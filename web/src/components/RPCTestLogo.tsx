'use client'

import { Chord, Ribbon } from '@visx/chord';
import { LinearGradient } from '@visx/gradient';
import { Group } from '@visx/group';
import { scaleOrdinal } from '@visx/scale';
import { Arc } from '@visx/shape';
import { useEffect, useState } from 'react';

const pink = '#45FF99';
const orange = '#FF9945';
const purple = '#9945FF';
const purple2 = '#7324ff';
const red = '#F11470';
const green = '#14F195';
const blue = '#04a6ff';
const lime = '#ABFF45';
const bg = 'rgba(0,0,0,0)';

const initialDataMatrix = [
  [2, 28, 18],
  [10, 8, 9],
  [2, 2, 23],
]; // Thank you Greg!

function descending(a: number, b: number): number {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

const color = scaleOrdinal<number, string>({
  domain: [0, 1, 2, 3],
  range: ['url(#solana)', 'url(#gpurplered)', 'url(#gpurplegreen)', 'url(#gbluelime)'],
});

export type ChordProps = {
  width: number;
  height: number;
  centerSize?: number;
  events?: boolean;
  updateFrequency?: number;
  transitionSpeed?: number;
  className?: string;
  rotateRing?: boolean;
};

export default function RPCTestLogo({ width, height, centerSize = 4, events = false, updateFrequency = 1000, className = '', rotateRing = false, transitionSpeed = 3500 }: ChordProps) {

  const [dataMatrix, setDataMatrix] = useState(initialDataMatrix);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const sineValue = Math.cos(time); // get the cosine value based on time
      const newMatrix = dataMatrix.map((row, rowIdx) => {
        return row.map((value, valueIdx) => {
          if (valueIdx === rowIdx) return value;

          // Use modulo to wrap around the matrix size
          const wrappedIndex = (valueIdx + 1) % dataMatrix.length;
          const compareValue = dataMatrix[wrappedIndex][rowIdx];

          if (value > compareValue) {
            return (value + sineValue);
          } else if (value < compareValue) {
            return (value - sineValue);
          } else {
            return Math.pow(value, 2) / 100 + 1;
          }
        });
      });

      setDataMatrix(newMatrix);
      setTime(time + updateFrequency); // increment the time with each interval
    }, updateFrequency);

    return () => clearInterval(timer);
  }, [dataMatrix, updateFrequency, time]);

  const outerRadius = Math.min(width, height) * 0.5 - (centerSize + 10);
  const innerRadius = outerRadius - centerSize;

  return width < 10 ? null : (
    <svg width={width} height={height} className={`overflow-clip bg-clip-content ${className}`}>
      <LinearGradient id="solana" from={purple} to={green} vertical={false} />
      <LinearGradient id="gpurplered" from={pink} to={orange} vertical={true} />
      <LinearGradient id="gpurplegreen" from={purple2} to={green} vertical={false} />
      <LinearGradient id="gbluelime" from={blue} to={lime} vertical={false} />
      <Group top={height / 2} left={width / 2}>
        <Chord matrix={dataMatrix} padAngle={0.05} sortSubgroups={descending}>
          {({ chords }) => (
            <g>
              {chords.groups.map((group, i) => (
                <Arc
                  key={`key-${i}`}
                  data={group}
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  fill={color(i)}
                  className={`${rotateRing ? 'animate-spin' : ''}`}
                />
              ))}
              {chords.map((chord, i) => (
                <Ribbon
                  key={`ribbon-${i}`}
                  chord={chord}
                  radius={innerRadius}
                  fill={color(chord.target.index)}
                  fillOpacity={0.75}
                  className={`transition-all shadow-2xl duration-1000 ease-linear`}
                />
              ))}
            </g>
          )}
        </Chord>
      </Group>
    </svg>
  );
}
