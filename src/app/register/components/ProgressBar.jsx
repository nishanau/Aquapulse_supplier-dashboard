'use client'
import React from 'react';
import styles from '../register.module.css';

const ProgressBar = ({ currentStep, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className={styles.stepsContainer}>
        {steps.map((step) => (
          <div 
            key={step} 
            className={`${styles.step} ${currentStep >= step ? styles.activeStep : ''}`}
          >
            <div className={styles.stepNumber}>{step}</div>
            <div className={styles.stepLabel}>
              {step === 1 && 'Company Info'}
              {step === 2 && 'Account Security'}
              {step === 3 && 'Service Areas'}
              {step === 4 && 'Pricing Tiers'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
