import React, { useState } from 'react'

import './styles.css'

interface Step {
  title: string
  description: string
  status: string
}

interface StepsProps {
  steps: Step[]
}

const Steps: React.FC<StepsProps> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = (step: Step, index: number) => {
    const isCurrentStep = index === currentStep
    const isDisabled = index > currentStep

    return (
      <div className={`step ${isCurrentStep ? 'active' : ''}`} key={index}>
        <h3 className="step-title">{step.title}</h3>
        <p className="step-description">{step.description}</p>
        <span className="step-status">{step.status}</span>
        {isCurrentStep && <div className="step-indicator" />}
      </div>
    )
  }

  return (
    <div className="flex flex-row gap-4">
      {steps.map(renderStep)}
      <div className="flex justify-end">
        <button
          className={`btn btn-primary ${
            currentStep === steps.length - 1 ? 'disabled' : ''
          }`}
          onClick={handleNextStep}
        >
          Next
        </button>
        <button
          className={`btn btn-secondary ${currentStep === 0 ? 'disabled' : ''}`}
          onClick={handlePreviousStep}
        >
          Previous
        </button>
      </div>
    </div>
  )
}

export default Steps
