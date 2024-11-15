import vcard from "vcards-js";
import db from "../db/index.js";
import { Contact, addressObject, ContactValidator } from "../db/schema.js";
import inquirer from "inquirer";
import chalk from "chalk";
import { like, and } from "drizzle-orm";
type ContactObject = {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string | null;
  phoneNumber: string;
  address: string | null;
  birthday: string | null;
}
const createCard = (item: ContactObject) => {
  const Card = vcard();
  Card.firstName = item.firstName;
  Card.lastName = item.lastName;
  Card.cellPhone = item.phoneNumber;
  if (item.middleName !== null)
    Card.middleName = item.middleName;
  if (item.email !== null)
    Card.email = item.email;
  if (item.birthday !== null)
    Card.birthday = new Date(item.birthday);
  if (item.address !== null) {
    const address = addressObject.safeParse(JSON.parse(item.address || "") || "");
    if (address.success)
      Card.homeAddress = address.data;
  }
  Card.saveToFile(`./exports/${item.firstName + '@uid' + item.id}.vcf`);
  console.log(chalk.blue.bold(`exported ${item.firstName + '@uid' + item.id}.vcf ✅`));
}

export const exportSelectedContact = async () => {
  let records: ContactObject[];
  const { choice } = await inquirer.prompt<{ choice: string }>([{
    type: "list",
    name: "choice",
    message: "Do you want to filter list?: ",
    choices: ["Yes", "No"],
    default: "Yes"
  }]);
  if (choice == "Yes") {
    let filter = await inquirer.prompt<{
      firstName: string,
      lastName: string,
      phoneNumber: string
    }>([{
      type: "input",
      name: "firstName",
      message: "Enter first name filter: ",
    }, {
      type: "input",
      name: "lastName",
      message: "Enter last name filter: ",
    }, {
      type: "input",
      name: "phoneNumber",
      message: "Enter ph-no filter: ",
    }]);
    records = await db
      .select()
      .from(Contact)
      .where(
        and(
          and(
            like(Contact.firstName,filter.firstName),
            like(Contact.lastName, filter.lastName)
          ),
          like(Contact.phoneNumber, filter.phoneNumber)
        )
      )
      .execute();
      if(!records.length){
        console.log(chalk.red.bold('No such records.'));
        process.exit(0);
      }
  } else {
    records = await db
      .select()
      .from(Contact)
      .execute();
  }
  const options = records.map(it => (it.middleName != null) ? ({
    id: it.id,
    Name: `${it.firstName} ${it.middleName} ${it.lastName}`,
    phoneNumber: it.phoneNumber
  }) : ({
    id: it.id,
    Name: `${it.firstName} ${it.lastName}`,
    phoneNumber: it.phoneNumber
  }));
  const selected = await inquirer.prompt<{ options: string[] }>([{
    type: "checkbox",
    name: "options",
    message: "check contacts to export: ",
    choices: options.map(it => JSON.stringify(it)),
  }]);

  console.clear();
  selected.options.forEach((value) => {
    try {
      const id: number | null = JSON.parse(value)?.id || null;
      if (id != null)
        records
          .filter(it => (it.id == id))
          .forEach(createCard);
    } catch (e) {
      console.log(chalk.red.bold(e));
    }
  });

}