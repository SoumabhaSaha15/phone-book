import inquirer from "inquirer";
import chalk from "chalk";
import { Contact, ContactValidator, addressObject } from "../db/schema.js";
import db from "../db/index.js";
import chalkAnimation from "chalk-animation";
import { z, ZodError } from "zod"
import { eq } from "drizzle-orm";
import figlet from "figlet";
import Database from "better-sqlite3";
const addContact = async (): Promise<void> => {


  let getData: z.infer<typeof ContactValidator> = await inquirer.prompt<z.infer<typeof ContactValidator>>([
    {
      type: "input",
      name: "firstName",
      message: chalk.yellow.bold("Enter your firstName: "),
      validate: (value) => {
        const firstNameValidator = ContactValidator.pick({ firstName: true });
        if (typeof value !== 'string')
          return "you need to provide a string";
        else {
          const validation = firstNameValidator.safeParse({ firstName: value });
          return (validation.success) ? (true) : (JSON.stringify(validation.error, null, "\t"));
        }
      }
    },
    {
      type: "input",
      name: "lastName",
      message: chalk.yellow.bold("Enter your lastName: "),
      validate: (value) => {
        const lastNameValidator = ContactValidator.pick({ lastName: true });
        if (typeof value !== 'string')
          return "you need to provide a string";
        else {
          const validation = lastNameValidator.safeParse({ lastName: value });
          return (validation.success) ? (true) : (JSON.stringify(validation.error, null, "\t"));
        }
      }
    },
    {
      type: "input",
      name: "phoneNumber",
      message: chalk.yellow.bold("Enter your phoneNumber: "),
      validate: (value) => {
        const phoneNumberValidator = ContactValidator.pick({ phoneNumber: true });
        if (typeof value !== 'string')
          return "you need to provide a string";
        else {
          const validation = phoneNumberValidator.safeParse({ phoneNumber: value });
          return (validation.success) ? (true) : (JSON.stringify(validation.error, null, "\t"));
        }
      }
    },
    {
      type: "input",
      name: "middleName",
      message: chalk.yellow.bold("Enter your middleName(press enter to skip): "),
      validate: (value) => {
        const middleNameValidator = ContactValidator.pick({ middleName: true });
        if (typeof value !== 'string')
          return "you need to provide a string";
        else {
          const validation = middleNameValidator.safeParse({ middleName: (value == '' ? null : value) });
          return (validation.success) ? (true) : (JSON.stringify(validation.error, null, "\t"));
        }
      },
    },
    {
      type: "input",
      name: "email",
      message: chalk.yellow.bold("Enter your email(press enter to skip): "),
      validate: (value) => {
        const emailValidator = ContactValidator.pick({ email: true });
        if (typeof value !== 'string')
          return "you need to provide a string";
        else {
          const validation = emailValidator.safeParse({ email: (value == '' ? null : value) });
          return (validation.success) ? (true) : (JSON.stringify(validation.error, null, "\t"));
        }
      }
    },
    {
      type: "input",
      name: "birthday",
      message: chalk.yellow.bold("Enter your birthday[YYYY-MM-DD](press enter to skip): "),
      validate: (value) => {
        const birthdayValidator = ContactValidator.pick({ birthday: true });
        if (typeof value !== 'string')
          return "you need to provide a string";
        else {
          const validation = birthdayValidator.safeParse({ birthday: (value == '' ? null : value) });
          return (validation.success) ? (true) : (JSON.stringify(validation.error, null, "\t"));
        }
      }
    },
  ]);

  inquirer.prompt([{
    type: "list",
    name: "confirm",
    message: chalk.yellow.bold("Do you want to add an address??: "),
    choices: ['Yes', 'No'],
    default: 'No'
  }]).then(async (data) => {

    if (data.confirm === 'Yes') {
      getData.address = await inquirer.prompt<z.infer<typeof addressObject>>([
        {
          type: "input",
          name: "city",
          message: chalk.yellow.bold("Enter your city: "),
          validate: (value) => {
            const cityValidator = addressObject.pick({ city: true });
            if (typeof value !== 'string')
              return "you need to provide a string";
            else {
              const validation = cityValidator.safeParse({ city: value });
              return (validation.success) ? (true) : (JSON.stringify(validation.error, null, "\t"));
            }
          }
        },
        {
          type: "input",
          name: "countryRegion",
          message: chalk.yellow.bold("Enter your countryRegion: "),
          validate: (value) => {
            const countryRegionValidator = addressObject.pick({ countryRegion: true });
            if (typeof value !== 'string')
              return "you need to provide a string";
            else {
              const validation = countryRegionValidator.safeParse({ countryRegion: value });
              return (validation.success) ? (true) : (JSON.stringify(validation.error, null, "\t"));
            }
          }
        },
        {
          type: "input",
          name: "label",
          message: chalk.yellow.bold("Enter your label: "),
          validate: (value) => {
            const labelValidator = addressObject.pick({ label: true });
            if (typeof value !== 'string')
              return "you need to provide a string";
            else {
              const validation = labelValidator.safeParse({ label: value });
              return (validation.success) ? (true) : (JSON.stringify(validation.error, null, "\t"));
            }
          }
        },
        {
          type: "input",
          name: "postalCode",
          message: chalk.yellow.bold("Enter your postalCode: "),
          validate: (value) => {
            const postalCodeValidator = addressObject.pick({ postalCode: true });
            if (typeof value !== 'string')
              return "you need to provide a string";
            else {
              const validation = postalCodeValidator.safeParse({ postalCode: value });
              return (validation.success) ? (true) : (JSON.stringify(validation.error, null, "\t"));
            }
          },
        },
        {
          type: "input",
          name: "stateProvince",
          message: chalk.yellow.bold("Enter your state Province: "),
          validate: (value) => {
            const stateProvinceValidator = addressObject.pick({ stateProvince: true });
            if (typeof value !== 'string')
              return "you need to provide a string";
            else {
              const validation = stateProvinceValidator.safeParse({ stateProvince: value });
              return (validation.success) ? (true) : (JSON.stringify(validation.error, null, "\t"));
            }
          }
        },
        {
          type: "input",
          name: "street",
          message: chalk.yellow.bold("Enter your street: "),
          validate: (value) => {
            const streetValidator = addressObject.pick({ street: true });
            if (typeof value !== 'string')
              return "you need to provide a string";
            else {
              const validation = streetValidator.safeParse({ street: value });
              return (validation.success) ? (true) : (JSON.stringify(validation.error, null, "\t"));
            }
          }
        },
      ]);
    } else {
      getData.address = null;
    }

    if (getData?.middleName === '') {
      getData.middleName = null
    }
    if (getData?.email === '') {
      getData.email = null;
    }
    if (getData.birthday === '') {
      getData.birthday = null;
    }

    try {
      ContactValidator.parse(getData);
      try {
        const stringified_address = getData.address ? (JSON.stringify(getData.address)) : (null);
        let result:Database.RunResult;
        if(stringified_address==null)
          result = await db.insert(Contact).values({...getData,address:null}).execute();
        else
          result = await db.insert(Contact).values({...getData,address:stringified_address}).execute()
        console.clear();
        const lastInserted = (
          await db
            .select()
            .from(Contact)
            .where(eq(Contact.id, result.lastInsertRowid as number))
        )[0];
        console.log(
          chalk
            .bgBlack
            .greenBright
            .bold(
              `Contact successfully added, id: ${result.lastInsertRowid
              }.\n${JSON.stringify(
                {
                  ...lastInserted,
                  address: (stringified_address!=null)?JSON.parse(lastInserted.address||''):(null)
                },
                null,
                "\t"
              )
              }.`
            )
        );

      } catch (err) {
        console.log(chalk.red.bold(JSON.stringify(err, null, "\t")));
      }
    } catch (error) {
      let err = (error as ZodError);
      console.log(chalk.red.bold(JSON.stringify(err, null, "\t")))
    }

  }).finally(() => {
    const rainbow = chalkAnimation.rainbow(
      figlet
        .textSync(
          'Process ended.',
          { whitespaceBreak: true }
        )
    );
    setTimeout(() => {
      rainbow.stop();
    }, 2000);
  }
  );


};
export default addContact;