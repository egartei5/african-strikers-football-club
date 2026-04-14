import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { motion } from "motion/react";

export function NotFound() {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-[#050505] px-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center gap-8"
            >
                <Logo className="w-24 h-24 drop-shadow-2xl opacity-40" />

                <h1 className="font-display text-8xl md:text-9xl text-white uppercase tracking-tight">
                    4<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">0</span>4
                </h1>

                <p className="text-slate-400 text-xl max-w-md leading-relaxed">
                    Looks like this page got a red card. It doesn't exist or has been moved.
                </p>

                <Link
                    to="/"
                    className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-display text-xl uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-teal-600/20 hover:shadow-teal-500/40 hover:-translate-y-1"
                >
                    Back to Home
                </Link>
            </motion.div>
        </div>
    );
}
