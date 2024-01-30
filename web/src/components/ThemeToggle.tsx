'use client'

import { useTheme } from '@/app/ThemeContext';
import { BsSun } from 'react-icons/bs';
import { MdDarkMode } from 'react-icons/md';
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme(); // Access theme and toggle function

  return (
    <div className="flex flex-row gap-2">
      <label className="swap swap-flip text-2xl">
        <input type="checkbox" onChange={toggleTheme} />
        <div className="swap-on"><BsSun /></div>
        <div className="swap-off"><MdDarkMode /></div>
      </label>
    </div>
  );
}
