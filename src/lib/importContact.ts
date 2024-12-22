import { parseVCards } from 'vcard4-ts';
import { z } from 'zod';
import { Contact, ContactValidator, ContactObject } from '../db/schema.js';
import fs from 'fs';
import db from '../db/index.js';
import chalk from 'chalk';
const importContacts = async (): Promise<void> => {
  type ContactType = z.infer<typeof ContactValidator>;
  const yyyymmddToDate = (dateTimeString: string): string => {
    const match = dateTimeString.match(/^(\d{4})(\d{2})(\d{2})$/);
    return (!match)? (""):(`${match[1]}-${match[2]}-${match[3]}`);
  }
  const DIR = fs.readdirSync('./imports').filter((file: string): Boolean => (file.split(".").pop() == 'vcf' && file.split(".").shift() != 'compleated'));
  if (DIR.length == 0) {
    console.log(chalk.red.bold('no files to import'));
    process.exit(0);
  }
  DIR.forEach(async (file) => {
    const cards = parseVCards(fs.readFileSync(`./imports/${file}`, 'utf-8'));
    if (!cards.vCards || cards.vCards.length === 0) console.error('No valid vCards found.');
    cards.vCards?.forEach(async (card) => {
      const name: string[] = card.FN[0].value.split(" "); // Get the full name
      const contact: ContactType = {
        firstName: name.shift() || ``,
        lastName: name.pop() || ``,
        middleName: name.join(" ") || null,
        email: card.EMAIL ? (card.EMAIL?.at(0)?.value) : (null),
        phoneNumber: card.TEL ? card.TEL[0].value : ``,
        address: card.ADR ? ({
          label: card?.ADR?.at(0)?.parameters?.TYPE?.at(0) || ``,
          street: (card.ADR[0].value?.streetAddress?.at(0)) || ``,
          city: card.ADR[0].value.locality?.at(0) || ``,
          stateProvince: card.ADR[0].value.region?.at(0) || ``,
          postalCode: card.ADR[0].value.postalCode?.at(0) || ``,
          countryRegion: card.ADR[0].value.countryName?.at(0) || ``,
        }) : (null),
        birthday: yyyymmddToDate(card?.BDAY?.value || ``) || null
      };
      console.log(contact);
      try {
        ContactValidator.parse(contact);
        const result = await db.insert(Contact).values(contact).execute();
        console.log(result);
      } catch (error) {
        console.log(chalk.red.bold((error as Error).message));
      }
    });
    fs.renameSync(`./imports/${file}`, `./imports/compleated.${file}`);
  });

}
export default importContacts;