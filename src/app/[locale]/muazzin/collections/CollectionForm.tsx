'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslate } from '@tolgee/react';
import { Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { createCollectionRequest } from '@/lib/actions/muazzin';
import {
  CollectionRequestInput,
  CollectionRequestSchema,
} from '@/lib/validations';

export function CollectionForm() {
  const { t } = useTranslate();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current date in YYYY-MM-DD for default
  const today = new Date().toISOString().split('T')[0];

  const form = useForm<CollectionRequestInput>({
    resolver: zodResolver(CollectionRequestSchema),
    defaultValues: {
      quantity: 1,
      target_date: today,
    },
  });

  async function onSubmit(data: CollectionRequestInput) {
    setIsSubmitting(true);
    try {
      await createCollectionRequest(data);
      form.reset({
        quantity: 1,
        target_date: today,
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Failed to create request');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-card/40 backdrop-blur-xl border rounded-[2.5rem] p-3 shadow-xl shadow-black/5 relative group">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                  {t('packets_needed')}
                </FormLabel>
                <FormControl>
                  <NumberInput
                    min={1}
                    className="bg-background/50 border-input/50 h-10 rounded-2xl focus:ring-primary/20 focus:border-primary/50 transition-all font-black text-xl pl-6"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-destructive ml-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="target_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                  {t('target_date')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="bg-background/50 border-input/50 h-12 rounded-2xl focus:ring-primary/20 focus:border-primary/50 transition-all font-bold text-base pl-6 pr-4 [&::-webkit-calendar-picker-indicator]:opacity-40 [&::-webkit-calendar-picker-indicator]:invert dark:[&::-webkit-calendar-picker-indicator]:invert-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-destructive ml-1" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-2xl text-lg font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all bg-primary hover:bg-primary/90 text-primary-foreground active:scale-[0.98]"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span>{t('submit_request')}</span>
              </div>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
