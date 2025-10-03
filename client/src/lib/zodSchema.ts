import {z} from 'zod';

export const AuthSchema = z.object({
    email: z.string().email({ pattern: z.regexes.html5Email }),
    password: z.string().min(6, {
        message: 'Password must be at least 6 characters',
    }).max(25, {
        message: 'Password must be at most 25 characters',
    })
});