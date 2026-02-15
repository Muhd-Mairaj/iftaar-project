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
import { CheckCircle2, Loader2, Upload } from 'lucide-react';

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
      await submitDonation(data);
      setIsSuccess(true);
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black mb-3 text-foreground tracking-tight">
          {t('success_title')}
        </h2>
        <p className="text-sm text-muted-foreground mb-8 max-w-[280px] mx-auto leading-relaxed">
          {t('success_desc')}
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline" className="rounded-xl px-8 border-primary/20 text-primary hover:bg-primary/5">
          {t('submit_another')}
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground ml-1">
                {t('quantity')}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value))}
                  className="h-12 rounded-xl border-border bg-background focus:ring-primary shadow-sm transition-all focus:border-primary/50"
                />
              </FormControl>
              <FormMessage className="text-[11px] font-medium" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="proof_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground ml-1">
                {t('proof_of_payment')}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="https://upload-your-receipt-here.com"
                    {...field}
                    className="h-12 rounded-xl border-border bg-background ps-11 focus:ring-primary shadow-sm transition-all focus:border-primary/50"
                  />
                  <Upload className="absolute start-4 top-3.5 w-5 h-5 text-muted-foreground/50" />
                </div>
              </FormControl>
              <FormMessage className="text-[11px] font-medium" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 text-lg font-black rounded-xl shadow-xl shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : t('submit_donation')}
        </Button>

        <div className="text-center">
          <p className="text-[10px] text-muted-foreground/60 italic font-medium px-4">
            {t('verification_notice')}
          </p>
        </div>
      </form>
    </Form>
  );
}
