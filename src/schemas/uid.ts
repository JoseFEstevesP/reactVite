import z from 'zod';

export const uidSchema = z.string().min(1);
