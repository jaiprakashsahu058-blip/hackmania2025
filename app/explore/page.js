'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Sparkles, BookOpen, Zap, Filter, TrendingUp, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/CourseCard';
import MobileNav from '@/components/MobileNav';
import Sidebar from '@/components/Sidebar';

export default function Explore() {
	const [query, setQuery] = useState('');
	const [filter, setFilter] = useState('all');
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showFilters, setShowFilters] = useState(false);

	useEffect(() => {
		fetchCourses();
	}, []);

	const fetchCourses = async () => {
		try {
			const res = await fetch('/api/courses');
			if (res.ok) {
				const data = await res.json();
				setCourses(data.courses || []);
			}
		} finally {
			setLoading(false);
		}
	};

	const filtered = courses.filter((c) => {
		const matchesQuery = !query || c.title?.toLowerCase().includes(query.toLowerCase());
		const matchesFilter = filter === 'all' || c.difficulty === filter;
		return matchesQuery && matchesFilter;
	});

	const getCategoryStats = () => {
		const stats = {};
		courses.forEach(course => {
			stats[course.category] = (stats[course.category] || 0) + 1;
		});
		return stats;
	};

	const categoryStats = getCategoryStats();

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
			{/* Holographic Background Effects */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-blue-500/20"></div>
			<div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_purple-500/10_60deg,_transparent_120deg,_blue-500/10_180deg,_transparent_240deg,_purple-500/10_300deg,_transparent_360deg)] animate-spin [animation-duration:20s]"></div>
			
			<Sidebar />
			<MobileNav />

			{/* Main Content */}
			<div className="ml-64 min-h-screen relative z-10">
				<div className="p-8">
					{/* Enhanced Header Section */}
					<motion.div 
						className="mb-8"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
							<div className="bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 shadow-2xl mb-8">
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.2 }}
							>
								<div className="flex items-center gap-4 mb-6">
														<motion.div 
															className="w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50"
															animate={{ 
															rotate: [0, 360],
															scale: [1, 1.05, 1]
														}}
															transition={{ 
															rotate: { duration: 10, repeat: Infinity, ease: "linear" },
															scale: { duration: 2, repeat: Infinity }
														}}
													>
										<Sparkles className="w-8 h-8 text-white" />
									</motion.div>
									<div>
															<h1 className="text-5xl font-bold text-white bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
											Explore Courses
										</h1>
										<p className="text-white/70 text-xl mt-2">
											Discover amazing AI-generated courses and expand your knowledge
										</p>
									</div>
								</div>
							</motion.div>
						</div>

						{/* Enhanced Search and Filter Section */}
							<motion.div 
												className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 shadow-2xl"
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
						>
							<div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
								{/* Search Bar */}
								<div className="relative flex-1 max-w-2xl">
									<Input 
										value={query} 
										onChange={(e) => setQuery(e.target.value)} 
										placeholder="Search courses by title, topic, or category..." 
															className="h-14 text-lg rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder:text-white/60 focus:border-purple-400/50 focus:ring-purple-400/20 pl-12 pr-4"
									/>
									<motion.div
										className="absolute left-4 top-1/2 -translate-y-1/2"
										animate={{ 
											scale: [1, 1.1, 1],
											rotate: [0, 5, -5, 0]
										}}
										transition={{ duration: 2, repeat: Infinity }}
									>
										<Search className="h-6 w-6 text-white/60" />
									</motion.div>
								</div>

								{/* Filter Button */}
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										onClick={() => setShowFilters(!showFilters)}
										className="h-14 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 flex items-center gap-3"
									>
										<motion.div
											animate={{ rotate: showFilters ? 180 : 0 }}
											transition={{ duration: 0.3 }}
										>
											<Filter className="h-5 w-5" />
										</motion.div>
										<span className="font-semibold">Advanced Filters</span>
									</Button>
								</motion.div>
							</div>

							{/* Advanced Filters Panel */}
							<AnimatePresence>
								{showFilters && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: 'auto' }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.3 }}
										className="mt-6 pt-6 border-t border-white/10"
									>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
											<div>
												<h3 className="text-white font-semibold mb-3 flex items-center gap-2">
													<TrendingUp className="h-4 w-4" />
													Popular Categories
												</h3>
												<div className="space-y-2">
													{Object.entries(categoryStats).slice(0, 3).map(([category, count]) => (
														<motion.div
															key={category}
															className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
															whileHover={{ x: 5 }}
														>
															<span className="text-white/80 capitalize">{category}</span>
															<span className="text-purple-300 font-semibold">{count}</span>
														</motion.div>
													))}
												</div>
											</div>
											<div>
												<h3 className="text-white font-semibold mb-3 flex items-center gap-2">
													<Star className="h-4 w-4" />
													Course Features
												</h3>
												<div className="space-y-2">
													<div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
														<span className="text-white/80">With Videos</span>
														<span className="text-blue-300 font-semibold">
															{courses.filter(c => c.includeVideos).length}
														</span>
													</div>
													<div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
														<span className="text-white/80">With Quizzes</span>
														<span className="text-green-300 font-semibold">
															{courses.filter(c => c.includeQuiz).length}
														</span>
													</div>
												</div>
											</div>
											<div>
												<h3 className="text-white font-semibold mb-3 flex items-center gap-2">
													<BookOpen className="h-4 w-4" />
													Quick Stats
												</h3>
												<div className="space-y-2">
													<div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
														<span className="text-white/80">Total Courses</span>
														<span className="text-purple-300 font-semibold">{courses.length}</span>
													</div>
													<div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
														<span className="text-white/80">Total Chapters</span>
														<span className="text-cyan-300 font-semibold">
															{courses.reduce((total, course) => total + (course.chapterCount || 0), 0)}
														</span>
													</div>
												</div>
											</div>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					</motion.div>

					{/* Enhanced Filter Tabs */}
					<motion.div 
						className="mb-8"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
					>
						<Tabs value={filter} onValueChange={setFilter} className="w-full">
							<div className="bg-black/20 backdrop-blur-xl rounded-2xl p-2 border border-purple-500/30 shadow-2xl">
								<TabsList className="grid w-full grid-cols-4 bg-transparent border-0">
									<TabsTrigger 
										value="all" 
										className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-xl transition-all duration-300 font-semibold"
									>
										All Courses
									</TabsTrigger>
									<TabsTrigger 
										value="Beginner" 
										className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-xl transition-all duration-300 font-semibold"
									>
										Beginner
									</TabsTrigger>
									<TabsTrigger 
										value="Intermediate" 
										className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-xl transition-all duration-300 font-semibold"
									>
										Intermediate
									</TabsTrigger>
									<TabsTrigger 
										value="Advanced" 
										className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl transition-all duration-300 font-semibold"
									>
										Advanced
									</TabsTrigger>
								</TabsList>
							</div>
							<TabsContent value="all" />
							<TabsContent value="Beginner" />
							<TabsContent value="Intermediate" />
							<TabsContent value="Advanced" />
						</Tabs>
					</motion.div>

					{/* Enhanced Course Grid */}
					<motion.div 
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
					>
						{loading ? (
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
								{[1,2,3,4,5,6].map((i) => (
									<motion.div 
										key={i} 
										className="h-80 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 animate-pulse"
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: i * 0.1 }}
									/>
								))}
							</div>
						) : filtered.length === 0 ? (
							<motion.div 
								className="py-16 text-center bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.8 }}
							>
								<motion.div 
									className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-500/50"
									animate={{ 
										rotate: [0, 360],
										scale: [1, 1.1, 1]
									}}
									transition={{ 
										rotate: { duration: 10, repeat: Infinity, ease: "linear" },
										scale: { duration: 2, repeat: Infinity }
									}}
								>
									<Search className="h-12 w-12 text-white" />
								</motion.div>
								<h3 className="mb-2 text-2xl font-bold text-white">No courses found</h3>
								<p className="mb-6 text-white/70">
									{query ? `No courses match "${query}"` : 'No courses available with the selected filters'}
								</p>
								{query && (
									<Button
										onClick={() => setQuery('')}
										className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
									>
										Clear Search
									</Button>
								)}
							</motion.div>
						) : (
							<motion.div 
								className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.6, delay: 0.7 }}
							>
								<AnimatePresence>
									{filtered.map((course, index) => (
										<motion.div
											key={course.id}
											initial={{ opacity: 0, y: 30 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -30 }}
											transition={{ delay: index * 0.1 }}
											whileHover={{ y: -8, scale: 1.02 }}
										>
											<CourseCard 
												course={course} 
												className="bg-black/20 backdrop-blur-xl border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20"
											/>
										</motion.div>
									))}
								</AnimatePresence>
							</motion.div>
						)}
					</motion.div>
				</div>
			</div>
		</div>
	);
}













