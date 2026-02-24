'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslate } from '@tolgee/react';
import {
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  Receipt,
  Repeat,
} from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { submitDonation } from '@/lib/actions';
import { compressImage } from '@/lib/image-compression';
import { DonationInput, DonationSchema } from '@/lib/validations';

export function DonationForm() {
  const { t } = useTranslate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<DonationInput>({
    resolver: zodResolver(DonationSchema),
    defaultValues: {
      quantity: 1,
      proof_url: '',
      isRecurring: false,
      durationDays: 10,
    },
  });

  const isRecurring = form.watch('isRecurring');
  const durationDays = form.watch('durationDays') || 10;
  const quantity = form.watch('quantity');

  async function onSubmit(data: DonationInput) {
    setIsSubmitting(true);
    try {
      if (!selectedFile) {
        alert(t('error_select_receipt'));
        setIsSubmitting(false);
        return;
      }

      const compressedFile = await compressImage(selectedFile);

      const result = await submitDonation({
        quantity: data.quantity,
        receipt: compressedFile,
        isRecurring: !!data.isRecurring,
        durationDays: data.durationDays,
      });
      if (result?.error) {
        alert(result.error);
      } else {
        setIsSuccess(true);
        form.reset();
        setSelectedFile(null);
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
                  {isRecurring && ' / day'}
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

        {/* Recurring Toggle */}
        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-2xl border-2 border-border/60 bg-white dark:bg-slate-900 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-primary/20">
              <div className="space-y-1 relative pr-4">
                <FormLabel className="text-[11px] font-black uppercase tracking-[0.1em] text-foreground flex items-center gap-2 cursor-pointer">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <Repeat className="w-3.5 h-3.5 text-primary" />
                  </div>
                  {t(
                    'recurring_donation_label',
                    'Make this a recurring donation'
                  )}
                </FormLabel>
                <div className="text-[10px] text-muted-foreground/80 font-medium">
                  {t(
                    'recurring_donation_desc',
                    'Automatically split packets across multiple days'
                  )}
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Duration Days Input */}
        {isRecurring && (
          <div className="animate-in slide-in-from-top-2 fade-in duration-300">
            <FormField
              control={form.control}
              name="durationDays"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
                      {t('duration_days_label', 'Duration (Days)')}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        className="h-10 w-8 rounded-full border border-border/60 bg-white dark:bg-slate-900 flex items-center justify-center text-foreground/70 active:scale-90 shadow-sm"
                        onClick={() =>
                          field.onChange(Math.max(1, (field.value || 10) - 1))
                        }
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex-grow flex justify-center relative group">
                        <NumberInput
                          {...field}
                          value={field.value || 10}
                          className="w-20 text-center text-3xl font-black text-foreground bg-transparent border-none focus:ring-0 p-0 tabular-nums auto-cols-min"
                        />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[1.5px] bg-primary/10 rounded-full" />
                      </div>

                      <button
                        type="button"
                        className="h-10 w-8 rounded-full border border-border/60 bg-white dark:bg-slate-900 flex items-center justify-center text-foreground/70 active:scale-90 shadow-sm"
                        onClick={() => field.onChange((field.value || 10) + 1)}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </FormControl>
                  <div className="text-[10px] text-primary/80 italic text-center font-medium mt-3 leading-relaxed">
                    {t('recurring_summary', {
                      dailyCount: quantity,
                      days: durationDays,
                      defaultValue: `This will provide ${quantity} packets per day for ${durationDays} days.`,
                    })}
                  </div>
                  <FormMessage className="text-[10px] font-medium text-destructive/80" />
                </FormItem>
              )}
            />
          </div>
        )}

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
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
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
