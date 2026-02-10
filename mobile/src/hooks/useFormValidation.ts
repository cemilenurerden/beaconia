import { useState, useCallback } from 'react';
import { validate, type ValidationSchema, type ValidationErrors } from '../utils/validation';

export function useFormValidation(schema: ValidationSchema) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = useCallback(
    (values: Record<string, string>): boolean => {
      const result = validate(schema, values);
      setErrors(result);
      return Object.keys(result).length === 0;
    },
    [schema],
  );

  const validateField = useCallback(
    (field: string, value: string) => {
      const rules = schema[field];
      if (!rules) return;

      for (const rule of rules) {
        const error = rule(value);
        if (error) {
          setErrors((prev) => ({ ...prev, [field]: error }));
          return;
        }
      }
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [schema],
  );

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  return { errors, validateForm, validateField, clearFieldError };
}
