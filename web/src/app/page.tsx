import latitudeLogo from '@/lib/assets/images/latitudeLogo.svg';
import localFont from 'next/font/local';
import Image from "next/image";
import Link from "next/link";
import GlobeWrapper from './GlobeWrapper';
import styles from './page.module.css';

const nexaBold = localFont({
  src: '../lib/assets/fonts/Nexa-Heavy.ttf',
  display: 'swap',
});

export default function Home() {
  return (
    <div className="hero">
      <div className="hero-content h-screen text-center">
        <div className="globeView fixed left-0 top-0 w-full h-full-screen overflow-y-hidden -z-10">
          <GlobeWrapper />
        </div>
        <div className="max-w-md flex flex-col -mt-10 items-center text-neutral-content justify-start mx-auto relative">
          <h1 className={`text-4xl ${nexaBold.className}`}>
            <span className={`${styles.solText} animate-pulse`}>
              sol
            </span>
            .RPCTest.com
          </h1>
          <p className="mt-2 text-xl">Can your <span className="font-bold animate-pulse from-current to-orange-600">Solana</span> RPC provider hack it?</p>
          <p className="mt-4 text-lg">You are already on the fastest blockchain in the world, why would you use the slowest RPC provider?</p>
          <div className="mt-6">
            <Link href={'/new'} className={`btn btn-primary mr-4 ${nexaBold.className}`}>Start Test</Link>
          </div>
          <div className="mt-6 text-md flex flex-col">
            <span className="text-bold">
              Proudly sponsored by:
            </span>
            <Link className="pt-2" href="https://latitude.sh">
              <Image src={latitudeLogo} alt="Latitude Logo" width={200} height={200} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}