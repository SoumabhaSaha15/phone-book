import db from "../db/index.js";
import { Contact } from "../db/schema.js";
import inquirer from "inquirer";
import chalk from "chalk";
import { and, like, eq } from "drizzle-orm";
const deleteContact = async (): Promise<void> => {
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
  const records = await db
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

  if (records.length === 0) {
    console.log(chalk.redBright.bold("no record found"));
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
          .forEach(({ id }) => {
            db.delete(Contact)
              .where(eq(Contact.id, id))
              .execute()
              .then(() => {
                console.log(chalk.blueBright.bold(`contact with uid: ${id} deleted.`));
              })
              .catch(err => {
                console.log(chalk.redBright.bold('!!!error occured'));
              });
          });
    } catch (e) {
      console.log(chalk.red.bold(e));
    }
  });

}
export default deleteContact;