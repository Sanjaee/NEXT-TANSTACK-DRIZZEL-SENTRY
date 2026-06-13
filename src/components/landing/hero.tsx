"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Database, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-black">
      {/* Background Gradients */}
      <div className="absolute inset-0 w-full h-full bg-white dark:bg-black z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob dark:bg-purple-900/40 dark:mix-blend-screen" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 dark:bg-yellow-900/40 dark:mix-blend-screen" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 dark:bg-pink-900/40 dark:mix-blend-screen" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0" />

      <main className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center justify-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="mb-6 flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            Tanstak v1.0 is live
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6"
          >
            Manage Your Data <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              With Elegance
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10"
          >
            Experience the next generation of data management. Built with Next.js, 
            Neon Database, and powered by intelligent features.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-20">
            <Link 
              href="/dashboard"
              className={buttonVariants({ size: "lg", className: "rounded-full px-8 h-12 text-base font-semibold transition-all hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.4)]" })}
            >
              Enter Dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link 
              href="https://github.com/zacode-id" 
              target="_blank"
              className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-full px-8 h-12 text-base font-semibold transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800" })}
            >
              View Source
            </Link>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl"
          >
            <motion.div variants={itemVariants} className="flex flex-col items-center p-6 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2 dark:text-white">Lightning Fast</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Powered by Turbopack and server components for instant load times.</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col items-center p-6 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 rounded-xl flex items-center justify-center mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2 dark:text-white">Serverless DB</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Connected to Neon Postgres for infinite scalability and performance.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col items-center p-6 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2 dark:text-white">Secure Auth</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Protected by NextAuth with robust session and token management.</p>
            </motion.div>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}
