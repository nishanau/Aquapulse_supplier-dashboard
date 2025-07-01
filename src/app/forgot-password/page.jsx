'use client';
import React, { useState } from 'react';
import styles from './forgot-password.module.css';
import {
  sendForgotPasswordCode,
  verifyForgotPasswordCode,
  resetPasswordWithCode,
} from '@/utils/apiService';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: reset
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setStatus('');
    const res = await sendForgotPasswordCode(email);
    setLoading(false);
    if (res && res.success) {
      setStep(2);
      setStatus('A verification code has been sent to your email.');
    } else {
      setStatus('Email not found.');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code) {
      setStatus('Please enter the code sent to your email.');
      return;
    }
    setLoading(true);
    setStatus('');
    const res = await verifyForgotPasswordCode(email, code);
    setLoading(false);
    if (res && res.success) {
      setStep(3);
      setStatus('');
    } else {
      setStatus('Invalid or expired code.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setStatus('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus('Passwords do not match.');
      return;
    }
    setLoading(true);
    setStatus('');
    const res = await resetPasswordWithCode(email, code, newPassword);
    setLoading(false);
    if (res && res.success) {
      setStatus('Password reset successful! You can now log in.');
      setStep(4);
    } else {
      setStatus('Failed to reset password. Try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Forgot Password</h1>
        {step === 1 && (
          <form className={styles.form} onSubmit={handleSendCode}>
            <p className={styles.subtitle}>
              Enter your email address and we'll send you a verification code.
            </p>
            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        )}
        {step === 2 && (
          <form className={styles.form} onSubmit={handleVerifyCode}>
            <p className={styles.subtitle}>
              Enter the code sent to <b>{email}</b>
            </p>
            <input
              className={styles.input}
              type="text"
              placeholder="Verification Code"
              value={code}
              onChange={e => setCode(e.target.value)}
              disabled={loading}
              required
            />
            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
            <button
              className={styles.linkButton}
              type="button"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Change email
            </button>
          </form>
        )}
        {step === 3 && (
          <form className={styles.form} onSubmit={handleResetPassword}>
            <p className={styles.subtitle}>Set your new password</p>
            <input
              className={styles.input}
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              disabled={loading}
              required
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        {step === 4 && (
          <div className={styles.successMessage}>
            <p>Password reset successful!</p>
            <a className={styles.loginLink} href="/login">
              Go to Login
            </a>
          </div>
        )}
        {status && (
          <div className={styles.status + (step === 4 ? " " + styles.success : "")}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;