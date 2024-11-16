import inquirer from "inquirer";
import chalk from "chalk";
import db from "../db/index.js";
import { Contact ,ContactObject} from "../db/schema.js";
import figlet from "figlet";
import { like ,eq} from "drizzle-orm";

const searchContact = async (): Promise<void> => {
  const stringView = (it:ContactObject) => (`@uid:${it.id}) Name: ${it.firstName} ${it.lastName}, Phone number: ${it.phoneNumber} .`);
  const searchByPhoneNumber = async () => {
    await inquirer.prompt([{
      type: "input",
      name: "search",
      message: chalk.blue.bold("Enter phone number to search (type '$exit' to exit process): "),
      validate: async (search: string) => {
        if (search == '$exit') {
          console.clear();
          process.exit(0);
        } else {
          let resultSet: string[] = (
            await db
              .select()
              .from(Contact)
              .where(like(Contact.phoneNumber, `%${search}%`))
              .execute()
          ).map(stringView);
          return (
            (resultSet.length) ?
              chalk.blue.bold(JSON.stringify(resultSet, null, 2)) :
              chalk.red.bold("No record found")
          );
        }
      }
    }]);
  }
  
  const searchByFirstName = async () => {
    await inquirer.prompt([{
      type: "input",
      name: "search",
      message: chalk.blue.bold("Enter first name to search (type '$exit' to exit process): "),
      validate: async (search: string) => {
        if (search == '$exit') {
          console.clear();
          process.exit(0);
          // return true;
        } else {
          let resultSet: string[] = (
            await db
              .select()
              .from(Contact)
              .where(like(Contact.firstName, `%${search}%`))
              .execute()
          ).map(stringView);
          return (
            (resultSet.length) ?
              chalk.blue.bold(JSON.stringify(resultSet, null, 2)) :
              chalk.red.bold("No record found")
          );
        }
      }
    }]);
  }

  const searchByLastName = async () => {
    await inquirer.prompt([{
      type: "input",
      name: "search",
      message: chalk.blue.bold("Enter last name to search (type '$exit' to exit process): "),
      validate: async (search: string) => {
        if (search == '$exit') {
          console.clear();
          process.exit(0);
        } else {
          let resultSet: string[] = (
            await db
              .select()
              .from(Contact)
              .where(like(Contact.lastName, `%${search}%`))
              .execute()
          ).map(stringView);
          return (
            (resultSet.length) ?
              chalk.blue.bold(JSON.stringify(resultSet, null, 2)) :
              chalk.red.bold("No record found")
          );
        }
      }
    }]);
  }
  
  /**
   * searches by id (primary key) in the database
  */
  const searchByUniqueId = async () => {
    await inquirer.prompt([{
      type: "input",
      name: "search",
      message: chalk.blue.bold("Enter last name to search (type '$exit' to exit process): "),
      validate: async (search: string) => {
        if (search == '$exit') {
          console.clear();
          process.exit(0);
        } else if(Number.isNaN(parseInt(search))){
          return chalk.red.bold(`!!!invalid input,pls enter an number`);
        } else {
          let resultSet = (
            await db
              .select()
              .from(Contact)
              .where(eq(Contact.id,parseInt(search)))
              .execute()
          ).map(it => (it.address !== null) ? ({ ...it, address: JSON.parse(it.address) }) : it); //ternery expression converts json string into address object if address is not null
          return (
            (resultSet.length) ?
              chalk.blue.bold(JSON.stringify(resultSet, null, 2)) :
              chalk.red.bold("No record found")
          );
        }
      }
    }]);
  }
  
  const INDEXES = ["phoneNumber", "firstName", "lastName", "UniqueId"];
  const searchIndex = await inquirer.prompt<{ searchKey: string }>([{
    type: "list",
    name: "searchKey",
    message: chalk.yellow.bold("Select the index you want to search with:-"),
    choices: INDEXES,
    default: INDEXES[0]
  }]);
  switch (searchIndex.searchKey) {
    case INDEXES[0]: {
      searchByPhoneNumber();
      break;
    }
    case INDEXES[1]: {
      searchByFirstName();
      break;
    }
    case INDEXES[2]: {
      searchByLastName();
      break;
    }
    case INDEXES[3]: {
      console.log(chalk.yellow.bold(`This will give you full data.`));
      searchByUniqueId();
      break;
    }
    default: {
      console.log(chalk.bgBlack.red.bold(`An error occured at line 25`));
      process.exit(0);
    }
  }
  process.on('beforeExit', () => {
    console.log(chalk.red.bold(figlet.textSync("Error", { whitespaceBreak: true })));
  })
}
export default searchContact;