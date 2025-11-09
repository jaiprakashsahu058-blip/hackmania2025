'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Zap, Play, Layers, Gauge, MoreVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import ExportMenu from './ExportMenu';

export default function CourseCard({ course, onDelete }) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const menuRef = useRef(null);
	
	const created = course.createdAt ? new Date(course.createdAt).toLocaleDateString() : '';
	const chapterCount = course.chapterCount ?? (course.chapters ? course.chapters.length : 0);
	const difficulty = course.difficulty || 'Beginner';

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setShowMenu(false);
			}
		};

		if (showMenu) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showMenu]);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			const response = await fetch(`/api/courses/${course.id}`, {
				method: 'DELETE',
			});
			
			if (response.ok) {
				onDelete?.(course.id);
				setShowDeleteDialog(false);
			} else {
				console.error('Failed to delete course');
			}
		} catch (error) {
			console.error('Error deleting course:', error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.25, ease: 'easeOut' }} className="group relative">
			<Card className="overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-neutral-900/70">
				{/* Menu Button */}
				<div className="absolute top-3 right-3 z-10">
					<div className="relative" ref={menuRef}>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0 bg-white/90 hover:bg-white dark:bg-neutral-800/90 dark:hover:bg-neutral-800 shadow-sm"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								setShowMenu(!showMenu);
							}}
						>
							<MoreVertical className="h-4 w-4" />
						</Button>
						
						{/* Dropdown Menu */}
						{showMenu && (
							<motion.div
								initial={{ opacity: 0, scale: 0.95, y: -10 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: -10 }}
								className="absolute right-0 top-10 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-20"
							>
								<div className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-700">
									<div className="flex items-center justify-between">
										<span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Export</span>
										<ExportMenu courseData={course} size="sm" />
									</div>
								</div>
								<button
									className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										setShowMenu(false);
										setShowDeleteDialog(true);
									}}
								>
									<Trash2 className="h-4 w-4" />
									Delete Course
								</button>
							</motion.div>
						)}
					</div>
				</div>

				<Link href={`/course/${course.id}`}>
					<div className="relative h-40 overflow-hidden">
						{/* Display course thumbnail (SVG data URI) */}
						{course.thumbnail ? (
							<img 
								src={course.thumbnail} 
								alt={course.category || 'Course'} 
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600 to-violet-600">
								<div className="text-center text-white">
									<BookOpen className="mx-auto mb-2 h-12 w-12 opacity-90" />
									<p className="text-base font-semibold">{course.category || 'Course'}</p>
								</div>
							</div>
						)}
						<div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
							<div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-md">
								<Play className="ml-0.5 h-7 w-7 text-neutral-800" />
							</div>
						</div>
					</div>
					<CardContent className="p-5">
						<h3 className="mb-2 line-clamp-2 text-xl font-bold text-neutral-900 transition-colors group-hover:text-purple-600 dark:text-neutral-100">
							{course.title}
						</h3>
						<p className="mb-4 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
							{course.description || 'No description available'}
						</p>
						<div className="mb-4 grid grid-cols-2 gap-3">
							<div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
								<Layers className="h-4 w-4" />
								<span>{chapterCount} chapters</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
								<Clock className="h-4 w-4" />
								<span>Created {created}</span>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-violet-900/40 dark:text-violet-200">
								{difficulty}
							</span>
							<div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
								<Zap className="h-4 w-4" />
								<span>View Course</span>
							</div>
						</div>
					</CardContent>
					<div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 transition-all duration-300 group-hover:from-purple-500/10 group-hover:via-purple-500/5 group-hover:to-purple-500/10" />
				</Link>
			</Card>

			{/* Delete Confirmation Dialog */}
			<DeleteConfirmationDialog
				isOpen={showDeleteDialog}
				onClose={() => setShowDeleteDialog(false)}
				onConfirm={handleDelete}
				courseTitle={course.title}
				isLoading={isDeleting}
			/>
		</motion.div>
	);
}
