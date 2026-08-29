export default function StepIndicator({ currentStep, totalSteps, stepLabels }) {
  return (
    <div className="flex flex-col gap-3 mb-8">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <>
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                i < currentStep
                  ? 'bg-primary-600 text-white'
                  : i === currentStep
                  ? 'bg-primary-100 text-primary-700 border-2 border-primary-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i < currentStep ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div key={`line-${i}`} className={`flex-1 h-0.5 ${i < currentStep ? 'bg-primary-600' : 'bg-gray-200'}`} />
            )}
          </>
        ))}
      </div>
      {stepLabels && (
        <p className="text-sm text-gray-500">
          Step {currentStep + 1} of {totalSteps}: <span className="font-medium text-gray-700">{stepLabels[currentStep]}</span>
        </p>
      )}
    </div>
  );
}
