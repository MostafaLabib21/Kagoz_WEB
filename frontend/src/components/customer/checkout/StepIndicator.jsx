import React from 'react';
import { CheckCircle } from 'lucide-react';

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center mb-8 px-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <React.Fragment key={step}>
            {/* Connector Line */}
            {index > 0 && (
              <div
                className={`w-16 md:w-24 h-0.5 mx-2 mb-6 ${
                  index <= currentStep ? 'bg-gray-900' : 'bg-gray-200'
                }`}
              />
            )}

            {/* Step Circle & Label */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isCompleted || isActive
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isActive ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
