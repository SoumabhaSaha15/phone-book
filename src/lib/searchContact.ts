import inquirer from "inquirer";
import db from "../db/index.js";
import chalk from "chalk";
import { ContactValidator } from "../db/schema.js";
import figlet from "figlet";
export const searchContact = async (): Promise<void> => {
  const searchByPhoneNumber = () => {

  }
  const searchByFirstName = () =>{

  }
  const searchByLastName = () => {

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
  process.on('beforeExit',()=>{
    console.log(chalk.blue.bold(figlet.textSync("Good bye.",{whitespaceBreak:true})));
  })
}