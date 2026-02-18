'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslate } from '@tolgee/react';
import { CheckCircle2, Loader2, Minus, Plus, Receipt } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { NumberInput } from '@/components/ui/number-input';
import { submitDonation } from '@/lib/actions';
import { DonationInput, DonationSchema } from '@/lib/validations';

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

      const fileInput = document.getElementById(
        'receipt-upload'
      ) as HTMLInputElement;
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
      <div className="text-center py-12 animate-in fade-in duration-500">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6 shadow-xl shadow-primary/5 border border-primary/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black mb-3 text-foreground tracking-tight">
          {t('success_title')}
        </h2>
        <p className="text-sm text-muted-foreground mb-8 max-w-[280px] mx-auto leading-relaxed font-medium">
          {t('success_desc')}
        </p>
        <Button
          onClick={() => setIsSuccess(false)}
          variant="outline"
          className="rounded-2xl px-8 h-12 border-primary/20 text-primary hover:bg-primary/5 font-bold transition-all"
        >
          {t('submit_another')}
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Compact Quantity Stepper */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
                  {t('quantity')}
                </FormLabel>
                <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                  {field.value} {t('packets_label')}
                </span>
              </div>
              <FormControl>
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    className="h-10 w-8 rounded-full border border-border/60 bg-white dark:bg-slate-900 flex items-center justify-center text-foreground/70 active:scale-90 shadow-sm"
                    onClick={() => field.onChange(Math.max(1, field.value - 1))}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex-grow flex justify-center relative group">
                    <NumberInput
                      {...field}
                      className="w-20 text-center text-3xl font-black text-foreground bg-transparent border-none focus:ring-0 p-0 tabular-nums auto-cols-min"
                    />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[1.5px] bg-primary/10 rounded-full" />
                  </div>

                  <button
                    type="button"
                    className="h-10 w-8 rounded-full border border-border/60 bg-white dark:bg-slate-900 flex items-center justify-center text-foreground/70 active:scale-90 shadow-sm"
                    onClick={() => field.onChange(field.value + 1)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-[10px] font-medium text-destructive/80" />
            </FormItem>
          )}
        />

        {/* Compact Receipt Upload */}
        <FormField
          control={form.control}
          name="proof_url"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 px-1">
                {t('proof_of_payment')}
              </FormLabel>
              <FormControl>
                <label
                  htmlFor="receipt-upload"
                  className="flex flex-col items-center justify-center h-24 w-full rounded-2xl border-2 border-dashed border-border bg-background/50 backdrop-blur-sm transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="flex flex-col items-center gap-1.5 text-center p-2">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-foreground/70">
                      {form.watch('proof_url')
                        ? t('receipt_selected')
                        : t('receipt_placeholder')}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-tight opacity-60">
                      {t('receipt_hint')}
                    </span>
                  </div>
                  <input
                    id="receipt-upload"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file.name);
                      }
                    }}
                  />
                </label>
              </FormControl>
              <FormMessage className="text-[10px] font-medium text-destructive/80" />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base font-black rounded-xl shadow-lg shadow-primary/10 active:scale-[0.98] transition-all bg-primary hover:bg-primary/90 text-primary-foreground group"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <span>{t('submit_donation')}</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </Button>

          <p className="mt-3 text-[9px] text-muted-foreground/50 italic font-medium text-center px-4 leading-normal">
            {t('verification_notice')}
          </p>
        </div>
      </form>
    </Form>
  );
}
