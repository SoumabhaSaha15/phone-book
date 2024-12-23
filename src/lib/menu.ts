import PhoneBook from "./index.js"
export type MenuString = ("Add a contact" | "Delete contact" | "Search contact" | "Edit a contact" | "Export contact" | "Import contact");
const Menu: Record<MenuString, Function> = {
  "Add a contact": PhoneBook.addContact,
  "Delete contact": PhoneBook.deleteContact,
  "Search contact": PhoneBook.searchContact,
  "Edit a contact": PhoneBook.editContact,
  "Export contact": PhoneBook.exportSelectedContact,
  "Import contact": PhoneBook.importContacts,
};
export default Menu;