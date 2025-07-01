'use client'
import React, { useEffect, useState } from 'react';
import { verifyEmail } from '@/utils/apiService';
import styles from './verify-email.module.css'; // Adjust the path as necessary
const VerifyEmailPage = () => {
  const [status, setStatus] = useState('Verifying...');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');

    if (!token || !email) {
      setStatus('Invalid verification link.');
      setSuccess(false);
      return;
    }

    const verify = async () => {
      try {
        const result = await verifyEmail(token, email);
        if (result.success) {
          setStatus('Your email has been verified successfully!');
          setSuccess(true);
        } else {
          setStatus(result.data?.message || 'Verification failed.');
          setSuccess(false);
        }
      } catch (err) {
        setStatus('An error occurred during verification.');
        setSuccess(false);
      }
    };

    verify();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Email Verification</h1>
      <p
        className={`${styles.status} ${success ? styles.success : styles.error}`}
      >
        {status}
      </p>
    </div>
  );
};

export default VerifyEmailPage;