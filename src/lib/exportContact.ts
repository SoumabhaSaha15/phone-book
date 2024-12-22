import vcard from "vcards-js";
import db from "../db/index.js";
import { Contact, addressObject, ContactObject, RecordFilter, getFilter } from "../db/schema.js";
import inquirer from "inquirer";
import chalk from "chalk";
import { like, and } from "drizzle-orm";
const createCard = (item: ContactObject) => {
  const Card = vcard();
  Card.firstName = item.firstName;
  Card.lastName = item.lastName;
  Card.cellPhone = item.phoneNumber;
  if (item.middleName !== null) Card.middleName = item.middleName;
  if (item.email !== null)  Card.email = item.email;
  if (item.birthday !== null) Card.birthday = new Date(item.birthday);
  if (item.address !== null) {
    const address = addressObject.safeParse(JSON.parse(item.address as string) || "");
    if (address.success)  Card.homeAddress = address.data;
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
    let filter: RecordFilter = await getFilter();
    records = await db.select().from(Contact)
      .where(and(
        and(
          like(Contact.firstName, filter.firstName),
          like(Contact.lastName, filter.lastName)
        ),like(Contact.phoneNumber, filter.phoneNumber)
      )).execute();
    if (!records.length) {
      console.log(chalk.red.bold('No such records.'));
      process.exit(0);
    }
  } else {
    records = await db.select().from(Contact).execute();
    if (!records.length) {
      console.log(chalk.red.bold('No such records.'));
      process.exit(0);
    }
  }
  const options = records.map(it => ({
    id: it.id,
    Name: `${it.firstName} ${it.middleName||''} ${it.lastName}`,
    phoneNumber: it.phoneNumber
  }));
  const { stringifiedOptions } = await inquirer.prompt<{ stringifiedOptions: string[] }>([{
    type: "checkbox",
    name: "stringifiedOptions",
    message: "check contacts to export: ",
    choices: options.map(it => JSON.stringify(it)),
  }]);
  console.clear();
  stringifiedOptions.forEach((value) => {
    try {
      const id: number | null = JSON.parse(value)?.id || null;
      if (id != null) records.filter(it => (it.id == id)).forEach(createCard);
    } catch (e) {
      console.log(chalk.red.bold(e));
    }
  });

}