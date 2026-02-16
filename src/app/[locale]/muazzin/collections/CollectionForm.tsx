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
import { createCollectionRequest } from '@/lib/actions';
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
    <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                  {t('packets_needed')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    className="bg-background/50 border-input/50 h-12 rounded-2xl focus:ring-primary/20 focus:border-primary/50 transition-all font-bold text-lg"
                    {...field}
                    onChange={e =>
                      field.onChange(Number.parseInt(e.target.value, 10))
                    }
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
                    className="bg-background/50 border-input/50 h-12 rounded-2xl focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
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
            className="w-full h-14 rounded-2xl text-lg font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all bg-primary hover:bg-primary/90 text-primary-foreground group"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" />
                {t('submit_request')}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
