import { z } from "zod";

const ZodNameSchema = z.string();
const ZodEmailSchema = z
  .string()
  .email({ stripWhitespace: true, strict: true });
const ZodPasswordSchema = z
  .string()
  .min(8, "Password must be atleast 8 characters long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must contain at least one uppercase letter, lowercase letter, number, and special character"
  );

export { ZodPasswordSchema, ZodNameSchema, ZodEmailSchema };
