import vcard from "vcards-js";
import db from "../db/index.js";
import { Contact, addressObject } from "../db/schema.js";
import inquirer from "inquirer";
import chalk from "chalk";


export const exportSelectedContact = async () => {
  const records = await db
    .select()
    .from(Contact)
    .execute();

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
          .forEach(item => {
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
          });
    } catch (e) {
      console.log(chalk.red.bold(e));
    }
  })

}