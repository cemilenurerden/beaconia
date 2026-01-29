import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response.js';

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Creates a validation middleware for the specified schema and target
 */
export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = req[target];
      const parsed = schema.parse(data);
      
      // Replace with parsed data (includes transformations)
      req[target] = parsed;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map(
          (e) => `${e.path.join('.')}: ${e.message}`
        );
        sendError(res, 'BAD_REQUEST', 'Validation failed', 400, details);
        return;
      }
      next(error);
    }
  };
}

/**
 * Validate request body
 */
export function validateBody(schema: ZodSchema) {
  return validate(schema, 'body');
}

/**
 * Validate query parameters
 */
export function validateQuery(schema: ZodSchema) {
  return validate(schema, 'query');
}

/**
 * Validate route parameters
 */
export function validateParams(schema: ZodSchema) {
  return validate(schema, 'params');
}
