import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSignOut, handlePasswordReset } from "../../service/authReader";
import { updateData, updateImageToFirebase } from "../../service/updateFirebase";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../service/firebaseConfig";

export default function SettingsPage({ metaData, setMetaData }) {
  const navigate = useNavigate();
  const { email, storeName, shopIcon, banners = [] } = metaData || {};
  const [isStoreNameInputOpen, setIsStoreNameInputOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState(storeName || "");
  const [isStoreNameConfirmed, setIsStoreNameConfirmed] = useState(false);
  const [storeNameError, setStoreNameError] = useState(null);
  const [isIconInputOpen, setIsIconInputOpen] = useState(false);
  const [selectedIconFile, setSelectedIconFile] = useState(null);
  const [isIconConfirmed, setIsIconConfirmed] = useState(false);
  const [iconError, setIconError] = useState(null);
  const [isBannerInputOpen, setIsBannerInputOpen] = useState(false);
  const [selectedBannerFile, setSelectedBannerFile] = useState(null);
  const [isBannerConfirmed, setIsBannerConfirmed] = useState(false);
  const [bannerError, setBannerError] = useState(null);
  const [bannerIndexToChange, setBannerIndexToChange] = useState(null);

  const toggleStoreNameInput = () => {
    setIsStoreNameInputOpen(!isStoreNameInputOpen);
    setStoreNameError(null);
    setIsStoreNameConfirmed(false);
    setNewStoreName(storeName || "");
  };

  const updateStoreName = async () => {
    if (!isStoreNameConfirmed) {
      setStoreNameError("Please confirm the action to update the store name.");
      return;
    }
    if (!newStoreName.trim()) {
      setStoreNameError("Store name cannot be empty.");
      return;
    }
    try {
      await updateData("", { storeName: newStoreName.trim() });
      setMetaData((prev) => ({ ...prev, storeName: newStoreName.trim() }));
      setIsStoreNameInputOpen(false);
      setStoreNameError(null);
      setIsStoreNameConfirmed(false);
    } catch (e) {
      setStoreNameError("Failed to update store name. Please try again.");
    }
  };

  const toggleIconInput = () => {
    setIsIconInputOpen(!isIconInputOpen);
    setIconError(null);
    setIsIconConfirmed(false);
    setSelectedIconFile(null);
  };

  const handleIconFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !["image/png", "image/jpeg"].includes(file.type)) {
      setIconError("Only PNG or JPG files are supported.");
      setSelectedIconFile(null);
      return;
    }
    setSelectedIconFile(file);
    setIconError(null);
  };

  const updateShopIcon = async () => {
    if (!isIconConfirmed) {
      setIconError("Please confirm the action to update the shop icon.");
      return;
    }
    if (!selectedIconFile) {
      setIconError("Please select an image file.");
      return;
    }
    try {
      const downloadURL = await updateImageToFirebase(selectedIconFile, "shopIcon.jpg","","");
      await updateData("", { shopIcon: downloadURL });
      setMetaData((prev) => ({ ...prev, shopIcon: downloadURL }));
      setIsIconInputOpen(false);
      setIconError(null);
      setIsIconConfirmed(false);
      setSelectedIconFile(null);
    } catch (e) {
      setIconError("Failed to update shop icon. Please try again.");
    }
  };

  const toggleBannerInput = (index = null) => {
    setIsBannerInputOpen(!isBannerInputOpen);
    setBannerError(null);
    setIsBannerConfirmed(false);
    setSelectedBannerFile(null);
    setBannerIndexToChange(index);
  };

  const handleBannerFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !["image/png", "image/jpeg"].includes(file.type)) {
      setBannerError("Only PNG or JPG files are supported.");
      setSelectedBannerFile(null);
      return;
    }
    setSelectedBannerFile(file);
    setBannerError(null);
  };

  const updateBanner = async () => {
    if (!isBannerConfirmed) {
      setBannerError("Please confirm the action to add or update the banner.");
      return;
    }
    if (!selectedBannerFile) {
      setBannerError("Please select an image file.");
      return;
    }
    try {
      const timestamp = Date.now();
      const downloadURL = await updateImageToFirebase(selectedBannerFile, `banner_${timestamp}.jpg`,"","");
      let updatedBanners = [...banners];

      if (bannerIndexToChange !== null) {
        const oldBannerURL = updatedBanners[bannerIndexToChange];
        const oldBannerPath = decodeURIComponent(oldBannerURL.split("/o/")[1].split("?")[0]);
        const oldBannerRef = ref(storage, oldBannerPath);
        await deleteObject(oldBannerRef).catch((e) => console.warn("Failed to delete old banner:", e));
        updatedBanners[bannerIndexToChange] = downloadURL;
      } else {
        updatedBanners = [...banners, downloadURL];
      }

      await updateData("", { banners: updatedBanners });
      setMetaData((prev) => ({ ...prev, banners: updatedBanners }));
      setIsBannerInputOpen(false);
      setBannerError(null);
      setIsBannerConfirmed(false);
      setSelectedBannerFile(null);
      setBannerIndexToChange(null);
    } catch (e) {
      setBannerError("Failed to add or update banner. Please try again.");
    }
  };

  const deleteBanner = async (index) => {
    try {
      const bannerURL = banners[index];
      const bannerPath = decodeURIComponent(bannerURL.split("/o/")[1].split("?")[0]);
      const bannerRef = ref(storage, bannerPath);
      await deleteObject(bannerRef).catch((e) => console.warn("Failed to delete banner from storage:", e));

      const updatedBanners = banners.filter((_, i) => i !== index);
      await updateData("", { banners: updatedBanners });
      setMetaData((prev) => ({ ...prev, banners: updatedBanners }));
    } catch (e) {
      setBannerError("Failed to delete banner. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-fit text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="mt-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
        {/* Email */}
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="font-semibold">Email address</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The email address and store name associated with your account.
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium">{email}</p>
            <button
              onClick={toggleStoreNameInput}
              className="text-blue-500 text-sm ml-2 hover:underline"
            >
              {storeName} ✎
            </button>
          </div>
        </div>

        {/* Change Shop Icon */}
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="font-semibold">Shop Icon</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload a shop icon to personalize your store. Recommended size: 128x128px. Only PNG or JPG files are supported.
            </p>
          </div>
          <div className="text-right">
            {shopIcon && (
              <img
                src={shopIcon}
                alt="Shop Icon"
                className="w-8 h-8 object-cover inline-block mr-2"
              />
            )}
            <button
              onClick={toggleIconInput}
              className="text-blue-500 text-sm hover:underline"
            >
              {shopIcon ? "Change" : "Upload"}
            </button>
          </div>
        </div>

        {/* Banners */}
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="font-semibold">Banners</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload banners to showcase your store. Recommended size: 1280x720px. Only PNG or JPG files are supported.
            </p>
            {banners.length > 0 && (
              <div className="flex space-x-2 mt-2 overflow-x-auto">
                {banners.map((banner, index) => (
                  <div key={index} className="relative">
                    <img
                      src={banner}
                      alt={`Banner ${index + 1}`}
                      className="w-24 h-16 object-cover rounded"
                    />
                    <button
                      onClick={() => deleteBanner(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      X
                    </button>
                    <button
                      onClick={() => toggleBannerInput(index)}
                      className="absolute bottom-0 right-0 bg-blue-500 text-white rounded px-1 text-xs"
                    >
                      Change
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => toggleBannerInput()}
            className="text-blue-500 text-sm hover:underline"
          >
            Add Banner
          </button>
        </div>

        {/* Password */}
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="font-semibold">Password</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Set a unique password to protect your account.
            </p>
          </div>
          <button
            onClick={() => handlePasswordReset(email)}
            className="text-sm px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Change Password
          </button>
        </div>

        {/* Deactivate Account */}
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="font-semibold">Log out</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This will shut down your account. Your account will be reactive when you sign in again.
            </p>
          </div>
          <button
            onClick={() => handleSignOut(navigate)}
            className="text-blue-500 text-sm hover:underline"
          >
            Deactivate
          </button>
        </div>

        {/* Delete Account */}
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="font-semibold">Delete Account</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This will delete your account. Your account will be permanently deleted from Prodeel.
            </p>
          </div>
          <button className="text-red-500 text-sm hover:underline">Delete</button>
        </div>
      </div>

      {/* Slide-in Store Name Input Panel */}
      <div
        className={`fixed bottom-4 right-0 w-80 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg transform transition-transform duration-300 ${
          isStoreNameInputOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="text-lg font-semibold mb-2">Update Store Name</h2>
        <input
          type="text"
          value={newStoreName}
          onChange={(e) => setNewStoreName(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          placeholder="Enter new store name"
        />
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={isStoreNameConfirmed}
            onChange={() => setIsStoreNameConfirmed(!isStoreNameConfirmed)}
            className="mr-2"
          />
          <label className="text-sm">Confirm store name change</label>
        </div>
        {storeNameError && (
          <p className="text-red-500 text-sm mb-2">{storeNameError}</p>
        )}
        <div className="flex justify-end space-x-2">
          <button
            onClick={toggleStoreNameInput}
            className="text-sm px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={updateStoreName}
            disabled={!isStoreNameConfirmed}
            className={`text-sm px-4 py-2 rounded ${
              isStoreNameConfirmed
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>
      </div>

      {/* Slide-in Shop Icon Input Panel */}
      <div
        className={`fixed bottom-20 right-0 w-80 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg transform transition-transform duration-300 ${
          isIconInputOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="text-lg font-semibold mb-2">Update Shop Icon</h2>
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleIconFileChange}
          className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Recommended size: 128x128px
        </p>
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={isIconConfirmed}
            onChange={() => setIsIconConfirmed(!isIconConfirmed)}
            className="mr-2"
          />
          <label className="text-sm">Confirm shop icon change</label>
        </div>
        {iconError && <p className="text-red-500 text-sm mb-2">{iconError}</p>}
        <div className="flex justify-end space-x-2">
          <button
            onClick={toggleIconInput}
            className="text-sm px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={updateShopIcon}
            disabled={!isIconConfirmed}
            className={`text-sm px-4 py-2 rounded ${
              isIconConfirmed
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>
      </div>

      {/* Slide-in Banner Input Panel */}
      <div
        className={`fixed bottom-36 right-0 w-80 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg transform transition-transform duration-300 ${
          isBannerInputOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="text-lg font-semibold mb-2">
          {bannerIndexToChange !== null ? "Change Banner" : "Add Banner"}
        </h2>
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleBannerFileChange}
          className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Recommended size: 1280x720px
        </p>
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={isBannerConfirmed}
            onChange={() => setIsBannerConfirmed(!isBannerConfirmed)}
            className="mr-2"
          />
          <label className="text-sm">
            Confirm {bannerIndexToChange !== null ? "banner change" : "banner addition"}
          </label>
        </div>
        {bannerError && <p className="text-red-500 text-sm mb-2">{bannerError}</p>}
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => toggleBannerInput()}
            className="text-sm px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={updateBanner}
            disabled={!isBannerConfirmed}
            className={`text-sm px-4 py-2 rounded ${
              isBannerConfirmed
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}