import { z } from 'zod';

// Common validation helpers
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .max(255, 'Email must be less than 255 characters')
  .email('Please enter a valid email address')
  .transform(val => val.toLowerCase());

const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .max(128, 'Password must be less than 128 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .regex(
    /^[a-zA-Z\s\-'\.]+$/,
    'Name can only contain letters, spaces, hyphens, apostrophes, and periods'
  )
  .transform(val => val.trim());

const mongoIdSchema = z
  .string()
  .min(24, 'Invalid ID format')
  .max(24, 'Invalid ID format')
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password must be less than 128 characters'),
  rememberMe: z.boolean().optional()
});

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, 'Password confirmation is required'),
    role: z.enum(['learn', 'teach', 'both']).optional(),
    agreeTerms: z.boolean().refine(val => val === true, {
      message: 'You must agree to the terms of service'
    })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, 'Password confirmation is required'),
    token: z.string().min(1, 'Reset token is required')
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

// Profile schemas
export const profileUpdateSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  bio: z
    .string()
    .max(1000, 'Bio must be less than 1000 characters')
    .optional(),
  location: z
    .string()
    .max(200, 'Location must be less than 200 characters')
    .optional(),
  website: z
    .string()
    .url('Please enter a valid URL')
    .max(500, 'Website URL must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  socialLinks: z
    .object({
      linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
      twitter: z.string().url('Please enter a valid Twitter URL').optional().or(z.literal('')),
      github: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal(''))
    })
    .optional(),
  skillsTeaching: z
    .array(z.string().min(1).max(50, 'Skill name must be less than 50 characters'))
    .max(10, 'You can teach maximum 10 skills')
    .optional(),
  skillsLearning: z
    .array(z.string().min(1).max(50, 'Skill name must be less than 50 characters'))
    .max(10, 'You can learn maximum 10 skills')
    .optional(),
  preferences: z
    .object({
      remoteOnly: z.boolean().optional(),
      inPersonOnly: z.boolean().optional(),
      maxDistance: z.number().min(0).max(1000).optional()
    })
    .optional()
});

// Skill schemas
const skillCategorySchema = z.enum([
  'Technology',
  'Language',
  'Art', 
  'Music',
  'Sports',
  'Cooking',
  'Academic',
  'Business',
  'Other'
]);

const skillLevelSchema = z.enum([
  'Beginner',
  'Intermediate', 
  'Advanced',
  'Expert'
]);

const availabilitySchema = z.enum([
  'Weekdays',
  'Weekends', 
  'Flexible'
]);

export const skillCreateSchema = z.object({
  name: z
    .string()
    .min(1, 'Skill name is required')
    .max(100, 'Skill name must be less than 100 characters')
    .transform(val => val.trim()),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long')
    .max(1000, 'Description must be less than 1000 characters')
    .transform(val => val.trim()),
  category: skillCategorySchema,
  level: skillLevelSchema,
  availability: availabilitySchema.optional(),
  tags: z
    .array(z.string().min(1).max(30, 'Tag must be less than 30 characters'))
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  location: z
    .string()
    .max(200, 'Location must be less than 200 characters')
    .optional(),
  isRemote: z.boolean().optional(),
  pricing: z
    .object({
      type: z.enum(['free', 'paid', 'exchange']),
      amount: z.number().min(0).optional(),
      currency: z.string().min(3).max(3).optional(),
      unit: z.enum(['hour', 'session', 'month']).optional()
    })
    .optional()
    .refine(
      data => {
        if (data?.type === 'paid') {
          return data.amount !== undefined && data.amount > 0 && data.currency;
        }
        return true;
      },
      {
        message: 'Paid skills must have an amount and currency',
        path: ['amount']
      }
    ),
  requirements: z
    .string()
    .max(500, 'Requirements must be less than 500 characters')
    .optional(),
  sessionDuration: z
    .number()
    .min(15, 'Session must be at least 15 minutes')
    .max(480, 'Session cannot be longer than 8 hours')
    .optional()
});

export const skillUpdateSchema = skillCreateSchema.partial();

// Message schemas
export const messageCreateSchema = z.object({
  recipientId: mongoIdSchema,
  subject: z
    .string()
    .max(200, 'Subject must be less than 200 characters')
    .optional(),
  content: z
    .string()
    .min(1, 'Message content is required')
    .max(2000, 'Message must be less than 2000 characters')
    .transform(val => val.trim())
});

export const messageReplySchema = z.object({
  content: z
    .string()
    .min(1, 'Reply content is required')
    .max(2000, 'Reply must be less than 2000 characters')
    .transform(val => val.trim())
});

// Schedule schemas
export const scheduleCreateSchema = z
  .object({
    skillId: mongoIdSchema,
    studentId: mongoIdSchema.optional(), // Optional for self-booking
    startTime: z
      .string()
      .datetime('Please provide a valid date and time')
      .or(z.date()),
    endTime: z
      .string()
      .datetime('Please provide a valid date and time')
      .or(z.date()),
    notes: z
      .string()
      .max(500, 'Notes must be less than 500 characters')
      .optional(),
    location: z
      .string()
      .max(200, 'Location must be less than 200 characters')
      .optional(),
    isRemote: z.boolean().optional()
  })
  .refine(
    data => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      return end.getTime() > start.getTime();
    },
    {
      message: 'End time must be after start time',
      path: ['endTime']
    }
  )
  .refine(
    data => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return diffHours <= 8;
    },
    {
      message: 'Session cannot be longer than 8 hours',
      path: ['endTime']
    }
  )
  .refine(
    data => {
      const start = new Date(data.startTime);
      return start.getTime() > Date.now();
    },
    {
      message: 'Start time must be in the future',
      path: ['startTime']
    }
  );

export const scheduleUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
  startTime: z
    .string()
    .datetime('Please provide a valid date and time')
    .or(z.date())
    .optional(),
  endTime: z
    .string()
    .datetime('Please provide a valid date and time')
    .or(z.date())
    .optional(),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
  cancelReason: z
    .string()
    .max(300, 'Cancel reason must be less than 300 characters')
    .optional()
});

// Search schemas
export const userSearchSchema = z.object({
  search: z
    .string()
    .max(100, 'Search query must be less than 100 characters')
    .optional(),
  skill: z
    .string()
    .max(50, 'Skill filter must be less than 50 characters')
    .optional(),
  location: z
    .string()
    .max(100, 'Location filter must be less than 100 characters')
    .optional(),
  sortBy: z
    .enum(['createdAt', 'name', 'email', 'profileCompletion'])
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).max(1000).optional(),
  limit: z.number().min(1).max(100).optional()
});

export const skillSearchSchema = z.object({
  search: z
    .string()
    .max(100, 'Search query must be less than 100 characters')
    .optional(),
  category: z
    .enum(['all', ...skillCategorySchema.options])
    .optional(),
  level: z
    .enum(['all', ...skillLevelSchema.options])
    .optional(),
  availability: z
    .enum(['all', ...availabilitySchema.options])
    .optional(),
  location: z
    .string()
    .max(100, 'Location filter must be less than 100 characters')
    .optional(),
  isRemote: z.boolean().optional(),
  sortBy: z
    .enum(['createdAt', 'name', 'category', 'level'])
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).max(1000).optional(),
  limit: z.number().min(1).max(100).optional()
});

// Contact/feedback schemas
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters long')
    .max(2000, 'Message must be less than 2000 characters')
    .transform(val => val.trim())
});

export const feedbackSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  comment: z
    .string()
    .max(1000, 'Comment must be less than 1000 characters')
    .optional(),
  category: z
    .enum(['technical', 'content', 'instructor', 'platform', 'other'])
    .optional()
});

// Admin schemas
export const banUserSchema = z.object({
  reason: z
    .string()
    .max(500, 'Reason must be less than 500 characters')
    .optional()
});

// Type exports for TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type SkillCreateData = z.infer<typeof skillCreateSchema>;
export type SkillUpdateData = z.infer<typeof skillUpdateSchema>;
export type MessageCreateData = z.infer<typeof messageCreateSchema>;
export type MessageReplyData = z.infer<typeof messageReplySchema>;
export type ScheduleCreateData = z.infer<typeof scheduleCreateSchema>;
export type ScheduleUpdateData = z.infer<typeof scheduleUpdateSchema>;
export type UserSearchData = z.infer<typeof userSearchSchema>;
export type SkillSearchData = z.infer<typeof skillSearchSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type FeedbackData = z.infer<typeof feedbackSchema>;
export type BanUserData = z.infer<typeof banUserSchema>;