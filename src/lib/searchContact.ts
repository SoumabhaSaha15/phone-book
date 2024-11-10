import inquirer from "inquirer";
import chalk from "chalk";
import db from "../db/index.js";
import PS from "prompt-sync";
import { Contact, ContactValidator } from "../db/schema.js";
import figlet from "figlet";
import { like } from "drizzle-orm";
export const searchContact = async (): Promise<void> => {
  // const prompt = PS();
  const searchByPhoneNumber = async () => {
    await inquirer.prompt([{
      type: "input",
      name: "search",
      message: chalk.blue.bold("Enter phone number to search (type '$exit' to exit process): "),
      validate: async (search: string) => {
        if (search == '$exit') {
          process.exit(0);
          return true;
        } else {
          let resultSet = await db
            .select()
            .from(Contact)
            .where(like(Contact.phoneNumber, `%${search}%`))
            .execute();
          resultSet = resultSet.map((it) => {
            if (it.address) {
              return { ...it, address: JSON.parse(it.address) };
            } else {
              return { ...it };
            }
          });
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
          return true;
        } else {
          let resultSet = await db
            .select()
            .from(Contact)
            .where(like(Contact.firstName, `%${search}%`))
            .execute();
          resultSet = resultSet.map((it) => {
            if (it.address) {
              return { ...it, address: JSON.parse(it.address) };
            } else {
              return { ...it };
            }
          });
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
          process.exit(0);
          return true;
        } else {
          let resultSet = await db
            .select()
            .from(Contact)
            .where(like(Contact.firstName, `%${search}%`))
            .execute();
          resultSet = resultSet.map((it) => {
            if (it.address) {
              return { ...it, address: JSON.parse(it.address) };
            } else {
              return { ...it };
            }
          });
          return (
            (resultSet.length) ?
              chalk.blue.bold(JSON.stringify(resultSet, null, 2)) :
              chalk.red.bold("No record found")
          );
        }
      }
    }]);
  }
  const INDEXES = ["phoneNumber", "firstName", "lastName"];
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
    default: {
      console.log(chalk.bgBlack.red.bold(`An error occured at line 25`));
      process.exit(0);
    }
  }
  process.on('beforeExit', () => {
    console.log(chalk.blue.bold(figlet.textSync("Good bye.", { whitespaceBreak: true })));
  })
}