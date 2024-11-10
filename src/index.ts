import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import inquirer from "inquirer";
import figlet from "figlet";
import PhoneBook from "./lib/index.js";
try {
  const Menu = ["Add a contact", "Delete contact", "Search contact", "Edit a contact", "Export contact", "Import contact"];
  const wellcomeAnimation = chalkAnimation.rainbow(figlet.textSync("PHONE  -  BOOK", {
    font: "Banner",
    whitespaceBreak: true
  }));
  const startProcess = () => {
    wellcomeAnimation.stop()
    inquirer
      .prompt([{
        type: "list",
        message: chalk.bgBlue.white("Select from given menu:-"),
        name: "Choise",
        choices: Menu,
      }])
      .then(data => {
        console.clear();
        switch (data.Choise) {
          case Menu[0]: {
            console.log(chalk.bgBlue.white(" Adding a contact. "));
            PhoneBook.addContact();
            break;
          }
          case Menu[2]: {
            console.log(chalk.bgBlue.white("Searchong a contact. "));
            PhoneBook.searchContact();
            break;
          }
          case Menu[4]: {
            console.log(chalk.bgBlue.white(" Exporting a contact. "));
            PhoneBook.exportAllToVirtualContactFile();
            break;
          }
          default: {
            console.log(console.log(chalk.red.bold("Invalid option!!!\n Process terminated.")));
            process.exit(0);
            break;
          }
        }
      });
  }
  setTimeout(startProcess, 2000);
} catch (e) {
  console.log(chalk.red.bold(JSON.stringify(e, null, "\t")));
}