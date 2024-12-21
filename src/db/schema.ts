import { integer, text, sqliteTable, } from "drizzle-orm/sqlite-core";
import { string, z, ZodError, } from "zod";
import inquirer from "inquirer";
export const Contact = sqliteTable('Contact', {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("firstName").notNull(),
  middleName: text('middleName'),
  lastName: text("lastName").notNull(),
  email: text("email"),
  phoneNumber: text("phoneNumber", { length: 13 }).notNull().unique(),
  address: text("address", { mode: 'json' }),
  birthday: text("birthday")
});
export const addressObject = z.strictObject({
  city: z.string(),
  countryRegion: z.string(),
  label: z.string(),
  postalCode: z.string(),
  stateProvince: z.string(),
  street: z.string()
});
export const ContactValidator = z.strictObject({
  firstName: z.string({ required_error: "first name is required" }).refine((name: string) => {
    return /^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/~`-]*$/.test(name);
  }, 'firstname is ivalid'),
  middleName: z.union([z.string(), z.null(), z.undefined()]).optional(),
  lastName: z.string({ required_error: "first name is required" }).refine((name: string) => {
    return /^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/~`-]*$/.test(name);
  }, 'lastname is ivalid'),
  email: z.union([z.null(), z.string().email(), z.undefined()]).optional(),
  phoneNumber: z.string().refine((ph: string) => {
    return /^\+?[1-9][0-9]{7,13}$/.test(ph)
  }, "invalid ph-no"),
  address: z.union([addressObject, z.null()]).optional(),
  birthday: z.union([z.string().date(), z.null()]).optional()
});

export type ContactObject = {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string | null;
  phoneNumber: string;
  address: string | null | unknown;
  birthday: string | null;
};

export type RecordFilter = {
  firstName: string,
  lastName: string,
  phoneNumber: string
};
export const getFilter = async () => {
  let filter: RecordFilter = await inquirer.prompt<RecordFilter>([
    {
      type: "input",
      name: "firstName",
      message: "Enter first name filter: ",
    },
    {
      type: "input",
      name: "lastName",
      message: "Enter last name filter: ",
    },
    {
      type: "input",
      name: "phoneNumber",
      message: "Enter ph-no filter: ",
    }
  ]);
  return filter;
};
/**
 * @name validatorFactory
 * @param validator 
 * @param picked 
 * @description picks the required field (only one at a time) from the validator and validates the input
 */
export const validatorFactory = <T extends z.ZodRawShape>(picked: z.ZodObject<T>) => {
  return (value: string) => {
    if (typeof value !== 'string') return "you need to provide a string";
    else {
      const { success, error } = picked.safeParse({[Object.keys(picked.shape)[0] as string]:value});
      return (success) ? (true) : (JSON.stringify(error, null, "\t"));
    }
  }
};