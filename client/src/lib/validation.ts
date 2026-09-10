import { z } from 'zod';

export const phoneRegex = /^(\+?\d{1,3}[\s-]?)?\d{10}$/;

export const customerSchema = z.object({
  name: z.string().min(2, 'Tell us your name'),
  phone: z.string().regex(phoneRegex, 'Enter a valid 10-digit mobile number'),
  email: z.string().email('Enter a valid email'),
  address: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),
  notes: z.string().max(240).optional(),
});

export const deliveryCustomerSchema = customerSchema.superRefine((val, ctx) => {
  // address fields validated conditionally in the form based on fulfilment
  void val;
  void ctx;
});

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Tell us your name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(phoneRegex, 'Enter a valid mobile number').optional().or(z.literal('')),
  password: z.string().min(6, 'At least 6 characters'),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Your name, please'),
  email: z.string().email('Valid email needed'),
  subject: z.string().min(3, 'Add a subject'),
  message: z.string().min(10, 'A little more detail helps'),
});

export type CustomerForm = z.infer<typeof customerSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ContactForm = z.infer<typeof contactSchema>;
