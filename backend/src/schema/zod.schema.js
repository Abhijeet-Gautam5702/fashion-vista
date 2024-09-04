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
const ZodAddressSchema = z
  .string()
  .min(1, "Address cannot be empty")
  .min(10, "Address too short")
  .min(25, "Address too long");
const ZodPhoneNumberSchema = z
  .string()
  .min(1, "Mobile number cannot be empty")
  .max(20, "Mobile number too long")
  .regex(
    /^(\+?\d{1,3})?\s*(\(\d{1,3}\)|\d{1,3}(?:-\d)?)(\s*(?:\(\d{3}\)|\d{3}(?:-\d)?))?[\s.-]?\d{3}([\s.-]?[\d]{3})$/i,
    {
      message: "Invalid mobile number format",
      parse: (str) => str.replace(/\D/g, ""),
    }
  )
  .refine((val) => val.length >= 10 && val.length <= 20, {
    message: "Mobile number must be between 10 and 20 digits long",
  });

export {
  ZodPasswordSchema,
  ZodNameSchema,
  ZodEmailSchema,
  ZodAddressSchema,
  ZodPhoneNumberSchema,
};
