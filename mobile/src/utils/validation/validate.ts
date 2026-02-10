export type ValidationRule = (value: string) => string | null;
export type ValidationSchema = Record<string, ValidationRule[]>;
export type ValidationErrors = Record<string, string>;

export function validate(
  schema: ValidationSchema,
  values: Record<string, string>,
): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const field of Object.keys(schema)) {
    const value = values[field] ?? '';
    for (const rule of schema[field]) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  }

  return errors;
}
