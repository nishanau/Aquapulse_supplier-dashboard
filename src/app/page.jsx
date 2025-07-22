"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Button from "@/components/button/Button";
import { colors } from "@/utils/colors";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logoContainer}>
            <Image 
              src="/logo.png" 
              alt="AquaPulse Logo" 
              width={180} 
              height={100} 
              priority 
            />
          </div>
          <h1 className={styles.heroTitle}>
            Streamline Your Water Supply Business
          </h1>
          <p className={styles.heroSubtitle}>
            Join hundreds of suppliers managing their water delivery operations
            efficiently with AquaPulse.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/register">
              <Button name="Register Now" background={colors.success} />
            </Link>
            <Link href="/login">
              <Button name="Sign In" background={colors.primary} />
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className={styles.benefits}>
        <h2 className={styles.sectionTitle}>Why Join AquaPulse?</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>📈</div>
            <h3>Increase Revenue</h3>
            <p>Connect with new customers in your service areas and grow your business.</p>
          </div>
          
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>📱</div>
            <h3>Simplified Management</h3>
            <p>Manage orders, track deliveries, and handle customer requests all in one place.</p>
          </div>
          
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🚚</div>
            <h3>Efficient Routing</h3>
            <p>Optimize delivery routes to save time and reduce fuel costs.</p>
          </div>
          
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>💰</div>
            <h3>Secure Payments</h3>
            <p>Get paid faster with our integrated payment processing system.</p>
          </div>
          
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>📊</div>
            <h3>Business Analytics</h3>
            <p>Gain insights into your operations with detailed performance reports.</p>
          </div>
          
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🔔</div>
            <h3>Real-time Notifications</h3>
            <p>Stay updated with instant alerts for new orders and customer requests.</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Register</h3>
            <p>Create your supplier account with service areas and pricing.</p>
          </div>
          
          <div className={styles.stepConnector}></div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Receive Orders</h3>
            <p>Get notified when customers request water delivery in your area.</p>
          </div>
          
          <div className={styles.stepConnector}></div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Deliver & Get Paid</h3>
            <p>Complete deliveries and receive payments securely.</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className={styles.testimonials}>
        <h2 className={styles.sectionTitle}>What Our Suppliers Say</h2>
        <div className={styles.testimonialCards}>
          <div className={styles.testimonialCard}>
            <p>"Since joining AquaPulse, we've increased our delivery volume by 40% and streamlined our operations."</p>
            <div className={styles.testimonialAuthor}>- ClearWaters Ltd.</div>
          </div>
          
          <div className={styles.testimonialCard}>
            <p>"The platform is incredibly easy to use. Managing orders and tracking deliveries has never been simpler."</p>
            <div className={styles.testimonialAuthor}>- AquaFlow Solutions</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className={styles.callToAction}>
        <h2>Ready to Grow Your Water Supply Business?</h2>
        <p>Join AquaPulse today and start receiving orders from customers in your area.</p>
        <Link href="/register">
          <Button name="Get Started" background={colors.success} />
        </Link>
      </div>


    </div>
  );
}