'use client';

import { useTranslate } from '@tolgee/react';
import { DonationForm } from '@/components/DonationForm';

export default function PublicDonationPage() {
  const { t } = useTranslate();

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-md mx-auto py-20 px-6">
        <header className="text-center mb-10">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
            Donate Iftaar Meals
          </h1>
          <p className="text-sm text-slate-500">
            Submit your donation proof to help us coordinate food packets.
          </p>
        </header>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
          <DonationForm />
        </div>

        <footer className="mt-12 text-center">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em]">
            Coordination Portal
          </p>
        </footer>
      </div>
    </div>
  );
}
