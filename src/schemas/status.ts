import z from 'zod';

export const statusBoolean = z.boolean();

export const statusEnum = z.enum(['true', 'false']);
