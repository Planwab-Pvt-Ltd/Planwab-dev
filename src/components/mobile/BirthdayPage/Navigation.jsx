'use client';

import { usePathname } from 'next/navigation';

export default function Navigation({ currentStep }) {

    const steps = [
        { id: 1, step: 'home' },
        { id: 2, step: 'hotels' },
        { id: 3, step: 'booking' },
        { id: 4, step: 'confirmation' },
    ];

    const currentStepIndex = steps.findIndex(step => step.step === currentStep);

    return (
        <nav className="absolute top-4 left-20 right-20 z-50 bg-white/5 backdrop-blur-xl border border-white/20 rounded-full shadow-lg shadow-black/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-center py-2">
                    <div className="flex items-center space-x-4">
                        {steps.map((step, index) => {
                            const isCompleted = index < currentStepIndex;
                            const isCurrent = index === currentStepIndex;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isCompleted
                                            ? 'bg-green-500 text-white'
                                            : isCurrent
                                                ? 'bg-pink-500 text-white ring-2 ring-pink-400'
                                                : 'bg-white/30 text-white/60'
                                            }`}
                                    >
                                        {step.id}
                                    </div>

                                    {index < steps.length - 1 && (
                                        <div className={`w-6 h-0.5 mx-1 transition-colors ${isCompleted ? 'bg-green-500' : 'bg-white/20'
                                            }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
