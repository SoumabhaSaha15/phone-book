import db from "../db/index.js";
import { Contact, RecordFilter, getFilter } from "../db/schema.js";
import inquirer from "inquirer";
import chalk from "chalk";
import { and, like, eq } from "drizzle-orm";
const deleteContact = async (): Promise<void> => {
  let filter: RecordFilter = await getFilter();
  const records = await db.select().from(Contact)
    .where(
      and(
        and(
          like(Contact.firstName, filter.firstName),
          like(Contact.lastName, filter.lastName)
        ),
        like(Contact.phoneNumber, filter.phoneNumber)
      )
    ).execute();
  if (records.length === 0) {
    console.log(chalk.redBright.bold("no record found"));
    process.exit(0);
  }
  const options = records.map(it => ({
    id: it.id,
    Name: `${it.firstName} ${it.middleName || ""} ${it.lastName}`,
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
      records.filter(it => (it.id === JSON.parse(value)?.id)).forEach(({ id }) => {
        db.delete(Contact).where(eq(Contact.id, id)).execute().then(() => {
          console.log(chalk.blueBright.bold(`contact with uid: ${id} deleted.`));
        }).catch((error: Error) => {
          console.log(chalk.redBright.bold('!!!error occured\n' + error.message));
        });
      });
    } catch (error) {
      console.log(chalk.red.bold((error as Error).message));
    }
  });
}
export default deleteContact;