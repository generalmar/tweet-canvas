import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StepIndicator } from '@/components/wizard/StepIndicator';
import { Step1CreationMethod } from '@/components/wizard/Step1CreationMethod';
import { Step2CampaignConfig } from '@/components/wizard/Step2CampaignConfig';
import { Step3Review } from '@/components/wizard/Step3Review';
import { WizardState, defaultWizardState } from '@/types/wizard';
import { generateMockColumns } from '@/data/mockTweets';

const steps = ['Create Content', 'Campaign Settings', 'Review & Generate'];

const CreateTweet = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardState, setWizardState] = useState<WizardState>(defaultWizardState);

  const handleUpdateState = (updates: Partial<WizardState>) => {
    setWizardState(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleGenerate = () => {
    // This would normally trigger the actual generation
    // For now, it navigates to the schedule page via Step3Review
    console.log('Generating tweets with state:', wizardState);
  };

  return (
    <DashboardLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Create Tweet Campaign</h1>
            <p className="text-muted-foreground mt-1">Set up your content strategy in a few simple steps</p>
          </div>

          {/* Step Indicator */}
          <StepIndicator 
            currentStep={currentStep} 
            totalSteps={3} 
            steps={steps} 
          />

          {/* Step Content */}
          <div className="mt-8">
            {currentStep === 1 && (
              <Step1CreationMethod
                state={wizardState}
                onUpdate={handleUpdateState}
                onNext={handleNext}
              />
            )}
            {currentStep === 2 && (
              <Step2CampaignConfig
                state={wizardState}
                onUpdate={handleUpdateState}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <Step3Review
                state={wizardState}
                onBack={handleBack}
                onGenerate={handleGenerate}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTweet;
