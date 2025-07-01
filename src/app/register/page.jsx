'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./register.module.css";
import Button from "@/components/button/Button";
import { colors } from "@/utils/colors";
import ProgressBar from './components/ProgressBar';
import Step1CompanyInfo from './components/Step1CompanyInfo';
import Step2AccountSecurity from './components/Step2AccountSecurity';
import Step3ServiceAreas from './components/Step3ServiceAreas';
import Step4PricingTiers from './components/Step4PricingTiers';
import { registerSupplier } from '@/utils/apiService';
import { useToast } from '@/provider/ToastProvider';
const Register = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postCode: '',
    password: '',
    confirmPassword: '',
    serviceAreas: [{ region: '', postalCodes: [] }],
    pricing: [{ minVolume: '', maxVolume: '', pricePerLiter: '' }]
  });
  
  const [errors, setErrors] = useState({});
  
  const validateStep = (step) => {
    let stepErrors = {};
    let isValid = true;
    
    switch(step) {
      case 1: // Company & Contact Info
        if (!formData.companyName?.trim()) {
          stepErrors.companyName = 'Company name is required';
          isValid = false;
        }
        
        if (!formData.email?.trim()) {
          stepErrors.email = 'Email is required';
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          stepErrors.email = 'Please enter a valid email address';
          isValid = false;
        }
        
        if (!formData.phone?.trim()) {
          stepErrors.phone = 'Phone number is required';
          isValid = false;
        }
        
        if (!formData.addressLine1?.trim()) {
          stepErrors.addressLine1 = 'Address line 1 is required';
          isValid = false;
        }
        
        if (!formData.city?.trim()) {
          stepErrors.city = 'City is required';
          isValid = false;
        }
        
        if (!formData.state?.trim()) {
          stepErrors.state = 'State is required';
          isValid = false;
        }
        
        if (!formData.postCode?.trim()) {
          stepErrors.postCode = 'Postal code is required';
          isValid = false;
        }
        break;
        
      case 2: // Account Security
        
        if (!formData.password) {
          stepErrors.password = 'Password is required';
          isValid = false;
        } else {
          const passwordChecks = [
            formData.password.length >= 8,
            /[A-Z]/.test(formData.password),
            /[a-z]/.test(formData.password),
            /[0-9]/.test(formData.password),
            /[^A-Za-z0-9]/.test(formData.password)
          ];
          
          if (passwordChecks.filter(check => check).length < 4) {
            stepErrors.password = 'Password does not meet strength requirements';
            isValid = false;
          }
        }
        
        if (!formData.confirmPassword) {
          stepErrors.confirmPassword = 'Please confirm your password';
          isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
          stepErrors.confirmPassword = 'Passwords do not match';
          isValid = false;
        }
        break;
        
      case 3: // Service Areas
        if (!formData.serviceAreas || formData.serviceAreas.length === 0) {
          stepErrors.serviceAreas = 'At least one service area is required';
          isValid = false;
        } else {
          const serviceAreaErrors = [];
          let hasServiceAreaError = false;
          
          formData.serviceAreas.forEach((area, index) => {
            const areaError = {};
            // Convert postalCodesInput to array for validation
            const postalCodes = area.postalCodesInput !== undefined
              ? area.postalCodesInput.split(",").map(code => code.trim()).filter(code => code)
              : area.postalCodes;

            if (!area.region?.trim()) {
              areaError.region = 'Region is required';
              hasServiceAreaError = true;
            }

            if (!postalCodes || !Array.isArray(postalCodes) || postalCodes.length === 0) {
              areaError.postalCodes = 'At least one postal code is required';
              hasServiceAreaError = true;
            } else if (
              postalCodes.some(
                (code) => !code || typeof code !== 'string' || !code.trim()
              )
            ) {
              areaError.postalCodes = 'Postal codes cannot be empty';
              hasServiceAreaError = true;
            }

            if (Object.keys(areaError).length > 0) {
              serviceAreaErrors[index] = areaError;
            }
          });
          
          if (hasServiceAreaError) {
            stepErrors.serviceAreas = serviceAreaErrors;
            isValid = false;
          }
        }
        break;
        
      case 4: // Pricing Tiers
        if (!formData.pricing || formData.pricing.length === 0) {
          stepErrors.pricing = 'At least one pricing tier is required';
          isValid = false;
        } else {
          const pricingTierErrors = [];
          let hasPricingTierError = false;
          
          formData.pricing.forEach((tier, index) => {
            const tierError = {};
            
            if (tier.minVolume === '' || isNaN(tier.minVolume) || Number(tier.minVolume) < 0) {
              tierError.minVolume = 'Min volume is required and must be 0 or greater';
              hasPricingTierError = true;
            }
            if (tier.maxVolume === '' || isNaN(tier.maxVolume) || Number(tier.maxVolume) <= Number(tier.minVolume)) {
              tierError.maxVolume = 'Max volume is required and must be greater than min volume';
              hasPricingTierError = true;
            }
            if (tier.pricePerLiter === '' || isNaN(tier.pricePerLiter) || Number(tier.pricePerLiter) < 0) {
              tierError.pricePerLiter = 'Price per liter is required and must be a non-negative number';
              hasPricingTierError = true;
            }

            if (Object.keys(tierError).length > 0) {
              pricingTierErrors[index] = tierError;
            }
          });
          
          if (hasPricingTierError) {
            stepErrors.pricing = pricingTierErrors;
            isValid = false;
          }
        }
        break;
    }
    
    setErrors(stepErrors);
    return isValid;
  };
  
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setIsLoading(true);
      setRegistrationError('');
      
      try {
        // Prepare data for submission
        const registrationData = {
          company: formData.companyName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phone,
          role: 'supplier',
          address: {
            street1: formData.addressLine1,
            street2: formData.addressLine2 || '',
            city: formData.city,
            state: formData.state,
            postalCode: formData.postCode
          },
          serviceAreas: formData.serviceAreas.map(area => ({
            region: area.region,
            postalCodes: area.postalCodesInput !== undefined
              ? area.postalCodesInput.split(",").map(code => code.trim()).filter(code => code)
              : area.postalCodes
          })),
          pricing: formData.pricing.map(tier => ({
            minVolume: Number(tier.minVolume),
            maxVolume: Number(tier.maxVolume),
            pricePerLiter: Number(tier.pricePerLiter)
          }))
        };
        
        // Call the API to register the supplier
        const response = await registerSupplier(registrationData);
        
        if (response.success) {
          showToast("Registration successful! Please verify your email.", "success");
          // Registration successful, redirect to login
          router.push('/login?registered=true');
        } else {
          // Handle registration error
          setRegistrationError(response.data?.message || 'Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Registration error:', error);
        setRegistrationError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return <Step1CompanyInfo formData={formData} setFormData={setFormData} errors={errors} />;
      case 2:
        return <Step2AccountSecurity formData={formData} setFormData={setFormData} errors={errors} />;
      case 3:
        return <Step3ServiceAreas formData={formData} setFormData={setFormData} errors={errors} />;
      case 4:
        return <Step4PricingTiers formData={formData} setFormData={setFormData} errors={errors} />;
      default:
        return null;
    }
  };

  return (

    <div className={styles.container}>
      <div className={styles.card}>
      <h1 className={styles.title}>Supplier Registration</h1>
      <p className={styles.subtitle}>Join the AquaPulse platform and start receiving service requests</p>
      
      <ProgressBar currentStep={currentStep} totalSteps={4} />
      
      <div className={styles.form}>
        <div className={styles.formContent}>
          {renderStep()}
          
          {registrationError && (
            <div className={styles.errorMessage}>
              {registrationError}
            </div>
          )}
        </div>
        
        <div className={styles.buttonsContainer}>
          {currentStep > 1 ? (
            <Button 
              background={colors.warning} 
              name="Previous" 
              clickHandler={handlePrevious} 
            />
          ) : (
            <div className={styles.buttonSpacer}></div>
          )}
          
          {currentStep < 4 ? (
            <Button 
              background={colors.success} 
              name="Next" 
              clickHandler={handleNext} 
            />
          ) : (
            <Button 
              background={colors.success} 
              name={isLoading ? "Registering..." : "Complete Registration"} 
              clickHandler={handleSubmit} 
            />
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Register;
