'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { Plus, BookOpen, Zap, Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AuthGuard from '@/components/AuthGuard';
import CourseCard from '@/components/CourseCard';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';

export default function Dashboard() {
	const { user } = useUser();
	const [courses, setCourses] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchCourses();
	}, []);

	const fetchCourses = async () => {
		try {
			const response = await fetch('/api/courses');
			if (response.ok) {
				const data = await response.json();
				setCourses(data.courses || []);
			}
		} catch (error) {
			console.error('Error fetching courses:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCourseDelete = (deletedCourseId) => {
		setCourses(prevCourses => prevCourses.filter(course => course.id !== deletedCourseId));
	};

	const getCategoryStats = () => {
		const stats = {};
		courses.forEach(course => {
			stats[course.category] = (stats[course.category] || 0) + 1;
		});
		return stats;
	};

	const categoryStats = getCategoryStats();

	return (
		<AuthGuard>
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
			{/* Holographic Background Effects */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-blue-500/20"></div>
			<div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_purple-500/10_60deg,_transparent_120deg,_blue-500/10_180deg,_transparent_240deg,_purple-500/10_300deg,_transparent_360deg)] animate-spin [animation-duration:20s]"></div>
				
				<Sidebar />

				{/* Main Content */}
				<div className="ml-64 min-h-screen relative z-10">
					<div className="p-8">
						{/* Enhanced Header Section */}
						<motion.div 
							className="flex flex-col gap-4 justify-between md:flex-row md:items-start mb-8"
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<div className="bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.2 }}
								>
									<h1 className="text-5xl font-bold text-white mb-4">
										Hello, <motion.span 
														className="bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent"
											animate={{ 
												backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
											}}
											transition={{ duration: 3, repeat: Infinity }}
										>{user?.firstName || 'Creator'}</motion.span> 
										<motion.span
											animate={{ 
												rotate: [0, 20, -20, 0],
												scale: [1, 1.2, 1]
											}}
											transition={{ duration: 2, repeat: Infinity }}
										>👋</motion.span>
									</h1>
									<p className="text-white/70 text-xl max-w-2xl leading-relaxed">
										Create new courses with AI, share with friends, and grow your library.
									</p>
								</motion.div>
							</div>
							<motion.div
								initial={{ opacity: 0, x: 30 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.3 }}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Link href="/create-course">
									<Button 
										variant="purple" 
										size="lg" 
														className="flex items-center gap-3 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0"
									>
										<motion.div
											animate={{ rotate: [0, 360] }}
											transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
										>
											<Plus className="w-6 h-6" />
										</motion.div>
										<span>Create AI Course</span>
									</Button>
								</Link>
							</motion.div>
						</motion.div>

						{/* Enhanced Stats Cards */}
						<motion.div 
							className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							<motion.div 
												className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 shadow-2xl hover:shadow-purple-500/30 transition-all duration-500"
												initial={{ opacity: 0, scale: 0.9 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{ delay: 0.3 }}
												whileHover={{ y: -8, scale: 1.05 }}
											>
												<div className="flex items-center gap-4">
													<motion.div 
														className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-500/50"
														animate={{ 
														boxShadow: ['0 0 20px rgba(168,85,247,0.5)', '0 0 30px rgba(168,85,247,0.8)', '0 0 20px rgba(168,85,247,0.5)'],
														scale: [1, 1.1, 1]
													}}
													transition={{ duration: 2, repeat: Infinity }}
												>
														<BookOpen className="h-7 w-7 text-white" />
									</motion.div>
									<div>
										<p className="text-3xl font-bold text-white">{courses.length}</p>
										<p className="text-sm text-white/70">Total Courses</p>
									</div>
								</div>
							</motion.div>

							<motion.div 
												className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500"
												initial={{ opacity: 0, scale: 0.9 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{ delay: 0.4 }}
												whileHover={{ y: -8, scale: 1.05 }}
											>
												<div className="flex items-center gap-4">
													<motion.div 
														className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/50"
														animate={{ 
														boxShadow: ['0 0 20px rgba(59,130,246,0.5)', '0 0 30px rgba(59,130,246,0.8)', '0 0 20px rgba(59,130,246,0.5)'],
														scale: [1, 1.1, 1]
													}}
													transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
												>
														<Zap className="h-7 w-7 text-white" />
									</motion.div>
									<div>
										<p className="text-3xl font-bold text-white">
											{courses.reduce((total, course) => total + (course.chapterCount || 0), 0)}
										</p>
										<p className="text-sm text-white/70">Total Chapters</p>
									</div>
								</div>
							</motion.div>

							<motion.div 
												className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500"
												initial={{ opacity: 0, scale: 0.9 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{ delay: 0.5 }}
												whileHover={{ y: -8, scale: 1.05 }}
											>
												<div className="flex items-center gap-4">
													<motion.div 
														className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50"
														animate={{ 
														boxShadow: ['0 0 20px rgba(6,182,212,0.5)', '0 0 30px rgba(6,182,212,0.8)', '0 0 20px rgba(6,182,212,0.5)'],
														scale: [1, 1.1, 1]
													}}
													transition={{ duration: 2, repeat: Infinity, delay: 1 }}
												>
														<Sparkles className="h-7 w-7 text-white" />
									</motion.div>
									<div>
										<p className="text-3xl font-bold text-white">
											{Object.keys(categoryStats).length}
										</p>
										<p className="text-sm text-white/70">Categories</p>
									</div>
								</div>
							</motion.div>

							<motion.div 
												className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 shadow-2xl hover:shadow-purple-500/30 transition-all duration-500"
												initial={{ opacity: 0, scale: 0.9 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{ delay: 0.6 }}
												whileHover={{ y: -8, scale: 1.05 }}
											>
												<div className="flex items-center gap-4">
													<motion.div 
														className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/50"
														animate={{ 
														boxShadow: ['0 0 20px rgba(168,85,247,0.5)', '0 0 30px rgba(168,85,247,0.8)', '0 0 20px rgba(168,85,247,0.5)'],
														scale: [1, 1.1, 1]
													}}
													transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
												>
														<Crown className="h-7 w-7 text-white" />
									</motion.div>
									<div>
										<p className="text-3xl font-bold text-white">
											{courses.filter(c => c.includeVideos).length}
										</p>
										<p className="text-sm text-white/70">With Videos</p>
									</div>
								</div>
							</motion.div>
						</motion.div>

						{/* Enhanced My AI Courses Section */}
						<motion.div 
							className="mb-8"
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							<div className="mb-6 flex items-center justify-between">
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.5 }}
								>
														<h2 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">My AI Courses</h2>
									<p className="text-white/70 mt-2">Your personalized learning library</p>
								</motion.div>
								<motion.div 
									className="text-sm text-white/60 bg-white/5 px-4 py-2 rounded-full border border-white/10"
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.6 }}
								>
									{courses.length} course{courses.length !== 1 ? 's' : ''} created
								</motion.div>
							</div>

							{isLoading ? (
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
									{[1, 2, 3].map((i) => (
										<motion.div 
											key={i} 
											className="h-80 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 animate-pulse"
											initial={{ opacity: 0, scale: 0.9 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: i * 0.1 }}
										/>
									))}
								</div>
							) : courses.length === 0 ? (
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
										<BookOpen className="h-12 w-12 text-white" />
									</motion.div>
									<h3 className="mb-2 text-2xl font-bold text-white">No courses yet</h3>
									<p className="mb-6 text-white/70">Create your first AI-powered course to get started!</p>
									<Link href="/create-course">
															<Button 
																variant="purple" 
																size="lg"
																className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
															>
											<Plus className="mr-2 h-5 w-5" />
											Create Your First Course
										</Button>
									</Link>
								</motion.div>
							) : (
								<motion.div 
									className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.6, delay: 0.7 }}
								>
									{courses.map((course, index) => (
										<motion.div
											key={course.id}
											initial={{ opacity: 0, y: 30 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.8 + index * 0.1 }}
											whileHover={{ y: -8, scale: 1.02 }}
										>
																<CourseCard 
																	course={course} 
																	onDelete={handleCourseDelete}
																	className="bg-black/20 backdrop-blur-xl border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20"
																/>
										</motion.div>
									))}
								</motion.div>
							)}
						</motion.div>
					</div>
				</div>
			</div>
		</AuthGuard>
	);
}
