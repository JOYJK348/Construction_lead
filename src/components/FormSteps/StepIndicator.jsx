import React from 'react';

const StepIndicator = ({ steps, currentStep }) => {
    return (
        <div className="w-full">
            {/* Step Counter */}
            <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Progress
                </span>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-md">
                    Step {currentStep + 1} / {steps.length}
                </span>
            </div>

            {/* Progress Bar - Minimal Thick Style */}
            <div className="flex gap-1.5 h-1.5 px-0.5">
                {steps.map((_, index) => (
                    <div
                        key={index}
                        className="flex-1 bg-slate-100 rounded-full overflow-hidden"
                    >
                        <div
                            className={`h-full transition-all duration-500 ease-in-out ${index <= currentStep
                                    ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]'
                                    : 'bg-transparent'
                                }`}
                            style={{
                                width: index <= currentStep ? '100%' : '0%',
                                opacity: index === currentStep ? 1 : index < currentStep ? 0.6 : 0
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepIndicator;
