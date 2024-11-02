import chalk from "chalk";
import { Contact, ContactValidator, addressObject } from "../db/schema.js";
import db from "../db/index.js";
import PS from "prompt-sync";
import { z, ZodError } from "zod"
import { eq } from "drizzle-orm";
const addContact = async (): Promise<void> => {
  const prompt = PS();

  const getEmail = (): null | string | undefined => {
    const res = prompt(chalk.yellow("Want to add an email (Y/N): "));
    if (res === 'Y' || res === 'N') {
      return res === 'Y' ?
        (prompt(chalk.yellow("Enter email: ")) || "") :
        null;
    } else {
      console.log(chalk.red.bold("Process terminated due to invalid option input."))
      process.exit(0);
    }
  };

  const getMiddleName = (): null | string | undefined => {
    const res = prompt(chalk.yellow("Want to add an middle name (Y/N): "));
    if (res === 'Y' || res === 'N') {
      return res === 'Y' ?
        (prompt(chalk.yellow("Enter middle name: ")) || "") :
        null;
    } else {
      console.log(chalk.red.bold("Process terminated due to invalid option input."))
      process.exit(0);
    }
  };

  const getBirthday = (): null | string | undefined => {
    const res = prompt(chalk.yellow("Want to add an birthday (Y/N): "));
    if (res === 'Y' || res === 'N') {
      return res === 'Y' ?
        (prompt(chalk.yellow("Enter birthday(YYYY-MM-DD): ")) || "") :
        null;
    } else {
      console.log(chalk.red.bold("Process terminated due to invalid option input."))
      process.exit(0);
    }
  };





  const getAddress = (): null | z.infer<typeof addressObject> | undefined => {
    const getAddressObject = (): z.infer<typeof addressObject> | undefined => {
      let address_object:any = { city: "", countryRegion: "", label: "", postalCode: "", stateProvince: "", street: "" };
      for (const property in address_object)
        address_object[property] = prompt(`Please enter the ${property}: `);
      const parseResult = addressObject.safeParse(address_object);
      if (parseResult.success) {
        return parseResult.data
      } else {
        console.log(chalk.red.bold(JSON.stringify(parseResult.error, null, "\t")));
        process.exit(0);
      }
    }
    const res = prompt(chalk.yellow("Want to add an address (Y/N): "));
    if (res === 'Y' || res === 'N') {
      return res === 'Y' ?
        getAddressObject() :
        null;
    } else {
      console.log(chalk.red.bold("Process terminated due to invalid option input."))
      process.exit(0);
    }
  };


  const getData: z.infer<typeof ContactValidator> = {
    firstName: prompt(chalk.yellow("Enter first name: ")) || "",
    middleName: getMiddleName(),
    lastName: prompt(chalk.yellow("Enter last name: ")) || "",
    phoneNumber: prompt(chalk.yellow("Enter phone-number: ")) || "",
    email: getEmail(),
    birthday: getBirthday(),
    address: getAddress()
  };

  try {
    ContactValidator.parse(getData);
    try {
      const stringified_address = getData.address?(JSON.stringify(getData.address)):(null);
      const result = await db.insert(Contact).values({...getData,address:stringified_address}).execute();
      const lastInserted = ((await db.select().from(Contact).where(eq(Contact.id, result.lastInsertRowid as number))))[0];
      console.clear();
      console.log(chalk.bgBlue.black.bold(`Contact successfully added, id: ${result.lastInsertRowid}.`));
      console.log(chalk.bgBlack.greenBright.bold(`${JSON.stringify(lastInserted, null, "\t")}.`));
    } catch (err) {
      console.log(chalk.red.bold(JSON.stringify(err, null, "\t")));
    }
  } catch (error) {
    let err = (error as ZodError);
    console.log(chalk.red.bold(JSON.stringify(err, null, "\t")))
  }
};
export default addContact;