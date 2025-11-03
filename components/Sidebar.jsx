"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Compass, Crown, Plus, BookOpen, LogOut } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const navItems = [
	{ href: "/dashboard", label: "Home", icon: Home },
	{ href: "/explore", label: "Explore", icon: Compass },
	{ href: "/upgrade", label: "Upgrade", icon: Crown },
];

export default function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="fixed left-0 top-0 z-40 h-full w-64 border-r border-white/20 bg-white/70 backdrop-blur-xl shadow-xl dark:bg-neutral-900/60 dark:border-white/10">
			<div className="flex h-full flex-col">
				{/* Brand */}
				<div className="border-b border-white/20 p-6 dark:border-white/10">
					<Link href="/" className="flex items-center space-x-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 shadow-md">
							<BookOpen className="h-6 w-6 text-white" />
						</div>
						<h1 className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-2xl font-bold text-transparent">
							MindCourse
						</h1>
					</Link>
				</div>

				{/* Nav */}
				<nav className="flex-1 p-4">
					<ul className="space-y-1">
						{navItems.map(({ href, label, icon: Icon }) => {
							const active = pathname === href || pathname?.startsWith(href + "/");
							return (
								<li key={href}>
									<Link
										href={href}
										className={cn(
											"group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
											"hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-violet-950/40 dark:hover:text-violet-300",
											active
												? "bg-purple-100 text-purple-800 shadow-sm dark:bg-violet-900/40 dark:text-violet-100"
												: "text-neutral-700 dark:text-neutral-300"
										)}
									>
										<Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
										<span>{label}</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>

				{/* CTA & User */}
				<div className="border-t border-white/20 p-4 dark:border-white/10">
					<Link
						href="/create-course"
						className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02] hover:shadow-lg"
					>
						<Plus className="h-4 w-4" />
						<span>Create AI Course</span>
					</Link>
					<div className="mt-4 flex items-center justify-between rounded-xl border border-white/20 bg-white/50 p-3 dark:bg-neutral-900/60">
						<UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
						<LogOut className="h-4 w-4 text-neutral-500" />
					</div>
				</div>
			</div>
		</aside>
	);
}













