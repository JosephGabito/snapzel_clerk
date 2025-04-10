'use client';

import { useAuth } from "@clerk/nextjs";

type Task = {
    task_id: string;
    status: string;
};

export default function TaskLinks({ task }: { task: Task }) {
    const { getToken } = useAuth();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (!API_URL) {
        console.error("Missing NEXT_PUBLIC_API_URL environment variable");
    }

    const downloadFile = async (endpoint: string, filename: string) => {
        try {
            const token = await getToken({ template: "Snapzel" });
            if (!token) throw new Error("Token not found");

            const res = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ task_id: task.task_id }),
            });

            if (!res.ok) {
                throw new Error("Failed to download file");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(`Download error [${endpoint}]:`, err);
        }
    };

    const handleDownloadReadme = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        downloadFile("/download-readme", `readme-${task.task_id}.md`);
    };

    const handleViewLanding = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        downloadFile("/download-landing-page", `landing-${task.task_id}.html`);
    };

    return (
        <div className="flex flex-wrap gap-3">
            {task.status === "done" && (
                <>
                    <button
                        onClick={handleDownloadReadme}
                        className="px-3 py-1 text-sm rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-sm transition"
                    >
                        README file
                    </button>
                    <button
                        onClick={handleViewLanding}
                        className="px-3 py-1 text-sm rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-sm transition"
                    >
                        View landing page
                    </button>
                </>
            )}
        </div>
    );
}
