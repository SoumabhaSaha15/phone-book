import vcard from "vcards-js";
import db from "../db/index.js";
import { Contact, addressObject } from "../db/schema.js";
export const exportToVirtualContactFile = async (): Promise<void> => {
  const result = await db.select().from(Contact);
  result.forEach(
    (item) => {
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
    }
  );
}