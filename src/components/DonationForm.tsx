'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DonationSchema, DonationInput } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { submitDonation } from '@/lib/actions';
import { useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { CheckCircle2, Loader2, Minus, Plus, Receipt } from 'lucide-react';

export function DonationForm() {
  const { t } = useTranslate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<DonationInput>({
    resolver: zodResolver(DonationSchema),
    defaultValues: {
      quantity: 1,
      proof_url: '',
    },
  });

  async function onSubmit(data: DonationInput) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('quantity', data.quantity.toString());

      const fileInput = document.getElementById('receipt-upload') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append('receipt', fileInput.files[0]);
      } else {
        alert(t('error_select_receipt'));
        setIsSubmitting(false);
        return;
      }

      const result = await submitDonation(formData);
      if (result?.error) {
        alert(result.error);
      } else {
        setIsSuccess(true);
        form.reset();
      }
    } catch (error) {
      console.error(error);
      alert(t('error_unexpected'));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6 shadow-xl shadow-primary/5 border border-primary/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black mb-3 text-foreground tracking-tight">
          {t('success_title')}
        </h2>
        <p className="text-sm text-muted-foreground mb-8 max-w-[280px] mx-auto leading-relaxed font-medium">
          {t('success_desc')}
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline" className="rounded-2xl px-8 h-12 border-primary/20 text-primary hover:bg-primary/5 font-bold transition-all">
          {t('submit_another')}
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Premium Quantity Stepper */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
                  {t('quantity')}
                </FormLabel>
                <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                  {field.value} {t('packets_label')}
                </span>
              </div>
              <FormControl>
                <div className="flex items-center justify-between gap-2 pt-2">
                  {/* Sleek Pill Button: Decrease */}
                  <button
                    type="button"
                    className="h-12 w-8 rounded-full border border-border/60 bg-white dark:bg-slate-900 flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/40 transition-all active:scale-90 shadow-sm"
                    onClick={() => field.onChange(Math.max(1, field.value - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex-grow flex justify-center relative group">
                    <input
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      className="w-24 text-center text-4xl font-black text-foreground bg-transparent border-none focus:ring-0 p-0 tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none relative z-10"
                    />
                    {/* Interaction Affordance: Subtle 'Shelf' */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-primary/10 rounded-full group-focus-within:w-16 group-focus-within:bg-primary/40 transition-all duration-500" />
                  </div>

                  {/* Sleek Pill Button: Increase */}
                  <button
                    type="button"
                    className="h-12 w-8 rounded-full border border-border/60 bg-white dark:bg-slate-900 flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/40 transition-all active:scale-90 shadow-sm"
                    onClick={() => field.onChange(field.value + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-[11px] font-medium text-destructive/80" />
            </FormItem>
          )}
        />

        {/* Premium Receipt Upload */}
        <FormField
          control={form.control}
          name="proof_url"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 px-1">
                {t('proof_of_payment')}
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <label
                    htmlFor="receipt-upload"
                    className="flex flex-col items-center justify-center h-32 w-full rounded-3xl border-2 border-dashed border-border group-hover:border-primary/50 bg-background/50 backdrop-blur-sm shadow-sm transition-all cursor-pointer relative z-10 overflow-hidden"
                  >
                    <div className="flex flex-col items-center gap-2 text-center p-4">
                      <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                        <Receipt className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-foreground/70">
                        {form.watch('proof_url') ? t('receipt_selected') : t('receipt_placeholder')}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                        {t('receipt_hint')}
                      </span>
                    </div>

                    <input
                      id="receipt-upload"
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file.name);
                        }
                      }}
                    />
                  </label>
                </div>
              </FormControl>
              <FormMessage className="text-[11px] font-medium text-destructive/80" />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-16 text-lg font-black rounded-2xl shadow-xl shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all bg-primary hover:bg-primary/90 text-primary-foreground group"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <span>{t('submit_donation')}</span>
                <CheckCircle2 className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            )}
          </Button>

          <p className="mt-6 text-[10px] text-muted-foreground/50 italic font-medium text-center px-6 leading-relaxed">
            {t('verification_notice')}
          </p>
        </div>
      </form>
    </Form>
  );
}
