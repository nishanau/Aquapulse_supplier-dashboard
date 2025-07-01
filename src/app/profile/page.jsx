"use client";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/provider/ToastProvider";
import styles from "./profile.module.css";
import Button from "@/components/button/Button";
import { colors } from "@/utils/colors";
import Image from "next/image";
import { passwordChange } from "@/utils/apiService";
import { uploadFile } from "@/utils/s3Service"; // Assuming you have a utility for S3 uploads

const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const { showToast } = useToast();
  const [loadSave, setLoadSave] = useState(false);
  const [loadPassword, setLoadPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [logoPreview, setLogoPreview] = useState(null);

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
        serviceAreas: (user.serviceAreas || []).map((area) => ({
          ...area,
          // Add a helper field for editing postal codes as a string
          postalCodesInput: (area.postalCodes || []).join(", "),
        })),
        pricing: user.pricing || [],
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
    if (field === "postalCodesInput") {
      updatedAreas[index] = {
        ...updatedAreas[index],
        postalCodesInput: value,
      };
    } else {
      updatedAreas[index] = { ...updatedAreas[index], [field]: value };
    }
    setFormData({ ...formData, serviceAreas: updatedAreas });
  };

  const addServiceArea = () => {
    const updatedAreas = [
      ...formData.serviceAreas,
      { region: "", postalCodes: [], postalCodesInput: "" },
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

  // Update profile
  // Updated saveProfile function that handles _id fields correctly

  const saveProfile = async () => {
    setLoadSave(true);
    try {
      // Create an object with only the changed fields
      const changedFields = {};

      // First, handle the logo upload if there's a new logo to upload
      if (formData.logo && formData.logo instanceof File) {
        try {
          // Upload the logo to S3
          const logoData = await uploadFile(
            formData.logo,
            "logo",
            {
              company: formData.company || user.company || `user-${user._id}`,
            },
            true // Make logo public
          );

          // Replace the File object with the uploaded file metadata
          changedFields.logo = logoData;

          // Also update the form data so UI can reflect the change
          setFormData((prev) => ({
            ...prev,
            logo: logoData,
          }));

          showToast("Logo uploaded successfully", "success");
        } catch (error) {
          showToast(`Failed to upload logo: ${error.message}`, "error");
          console.error("Logo upload error:", error);
          // Continue with other profile updates even if logo upload fails
        }
      }

      // Compare each field in formData with the original user data
      Object.keys(formData).forEach((key) => {
        // Skip logo since we already handled it above
        if (key === "logo") {
          // Only add logo to changedFields if we haven't already added it during upload
          if (
            !changedFields.logo &&
            JSON.stringify(formData[key]) !== JSON.stringify(user[key])
          ) {
            changedFields[key] = formData[key];
          }
        }
        // Special handling for service areas
        else if (key === "serviceAreas") {
          // Check if service areas have changed (ignoring _id fields)
          const formServiceAreas = formData.serviceAreas.map((area) => {
            // Create a copy without the _id and postalCodesInput fields
            const { _id, postalCodesInput, ...areaWithoutId } = area;
            // Use postalCodesInput to generate postalCodes array
            return {
              ...areaWithoutId,
              postalCodes: (postalCodesInput || "")
                .split(",")
                .map((code) => code.trim())
                .filter((code) => code),
            };
          });

          const userServiceAreas = user.serviceAreas.map((area) => {
            // Create a copy without the _id field
            const { _id, ...areaWithoutId } = area;
            return areaWithoutId;
          });

          // Compare the arrays without IDs
          if (
            JSON.stringify(formServiceAreas) !==
            JSON.stringify(userServiceAreas)
          ) {
            // Send all service areas without _id fields
            changedFields.serviceAreas = formServiceAreas;
          }
        }
        // Special handling for pricing tiers
        else if (key === "pricing") {
          // Check if pricing tiers have changed (ignoring _id fields)
          const formPricing = formData.pricing.map((tier) => {
            // Create a copy without the _id field
            const { _id, ...tierWithoutId } = tier;
            return tierWithoutId;
          });

          const userPricing = user.pricing.map((tier) => {
            // Create a copy without the _id field
            const { _id, ...tierWithoutId } = tier;
            return tierWithoutId;
          });

          // Compare the arrays without IDs
          if (JSON.stringify(formPricing) !== JSON.stringify(userPricing)) {
            // Send all pricing tiers without _id fields
            changedFields.pricing = formPricing;
          }
        }
        // Simple field comparison
        else if (formData[key] !== user[key]) {
          changedFields[key] = formData[key];
        }
      });

      // Only make the API call if there are changes
      if (Object.keys(changedFields).length === 0) {
        showToast("No changes to save", "info");
        setEditMode(false);
        return;
      }

      // Call the updateUser function with only the changed fields
      const updatedUser = await updateUser(changedFields);

      showToast("Profile updated successfully!", "success");
      setEditMode(false);
    } catch (error) {
      showToast(
        `Failed to update profile: ${error.message || "Please try again."}`,
        "error"
      );
      console.error("Update error:", error);
    } finally {
      setLoadSave(false);
    }
  };

  // Update password
  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showToast("Password must be at least 8 characters long", "error");
      return;
    }

    setLoadPassword(true);
    try {
      await passwordChange(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      showToast("Password updated successfully!", "success");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      showToast(
        `Failed to update password: ${
          error.message || "Check your current password."
        }`,
        "error"
      );
      console.error("Password update error:", error);
    } finally {
      setLoadPassword(false);
    }
  };

  // Handle logo upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file before setting
    if (file.size > 5 * 1024 * 1024) {
      showToast("Logo must be less than 5MB", "error");
      return;
    }

    // Validate file type - only images allowed for logos
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      showToast(
        "Please select a valid image file (JPEG, PNG, SVG, WebP)",
        "error"
      );
      return;
    }

    // Store the file object directly in formData
    // We'll handle the actual upload when the user saves the profile
    setFormData({
      ...formData,
      logo: file,
    });

    // Also create a preview URL for the UI
    const previewUrl = URL.createObjectURL(file);

    // You might want to store this separately for preview purposes
    setLogoPreview(previewUrl);

    showToast("Logo selected. Save changes to upload.", "info");
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
              name={loadSave ? "Saving..." : "Save Changes"}
              clickHandler={saveProfile}
              disabled={loadSave}
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
                  });
                }
              }}
              disabled={loadSave}
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
                <p>{formData.company}</p>
              </div>

              <div className={styles.field}>
                <label>Logo</label>
                {editMode ? (
                  <div className={styles.logoUploader}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className={styles.fileInput}
                    />
                    <div className={styles.previewThumbnail}>
                      {logoPreview ? (
                        <Image
                          width={70}
                          height={50}
                          src={logoPreview}
                          alt="Logo preview"
                        />
                      ) : formData.logo?.downloadURL ? (
                        <Image
                          width={70}
                          height={50}
                          src={formData.logo.downloadURL}
                          alt="Current logo"
                        />
                      ) : (
                        <p>No logo selected</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={styles.logoDisplay}>
                    {formData.logo?.downloadURL ? (
                      <Image
                        width={70}
                        height={50}
                        src={formData.logo.downloadURL}
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
                <Image
                  width={700}
                  height={400}
                  src={
                    formData.logo.downloadURL
                      ? formData.logo.downloadURL
                      : logoPreview
                  }
                  alt={`${formData.company} logo`}
                />
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
                        value={area.postalCodesInput ?? area.postalCodes.join(", ")}
                        onChange={(e) =>
                          handleServiceAreaChange(
                            index,
                            "postalCodesInput",
                            e.target.value
                          )
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
                name={loadPassword ? "Updating..." : "Update Password"}
                clickHandler={updatePassword}
                disabled={
                  loadPassword ||
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
