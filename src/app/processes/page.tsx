"use client"

import { useEffect, useRef, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import {
    CheckCircle,
    Clock,
    LoaderCircle,
    XCircle,
    MoreHorizontal,
    Trash2,
    SquareSlash
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

export default function ProcessesPage() {
    const [tasks, setTasks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [now, setNow] = useState<number>(Date.now())
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const { getToken } = useAuth()

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = await getToken({ template: "Snapzel" })
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/tasks`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
                const data = await res.json()
                setTasks(data.tasks || [])
            } catch (err) {
                console.error("Failed to fetch tasks", err)
            } finally {
                setLoading(false)
            }
        }

        fetchTasks()

        const interval = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpenMenu(null)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const getStatusBadge = (status: string) => {
        const baseClasses = "inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded border-1"
        switch (status) {
            case "done":
                return {
                    icon: <CheckCircle className="w-4 h-4" />,
                    className: `${baseClasses} text-green-600 bg-green-50 border-green-200`,
                }
            case "failed":
                return {
                    icon: <XCircle className="w-4 h-4" />,
                    className: `${baseClasses} text-red-600 bg-red-50 border-red-200`,
                }
            case "in-progress":
                return {
                    icon: <LoaderCircle className="w-4 h-4 animate-spin" />,
                    className: `${baseClasses} text-blue-600 bg-blue-50 border-blue-200`,
                }
            default:
                return {
                    icon: <Clock className="w-4 h-4" />,
                    className: `${baseClasses} text-yellow-600 bg-yellow-50 border-yellow-200`,
                }
        }
    }

    const formatTimeAgo = (timestamp: number, active: boolean) => {
        if (!active) return ""
        const diff = now - timestamp * 1000
        const seconds = Math.floor(diff / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)

        if (hours > 0) return `Started ${hours}h ${minutes % 60}m ago`
        if (minutes > 0) return `Started ${minutes}m ${seconds % 60}s ago`
        return `Started ${seconds}s ago`
    }

    const copyToClipboard = async (value: string) => {
        await navigator.clipboard.writeText(value)
        toast.success("Task ID copied to clipboard")
    }

    const handleAction = (action: string, taskId: string) => {
        toast.success(`${action} triggered for task ${taskId}`)
        setOpenMenu(null)
    }

    if (loading) return <p className="text-center text-gray-500 mt-10">Loading your tasks...</p>
    if (!tasks.length) return <p className="text-center text-gray-500 mt-10">No tasks yet.</p>

    return (
        <div style={{ width: "800px" }} className="mx-auto px-6 py-12">
            <div className="space-y-4">
                {tasks.map((task) => {
                    const showTimer = !["done", "failed"].includes(task.status)
                    const { icon, className: badgeClass } = getStatusBadge(task.status)

                    return (
                        <motion.div
                            key={task.task_id}
                            layout
                            transition={{ duration: 0.2 }}
                            className="w-full bg-white border border-gray-200 rounded shadow-sm p-6 transition relative"
                        >
                            {/* Top row: title + status + menu */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded bg-blue-400" />
                                    <div className="text-lg font-semibold text-gray-800">
                                        Brochure for{" "}
                                        <a
                                            href={task.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline text-slate-800 break-words"
                                        >
                                            {task.url}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-2 md:mt-0">
                                    <div className={badgeClass}>
                                        {icon}
                                        {task.status}
                                    </div>

                                    <div ref={dropdownRef} className="relative">
                                        <button
                                            onClick={() =>
                                                setOpenMenu(openMenu === task._id ? null : task._id)
                                            }
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>

                                        <AnimatePresence>
                                            {openMenu === task._id && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -5 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute right-0 top-8 w-40 bg-white border border-gray-200 shadow-lg rounded-md z-50 overflow-hidden"
                                                >
                                                    {task.status === "in-progress" && (
                                                        <button
                                                            onClick={() => handleAction("Cancel", task._id)}
                                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                        >
                                                            <SquareSlash className="w-4 h-4" /> Cancel
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleAction("Delete", task._id)}
                                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Delete
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            {/* Metadata row */}
                            <div className="mt-4 text-sm text-gray-500 flex flex-wrap gap-x-6 gap-y-2">
                                <div className="flex" style={{ width: "100%", justifyContent: "space-between" }}>

                                    <div className="flex items-center gap-1">
                                        <span className="font-medium text-gray-600">Task ID:</span>
                                        <button
                                            onClick={() => copyToClipboard(task.task_id)}
                                            className="text-slate-600 hover:underline truncate"
                                        >
                                            {task.task_id}
                                        </button>
                                    </div>
                                    <div>
                                        {showTimer && <div>{formatTimeAgo(task.date_added, showTimer)}</div>}
                                    </div>

                                </div>

                            </div>

                            {/* Separator */}
                            <div className="border-t border-gray-100 my-4" />

                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-3">
                                {["View PDF", "Open JSON", "Generate Again"].map((label) => (
                                    <button
                                        key={label}
                                        className="px-3 py-1 text-sm rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-sm transition"
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
