'use client'

import { SignedIn, useUser, useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx"; // Optional utility for cleaner class logic

export default function SnapForm() {
    const { user } = useUser();
    const { getToken } = useAuth();

    const [url, setUrl] = useState("https://");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Generating...')
        if (!url.trim()) return;

        try {
            setLoading(true);
            setFeedback("");

            const token = await getToken({ template: "Snapzel" });

            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/generate", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            });

            const json = await res.json();

            if (res.ok) {
                setFeedback(`✅ Task started! Task ID: ${json.task_id}`);
                setUrl("");
            } else {
                setFeedback(`❌ ${json.detail || "Failed to generate brochure"}`);
            }
        } catch (err) {
            console.error(err);
            setFeedback("❌ Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SignedIn>
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white px-4">
                <div className="max-w-md w-full">
                    <h1 className="text-2xl font-semibold text-center text-zinc-900 mb-2">
                        🎉 You’re signed in and ready to Snap 🐤
                    </h1>
                    <p className="text-center text-zinc-600 mb-6">
                        Welcome back, {user?.firstName || user?.username || "friend"}
                    </p>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="url"
                            placeholder="Paste a link to generate a brochure..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className={clsx(
                                "w-full px-4 py-3 rounded-xl border border-zinc-300 shadow-sm text-base text-zinc-900 placeholder:text-zinc-400 transition focus:outline-none focus:ring-2 focus:ring-black",
                                loading && "bg-zinc-100 animate-pulse cursor-not-allowed"
                            )}
                            required
                            disabled={loading}
                        />
                    </form>

                    {/* Feedback / Loading Spinner */}
                    <div className="mt-4 text-center">
                        {loading && (
                            <div className="flex justify-center items-center gap-2 text-sm text-zinc-500 animate-pulse">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating brochure...
                            </div>
                        )}
                        {!loading && feedback && (
                            <p className="text-sm text-zinc-700">{feedback}</p>
                        )}
                    </div>
                </div>
            </div>
        </SignedIn>
    );
}
