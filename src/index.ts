import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import inquirer from "inquirer";
import figlet from "figlet";
import { rainbow } from "gradient-string";
import Menu, { MenuString, Commands, CommandString } from "./lib/menu.js";
console.clear();
try {
  if (process.argv.length == 2) {
    const wellcomeAnimation = chalkAnimation.rainbow(figlet.textSync("PHONE  -  BOOK", { font: "Banner", whitespaceBreak: true }));
    const startProcess = async () => {
      wellcomeAnimation.stop();
      const { Choise } = await inquirer.prompt<{ Choise: MenuString }>([{
        type: "list",
        message: chalk.bgBlue.white("Select from given menu:-"),
        name: "Choise",
        choices: Object.keys(Menu),
      }]);
      Menu[Choise]();
    }
    setTimeout(startProcess, 2000);
  } else {
    if (Object.keys(Commands).includes(process.argv[2]) && process.argv.length === 3) {
      console.log(rainbow(figlet.textSync(process.argv[2].toLocaleUpperCase(), { whitespaceBreak: true })));
      Commands[process.argv[2] as CommandString]();
    } else throw new Error(chalk.red(figlet.textSync("\nInvalid command", { whitespaceBreak: true })));
  }
} catch (error) {
  console.log(chalk.red.bold((error as Error).message));
}