import inquirer from "inquirer";
import chalk from "chalk";
import db from "../db/index.js";
import { Contact, ContactObject, ContactValidator, RecordFilter, getFilter } from "../db/schema.js";
import { like, and, eq } from "drizzle-orm";
const editContact = async (): Promise<void> => {
  let records: ContactObject[];
  let filter: RecordFilter = await getFilter();
  records = await db.select().from(Contact).where(
    and(
      and(
        like(Contact.firstName, filter.firstName),
        like(Contact.lastName, filter.lastName)
      ), like(Contact.phoneNumber, filter.phoneNumber)
    )
  ).execute();
  if (!records.length) {
    console.log(chalk.red.bold('No such records.'));
    process.exit(0);
  }
  const options = records.map(it => ({
    id: it.id,
    Name: `${it.firstName} ${it.middleName || ''} ${it.lastName}`,
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
      records.filter(it => (it.id === JSON.parse(value)?.id)).forEach((item) => {
        let it: any = JSON.parse(JSON.stringify(item));
        delete it.id;
        inquirer.prompt<{ editable: string }>([{
          type: "editor",
          default: JSON.stringify(it, null, 2),
          name: "editable",
          message: `edit ${item.firstName}'s contact`,
        }]).then(({ editable }) => {
          let edited = JSON.parse(editable);
          (edited["id"] && (delete edited.id));
          db.update(Contact).set(ContactValidator.parse(edited)).where(eq(Contact.id, item.id)).execute().then(data => {
            console.log(chalk.blue.bold(JSON.stringify(data, null, 2)));
          }).catch((error: Error) => {
            console.log(chalk.red.bold(error.message));
          });
        }).catch((error: Error) => {
          console.log(chalk.red.bold(error.message));
        });
      });
    } catch (err) {
      console.log(chalk.red.bold((err as { message: string }).message));
    }
  });
}
export default editContact;