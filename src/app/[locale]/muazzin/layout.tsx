import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function MuazzinLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'muazzin') {
    redirect(`/${locale}`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 h-full flex flex-col">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 min-h-0 flex flex-col">
        {children}
      </div>
    </div>
  );
}
