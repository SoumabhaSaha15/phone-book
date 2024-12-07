import PhoneBook from "./index.js"
const Menu:Record<string,Function> = {
  "Add a contact": PhoneBook.addContact,
  "Delete contact": PhoneBook.deleteContact,
  "Search contact": PhoneBook.searchContact,
  "Edit a contact": PhoneBook.editContact,
  "Export contact": PhoneBook.exportSelectedContact,
  "Import contact": PhoneBook.importContacts,
};
export type MenuString = (
  "Add a contact" |
  "Delete contact" |
  "Search contact" |
  "Edit a contact" |
  "Export contact" |
  "Import contact"
);
export default Menu