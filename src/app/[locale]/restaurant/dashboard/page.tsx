'use client';

import { useTranslate } from '@tolgee/react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { ChefHat, Truck, Clock, CheckCircle, Package } from 'lucide-react';

export default function RestaurantDashboard() {
  const { t } = useTranslate();
  const supabase = createClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['collection-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collection_requests')
        .select('*')
        .order('target_date', { ascending: true });
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000,
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <ChefHat className="text-orange-500" />
          {t('restaurant_dashboard')}
        </h1>
        <p className="text-slate-500 mt-1">Manage food preparation and collections</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <section className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="font-bold flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-500" />
              {t('collection_requests')}
            </h2>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {isLoading ? (
              <div className="p-12 text-center text-slate-400">Loading requests...</div>
            ) : requests?.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No collection requests found</div>
            ) : (
              requests?.map((request) => (
                <div key={request.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex flex-col items-center justify-center text-orange-700 dark:text-orange-400">
                      <span className="text-xl font-black">{request.quantity}</span>
                      <span className="text-[10px] font-bold uppercase tracking-tighter">Meals</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {new Date(request.target_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${request.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            request.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                              'bg-emerald-100 text-emerald-700'
                          }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {request.status === 'pending' && (
                      <button className="flex-1 md:flex-none px-6 py-2 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {t('approve')}
                      </button>
                    )}
                    {request.status === 'approved' && (
                      <button className="flex-1 md:flex-none px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                        <Truck className="w-4 h-4" />
                        Mark Collected
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
