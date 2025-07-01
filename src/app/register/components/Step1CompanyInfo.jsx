'use client'
import React from 'react';
import styles from '../register.module.css';

const Step1CompanyInfo = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Company & Contact Information</h2>
      
      <div className={styles.formGroup}>
        <label htmlFor="companyName">Company Name*</label>
        <input
          id="companyName"
          className={`${styles.input} ${errors.companyName ? styles.inputError : ''}`}
          type="text"
          name="companyName"
          value={formData.companyName || ''}
          onChange={handleChange}
          placeholder="Your Company Name"
        />
        {errors.companyName && <span className={styles.errorText}>{errors.companyName}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email Address*</label>
        <input
          id="email"
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          placeholder="company@example.com"
        />
        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone">Phone Number*</label>
        <input
          id="phone"
          className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
          type="tel"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
          placeholder="(123) 456-7890"
        />
        {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
      </div>

      <div className={styles.addressSection}>
        <h3>Business Address</h3>
        
        <div className={styles.formGroup}>
          <label htmlFor="addressLine1">Address Line 1*</label>
          <input
            id="addressLine1"
            className={`${styles.input} ${errors.addressLine1 ? styles.inputError : ''}`}
            type="text"
            name="addressLine1"
            value={formData.addressLine1 || ''}
            onChange={handleChange}
            placeholder="Street Address"
          />
          {errors.addressLine1 && <span className={styles.errorText}>{errors.addressLine1}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="addressLine2">Address Line 2</label>
          <input
            id="addressLine2"
            className={styles.input}
            type="text"
            name="addressLine2"
            value={formData.addressLine2 || ''}
            onChange={handleChange}
            placeholder="Apartment, Suite, Unit, etc. (optional)"
          />
        </div>

        <div className={styles.addressRow}>
          <div className={styles.formGroup}>
            <label htmlFor="city">City*</label>
            <input
              id="city"
              className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
              type="text"
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              placeholder="City"
            />
            {errors.city && <span className={styles.errorText}>{errors.city}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="state">State*</label>
            <input
              id="state"
              className={`${styles.input} ${errors.state ? styles.inputError : ''}`}
              type="text"
              name="state"
              value={formData.state || ''}
              onChange={handleChange}
              placeholder="State"
            />
            {errors.state && <span className={styles.errorText}>{errors.state}</span>}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="postCode">Postal Code*</label>
          <input
            id="postCode"
            className={`${styles.input} ${errors.postCode ? styles.inputError : ''}`}
            type="text"
            name="postCode"
            value={formData.postCode || ''}
            onChange={handleChange}
            placeholder="Postal Code"
          />
          {errors.postCode && <span className={styles.errorText}>{errors.postCode}</span>}
        </div>
      </div>
      
      <p className={styles.requiredNote}>* Required fields</p>
    </div>
  );
};

export default Step1CompanyInfo;
