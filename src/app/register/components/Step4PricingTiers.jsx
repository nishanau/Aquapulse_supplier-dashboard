'use client'
import React from 'react';
import styles from '../register.module.css';
import { colors } from '@/utils/colors';

const Step4PricingTiers = ({ formData, setFormData, errors }) => {
  const handlePricingTierChange = (index, field, value) => {
    const updatedPricing = [...formData.pricing];
    updatedPricing[index][field] = value;
    setFormData(prevData => ({
      ...prevData,
      pricing: updatedPricing
    }));
  };

  const addPricingTier = () => {
    setFormData(prevData => ({
      ...prevData,
      pricing: [
        ...prevData.pricing || [],
        { minVolume: '', maxVolume: '', pricePerLiter: '' }
      ]
    }));
  };

  const removePricingTier = (index) => {
    const updatedPricing = [...formData.pricing];
    updatedPricing.splice(index, 1);
    setFormData(prevData => ({
      ...prevData,
      pricing: updatedPricing
    }));
  };

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Pricing Tiers</h2>
      <p className={styles.stepDescription}>
        Add your service pricing tiers. Each tier should specify a volume range and price per liter.
      </p>

      {(formData.pricing || []).map((tier, index) => (
        <div key={index} className={styles.pricingTierItem}>
          <div className={styles.pricingTierHeader}>
            <h3>Pricing Tier {index + 1}</h3>
            {index > 0 && (
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removePricingTier(index)}
              >
                Remove
              </button>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor={`minVolume-${index}`}>Min Volume (L)*</label>
            <input
              id={`minVolume-${index}`}
              className={`${styles.input} ${errors.pricing?.[index]?.minVolume ? styles.inputError : ''}`}
              type="number"
              min="0"
              value={tier.minVolume}
              onChange={(e) => handlePricingTierChange(index, 'minVolume', e.target.value)}
              placeholder="e.g. 0"
            />
            {errors.pricing?.[index]?.minVolume && (
              <span className={styles.errorText}>{errors.pricing[index].minVolume}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor={`maxVolume-${index}`}>Max Volume (L)*</label>
            <input
              id={`maxVolume-${index}`}
              className={`${styles.input} ${errors.pricing?.[index]?.maxVolume ? styles.inputError : ''}`}
              type="number"
              min="1"
              value={tier.maxVolume}
              onChange={(e) => handlePricingTierChange(index, 'maxVolume', e.target.value)}
              placeholder="e.g. 1000"
            />
            {errors.pricing?.[index]?.maxVolume && (
              <span className={styles.errorText}>{errors.pricing[index].maxVolume}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor={`pricePerLiter-${index}`}>Price per Liter ($)*</label>
            <input
              id={`pricePerLiter-${index}`}
              className={`${styles.input} ${errors.pricing?.[index]?.pricePerLiter ? styles.inputError : ''}`}
              type="number"
              min="0"
              step="0.01"
              value={tier.pricePerLiter}
              onChange={(e) => handlePricingTierChange(index, 'pricePerLiter', e.target.value)}
              placeholder="e.g. 0.50"
            />
            {errors.pricing?.[index]?.pricePerLiter && (
              <span className={styles.errorText}>{errors.pricing[index].pricePerLiter}</span>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        className={styles.addButton}
        onClick={addPricingTier}
      >
        + Add Another Pricing Tier
      </button>

      {errors.pricing && typeof errors.pricing === 'string' && (
        <span className={styles.errorText}>{errors.pricing}</span>
      )}

      <p className={styles.requiredNote}>* Required fields</p>
    </div>
  );
};

export default Step4PricingTiers;
