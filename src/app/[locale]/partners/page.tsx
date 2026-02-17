'use client';

import { useTranslate } from '@tolgee/react';
import { Copy, Receipt, Smartphone } from 'lucide-react';

const RESTAURANTS = [
  {
    id: 1,
    nameKey: 'res_1_name',
    price: 15,
    payment_info: 'STC Pay: 050 123 4567',
    account_num: '0501234567',
    descKey: 'res_1_desc',
  },
  {
    id: 2,
    nameKey: 'res_2_name',
    price: 12,
    payment_info: 'Bank AlRajhi: SA12 3456 7890',
    account_num: 'SA1234567890',
    descKey: 'res_2_desc',
  },
];

export default function PartnersPage() {
  const { t } = useTranslate();
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex-grow flex flex-col items-center p-6 transition-all duration-700 h-full">
      <div className="w-full max-w-sm mx-auto flex flex-col h-full overflow-hidden">
        <header className="mb-6 px-2 text-center animate-in fade-in duration-500">
          <h1 className="text-2xl font-black text-foreground tracking-tight">
            {t('partners_title')}
          </h1>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 opacity-50">
            {t('partners_subtitle')}
          </p>
        </header>

        <div className="space-y-4 overflow-y-auto no-scrollbar pr-1 flex-grow pb-12">
          {RESTAURANTS.map(res => (
            <div
              key={res.id}
              className="bg-card/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2.5rem] p-5 flex flex-col gap-4 group transition-all hover:bg-card/60 shadow-xl shadow-black/5 animate-in fade-in duration-500"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors leading-none">
                    {t(res.nameKey)}
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-medium leading-none mt-2 opacity-60">
                    {t(res.descKey)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-primary tracking-tight">
                    {res.price}{' '}
                    <span className="text-[10px] font-medium opacity-60">
                      {t('currency_sar')}
                    </span>
                  </div>
                  <div className="text-[8px] font-bold uppercase tracking-tighter opacity-40">
                    {t('per_packet')}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-primary/5 rounded-2xl p-4 border border-primary/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary/60">
                    <Smartphone className="w-3 h-3 text-lantern" />
                    {t('account_details')}
                  </div>
                  <div className="font-mono text-[11px] font-bold text-foreground/80 tracking-tight">
                    {res.payment_info}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(res.account_num)}
                  className="p-3 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 active:scale-90 transition-transform hover:bg-primary/90"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="p-6 rounded-[2.5rem] bg-lantern/5 border border-lantern/10 text-center space-y-3 mt-4 mb-20">
            <Receipt className="w-6 h-6 text-lantern mx-auto opacity-40" />
            <p className="text-[9px] font-bold text-lantern/80 uppercase tracking-widest leading-relaxed px-4">
              {t('receipt_instruction')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
