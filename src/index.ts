import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";
import PhoneBook from "./lib/index.js";
import figlet from "figlet";
try {
  console.clear();
  chalkAnimation.rainbow(figlet.textSync("Wellcome to phone-book.",{
    font:"Banner",
    whitespaceBreak:true
  }));
} catch (error) {
  console.error(error);
}