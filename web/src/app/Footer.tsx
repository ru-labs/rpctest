import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer sticky bottom-0 items-center justify-items-center p-4 bg-base-300 text-base-content w-full">
      <aside className="flex flex-row items-center">
        <code className="text-xs text-center">
          v{process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "0.0.0-bleeding.0"}
        </code>
        <div className="animate-pulse">
          ⊙
        </div>
        <p className="text-xs hidden lg:block">Made with <span className="text-red-500 text-xs animate-pulse">❤️</span>
          {' '}by the{' '}
          <Link href="https://trustless.engineering">
            Trustless Engineering Project
          </Link>
        </p>
        <p className="text-xs lg:hidden"><span className="text-red-500 text-xs animate-pulse">❤️ </span><Link href="https://trustless.engineering">TEP {new Date().getFullYear()}</Link></p>
      </aside>
    </footer>
  )
}