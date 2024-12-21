import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import inquirer from "inquirer";
import figlet from "figlet";
import Menu, { MenuString } from "./lib/menu.js";
try {
  console.clear();
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
} catch (e) {
  console.log(chalk.red.bold(JSON.stringify(e, null, "\t")));
}