'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Heart, Users, ArrowLeft, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';

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

const donationAmounts = ['500', '1000', '2500', '5000', '10000'];

export default function ContributionPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'donate';

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
        </div>
      </main>
      <Footer />
    </div>
  );
}

function DonationForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<DonationFormData>({
    defaultValues: {
      donationType: 'one-time',
      amount: '1000',
    },
  });

  const selectedAmount = watch('amount');

  const onSubmit = async (data: DonationFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Donation submitted:', data);
  };

  if (isSubmitSuccessful) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-lime/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-[#1a2e35]" />
        </div>
        <h3 className="text-2xl font-bold mb-3">Thank You!</h3>
        <p className="text-gray-600 mb-6">
          Your generous donation will help us continue our mission of supporting communities in need.
        </p>
        <Link href="/">
          <Button variant="ghost">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-lime/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-7 h-7 text-[#1a2e35]" />
        </div>
        <h2 className="text-2xl font-bold">Make a Donation</h2>
        <p className="text-gray-500 mt-2">Support our cause and help us make a difference</p>
      </div>

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
          <label className="flex-1">
            <input
              type="radio"
              value="monthly"
              {...register('donationType')}
              className="peer sr-only"
            />
            <div className="p-4 border-2 border-gray-200 rounded-xl text-center cursor-pointer transition-all peer-checked:border-[#1a2e35] peer-checked:bg-[#1a2e35]/5 hover:border-gray-300">
              <span className="font-medium">Monthly</span>
            </div>
          </label>
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
              />
              <div className="p-4 border-2 border-gray-200 rounded-xl text-center cursor-pointer transition-all peer-checked:border-[#1a2e35] peer-checked:bg-[#1a2e35] peer-checked:text-white hover:border-gray-300">
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
            />
            <div className="p-4 border-2 border-gray-200 rounded-xl text-center cursor-pointer transition-all peer-checked:border-[#1a2e35] peer-checked:bg-[#1a2e35] peer-checked:text-white hover:border-gray-300">
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a2e35]/20 focus:border-[#1a2e35] transition-all"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a2e35]/20 focus:border-[#1a2e35] transition-all"
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
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a2e35]/20 focus:border-[#1a2e35] transition-all resize-none"
          placeholder="Leave a message or note with your donation"
        />
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
            Processing...
          </>
        ) : (
          <>
            <Heart size={20} />
            Complete Donation
          </>
        )}
      </button>

      <p className="text-center text-sm text-gray-500">
        Your donation is secure and encrypted. You will receive a confirmation email.
      </p>
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Volunteer application submitted:', data);
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

