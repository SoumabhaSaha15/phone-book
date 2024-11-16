import { parseVCards } from "vcard4-ts";
import fs from "fs";

const importContact = async () => {
  
  const yyyymmddToDate = (dateString:string) => {
    const regex = /^(\d{4})(\d{2})(\d{2})$/;
    const match = dateString.match(regex);
    if (!match) throw new Error('Invalid date format. Expected YYYYMMDD.');
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // Month is zero-based
    const day = parseInt(match[3], 10);
    return new Date(year, month, day);
  }

  const imported = parseVCards(fs.readFileSync('./imports/x.vcf',"utf-8"));
  console.log(imported.vCards?.at(0)?.FN?.at(0)?.value);
  console.log(yyyymmddToDate(imported.vCards?.at(0)?.BDAY?.value||""));

};
importContact();
export default importContact;