import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, Info, Loader2, MapPin } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const getStrength = (password) => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < 8) {
    return { score: 1, label: 'Weak', color: 'bg-red-500' };
  }

  if (hasUppercase && hasNumber && hasSpecial && hasLowercase) {
    return { score: 4, label: 'Strong', color: 'bg-green-500' };
  }

  if (hasUppercase && hasNumber) {
    return { score: 3, label: 'Good', color: 'bg-yellow-500' };
  }

  return { score: 2, label: 'Fair', color: 'bg-orange-500' };
};

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();
  const { showToast } = useToast();

  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [addressForm, setAddressForm] = useState({
    district: '',
    cityUpozela: '',
    street: '',
    zip: '',
    country: 'Bangladesh',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [passwordMismatchError, setPasswordMismatchError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/auth/profile');
      return response.data;
    },
  });

  const user = data?.user;

  useEffect(() => {
    if (!user) {
      return;
    }

    setProfileForm({
      name: user.name || '',
      phone: user.phone || '',
    });

    setAddressForm({
      district: user.address?.district || '',
      cityUpozela: user.address?.cityUpozela || '',
      street: user.address?.street || '',
      zip: user.address?.zip || '',
      country: user.address?.country || 'Bangladesh',
    });
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.put('/api/auth/profile', payload);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      await refreshUser();
      showToast('Profile updated', 'success');
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Failed to update profile', 'error');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.put('/api/auth/change-password', payload);
      return response.data;
    },
    onSuccess: () => {
      setEditingPassword(false);
      setPasswordError('');
      setPasswordMismatchError('');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      showToast('Password updated successfully', 'success');
    },
    onError: (error) => {
      setPasswordError(error.response?.data?.message || 'Failed to update password');
    },
  });

  const strength = useMemo(() => getStrength(passwordForm.newPassword), [passwordForm.newPassword]);

  const handleCancelProfileEdit = () => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
    setEditingProfile(false);
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    await updateProfileMutation.mutateAsync({
      name: profileForm.name,
      phone: profileForm.phone,
    });

    if (!updateProfileMutation.isError) {
      setEditingProfile(false);
    }
  };

  const handleCancelAddressEdit = () => {
    if (user) {
      setAddressForm({
        district: user.address?.district || '',
        cityUpozela: user.address?.cityUpozela || '',
        street: user.address?.street || '',
        zip: user.address?.zip || '',
        country: user.address?.country || 'Bangladesh',
      });
    }
    setEditingAddress(false);
  };

  const handleSaveAddress = async (event) => {
    event.preventDefault();

    await updateProfileMutation.mutateAsync({
      address: addressForm,
    });

    if (!updateProfileMutation.isError) {
      setEditingAddress(false);
    }
  };

  const handleCancelPasswordEdit = () => {
    setEditingPassword(false);
    setPasswordError('');
    setPasswordMismatchError('');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  const handleSavePassword = async (event) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordMismatchError('');

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmNewPassword
    ) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordMismatchError('Passwords do not match');
      return;
    }

    await changePasswordMutation.mutateAsync({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="h-8 w-40 bg-gray-200 animate-pulse rounded-sm mb-4" />
        <div className="h-24 bg-gray-200 animate-pulse rounded-sm mb-6" />
        <div className="h-40 bg-gray-200 animate-pulse rounded-sm mb-6" />
        <div className="h-40 bg-gray-200 animate-pulse rounded-sm" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-700 mb-4">Failed to load profile. Please try again.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="border border-gray-300 rounded-sm px-4 py-2 text-sm hover:bg-gray-50"
        >
          Retry
        </button>
      </div>
    );
  }

  const avatarLetter = (user.name || '?').charAt(0).toUpperCase();
  const hasAddress = Boolean(user.address?.street);
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '-';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account details</p>
        </div>
        <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
          {avatarLetter}
        </div>
      </div>

      <div className="space-y-6">
        <section className="bg-white border border-gray-200 rounded-sm p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-gray-900">Personal Information</h2>
            <button
              type="button"
              onClick={() => setEditingProfile((current) => !current)}
              className="text-sm text-gray-600 border border-gray-300 rounded-sm px-3 py-1.5 hover:bg-gray-50"
            >
              {editingProfile ? 'Close' : 'Edit'}
            </button>
          </div>

          {!editingProfile ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-sm font-medium text-gray-900">{user.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-900">{user.email || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{user.phone || '-'}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 italic mt-2">Email address cannot be changed</p>
            </>
          ) : (
            <form className="space-y-4" onSubmit={handleSaveProfile}>
              <div>
                <label htmlFor="profile-name" className="block text-sm text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label htmlFor="profile-phone" className="block text-sm text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  id="profile-phone"
                  type="text"
                  value={profileForm.phone}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, phone: event.target.value }))}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label htmlFor="profile-email" className="block text-sm text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="profile-email"
                  type="email"
                  disabled
                  value={user.email || ''}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm bg-gray-100 text-gray-500"
                />
              </div>

              <div className="flex gap-3 mt-5 justify-end">
                <button
                  type="button"
                  onClick={handleCancelProfileEdit}
                  className="border border-gray-300 rounded-sm px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="bg-gray-900 text-white rounded-sm px-4 py-2 text-sm disabled:opacity-60 inline-flex items-center gap-2"
                >
                  {updateProfileMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="bg-white border border-gray-200 rounded-sm p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-gray-900">Default Delivery Address</h2>
            <button
              type="button"
              onClick={() => setEditingAddress((current) => !current)}
              className="text-sm text-gray-600 border border-gray-300 rounded-sm px-3 py-1.5 hover:bg-gray-50"
            >
              {editingAddress ? 'Close' : 'Edit'}
            </button>
          </div>

          {!editingAddress ? (
            hasAddress ? (
              <div className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p>{user.address.district}</p>
                  <p>{user.address.cityUpozela}</p>
                  <p>{user.address.street}</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 italic text-sm">No address saved yet</p>
                <button
                  type="button"
                  onClick={() => setEditingAddress(true)}
                  className="text-sm text-gray-700 underline mt-2"
                >
                  Add Address
                </button>
              </div>
            )
          ) : (
            <form className="space-y-4" onSubmit={handleSaveAddress}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="address-district" className="block text-sm text-gray-700 mb-1">
                    District
                  </label>
                  <input
                    id="address-district"
                    type="text"
                    value={addressForm.district}
                    onChange={(event) =>
                      setAddressForm((prev) => ({ ...prev, district: event.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="address-city-upozela" className="block text-sm text-gray-700 mb-1">
                    City / Upozela
                  </label>
                  <input
                    id="address-city-upozela"
                    type="text"
                    value={addressForm.cityUpozela}
                    onChange={(event) =>
                      setAddressForm((prev) => ({ ...prev, cityUpozela: event.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="address-street" className="block text-sm text-gray-700 mb-1">
                    Street
                  </label>
                  <input
                    id="address-street"
                    type="text"
                    value={addressForm.street}
                    onChange={(event) =>
                      setAddressForm((prev) => ({ ...prev, street: event.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-5 justify-end">
                <button
                  type="button"
                  onClick={handleCancelAddressEdit}
                  className="border border-gray-300 rounded-sm px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="bg-gray-900 text-white rounded-sm px-4 py-2 text-sm disabled:opacity-60 inline-flex items-center gap-2"
                >
                  {updateProfileMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="bg-white border border-gray-200 rounded-sm p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-gray-900">Password & Security</h2>
            {user.authProvider === 'local' && (
              <button
                type="button"
                onClick={() => setEditingPassword((current) => !current)}
                className="text-sm text-gray-600 border border-gray-300 rounded-sm px-3 py-1.5 hover:bg-gray-50"
              >
                {editingPassword ? 'Close' : 'Change Password'}
              </button>
            )}
          </div>

          {user.authProvider === 'google' ? (
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-700 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">You signed in with Google</p>
                <p className="text-sm text-blue-700 mt-1">
                  Password management is handled by your Google account.
                </p>
              </div>
            </div>
          ) : !editingPassword ? (
            <div>
              <p className="text-gray-400 text-sm">••••••••</p>
              <p className="text-xs text-gray-400 mt-1">Last updated: -</p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSavePassword}>
              <div>
                <label htmlFor="current-password" className="block text-sm text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(event) =>
                      setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && <p className="text-xs text-red-600 mt-1">{passwordError}</p>}
              </div>

              <div>
                <label htmlFor="new-password" className="block text-sm text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(event) =>
                      setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {passwordForm.newPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4].map((bar) => (
                        <div
                          key={bar}
                          className={`h-1.5 w-8 rounded ${bar <= strength.score ? strength.color : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">{strength.label}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmNewPassword}
                    onChange={(event) =>
                      setPasswordForm((prev) => ({ ...prev, confirmNewPassword: event.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordMismatchError && (
                  <p className="text-xs text-red-600 mt-1">{passwordMismatchError}</p>
                )}
              </div>

              <div className="flex gap-3 mt-5 justify-end">
                <button
                  type="button"
                  onClick={handleCancelPasswordEdit}
                  className="border border-gray-300 rounded-sm px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="bg-gray-900 text-white rounded-sm px-4 py-2 text-sm disabled:opacity-60 inline-flex items-center gap-2"
                >
                  {changePasswordMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update Password
                </button>
              </div>
            </form>
          )}
        </section>
      </div>

      <div className="mt-4 text-center text-xs text-gray-400">
        <p>Member since {joinedDate}</p>
        <p>
          Account type: {user.authProvider === 'google' ? 'Google Account' : 'Email Account'}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
