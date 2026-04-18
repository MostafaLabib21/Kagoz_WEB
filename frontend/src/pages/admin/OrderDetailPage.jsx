import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, ArrowLeft } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import StatusBadge from '../../components/admin/StatusBadge';
import OrderStatusTimeline from '../../components/admin/OrderStatusTimeline';
import { STATUS_LABELS, VALID_TRANSITIONS } from '../../constants/orderConstants';
import { useToast } from '../../context/ToastContext';

const OrderDetailPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [courierName, setCourierName] = useState('');
  const [courierTrackingNumber, setCourierTrackingNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: async () => { const { data } = await axiosInstance.get(`/api/admin/orders/${id}`); return data; },
  });

  const statusMutation = useMutation({
    mutationFn: (body) => axiosInstance.patch(`/api/admin/orders/${id}/status`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      showToast('Order status updated', 'success');
      setNewStatus('');
      setNote('');
      setCourierName('');
      setCourierTrackingNumber('');
      setPaymentMethod('');
      setBankAccountNo('');
      setMobileNumber('');
      setPaymentAmount('');
    },
    onError: (err) => showToast(err.response?.data?.message || 'Update failed', 'error'),
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;
  }

  if (!order) return <p className="text-center text-gray-400 mt-16">Order not found</p>;

  const isCOD = order.paymentMethod === 'cod';
  let nextStatuses = VALID_TRANSITIONS[order.status] || [];
  // For advance payment orders, delivered is the final status (no money_received)
  if (!isCOD) {
    nextStatuses = nextStatuses.filter((s) => s !== 'money_received');
  }
  const isTerminal = nextStatuses.length === 0;

  return (
    <div>
      {/* Header */}
      <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={16} /> Back to Orders
      </Link>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold font-mono text-gray-900">{order.orderId}</h1>
        <span className="text-sm text-gray-400">
          {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left */}
        <div className="col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-16 h-16 rounded object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded bg-gray-100" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    {item.variant && <p className="text-sm text-gray-500">{item.variant}</p>}
                    <p className="text-xs text-gray-400 font-mono">{item.productId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">৳{item.price?.toFixed(2)} × {item.quantity}</p>
                    <p className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 space-y-1 text-right text-sm">
              <p className="text-gray-600">Items total: <span className="font-medium">৳{order.itemsPrice?.toFixed(2)}</span></p>
              <p className="text-gray-600">Shipping: <span className="font-medium">৳{order.shippingPrice?.toFixed(2)}</span></p>
              <p className="text-gray-600">Tax: <span className="font-medium">৳{order.taxPrice?.toFixed(2)}</span></p>
              <div className="border-t pt-2 mt-2">
                <p className="text-lg font-bold text-gray-900">Grand Total: ৳{order.totalPrice?.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Customer & Shipping */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Customer & Shipping</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs uppercase text-gray-500 mb-2">Customer</h4>
                {order.user ? (
                  <>
                    <p className="font-medium text-gray-900">{order.user.name}</p>
                    <p className="text-sm text-gray-600">{order.user.email}</p>
                  </>
                ) : (
                  <p className="text-gray-500">Guest Order {order.guestEmail && `(${order.guestEmail})`}</p>
                )}
              </div>
              <div>
                <h4 className="text-xs uppercase text-gray-500 mb-2">Delivery Address</h4>
                {order.shippingAddress && (
                  <>
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p className="text-sm text-gray-600">Phone: {order.shippingAddress.phone || order.phone || '-'}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.house}, {order.shippingAddress.street}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.thana}, {order.shippingAddress.district} {order.shippingAddress.zip ? `- ${order.shippingAddress.zip}` : ''}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                  </>
                )}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-xs uppercase text-gray-500 mb-2">Payment</h4>
              <p className="text-sm text-gray-700">Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
              <p className="text-sm text-gray-700">Status: {order.paymentResult?.status || (order.paidAt ? 'Paid' : 'Pending')}</p>
              {order.paidAt && (
                <p className="text-sm text-gray-700">Paid at: {new Date(order.paidAt).toLocaleDateString('en-GB')}</p>
              )}
              {!isCOD && ['confirmed', 'shipped_to_courier', 'out_for_delivery', 'delivered'].includes(order.status) && (
                <span className="inline-block mt-2 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded">
                  Money Received in Advance
                </span>
              )}
              {order.advancePaymentDetails?.method && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
                  <p className="font-medium text-gray-700">Payment Details:</p>
                  <p className="text-gray-600">Method: {order.advancePaymentDetails.method === 'bank' ? 'Bank Transfer' : order.advancePaymentDetails.method.charAt(0).toUpperCase() + order.advancePaymentDetails.method.slice(1)}</p>
                  {order.advancePaymentDetails.bankAccountNo && <p className="text-gray-600">Account No: {order.advancePaymentDetails.bankAccountNo}</p>}
                  {order.advancePaymentDetails.mobileNumber && <p className="text-gray-600">Mobile: {order.advancePaymentDetails.mobileNumber}</p>}
                  {order.advancePaymentDetails.amount > 0 && <p className="text-gray-600">Amount: ৳{order.advancePaymentDetails.amount.toFixed(2)}</p>}
                </div>
              )}
            </div>
            {order.courierInfo?.name && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-xs uppercase text-gray-500 mb-2">Courier Info</h4>
                <p className="text-sm text-gray-700">Courier: {order.courierInfo.name}</p>
                {order.courierInfo.trackingNumber && <p className="text-sm text-gray-700">Tracking: {order.courierInfo.trackingNumber}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="col-span-1 space-y-6">
          {/* Update Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Update Status</h3>
            <div className="mb-4">
              <StatusBadge status={order.status} />
            </div>
            {isTerminal ? (
              <p className="text-sm text-gray-400 italic">
                {!isCOD && order.status === 'delivered'
                  ? 'Order delivered — advance payment already received'
                  : 'Order is complete — no further updates'}
              </p>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Change status to:</label>
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">Select new status</option>
                    {nextStatuses.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>

                {/* Courier info - required when shipping */}
                {newStatus === 'shipped_to_courier' && (
                  <div className="space-y-2 p-3 bg-purple-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Courier Name *</label>
                      <input type="text" value={courierName} onChange={(e) => setCourierName(e.target.value)}
                        placeholder="e.g. Pathao, RedX, Sundorban"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number (optional)</label>
                      <input type="text" value={courierTrackingNumber} onChange={(e) => setCourierTrackingNumber(e.target.value)}
                        placeholder="Tracking ID"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  </div>
                )}

                {/* Advance payment recording - show when confirming advance payment orders */}
                {!isCOD && newStatus === 'confirmed' && !order.advancePaymentDetails?.method && (
                  <div className="space-y-2 p-3 bg-emerald-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Record Payment Received</p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Channel</label>
                      <select value={paymentMethod} onChange={(e) => { setPaymentMethod(e.target.value); setBankAccountNo(''); setMobileNumber(''); }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="">Select payment method</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="bkash">bKash</option>
                        <option value="nagad">Nagad</option>
                        <option value="rocket">Rocket</option>
                      </select>
                    </div>
                    {paymentMethod === 'bank' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account No.</label>
                        <input type="text" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)}
                          placeholder="Account number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      </div>
                    )}
                    {['bkash', 'nagad', 'rocket'].includes(paymentMethod) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                        <input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)}
                          placeholder="01XXXXXXXXX"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      </div>
                    )}
                    {paymentMethod && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (৳)</label>
                        <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)}
                          placeholder={order.totalPrice?.toFixed(2)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                  <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note about this status change..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <button
                  onClick={() => {
                    const body = { status: newStatus, note };
                    if (newStatus === 'shipped_to_courier') {
                      body.courierName = courierName;
                      body.courierTrackingNumber = courierTrackingNumber;
                    }
                    if (!isCOD && newStatus === 'confirmed' && paymentMethod) {
                      body.advancePaymentDetails = {
                        method: paymentMethod,
                        bankAccountNo,
                        mobileNumber,
                        amount: paymentAmount || order.totalPrice,
                      };
                    }
                    statusMutation.mutate(body);
                  }}
                  disabled={!newStatus || statusMutation.isPending || (newStatus === 'shipped_to_courier' && !courierName.trim())}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {statusMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                  Update Status
                </button>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <OrderStatusTimeline statusHistory={order.statusHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
