"use client";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/provider/ToastProvider";
import styles from "./profile.module.css";
import Button from "@/components/button/Button";
import { colors } from "@/utils/colors";
import Image from "next/image";

const ProfilePage = () => {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Tabs for different sections
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        company: user.company || "",
        logo: user.logo || "",
        serviceAreas: user.serviceAreas || [],
        pricing: user.pricing || [],
        active: user.active || false,
      });
    }
  }, [user]);

  if (!formData) {
    return;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleServiceAreaChange = (index, field, value) => {
    const updatedAreas = [...formData.serviceAreas];
    updatedAreas[index] = { ...updatedAreas[index], [field]: value };
    setFormData({ ...formData, serviceAreas: updatedAreas });
  };

  const handlePostalCodeChange = (areaIndex, value) => {
    const updatedAreas = [...formData.serviceAreas];
    // Split by commas, trim whitespace, and filter out empty strings
    const postalCodes = value
      .split(",")
      .map((code) => code.trim())
      .filter((code) => code);
    updatedAreas[areaIndex] = { ...updatedAreas[areaIndex], postalCodes };
    setFormData({ ...formData, serviceAreas: updatedAreas });
  };

  const addServiceArea = () => {
    const updatedAreas = [
      ...formData.serviceAreas,
      { region: "", postalCodes: [] },
    ];
    setFormData({ ...formData, serviceAreas: updatedAreas });
  };

  const removeServiceArea = (index) => {
    const updatedAreas = formData.serviceAreas.filter((_, i) => i !== index);
    setFormData({ ...formData, serviceAreas: updatedAreas });
  };

  const handlePricingChange = (index, field, value) => {
    const updatedPricing = [...formData.pricing];
    updatedPricing[index] = {
      ...updatedPricing[index],
      [field]:
        field === "pricePerLiter" ? parseFloat(value) : parseInt(value, 10),
    };
    setFormData({ ...formData, pricing: updatedPricing });
  };

  const addPricingTier = () => {
    const lastTier = formData.pricing[formData.pricing.length - 1] || {
      maxVolume: 0,
    };
    const updatedPricing = [
      ...formData.pricing,
      {
        minVolume: lastTier.maxVolume + 1,
        maxVolume: lastTier.maxVolume + 5000,
        pricePerLiter: lastTier.pricePerLiter || 1.0,
      },
    ];
    setFormData({ ...formData, pricing: updatedPricing });
  };

  const removePricingTier = (index) => {
    const updatedPricing = formData.pricing.filter((_, i) => i !== index);
    setFormData({ ...formData, pricing: updatedPricing });
  };

  const saveProfile = async () => {
    setIsLoading(true);
    try {
      // API call would go here
      // const response = await fetch('/api/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // Mock successful response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToast("Profile updated successfully!", "success");
      setEditMode(false);
    } catch (error) {
      showToast("Failed to update profile. Please try again.", "error");
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    setIsLoading(true);
    try {
      // API call would go here
      // const response = await fetch('/api/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     currentPassword: passwordData.currentPassword,
      //     newPassword: passwordData.newPassword
      //   })
      // });

      // Mock successful response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToast("Password updated successfully!", "success");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      showToast(
        "Failed to update password. Please check your current password.",
        "error"
      );
      console.error("Password update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <h1>Profile</h1>
        {!editMode ? (
          <Button
            background={colors.primary}
            name="Edit Profile"
            clickHandler={() => setEditMode(true)}
          />
        ) : (
          <div className={styles.editButtons}>
            <Button
              background={colors.success}
              name="Save Changes"
              clickHandler={saveProfile}
              disabled={isLoading}
            />
            <Button
              background={colors.secondary}
              name="Cancel"
              clickHandler={() => {
                setEditMode(false);
                // Reset form data to original user data
                if (user) {
                  setFormData({
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    email: user.email || "",
                    phoneNumber: user.phoneNumber || "",
                    company: user.company || "",
                    logo: user.logo || "",
                    serviceAreas: user.serviceAreas || [],
                    pricing: user.pricing || [],
                    active: user.active || false,
                  });
                }
              }}
              disabled={isLoading}
            />
          </div>
        )}
      </div>

      <div className={styles.tabsContainer}>
        <div
          className={`${styles.tab} ${
            activeTab === "personal" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("personal")}
        >
          Personal Information
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "service" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("service")}
        >
          Service Areas
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "pricing" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("pricing")}
        >
          Pricing Tiers
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "metrics" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("metrics")}
        >
          Metrics & Reviews
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "security" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("security")}
        >
          Security
        </div>
      </div>

      <div className={styles.profileContent}>
        {/* Personal Information Tab */}
        {activeTab === "personal" && (
          <div className={styles.section}>
            <h2>Personal Information</h2>
            <div className={styles.profileGrid}>
              {/* <div className={styles.field}>
                <label>First Name</label>
                {editMode ? (
                  <input 
                    type="text" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange}
                  />
                ) : (
                  <p>{formData.firstName}</p>
                )}
              </div>
              
              <div className={styles.field}>
                <label>Last Name</label>
                {editMode ? (
                  <input 
                    type="text" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange}
                  />
                ) : (
                  <p>{formData.lastName}</p>
                )}
              </div> */}

              <div className={styles.field}>
                <label>Email Address</label>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{formData.email}</p>
                )}
              </div>

              <div className={styles.field}>
                <label>Phone Number</label>
                {editMode ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{formData.phoneNumber}</p>
                )}
              </div>

              <div className={styles.field}>
                <label>Company</label>
                {editMode ? (
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{formData.company}</p>
                )}
              </div>

              <div className={styles.field}>
                <label>Logo</label>
                {editMode ? (
                  <div className={styles.logoUploader}>
                    <input
                      type="text"
                      name="logo"
                      //formData.logo
                      value="/logo.png"
                      onChange={handleChange}
                      placeholder="Enter image URL or upload a file"
                      className={styles.logoInput}
                    />
                    <div className={styles.uploadControls}>
                      <label className={styles.fileInputLabel}>
                        <span>Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              // For real implementation, you'd upload to a server/storage
                              // and get back a URL. This is a simplified example:
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setFormData({
                                  ...formData,
                                  logo: event.target.result,
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className={styles.fileInput}
                        />
                      </label>
                      {formData.logo && (
                        <button
                          className={styles.clearButton}
                          onClick={() => setFormData({ ...formData, logo: "" })}
                          type="button"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    {formData.logo && (
                      <div className={styles.previewThumbnail}>
                        <Image
                          width={200}
                          height={100}
                          src="/logo.png"
                          alt="Logo preview"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.logoDisplay}>
                    {formData.logo ? (
                      <Image
                        width={200}
                        height={100}
                        src="/logo.png"
                        alt={`${formData.company} logo`}
                        className={styles.logoImage}
                      />
                    ) : (
                      <p>No logo uploaded</p>
                    )}
                  </div>
                )}
              </div>

              {/* <div className={styles.field}>
                <label>Account Status</label>
                <p>{formData.active ? 'Active' : 'Inactive'}</p>
              </div> */}
            </div>

            {formData.logo && (
              <div className={styles.logoPreview}>
                <h3>Logo Preview</h3>
                <img src={formData.logo} alt={`${formData.company} logo`} />
              </div>
            )}
          </div>
        )}

        {/* Service Areas Tab */}
        {activeTab === "service" && (
          <div className={styles.section}>
            <h2>Service Areas</h2>
            <p>
              Define the regions and postal codes where you provide water
              delivery services.
            </p>

            {formData.serviceAreas.map((area, index) => (
              <div key={index} className={styles.serviceArea}>
                <div className={styles.areaHeader}>
                  <h3>Area {index + 1}</h3>
                  {editMode && (
                    <button
                      className={styles.removeButton}
                      onClick={() => removeServiceArea(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className={styles.areaFields}>
                  <div className={styles.field}>
                    <label>Region Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={area.region}
                        onChange={(e) =>
                          handleServiceAreaChange(
                            index,
                            "region",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <p>{area.region}</p>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label>Postal Codes (comma-separated)</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={area.postalCodes.join(", ")}
                        onChange={(e) =>
                          handlePostalCodeChange(index, e.target.value)
                        }
                      />
                    ) : (
                      <p>{area.postalCodes.join(", ")}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {editMode && (
              <button className={styles.addButton} onClick={addServiceArea}>
                + Add Service Area
              </button>
            )}
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === "pricing" && (
          <div className={styles.section}>
            <h2>Pricing Tiers</h2>
            <p>Set volume-based pricing for your water delivery services.</p>

            <div className={styles.pricingTable}>
              <div className={styles.pricingHeader}>
                <span>Min Volume (L)</span>
                <span>Max Volume (L)</span>
                <span>Price per Liter ($)</span>
                {editMode && <span>Actions</span>}
              </div>

              {formData.pricing.map((tier, index) => (
                <div key={index} className={styles.pricingRow}>
                  {editMode ? (
                    <>
                      <input
                        type="number"
                        value={tier.minVolume}
                        onChange={(e) =>
                          handlePricingChange(
                            index,
                            "minVolume",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="number"
                        value={tier.maxVolume}
                        onChange={(e) =>
                          handlePricingChange(
                            index,
                            "maxVolume",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={tier.pricePerLiter}
                        onChange={(e) =>
                          handlePricingChange(
                            index,
                            "pricePerLiter",
                            e.target.value
                          )
                        }
                      />
                      <button
                        className={styles.removeButton}
                        onClick={() => removePricingTier(index)}
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{tier.minVolume}</span>
                      <span>{tier.maxVolume}</span>
                      <span>${tier.pricePerLiter.toFixed(2)}</span>
                    </>
                  )}
                </div>
              ))}
            </div>

            {editMode && (
              <button className={styles.addButton} onClick={addPricingTier}>
                + Add Pricing Tier
              </button>
            )}
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === "metrics" && (
          <div className={styles.section}>
            <h2>Performance Metrics</h2>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <h3>Average Response Time</h3>
                <div className={styles.metricValue}>
                  {user.avgResponseTime} min
                </div>
                <p className={styles.metricDesc}>
                  Average time to respond to new orders
                </p>
              </div>

              <div className={styles.metricCard}>
                <h3>Customer Rating</h3>
                <div className={styles.metricValue}>
                  {user.rating.toFixed(1)}
                  <span className={styles.stars}>★★★★★</span>
                </div>
                <p className={styles.metricDesc}>Based on customer reviews</p>
              </div>

              <div className={styles.metricCard}>
                <h3>Service Areas</h3>
                <div className={styles.metricValue}>
                  {user.serviceAreas.length}
                </div>
                <p className={styles.metricDesc}>
                  Number of regions you service
                </p>
              </div>

              <div className={styles.metricCard}>
                <h3>Pricing Tiers</h3>
                <div className={styles.metricValue}>{user.pricing.length}</div>
                <p className={styles.metricDesc}>
                  Number of volume-based pricing options
                </p>
              </div>
            </div>

            <h2 className={styles.reviewsTitle}>Customer Reviews</h2>
            {user.reviews.length > 0 ? (
              <div className={styles.reviewsList}>
                {user.reviews.map((review, index) => (
                  <div key={index} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewerName}>
                        {review.customerName}
                      </span>
                      <span className={styles.reviewRating}>
                        {review.rating} ★
                      </span>
                    </div>
                    <p className={styles.reviewContent}>{review.comment}</p>
                    <span className={styles.reviewDate}>
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noReviews}>
                No reviews yet. Reviews will appear here as customers rate your
                service.
              </p>
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className={styles.section}>
            <h2>Change Password</h2>
            <p>
              Update your account password below. For security, please enter
              your current password.
            </p>

            <div className={styles.passwordForm}>
              <div className={styles.field}>
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className={styles.field}>
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className={styles.field}>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <Button
                background={colors.primary}
                name="Update Password"
                clickHandler={updatePassword}
                disabled={
                  isLoading ||
                  !passwordData.currentPassword ||
                  !passwordData.newPassword ||
                  !passwordData.confirmPassword
                }
              />
            </div>

            <div className={styles.securityTips}>
              <h3>Password Security Tips</h3>
              <ul>
                <li>Use at least 8 characters</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Add numbers and special characters</li>
                <li>Don't reuse passwords from other sites</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
