import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TopHeader from "../../components/TopHeader/TopHeader";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { updateProfileApi, getCategoriesApi, uploadFileApi } from "../../services/api";
import { message, Spin, Select, Tag } from "antd";

const Preferences = () => {
  const { theme, setTheme } = useTheme();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    avatar: "",
    fullName: "",
    phoneNumber: "",
    bio: "",
    theme: "system",
    interests: [],
  });
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCats, setIsLoadingCats] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategoriesApi();
        if (res && res.statusCode === 200) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Fetch categories error:", error);
      } finally {
        setIsLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user) {
      setFormValues({
        avatar: user.avatar || "",
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.bio || "",
        theme: user.theme || theme || "system",
        interests: user.interests || [],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestsChange = (values) => {
    setFormValues((prev) => ({
      ...prev,
      interests: values,
    }));
  };

  const handleThemeChange = (newTheme) => {
    setFormValues((prev) => ({ ...prev, theme: newTheme }));
    setTheme(newTheme);
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (e.g., 2MB)
    if (file.size > 2 * 1024 * 1024) {
      message.error("Image size must be less than 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const hide = message.loading("Uploading avatar...", 0);
    try {
      const res = await uploadFileApi(formData);
      if (res && res.statusCode === 200) {
        setFormValues((prev) => ({ ...prev, avatar: res.data.url }));
        message.success("Avatar uploaded! Remember to save changes.");
      }
    } catch (error) {
      console.error("Upload avatar error:", error);
      message.error("Failed to upload avatar");
    } finally {
      hide();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await updateProfileApi(formValues);
      if (res && res.statusCode === 200) {
        message.success("Profile updated successfully");
        await refreshUser(true);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      message.error(
        error.response?.data?.message || "Failed to update profile",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f9fafb] dark:bg-background-dark">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-full bg-[#f9fafb] dark:bg-background-dark relative">
      <TopHeader title="Settings & Preferences" />
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <form
          onSubmit={handleSave}
          className="max-w-8xl mx-auto space-y-8 pb-20"
        >
          {/* Profile Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-text-light dark:text-white">
                  Profile & Account
                </h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  Manage your personal information and profile visibility.
                </p>
              </div>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6 shadow-sm transition-colors">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div 
                  onClick={handleAvatarClick}
                  className="relative group cursor-pointer flex-shrink-0 mx-auto md:mx-0"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-xl transition-transform group-hover:scale-105 active:scale-95">
                    <img
                      alt="Profile"
                      className="w-full h-full object-cover"
                      src={
                        formValues.avatar ||
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || "User")}&background=3b82f6&color=fff`
                      }
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-2xl">
                      photo_camera
                    </span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                <div className="flex-1 w-full space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark ml-1">
                        Full Name
                      </label>
                      <input
                        name="fullName"
                        value={formValues.fullName}
                        onChange={handleChange}
                        className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white dark:bg-slate-800"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark ml-1">
                        Email Address
                      </label>
                      <input
                        disabled
                        value={user.email}
                        className="w-full bg-gray-100 dark:bg-gray-800/50 border border-border-light dark:border-border-dark rounded-xl px-4 py-3 text-sm cursor-not-allowed opacity-70 dark:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark ml-1">
                        Phone Number
                      </label>
                      <input
                        name="phoneNumber"
                        value={formValues.phoneNumber}
                        onChange={handleChange}
                        className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white dark:bg-slate-800"
                        placeholder="e.g. +84 123 456 789"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark ml-1">
                        Account Role
                      </label>
                      <div className="flex items-center h-[46px] px-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-border-light dark:border-border-dark text-xs font-black text-primary uppercase tracking-[0.2em]">
                        {user.role}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark ml-1">
                      Interests & Categories
                    </label>
                    <Select
                      mode="multiple"
                      allowClear
                      placeholder="Select topics you are interested in"
                      value={formValues.interests}
                      onChange={handleInterestsChange}
                      className="w-full custom-antd-select"
                      loading={isLoadingCats}
                      options={categories.map((cat) => ({
                        label: cat.name,
                        value: cat._id,
                      }))}
                      tagRender={({ label, closable, onClose }) => (
                        <Tag
                          closable={closable}
                          onClose={onClose}
                          className="bg-primary/10 border-primary/20 text-primary font-bold text-[10px] rounded-md py-0.5 px-2 uppercase tracking-wider"
                        >
                          {label}
                        </Tag>
                      )}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark ml-1">
                      Bio / About Me
                    </label>
                    <textarea
                      name="bio"
                      value={formValues.bio}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white dark:bg-slate-800 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-border-light dark:border-border-dark" />

          {/* Interface Section */}
          <section>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-text-light dark:text-white">
                Interface & Experience
              </h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                Customize how SmartShare AI looks and behaves for you.
              </p>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden shadow-sm transition-colors">
              <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border-light dark:border-border-dark">
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex-shrink-0">
                    <span className="material-symbols-outlined text-2xl">
                      dark_mode
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-text-light dark:text-white">
                      Theme Preference
                    </p>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark font-medium">
                      Choose between light, dark or follow system
                    </p>
                  </div>
                </div>
                <div className="flex bg-background-light dark:bg-background-dark p-1.5 rounded-xl border border-border-light dark:border-border-dark w-full sm:w-auto">
                  {["light", "dark", "system"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleThemeChange(t)}
                      className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${formValues.theme === t ? "bg-white dark:bg-primary text-primary dark:text-white shadow-xl translate-z-1" : "text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-6 flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex-shrink-0">
                    <span className="material-symbols-outlined text-2xl">
                      auto_awesome
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-text-light dark:text-white">
                      AI Assistant
                    </p>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark font-medium">
                      Enable AI-powered recommendations and shortcuts
                    </p>
                  </div>
                </div>
                <div className="relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-gray-200 dark:bg-gray-700">
                  <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-bold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-10 py-3.5 bg-primary text-white rounded-xl shadow-2xl shadow-primary/30 hover:bg-primary-hover hover:-translate-y-1 active:translate-y-0 transition-all font-bold text-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Spin size="small" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    save
                  </span>
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .custom-antd-select .ant-select-selector {
          background-color: transparent !important;
          border-radius: 12px !important;
          border-color: #e2e8f0 !important;
          padding: 6px 12px !important;
          min-height: 46px !important;
        }
        .dark .custom-antd-select .ant-select-selector {
          background-color: #1e293b !important;
          border-color: #334155 !important;
          color: white !important;
        }
        .custom-antd-select .ant-select-selection-placeholder {
          color: #94a3b8 !important;
          font-size: 14px !important;
        }
      `}</style>
    </main>
  );
};

export default Preferences;
