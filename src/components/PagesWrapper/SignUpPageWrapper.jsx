"use client";

import { SignUp, useSignUp } from '@clerk/nextjs';
import React from 'react';
import { motion } from 'framer-motion';
import AuthPromo from '@/components/AuthPromo';

const SignUpPageWrapper = () => {
    const { isLoaded } = useSignUp();
    return (
        <main className='min-h-screen relative overflow-hidden bg-white dark:bg-black'>
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)`,
                    backgroundSize: "20px 20px, 30px 30px, 25px 25px",
                    backgroundPosition: "0 0, 10px 10px, 15px 5px",
                }}
            />
            
            <svg className="absolute w-0 h-0">
                <defs>
                    <clipPath id="shatterClip" clipPathUnits="objectBoundingBox">
                        <path d="M 0 0 L 0.93 0 C 0.94 0.1, 0.9 0.15, 0.95 0.2 C 0.92 0.28, 0.97 0.35, 0.93 0.4 C 0.96 0.48, 0.92 0.53, 0.98 0.6 C 0.94 0.68, 0.99 0.75, 0.92 0.8 C 0.97 0.88, 0.93 0.95, 1 1 L 0 1 Z" />
                    </clipPath>
                </defs>
            </svg>

            <div className='flex min-h-screen'>
                <AuthPromo pageType="sign-up" />

                <div className='w-full lg:w-1/2 lg:ml-[50%] flex flex-col h-full min-h-screen overflow-y-auto'>
                    <div className="flex-1 flex items-center justify-center p-6 md:p-8">
                        <div className="w-full max-w-sm xl:max-w-md mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="w-full"
                            >
                                {!isLoaded ? (
                                    <div className="flex items-center justify-center h-32">
                                        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <SignUp />
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default SignUpPageWrapper;