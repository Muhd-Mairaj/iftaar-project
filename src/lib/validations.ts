import { z } from 'zod';

export const DonationSchema = z.object({
  quantity: z.number().int().positive('Quantity must be at least 1'),
  proof_url: z.string().url('Invalid proof URL'),
});

export type DonationInput = z.infer<typeof DonationSchema>;

export const CollectionRequestSchema = z.object({
  quantity: z.number().int().positive('Quantity must be at least 1'),
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
});

export type CollectionRequestInput = z.infer<typeof CollectionRequestSchema>;

export const ReviewDonationSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['approved', 'rejected']),
});

export type ReviewDonationInput = z.infer<typeof ReviewDonationSchema>;

export const UpdateCollectionStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['approved', 'collected', 'uncollected']),
});

export type UpdateCollectionStatusInput = z.infer<typeof UpdateCollectionStatusSchema>;
