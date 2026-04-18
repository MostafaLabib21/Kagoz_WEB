import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Save, Loader } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { useToast } from '../../context/ToastContext';

const SettingsPage = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { register, handleSubmit, setValue } = useForm();

  const { data: deliveryData, isLoading } = useQuery({
    queryKey: ['deliveryCharge'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/admin/settings/delivery');
      return data;
    },
  });

  useEffect(() => {
    if (deliveryData) {
      setValue('amount', deliveryData.amount);
    }
  }, [deliveryData, setValue]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post('/api/admin/settings/delivery', data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['deliveryCharge']);
      showToast('Delivery charge updated successfully', 'success');
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Failed to update', 'error');
    },
  });

  const onSubmit = (data) => {
    updateMutation.mutate({ amount: Number(data.amount) });
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Store Settings</h1>
      
      <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Charge</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Standard Delivery Fee (BDT)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { required: true, min: 0 })}
              className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
          
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {updateMutation.isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
