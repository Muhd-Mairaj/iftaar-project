import { CheckCircle2, Clock, ListChecks, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { getTolgee } from '@/i18n';
import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';

export default async function RestaurantDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTolgee(locale);
  const supabase = await createClient();

  // Fetch summary stats
  const { data: stats } = await supabase
    .from('collection_requests')
    .select('status');

  const pendingCount = stats?.filter(r => r.status === 'pending').length || 0;
  const approvedCount = stats?.filter(r => r.status === 'approved').length || 0;
  const fulfilledCount =
    stats?.filter(r => r.status === 'collected').length || 0;

  const dashboardStats = [
    {
      title: t('restaurant_stats_pending'),
      value: pendingCount,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      title: t('restaurant_stats_approved'),
      value: approvedCount,
      icon: CheckCircle2,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: t('restaurant_stats_fulfilled'),
      value: fulfilledCount,
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
  ];

  return (
    <>
      <div className="flex-none">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          {t('nav_dashboard')}
        </h1>
        <p className="text-sm text-muted-foreground font-medium opacity-80">
          {t('restaurant_dashboard_desc')}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {dashboardStats.map(stat => (
          <Card
            key={stat.title}
            className="bg-card/40 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden group"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-4xl font-black">{stat.value}</h3>
                </div>
                <div
                  className={cn(
                    stat.bg,
                    'p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300'
                  )}
                >
                  <stat.icon className={cn('w-8 h-8', stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 mb-2">
        <Link
          href={`/${locale}/restaurant/collections`}
          className="group flex items-center gap-4 px-6 py-5 rounded-[2rem] bg-card/40 backdrop-blur-xl border hover:bg-primary hover:border-primary/30 transition-all duration-300 active:scale-[0.98] shadow-xl shadow-black/5 hover:shadow-primary/10"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors duration-300">
            <ListChecks className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
          </div>
          <div className="flex flex-col text-start">
            <span className="text-lg font-black text-foreground group-hover:text-primary-foreground transition-colors leading-tight">
              {t('restaurant_collections_title')}
            </span>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-primary-foreground/70 transition-colors">
              {t('restaurant_action_collections_desc')}
            </span>
          </div>
        </Link>
      </div>
    </>
  );
}
