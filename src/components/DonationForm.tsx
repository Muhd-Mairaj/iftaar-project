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
import { CheckCircle2, Loader2 } from 'lucide-react';

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
      <div className="text-center py-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Submission Received</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Thank you for your donation. We will verify it shortly.
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline" size="sm">
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t('quantity')}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value))}
                  className="rounded-md border-slate-200"
                />
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="proof_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t('proof_of_payment')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://..."
                  {...field}
                  className="rounded-md border-slate-200"
                />
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-semibold rounded-md transition-all active:scale-[0.98]"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t('submit_donation')}
        </Button>
      </form>
    </Form>
  );
}
