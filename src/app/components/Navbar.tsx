"use client"

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import clsx from "clsx" // Optional: for cleaner class toggling

export default function NavBar() {
    const pathname = usePathname()

    return (
        <div className="relative bg-white border-b border-gray-200">
            <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-12">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-semibold text-gray-800">
                        Snapzel
                    </Link>

                    {/* Nav Links */}
                    <div className="space-x-6">
                        <Link
                            href="/"
                            className={clsx(
                                "font-medium",
                                pathname === "/" ? "text-black" : "text-gray-600 hover:text-black"
                            )}
                        >
                            Generate Brochure
                        </Link>
                        <Link
                            href="/processes"
                            className={clsx(
                                "font-medium",
                                pathname === "/processes"
                                    ? "text-black"
                                    : "text-gray-600 hover:text-black"
                            )}
                        >
                            My Brochures
                        </Link>
                    </div>
                </div>
            </nav>

            {/* User Avatar */}
            <div className="absolute right-4 top-3">
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    )
}
