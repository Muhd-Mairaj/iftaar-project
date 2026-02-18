'use client';
import { useQuery } from '@tanstack/react-query';
import { useTranslate } from '@tolgee/react';
import { CheckCircle2, Clock, ListChecks, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { StatsSkeleton } from '@/components/Skeletons';
import { Card, CardContent } from '@/components/ui/card';
import { getRestaurantStats } from '@/lib/api/restaurant';
import { cn } from '@/lib/utils';

export default function RestaurantDashboard() {
  const { t } = useTranslate();
  const params = useParams();
  const locale = params.locale as string;

  const {
    data: statsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['restaurant-stats'],
    queryFn: getRestaurantStats,
  });

  const dashboardStats = [
    {
      title: t('restaurant_stats_pending'),
      value: statsData?.pendingCount || 0,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      title: t('restaurant_stats_approved'),
      value: statsData?.approvedCount || 0,
      icon: CheckCircle2,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: t('restaurant_stats_fulfilled'),
      value: statsData?.fulfilledCount || 0,
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
        {isLoading && <StatsSkeleton />}

        {isError && (
          <div className="text-center py-10 text-destructive font-bold">
            {t('error_unexpected')}
          </div>
        )}

        {!isLoading &&
          !isError &&
          dashboardStats.map(stat => (
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

        {/* <div className="flex flex-col gap-3 mb-2"> */}
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
        {/* </div> */}
      </div>
    </>
  );
}
