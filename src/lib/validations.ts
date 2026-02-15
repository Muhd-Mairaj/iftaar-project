import { z } from 'zod';

export const DonationSchema = z.object({
  quantity: z.number().int().positive('Quantity must be at least 1'),
  proof_url: z.string().min(1, 'Proof of payment is required'),
});

export type DonationInput = z.infer<typeof DonationSchema>;

export const CollectionRequestSchema = z.object({
  quantity: z.number().int().positive('Quantity must be at least 1'),
  target_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
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

export type UpdateCollectionStatusInput = z.infer<
  typeof UpdateCollectionStatusSchema
>;

export const InviteUserSchema = z.object({
  email: z.email('Invalid email address'),
  role: z.enum(['muazzin', 'restaurant_admin']),
});

export type InviteUserInput = z.infer<typeof InviteUserSchema>;

export const UpdatePasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
