'use client';

import React, { Suspense, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Heart, Users, ArrowLeft, CheckCircle, XCircle, CreditCard, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';

// Declare PhonePe checkout global
declare global {
  interface Window {
    PhonePeCheckout?: {
      transact: (options: {
        tokenUrl: string;
        callback: (response: string) => void;
        type: 'IFRAME' | 'REDIRECT';
      }) => void;
      closePage: () => void;
    };
  }
}

// Types for forms
interface DonationFormData {
  fullName: string;
  email: string;
  phone?: string;
  amount: string;
  customAmount?: string;
  donationType: 'one-time' | 'monthly';
  message?: string;
}

interface VolunteerFormData {
  fullName: string;
  email: string;
  phone: string;
  skills: string;
  availability: string;
  message: string;
}

// Payment states
type PaymentState = 
  | 'idle'
  | 'creating_order'
  | 'payment_pending'
  | 'verifying'
  | 'success'
  | 'failed'
  | 'cancelled';

const donationAmounts = ['500', '1000', '2500', '5000', '10000'];

function ContributionContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'donate';

  return (
    <>
      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-center mb-10"
      >
        <div className="inline-flex bg-white rounded-full p-1.5 border border-gray-200 shadow-sm">
          <Link
            href="/contribution?tab=donate"
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-base font-medium transition-all duration-300 ${
              activeTab === 'donate'
                ? 'bg-[#1a2e35] text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Heart size={18} />
            Donate
          </Link>
          <Link
            href="/contribution?tab=volunteer"
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-base font-medium transition-all duration-300 ${
              activeTab === 'volunteer'
                ? 'bg-[#1a2e35] text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users size={18} />
            Volunteer
          </Link>
        </div>
      </motion.div>

      {/* Form Container */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 md:p-10"
      >
        {activeTab === 'donate' ? <DonationForm /> : <VolunteerForm />}
      </motion.div>
    </>
  );
}

function ContributionFallback() {
  return (
    <>
      {/* Tab Navigation Skeleton */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-white rounded-full p-1.5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 animate-pulse w-28 h-12" />
          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-50 animate-pulse w-32 h-12" />
        </div>
      </div>
      {/* Form Container Skeleton */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 md:p-10">
        <div className="animate-pulse space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-gray-200 rounded-full mb-4" />
            <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-64" />
          </div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-100 rounded-xl" />
            <div className="h-12 bg-gray-100 rounded-xl" />
            <div className="h-12 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    </>
  );
}

export default function ContributionPage() {
  return (
    <div className="font-sans text-slate-900 bg-gray-50 min-h-screen flex flex-col">
      <Navbar forceScrolled />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Back Link */}
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Make a Difference</h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Your contribution helps us continue our mission of empowering communities through education, food security, and human rights advocacy.
            </p>
          </motion.div>

          <Suspense fallback={<ContributionFallback />}>
            <ContributionContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function DonationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  
  // Store donor info for verification
  const [donorInfo, setDonorInfo] = useState<{
    fullName: string;
    email: string;
    phone?: string;
    message?: string;
  } | null>(null);
  
  // Store order ID for verification
  const [merchantOrderId, setMerchantOrderId] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<DonationFormData>({
    defaultValues: {
      donationType: 'one-time',
      amount: '1000',
    },
  });

  const selectedAmount = watch('amount');

  // Handle payment callback from URL (redirect mode fallback)
  useEffect(() => {
    const paymentCallback = searchParams.get('payment');
    const orderId = searchParams.get('orderId');
    
    if (paymentCallback === 'callback' && orderId) {
      // Clear URL params
      router.replace('/contribution?tab=donate', { scroll: false });
      
      // Verify payment status
      setMerchantOrderId(orderId);
      setPaymentState('verifying');
      
      // Try to get stored donor info from sessionStorage
      const storedDonorInfo = sessionStorage.getItem('donorInfo');
      if (storedDonorInfo) {
        setDonorInfo(JSON.parse(storedDonorInfo));
      }
    }
  }, [searchParams, router]);

  // Verify payment when in verifying state
  useEffect(() => {
    if (paymentState === 'verifying' && merchantOrderId) {
      verifyPayment();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentState, merchantOrderId]);

  const verifyPayment = useCallback(async () => {
    try {
      const response = await fetch('/api/phonepe/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantOrderId,
          donorInfo: donorInfo || {
            fullName: 'Anonymous',
            email: 'unknown@example.com',
          },
        }),
      });

      const result = await response.json();

      if (result.success && result.status === 'COMPLETED') {
        setTransactionId(result.transactionId);
        setPaidAmount(result.amount);
        setPaymentState('success');
        sessionStorage.removeItem('donorInfo');
      } else if (result.status === 'PENDING') {
        // Still pending, retry after delay
        setTimeout(verifyPayment, 3000);
      } else {
        setErrorMessage(result.message || 'Payment verification failed');
        setPaymentState('failed');
      }
    } catch {
      setErrorMessage('Could not verify payment status. Please contact support.');
      setPaymentState('failed');
    }
  }, [merchantOrderId, donorInfo]);

  const handlePhonePeCallback = useCallback((response: string) => {
    console.log('PhonePe callback response:', response);
    
    if (response === 'CONCLUDED') {
      // Payment flow concluded (success or failure) - verify status
      setPaymentState('verifying');
    } else if (response === 'USER_CANCEL') {
      // User cancelled the payment
      setPaymentState('cancelled');
      setErrorMessage('Payment was cancelled. You can try again.');
    } else {
      // Unknown response
      setPaymentState('failed');
      setErrorMessage('Payment could not be completed. Please try again.');
    }
  }, []);

  const initiatePayment = async (data: DonationFormData) => {
    setErrorMessage('');
    setPaymentState('creating_order');

    // Calculate final amount
    const amount = data.amount === 'custom' 
      ? parseInt(data.customAmount || '0') 
      : parseInt(data.amount);

    if (!amount || amount < 1) {
      setErrorMessage('Please enter a valid donation amount');
      setPaymentState('idle');
      return;
    }

    // Store donor info
    const donor = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      message: data.message,
    };
    setDonorInfo(donor);
    
    // Store in sessionStorage for redirect fallback
    sessionStorage.setItem('donorInfo', JSON.stringify(donor));

    try {
      // Create order on server
      const response = await fetch('/api/phonepe/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          message: data.message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create payment order');
      }

      // Store merchant order ID for verification
      setMerchantOrderId(result.merchantOrderId);
      setPaymentState('payment_pending');

      // Check if PhonePe checkout is available
      if (!window.PhonePeCheckout) {
        // Fallback: redirect directly
        window.location.href = result.redirectUrl;
        return;
      }

      // Open PhonePe PayPage in iframe
      window.PhonePeCheckout.transact({
        tokenUrl: result.redirectUrl,
        callback: handlePhonePeCallback,
        type: 'IFRAME',
      });

    } catch (error) {
      console.error('Payment initiation error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to initiate payment');
      setPaymentState('failed');
    }
  };

  // Success state
  if (paymentState === 'success') {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold mb-2 text-emerald-700">Payment Successful!</h3>
          <p className="text-3xl font-bold text-[#1a2e35] mb-4">₹{paidAmount.toLocaleString('en-IN')}</p>
          <p className="text-gray-600 mb-2">
            Thank you for your generous donation, <span className="font-semibold">{donorInfo?.fullName}</span>!
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Transaction ID: <span className="font-mono">{transactionId}</span>
          </p>
          <p className="text-gray-500 mb-8">
            A confirmation email has been sent to <span className="font-medium">{donorInfo?.email}</span>
          </p>
          <Link href="/">
            <Button variant="ghost">Return to Home</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Failed/Cancelled state
  if (paymentState === 'failed' || paymentState === 'cancelled') {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-24 h-24 bg-gradient-to-br from-red-50 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <XCircle className="w-12 h-12 text-red-500" />
        </motion.div>
        <h3 className="text-2xl font-bold mb-3 text-gray-800">
          {paymentState === 'cancelled' ? 'Payment Cancelled' : 'Payment Failed'}
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {errorMessage || 'Something went wrong with your payment. Please try again.'}
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            variant="ghost"
            onClick={() => {
              setPaymentState('idle');
              setErrorMessage('');
            }}
          >
            Try Again
          </Button>
          <Link href="/">
            <Button variant="ghost" className="border-gray-200">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Verifying state
  if (paymentState === 'verifying') {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
        <h3 className="text-xl font-bold mb-2">Verifying Payment...</h3>
        <p className="text-gray-500">Please wait while we confirm your payment.</p>
      </div>
    );
  }

  // Processing state (creating order or waiting for payment)
  const isProcessing = paymentState === 'creating_order' || paymentState === 'payment_pending';

  return (
    <form onSubmit={handleSubmit(initiatePayment)} className="space-y-8">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-lime/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-7 h-7 text-[#1a2e35]" />
        </div>
        <h2 className="text-2xl font-bold">Make a Donation</h2>
        <p className="text-gray-500 mt-2">Support our cause and help us make a difference</p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {errorMessage}
        </div>
      )}

      {/* Donation Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Donation Type</label>
        <div className="flex gap-3">
          <label className="flex-1">
            <input
              type="radio"
              value="one-time"
              {...register('donationType')}
              className="peer sr-only"
            />
            <div className="p-4 border-2 border-gray-200 rounded-xl text-center cursor-pointer transition-all peer-checked:border-[#1a2e35] peer-checked:bg-[#1a2e35]/5 hover:border-gray-300">
              <span className="font-medium">One-time</span>
            </div>
          </label>
          <div className="flex-1 relative">
            <div className="p-4 border-2 border-gray-100 rounded-xl text-center bg-gray-50 cursor-not-allowed opacity-60">
              <span className="font-medium text-gray-400">Monthly</span>
            </div>
            <span className="absolute -top-2 -right-2 bg-amber-100 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* Donation Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Select Amount (₹)</label>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {donationAmounts.map((amount) => (
            <label key={amount}>
              <input
                type="radio"
                value={amount}
                {...register('amount')}
                className="peer sr-only"
                disabled={isProcessing}
              />
              <div className="p-4 border-2 border-gray-200 rounded-xl text-center cursor-pointer transition-all peer-checked:border-[#1a2e35] peer-checked:bg-[#1a2e35] peer-checked:text-white hover:border-gray-300 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed">
                <span className="font-semibold">₹{parseInt(amount).toLocaleString()}</span>
              </div>
            </label>
          ))}
          <label>
            <input
              type="radio"
              value="custom"
              {...register('amount')}
              className="peer sr-only"
              disabled={isProcessing}
            />
            <div className="p-4 border-2 border-gray-200 rounded-xl text-center cursor-pointer transition-all peer-checked:border-[#1a2e35] peer-checked:bg-[#1a2e35] peer-checked:text-white hover:border-gray-300 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed">
              <span className="font-semibold">Custom</span>
            </div>
          </label>
        </div>
        {selectedAmount === 'custom' && (
          <div className="mt-3">
            <input
              type="number"
              placeholder="Enter custom amount"
              {...register('customAmount', {
                required: selectedAmount === 'custom' ? 'Please enter an amount' : false,
                min: { value: 100, message: 'Minimum donation is ₹100' },
              })}
              disabled={isProcessing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a2e35]/20 focus:border-[#1a2e35] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.customAmount && (
              <p className="text-red-500 text-sm mt-1">{errors.customAmount.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Personal Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-2">Personal Details</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            {...register('fullName', { required: 'Full name is required' })}
            disabled={isProcessing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a2e35]/20 focus:border-[#1a2e35] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            disabled={isProcessing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a2e35]/20 focus:border-[#1a2e35] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
          <input
            type="tel"
            {...register('phone')}
            disabled={isProcessing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a2e35]/20 focus:border-[#1a2e35] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
        <textarea
          {...register('message')}
          rows={3}
          disabled={isProcessing}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a2e35]/20 focus:border-[#1a2e35] transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Leave a message or note with your donation"
        />
      </div>

      {/* Amount Summary */}
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Donation Amount</span>
          <span className="text-2xl font-bold text-[#1a2e35]">
            ₹{(selectedAmount === 'custom' 
              ? parseInt(getValues('customAmount') || '0') 
              : parseInt(selectedAmount || '0')
            ).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-[#1a2e35] text-white py-4 rounded-full font-semibold text-lg hover:bg-[#1a2e35]/90 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {paymentState === 'creating_order' ? 'Creating Order...' : 'Waiting for Payment...'}
          </>
        ) : (
          <>
            <CreditCard size={20} />
            Proceed to Pay
          </>
        )}
      </button>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">
          Secure payment powered by PhonePe
        </p>
        <p className="text-xs text-gray-400">
          You will be redirected to PhonePe to complete your payment
        </p>
      </div>
    </form>
  );
}

function VolunteerForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<VolunteerFormData>();

  const onSubmit = async (data: VolunteerFormData) => {
    const response = await fetch('/api/volunteer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit application');
    }
  };

  if (isSubmitSuccessful) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-lime/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-[#1a2e35]" />
        </div>
        <h3 className="text-2xl font-bold mb-3">Application Received!</h3>
        <p className="text-gray-600 mb-6">
          Thank you for your interest in volunteering. Our team will review your application and get back to you soon.
        </p>
        <Link href="/">
          <Button variant="ghost">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-lime/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-7 h-7 text-[#1a2e35]" />
        </div>
        <h2 className="text-2xl font-bold">Become a Volunteer</h2>
        <p className="text-gray-500 mt-2">Join our mission to create positive change in communities</p>
      </div>

      {/* Personal Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            {...register('fullName', { required: 'Full name is required' })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a2e35]/20 focus:border-[#1a2e35] transition-all"
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a2e35]/20 focus:border-[#1a2e35] transition-all"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            {...register('phone', { required: 'Phone number is required' })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a2e35]/20 focus:border-[#1a2e35] transition-all"
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Skills & Background */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Skills / Background *</label>
        <select
          {...register('skills', { required: 'Please select your background' })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a2e35]/20 focus:border-[#1a2e35] transition-all bg-white appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
          }}
        >
          <option value="">Select your background</option>
          <option value="legal">Legal</option>
          <option value="public-sector">Public Sector</option>
          <option value="education">Education</option>
          <option value="healthcare">Healthcare</option>
          <option value="technology">Technology</option>
          <option value="marketing">Marketing & Communications</option>
          <option value="other">Other</option>
        </select>
        {errors.skills && (
          <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
        )}
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Availability *</label>
        <select
          {...register('availability', { required: 'Please select your availability' })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a2e35]/20 focus:border-[#1a2e35] transition-all bg-white appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
          }}
        >
          <option value="">Select your availability</option>
          <option value="weekdays">Weekdays</option>
          <option value="weekends">Weekends</option>
          <option value="flexible">Flexible</option>
          <option value="few-hours-week">A few hours per week</option>
          <option value="few-hours-month">A few hours per month</option>
          <option value="project-based">Project-based</option>
        </select>
        {errors.availability && (
          <p className="text-red-500 text-sm mt-1">{errors.availability.message}</p>
        )}
      </div>

      {/* Message / Motivation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to volunteer? *</label>
        <textarea
          {...register('message', {
            required: 'Please tell us why you want to volunteer',
            minLength: { value: 20, message: 'Please write at least 20 characters' },
          })}
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a2e35]/20 focus:border-[#1a2e35] transition-all resize-none"
          placeholder="Tell us about your motivation and how you'd like to contribute..."
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#1a2e35] text-white py-4 rounded-full font-semibold text-lg hover:bg-[#1a2e35]/90 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Users size={20} />
            Submit Application
          </>
        )}
      </button>

      <p className="text-center text-sm text-gray-500">
        We'll review your application and contact you within 3-5 business days.
      </p>
    </form>
  );
}
