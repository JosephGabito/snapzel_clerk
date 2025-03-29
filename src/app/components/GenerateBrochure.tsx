"use client";

import { useState, useEffect } from "react";
import { Paperclip, LoaderCircle, CheckCircle } from "lucide-react";

export default function GenerateBrochure() {
    const [url, setUrl] = useState("");
    const [taskId, setTaskId] = useState("");
    const [status, setStatus] = useState("");
    const [result, setResult] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTaskId("");
        setStatus("Submitting...");
        setResult("");

        const res = await fetch("https://your-fastapi-api.com/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
        });

        const data = await res.json();
        setTaskId(data.task_id);
        setStatus("Pending...");
    };

    useEffect(() => {
        if (!taskId) return;

        const interval = setInterval(async () => {
            const res = await fetch(`https://your-fastapi-api.com/status/${taskId}`);
            const data = await res.json();

            setStatus(data.state);
            if (data.state === "SUCCESS") {
                setResult(data.result);
                clearInterval(interval);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [taskId]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-100 px-4">
            <div className="w-full max-w-md bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-2 text-xl font-semibold text-zinc-900">
                    <Paperclip className="w-5 h-5" />
                    Snapzel Brochure Generator
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">
                            Enter a URL:
                        </label>
                        <input
                            type="url"
                            required
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-zinc-800 transition"
                    >
                        Generate Brochure
                    </button>
                </form>

                {taskId && (
                    <div className="mt-4 text-sm text-zinc-800 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Status:</span>
                            {status === "SUCCESS" ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : status.includes("Pending") || status === "Submitting..." ? (
                                <LoaderCircle className="w-4 h-4 animate-spin text-zinc-500" />
                            ) : null}
                            <span>{status}</span>
                        </div>

                        {result && (
                            <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm">
                                {result}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
