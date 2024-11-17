import { parseVCards } from "vcard4-ts";
import fs from "fs";
import {ContactObject,ContactValidator} from "../db/schema.js"
import { z } from "zod";
const importContact = async () => {
  type details = z.infer<typeof ContactValidator>;
  /**
   * 
   * @param dateTimeString {string}
   * @returns empty string for invalid dateTimeString else YYYY-MM-DD string
   */
  const yyyymmddToDate = (dateTimeString:string):string => {
    const match = dateTimeString.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (!match) return "";
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  const imported = parseVCards(fs.readFileSync('./imports/x.vcf',"utf-8"));
  imported.vCards?.forEach(item=>{
    const name = item.FN[0]?.value;
    const nameArray = name.split(" ");
    const email = item?.EMAIL;
    const phno = item?.TEL?.at(0)?.value;
    let data:details = {
      firstName:nameArray.shift() as string,
      lastName:nameArray.pop() as string,
      middleName:nameArray.join(" ") as string,
      birthday:yyyymmddToDate(item.BDAY?.value||""),
      email:email?.[0].value,
      phoneNumber:phno as string,
    }
    console.log(data);
  });

};
importContact();
export default importContact;