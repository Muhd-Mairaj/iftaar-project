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
    <div className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-[2rem] px-4 py-2 shadow-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                    {t('packets_needed')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      className="bg-background/40 border-input/40 h-10 rounded-xl focus:ring-primary/20 focus:border-primary/50 transition-all font-bold text-base"
                      {...field}
                      onChange={e =>
                        field.onChange(Number.parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold text-destructive ml-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_date"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                    {t('target_date')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="bg-background/40 border-input/40 h-10 rounded-xl focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-xs [&::-webkit-calendar-picker-indicator]:invert-[0.2]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold text-destructive ml-1" />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-xl text-sm font-black shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all bg-primary hover:bg-primary/90 text-primary-foreground group"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                <Plus className="mr-2 h-5 w-4" />
                {t('submit_request')}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
