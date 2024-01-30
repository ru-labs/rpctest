'use client'

import UserAvatar from "@/components/RPCTestLogo";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import styles from './page.module.css';

export default function TopMenu() {

  const handleClick = () => {
    const elem = document.getElementById("topMenu")?.getElementsByTagName('details').item(0)
    if (elem && elem.open) {
      elem.open = false;
    }
  }

  return (
    <div id="topMenu" className="navbar place-content-evenly z-10 bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <Link href={'/new'} onClick={handleClick}>
                Run Test
              </Link>
            </li>
            <li>
              <a>Stats</a>
              <ul className="p-2 pr-5 z-10">
                <li><Link href={'/stats/worldView'} onClick={handleClick}>World View</Link></li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="flex flex-row items-center">
          <UserAvatar width={65} height={65} className={'hidden md:inline'} />
          <Link href={'/'} className={`btn btn-ghost normal-case md:text-xl`} onClick={handleClick}>
            <span className="text-current-content">
              <span className={`${styles.solText} animate-pulse`}>
                sol
              </span>
              .RPCTest.com
            </span>
          </Link>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li><Link href={'/new'} onClick={handleClick}>Run Test</Link></li>
          <li tabIndex={0}>
            <details>
              <summary>Stats</summary>
              <ul>
                <li className="w-32"><Link href='/stats/worldView' onClick={handleClick}>World View</Link></li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
      <div className="navbar-end mr-3 lg:flex">
        <ThemeToggle />
      </div>
    </div>
  )
}