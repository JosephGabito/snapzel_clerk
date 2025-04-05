'use client'

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import SnapForm from "./SnapForm";

export default function GenerateBrochure() {
    const [loading, setLoading] = useState(false);
    return (
        <main>
            <SignedOut>
                <div
                    className="relative w-full flex-1 overflow-hidden bg-black flex items-center justify-center"
                    style={{
                        height: "100vh",
                        backgroundImage: "url('/images/snapzel-bg.png')",
                        backgroundRepeat: "repeat",
                    }}
                >
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="relative z-10 flex items-center justify-center px-4"
                    >
                        <Card className="w-full max-w-md rounded-2xl text-center shadow-xl border border-zinc-800 bg-white/90 backdrop-blur-md">
                            <CardContent className="py-10 px-6 text-center space-y-4">
                                <div className="space-y-2">
                                    <div className="text-center">
                                        <p className="text-3xl font-semibold text-zinc-900 leading-snug">
                                            <span className="mr-1">🐤</span>
                                            Snapzel turns links into<br />
                                            stunning brochures —
                                        </p>
                                        <p className="mt-2 text-base text-zinc-500">
                                            just like that.
                                        </p>
                                    </div>
                                </div>

                                <SignInButton mode="modal">
                                    <Button
                                        onClick={() => {
                                            setLoading(true);
                                            setTimeout(() => setLoading(false), 1000);
                                        }}
                                        disabled={loading}
                                        className="relative mt-4 w-40 h-[30px] px-4 text-sm font-medium rounded-md border border-[#2f3037] shadow-[0_0_0_1px_#2f3037,0_1px_1px_rgba(255,255,255,0.07)_inset,0_2px_3px_rgba(34,42,53,0.2),0_1px_1px_rgba(0,0,0,0.24)] bg-zinc-900 text-white transition hover:brightness-110"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                                        ) : (
                                            <>
                                                Continue <span className="ml-1 text-zinc-400">→</span>
                                            </>
                                        )}
                                    </Button>
                                </SignInButton>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </SignedOut>

            <SignedIn>
                <SnapForm />
            </SignedIn>
        </main>
    );
}
