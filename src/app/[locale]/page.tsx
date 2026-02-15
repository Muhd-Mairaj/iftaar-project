'use client';

import { useTranslate } from '@tolgee/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DonationSchema, DonationInput } from '@/lib/validations';
import { submitDonation } from '@/lib/actions';
import { useState } from 'react';
import { Upload, CheckCircle2 } from 'lucide-react';

export default function PublicDonationPage() {
  const { t } = useTranslate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DonationInput>({
    resolver: zodResolver(DonationSchema),
    defaultValues: {
      quantity: 1,
      proof_url: '',
    },
  });

  const onSubmit = async (data: DonationInput) => {
    setIsSubmitting(true);
    try {
      await submitDonation(data);
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error(error);
      alert('Failed to submit donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
        <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          JazakAllah Khair!
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-md">
          Your donation has been submitted and is pending verification by the Muazzin.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-8 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          {t('donate_now')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {t('app_title')}
          </h1>
          <p className="text-slate-500 mt-2">{t('donate_now')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t('quantity')}
            </label>
            <input
              type="number"
              {...register('quantity', { valueAsNumber: true })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="How many packets?"
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t('proof_of_payment')}
            </label>
            <div className="relative">
              <input
                type="text"
                {...register('proof_url')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all pl-10"
                placeholder="URL to receipt/screenshot"
              />
              <Upload className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            </div>
            {errors.proof_url && (
              <p className="text-red-500 text-xs mt-1">{errors.proof_url.message}</p>
            )}
            <p className="text-slate-400 text-[10px] mt-2 italic px-1">
              * In a production app, we would use a file upload to Supabase Storage.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 dark:shadow-none hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : t('submit_donation')}
          </button>
        </form>
      </div>
    </div>
  );
}
