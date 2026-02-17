import { Clock, HeartHandshake, Boxes, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { getTolgee } from '@/i18n';
import { createClient } from '@/lib/supabase/server';

export default async function MuazzinDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTolgee(locale);
  const supabase = await createClient();

  // Fetch summary stats
  const [
    { count: pendingCount },
    // { count: approvedCount },
    { data: approvedDonations },
    { data: collectionRequests },
  ] = await Promise.all([
    supabase
      .from('donations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    // supabase
    //   .from('collection_requests')
    //   .select('*', { count: 'exact', head: true })
    //   .eq('status', 'approved'),
    supabase.from('donations').select('quantity').eq('status', 'approved'),
    supabase.from('collection_requests').select('quantity'),
  ]);

  const totalApprovedPackets = (approvedDonations ?? []).reduce(
    (sum, d) => sum + (d.quantity || 0),
    0
  );
  const totalCollectedPackets = (collectionRequests ?? []).reduce(
    (sum, c) => sum + (c.quantity || 0),
    0
  );
  const packetsAvailable = Math.max(
    0,
    totalApprovedPackets - totalCollectedPackets
  );

  const stats = [
    {
      title: t('muazzin_stats_pending'),
      value: pendingCount || 0,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      title: t('muazzin_stats_collected'),
      value: totalCollectedPackets || 0,
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: t('muazzin_stats_packets'),
      value: packetsAvailable || 0,
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex-none">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          {t('muazzin_dashboard')}
        </h1>
        <p className="text-sm text-muted-foreground font-medium opacity-80">
          {t('muazzin_nav_dashboard_desc') ||
            'Overview of your mosque activities.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map(stat => (
          <Card
            key={stat.title}
            className="border-white/10 bg-card/40 backdrop-blur-xl overflow-hidden group"
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
                  className={
                    stat.bg +
                    ' p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300'
                  }
                >
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href={`/${locale}/muazzin/donations`}
          className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/10 hover:bg-primary hover:border-primary/30 transition-all duration-300 active:scale-[0.97] shadow-sm hover:shadow-lg hover:shadow-primary/10"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors duration-300">
            <HeartHandshake className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
          </div>
          <span className="text-sm font-bold text-foreground group-hover:text-primary-foreground transition-colors truncate">
            {t('muazzin_nav_donations')}
          </span>
        </Link>

        <Link
          href={`/${locale}/muazzin/collections`}
          className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/10 hover:bg-lantern hover:border-lantern/30 transition-all duration-300 active:scale-[0.97] shadow-sm hover:shadow-lg hover:shadow-lantern/10"
        >
          <div className="w-10 h-10 rounded-xl bg-lantern/10 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors duration-300">
            <Boxes className="w-5 h-5 text-lantern group-hover:text-lantern-foreground transition-colors" />
          </div>
          <span className="text-sm font-bold text-foreground group-hover:text-lantern-foreground transition-colors truncate">
            {t('muazzin_nav_collections')}
          </span>
        </Link>
      </div>
    </div>
  );
}
