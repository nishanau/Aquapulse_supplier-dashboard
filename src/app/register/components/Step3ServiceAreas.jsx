'use client'
import React from 'react';
import styles from '../register.module.css';

const Step3ServiceAreas = ({ formData, setFormData, errors }) => {
  // Handle changes for region and postalCodesInput
  const handleServiceAreaChange = (index, field, value) => {
    const updatedServiceAreas = [...formData.serviceAreas];
    if (field === "postalCodesInput") {
      updatedServiceAreas[index][field] = value;
    } else {
      updatedServiceAreas[index][field] = value;
    }
    setFormData(prevData => ({
      ...prevData,
      serviceAreas: updatedServiceAreas
    }));
  };

  const addServiceArea = () => {
    setFormData(prevData => ({
      ...prevData,
      serviceAreas: [
        ...prevData.serviceAreas || [],
        { region: '', postalCodes: [], postalCodesInput: '' }
      ]
    }));
  };

  const removeServiceArea = (index) => {
    const updatedServiceAreas = [...formData.serviceAreas];
    updatedServiceAreas.splice(index, 1);
    setFormData(prevData => ({
      ...prevData,
      serviceAreas: updatedServiceAreas
    }));
  };

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Service Areas</h2>
      <p className={styles.stepDescription}>
        Add the regions you serve and the postal codes for each region. You can add multiple regions.
      </p>
      {(formData.serviceAreas || []).map((area, index) => (
        <div key={index} className={styles.serviceAreaItem}>
          <div className={styles.serviceAreaHeader}>
            <h3>Service Area {index + 1}</h3>
            {index > 0 && (
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeServiceArea(index)}
              >
                Remove
              </button>
            )}
          </div>
          <div className={styles.serviceAreaInputs}>
            <div className={styles.formGroup}>
              <label htmlFor={`region-${index}`}>Region*</label>
              <input
                id={`region-${index}`}
                className={`${styles.input} ${errors.serviceAreas?.[index]?.region ? styles.inputError : ''}`}
                type="text"
                value={area.region || ''}
                onChange={(e) => handleServiceAreaChange(index, 'region', e.target.value)}
                placeholder="Region name (e.g. Western Province)"
              />
              {errors.serviceAreas?.[index]?.region && (
                <span className={styles.errorText}>{errors.serviceAreas[index].region}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor={`postalCodes-${index}`}>Postal Codes* (comma-separated)</label>
              <input
                id={`postalCodes-${index}`}
                className={`${styles.input} ${errors.serviceAreas?.[index]?.postalCodes ? styles.inputError : ''}`}
                type="text"
                inputMode="text"
                pattern=".*"
                value={area.postalCodesInput ?? (Array.isArray(area.postalCodes) ? area.postalCodes.join(", ") : "")}
                onChange={(e) => handleServiceAreaChange(index, 'postalCodesInput', e.target.value)}
                placeholder="e.g. 10100, 10200, 10300"
              />
              {errors.serviceAreas?.[index]?.postalCodes && (
                <span className={styles.errorText}>{errors.serviceAreas[index].postalCodes}</span>
              )}
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        className={styles.addButton}
        onClick={addServiceArea}
      >
        + Add Another Service Area
      </button>
      {errors.serviceAreas && typeof errors.serviceAreas === 'string' && (
        <span className={styles.errorText}>{errors.serviceAreas}</span>
      )}
      <p className={styles.requiredNote}>* Required fields</p>
    </div>
  );
};

export default Step3ServiceAreas;
