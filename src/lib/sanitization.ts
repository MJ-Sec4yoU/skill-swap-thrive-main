import DOMPurify from 'dompurify';

// Configure DOMPurify with secure defaults
const configureDOMPurify = () => {
  // Allow specific tags and attributes for rich text content
  DOMPurify.addHook('beforeSanitizeElements', (node) => {
    // Remove any script tags that might have been missed
    if (node.tagName === 'SCRIPT') {
      node.remove();
    }
    
    // Remove any elements with javascript: protocol
    if (node.hasAttribute && node.hasAttribute('href')) {
      const href = node.getAttribute('href');
      if (href && href.toLowerCase().includes('javascript:')) {
        node.removeAttribute('href');
      }
    }
  });

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    // Ensure all external links have proper security attributes
    if (node.tagName === 'A' && node.hasAttribute('href')) {
      const href = node.getAttribute('href');
      if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    }
  });
};

// Initialize DOMPurify configuration
configureDOMPurify();

// Sanitization functions for different content types
export const sanitization = {
  // Sanitize HTML content for display (allows basic formatting)
  html: (dirty: string): string => {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote',
        'a', 'code', 'pre'
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_DOM_IMPORT: false
    });
  },

  // Sanitize plain text (strips all HTML)
  text: (dirty: string): string => {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: [],
      KEEP_CONTENT: true
    });
  },

  // Sanitize user input for forms (very restrictive)
  input: (dirty: string): string => {
    // First sanitize HTML
    const cleaned = DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: [],
      KEEP_CONTENT: true
    });
    
    // Remove common injection patterns
    return cleaned
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+=/gi, '')
      .replace(/<script/gi, '')
      .replace(/<\/script>/gi, '')
      .replace(/eval\s*\(/gi, '')
      .replace(/document\./gi, '')
      .replace(/window\./gi, '');
  },

  // Sanitize URLs
  url: (dirty: string): string => {
    // Basic URL validation and sanitization
    try {
      const url = new URL(dirty);
      // Only allow http and https protocols
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return '';
      }
      return url.toString();
    } catch {
      // If URL parsing fails, treat as relative URL and sanitize
      const cleaned = dirty.replace(/javascript:/gi, '')
                          .replace(/data:/gi, '')
                          .replace(/vbscript:/gi, '');
      return encodeURI(cleaned);
    }
  },

  // Sanitize email addresses
  email: (dirty: string): string => {
    const cleaned = sanitization.input(dirty);
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(cleaned) ? cleaned.toLowerCase() : '';
  },

  // Sanitize file names
  filename: (dirty: string): string => {
    return dirty
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace invalid chars with underscore
      .replace(/\.{2,}/g, '.') // Replace multiple dots with single dot
      .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
      .substring(0, 255); // Limit length
  },

  // Sanitize JSON data
  json: (dirty: any): any => {
    if (typeof dirty === 'string') {
      return sanitization.text(dirty);
    }
    
    if (Array.isArray(dirty)) {
      return dirty.map(item => sanitization.json(item));
    }
    
    if (dirty && typeof dirty === 'object') {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(dirty)) {
        // Sanitize both keys and values
        const cleanKey = sanitization.input(key);
        cleaned[cleanKey] = sanitization.json(value);
      }
      return cleaned;
    }
    
    return dirty;
  },

  // Sanitize search queries
  searchQuery: (dirty: string): string => {
    return sanitization.input(dirty)
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/['"]/g, '') // Remove quotes
      .trim()
      .substring(0, 100); // Limit length
  }
};

// Input validation helpers
export const validation = {
  // Check if string contains potential XSS
  hasXSS: (input: string): boolean => {
    const xssPatterns = [
      /<script/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  },

  // Check if string contains potential SQL injection
  hasSQLInjection: (input: string): boolean => {
    const sqlPatterns = [
      /union\s+select/gi,
      /drop\s+table/gi,
      /delete\s+from/gi,
      /insert\s+into/gi,
      /update\s+.*set/gi,
      /--/g,
      /;/g
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  },

  // Check if string contains potential NoSQL injection
  hasNoSQLInjection: (input: string): boolean => {
    const nosqlPatterns = [
      /\$where/gi,
      /\$regex/gi,
      /\$gt/gi,
      /\$lt/gi,
      /\$ne/gi,
      /\$in/gi,
      /\$nin/gi,
      /\$or/gi,
      /\$and/gi
    ];
    
    return nosqlPatterns.some(pattern => pattern.test(input));
  },

  // Check if input is safe for general use
  isSafe: (input: string): boolean => {
    return !validation.hasXSS(input) && 
           !validation.hasSQLInjection(input) && 
           !validation.hasNoSQLInjection(input);
  }
};

// Secure localStorage wrapper
export const secureStorage = {
  set: (key: string, value: any): void => {
    try {
      const sanitizedKey = sanitization.input(key);
      const sanitizedValue = typeof value === 'string' 
        ? sanitization.input(value) 
        : JSON.stringify(sanitization.json(value));
      
      localStorage.setItem(sanitizedKey, sanitizedValue);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  get: (key: string): any => {
    try {
      const sanitizedKey = sanitization.input(key);
      const item = localStorage.getItem(sanitizedKey);
      
      if (!item) return null;
      
      try {
        return JSON.parse(item);
      } catch {
        return sanitization.input(item);
      }
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  },

  remove: (key: string): void => {
    try {
      const sanitizedKey = sanitization.input(key);
      localStorage.removeItem(sanitizedKey);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }
};

// API response sanitizer
export const sanitizeAPIResponse = (response: any): any => {
  // Deep clone to avoid mutating original
  const sanitized = JSON.parse(JSON.stringify(response));
  return sanitization.json(sanitized);
};

// Form data sanitizer
export const sanitizeFormData = <T extends Record<string, any>>(data: T): T => {
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitization.input(value) as T[keyof T];
    } else if (Array.isArray(value)) {
      sanitized[key as keyof T] = value.map(item => 
        typeof item === 'string' ? sanitization.input(item) : item
      ) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  
  return sanitized;
};

// Export main sanitization function for convenience
export const sanitize = sanitization.input;
export default sanitization;