import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, Loader2, X, Sparkles } from "lucide-react";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { changePassword, isChangingPassword } = useAuthStore();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (formData.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }

    const success = await changePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });

    if (success) {
      onClose();
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box relative bg-base-100 backdrop-blur-md border border-base-300 shadow-xl p-8 max-w-md">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-4 top-4"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary-content" />
          </div>
          <h2 className="text-2xl font-bold text-base-content">
            Change Password
          </h2>
          <p className="text-base-content/70 mt-2">
            Update your password for enhanced security.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            show={showPass.current}
            onToggle={() =>
              setShowPass({ ...showPass, current: !showPass.current })
            }
            placeholder="Current Password"
          />
          <InputField
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            show={showPass.new}
            onToggle={() => setShowPass({ ...showPass, new: !showPass.new })}
            placeholder="New Password"
          />
          <InputField
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            show={showPass.confirm}
            onToggle={() =>
              setShowPass({ ...showPass, confirm: !showPass.confirm })
            }
            placeholder="Confirm New Password"
          />

          <button
            type="submit"
            className="btn btn-primary w-full mt-4"
            disabled={isChangingPassword}
          >
            {isChangingPassword ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Update Password
              </>
            )}
          </button>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

// Reusable InputField sub-component
const InputField = ({ name, value, onChange, show, onToggle, placeholder }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text">{placeholder}</span>
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input input-bordered w-full pl-12 pr-12"
      />
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  </div>
);

export default ChangePasswordModal;
