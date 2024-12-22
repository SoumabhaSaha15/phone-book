import inquirer from "inquirer";
import chalk from "chalk";
import { Contact, ContactValidator, addressObject, validatorFactory } from "../db/schema.js";
import db from "../db/index.js";
import chalkAnimation from "chalk-animation";
import { z, ZodError } from "zod"
import { eq } from "drizzle-orm";
import figlet from "figlet";
import Database from "better-sqlite3";
const addContact = async (): Promise<void> => {

  const blackGreenBoldLog = (...params: any[]): void => {
    const logger = (log: string) => console.log(chalk.bgBlack.greenBright.bold(log));
    params.forEach(item => logger((typeof item === 'object') ? JSON.stringify(item, null, "\t") : item));
  };

  let getData: z.infer<typeof ContactValidator> = await inquirer.prompt<z.infer<typeof ContactValidator>>([
    {
      type: "input",
      name: "firstName",
      message: chalk.yellow.bold("Enter your firstName: "),
      validate: validatorFactory(ContactValidator.pick({ firstName: true }))
    },
    {
      type: "input",
      name: "lastName",
      message: chalk.yellow.bold("Enter your lastName: "),
      validate: validatorFactory(ContactValidator.pick({ lastName: true }))
    },
    {
      type: "input",
      name: "phoneNumber",
      message: chalk.yellow.bold("Enter your phoneNumber: "),
      validate: validatorFactory(ContactValidator.pick({ phoneNumber: true }))
    },
    {
      type: "input",
      name: "middleName",
      message: chalk.yellow.bold("Enter your middleName(press enter to skip): "),
      validate: validatorFactory(ContactValidator.pick({ middleName: true }))
    },
    {
      type: "input",
      name: "email",
      message: chalk.yellow.bold("Enter your email(press enter to skip): "),
      validate: validatorFactory(ContactValidator.pick({ email: true }))
    },
    {
      type: "input",
      name: "birthday",
      message: chalk.yellow.bold("Enter your birthday[YYYY-MM-DD](press enter to skip): "),
      validate: validatorFactory(ContactValidator.pick({ birthday: true }))
    },
  ]);

  inquirer.prompt([{
    type: "list",
    name: "confirm",
    message: chalk.yellow.bold("Do you want to add an address??: "),
    choices: ['Yes', 'No'],
    default: 'No'
  }]).then(async ({ confirm }) => {

    if (confirm === 'Yes')
      getData.address = await inquirer.prompt<z.infer<typeof addressObject>>([
        {
          type: "input",
          name: "city",
          message: chalk.yellow.bold("Enter your city: "),
          validate: validatorFactory(addressObject.pick({ city: true }))
        },
        {
          type: "input",
          name: "countryRegion",
          message: chalk.yellow.bold("Enter your countryRegion: "),
          validate: validatorFactory(addressObject.pick({ countryRegion: true }))
        },
        {
          type: "input",
          name: "label",
          message: chalk.yellow.bold("Enter your label: "),
          validate: validatorFactory(addressObject.pick({ label: true }))
        },
        {
          type: "input",
          name: "postalCode",
          message: chalk.yellow.bold("Enter your postalCode: "),
          validate: validatorFactory(addressObject.pick({ postalCode: true }))
        },
        {
          type: "input",
          name: "stateProvince",
          message: chalk.yellow.bold("Enter your state Province: "),
          validate: validatorFactory(addressObject.pick({ stateProvince: true }))
        },
        {
          type: "input",
          name: "street",
          message: chalk.yellow.bold("Enter your street: "),
          validate: validatorFactory(addressObject.pick({ street: true }))
        },
      ]);
    else getData.address = null;
    if (getData?.middleName === '') getData.middleName = null;
    if (getData?.email === '') getData.email = null;
    if (getData.birthday === '') getData.birthday = null;
    ContactValidator.parse(getData);
    console.clear();
    try {
      const result: Database.RunResult = await db.insert(Contact).values(getData).execute();
      const lastInserted = (await db.select().from(Contact).where(eq(Contact.id, result.lastInsertRowid as number)).limit(1)).pop();
      if (!lastInserted) throw Error('Contact not inserted!!!');
      blackGreenBoldLog(`Contact successfully added, id: ${result.lastInsertRowid}.\n`, lastInserted);
    } catch (error) {
      console.log(chalk.red.bold(JSON.stringify(error, null, "\t")));
    }

  }).catch((error) => {
    console.log(chalk.red.bold(JSON.stringify((error as ZodError), null, "\t")));
  }).finally(() => {
    const rainbow = chalkAnimation.rainbow(figlet.textSync('Process ended.', { whitespaceBreak: true }));
    setTimeout(() => { rainbow.stop(); }, 2000);
  });

};
export default addContact;