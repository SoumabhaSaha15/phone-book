import inquirer from "inquirer";
import chalk from "chalk";
import db from "../db/index.js";
import { string, z } from "zod";
import { Contact, ContactObject, ContactValidator } from "../db/schema.js";
import { like, and, eq } from "drizzle-orm";
const editContact = async (): Promise<void> => {
  let records: ContactObject[];
  type FilterObject = {
    firstName: string,
    lastName: string,
    phoneNumber: string
  };
  let filter = await inquirer.prompt<FilterObject>([
    {
      type: "input",
      name: "firstName",
      message: "Enter first name filter: ",
    },
    {
      type: "input",
      name: "lastName",
      message: "Enter last name filter: ",
    },
    {
      type: "input",
      name: "phoneNumber",
      message: "Enter ph-no filter: ",
    }
  ]);
  records = await db
    .select()
    .from(Contact)
    .where(
      and(
        and(
          like(Contact.firstName, filter.firstName),
          like(Contact.lastName, filter.lastName)
        ),
        like(Contact.phoneNumber, filter.phoneNumber)
      )
    )
    .execute();
  if (!records.length) {
    console.log(chalk.red.bold('No such records.'));
    process.exit(0);
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
      if (id != null)
        records
          .filter(it => (it.id == id))
          .forEach((item) => {
            let it: any = JSON.parse(JSON.stringify(item));
            delete it.id;
            if (item.address !== null)
              it.address = JSON.parse(it.address);
            inquirer
              .prompt<{ editable: string }>([{
                type: "editor",
                default: JSON.stringify(it, null, 2),
                name: "editable",
                message: ""
              }])
              .then(({ editable }) => {
                let edited = JSON.parse(editable);
                (edited["id"]) ? ((() => { delete edited.id; })()) : ((() => { })());
                if (edited["address"] !== null) {
                  if (typeof edited["address"] == "string") {
                    edited["address"] = JSON.parse(edited["address"]);
                  }
                }
                ContactValidator.parse(edited);
                db.update(Contact)
                  .set({ ...edited, address: (edited.address) ? JSON.stringify(edited.address) : null })
                  .where(eq(Contact.id, item.id))
                  .execute()
                  .then(data => {
                    console.log(chalk.blue.bold(JSON.stringify(data, null, 2)));
                  }).catch((err: { message: string }) => {
                    console.log(chalk.red.bold(err.message));
                  });
              })
              .catch((err: { message: string }) => {
                console.log(chalk.red.bold(err.message))
              });
          });
    } catch (e) {
      console.log(chalk.red.bold(e));
    }
  });
}
export default editContact;