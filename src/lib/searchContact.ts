import inquirer from "inquirer";
import chalk from "chalk";
import db from "../db/index.js";
import { Contact, ContactObject } from "../db/schema.js";
import figlet from "figlet";
import { like, Column } from "drizzle-orm";
const searchContact = async (): Promise<void> => {
  const stringView = (it: ContactObject) => (`@uid:${it.id}) Name: ${it.firstName} ${it.lastName}, Phone number: ${it.phoneNumber} .`);
  const validator = (column: Column, mapper: (it: ContactObject) => any) => {
    return async (search: string) => {
      if (search === '$exit') {
        console.clear();
        process.exit(0);
      }
      let resultSet: any[] = (await db.select().from(Contact).where(like(column, search)).execute()).map(mapper);
      return (resultSet.length) ? chalk.blue.bold(JSON.stringify(resultSet, null, 2)) : chalk.red.bold("No record found");
    };
  }
  const searchByPhoneNumber = async () => {
    await inquirer.prompt([{
      type: "input",
      name: "search",
      message: chalk.blue.bold("Enter phone number to search (type '$exit' to exit process): "),
      validate: validator(Contact.phoneNumber, stringView),
    }]);
  }
  const searchByFirstName = async () => {
    await inquirer.prompt([{
      type: "input",
      name: "search",
      message: chalk.blue.bold("Enter first name to search (type '$exit' to exit process): "),
      validate: validator(Contact.firstName, stringView)
    }]);
  }
  const searchByLastName = async () => {
    await inquirer.prompt([{
      type: "input",
      name: "search",
      message: chalk.blue.bold("Enter last name to search (type '$exit' to exit process): "),
      validate: validator(Contact.lastName, stringView)
    }]);
  }
  const searchByUniqueId = async () => {
    console.log(chalk.yellow.bold(`This option will provide you all details.`));
    await inquirer.prompt([{
      type: "input",
      name: "search",
      message: chalk.blue.bold("Enter last name to search (type '$exit' to exit process): "),
      validate: validator(Contact.id, (item: ContactObject) => item),
    }]);
  }
  const INDEXES: Record<string, Function> = {
    "phoneNumber": searchByPhoneNumber,
    "firstName": searchByFirstName,
    "lastName": searchByLastName,
    "UniqueId": searchByUniqueId
  } as const;
  const keys = Object.keys(INDEXES);
  const { searchKey } = await inquirer.prompt<{ searchKey: string }>([{
    type: "list",
    name: "searchKey",
    message: chalk.yellow.bold("Select the index you want to search with:-"),
    choices: keys,
    default: keys[0]
  }]);
  INDEXES[searchKey]();
  process.on('beforeExit', () => console.log(chalk.red.bold(figlet.textSync("Error", { whitespaceBreak: true }))));
}
export default searchContact;