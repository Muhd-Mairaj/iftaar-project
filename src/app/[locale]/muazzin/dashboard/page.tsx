'use client';

import { useTranslate } from '@tolgee/react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { LayoutDashboard, Utensils, ClipboardList, CheckCircle, XCircle } from 'lucide-react';

export default function MuazzinDashboard() {
  const { t } = useTranslate();
  const supabase = createClient();

  // Real-time polling for pending donations
  const { data: donations, isLoading: isLoadingDonations } = useQuery({
    queryKey: ['pending-donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000,
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <LayoutDashboard className="text-emerald-600" />
            {t('muazzin_dashboard')}
          </h1>
          <p className="text-slate-500 mt-1">Verify donations and manage collection requests</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-4 rounded-2xl">
          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{t('available_packets')}</span>
          <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">124</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Donations List */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h2 className="font-bold flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-emerald-600" />
                {t('pending_donations')}
              </h2>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                {donations?.length || 0} New
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {isLoadingDonations ? (
                <div className="p-12 text-center text-slate-400">Loading donations...</div>
              ) : donations?.length === 0 ? (
                <div className="p-12 text-center text-slate-400">No pending donations to review</div>
              ) : (
                donations?.map((donation) => (
                  <div key={donation.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xl">
                        {donation.quantity}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">Packet Donation</div>
                        <a href={donation.proof_url} target="_blank" className="text-xs text-blue-500 hover:underline">View Proof</a>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-xl transition-all border border-transparent hover:border-emerald-100">
                        <CheckCircle className="w-6 h-6" />
                      </button>
                      <button className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all border border-transparent hover:border-rose-100">
                        <XCircle className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Create Request Sidebar */}
        <div className="space-y-6">
          <section className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
              <Utensils className="w-5 h-5 text-emerald-600" />
              {t('create_request')}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('quantity')}</label>
                <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('target_date')}</label>
                <input type="date" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <button className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-all mt-4">
                Submit Request
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
