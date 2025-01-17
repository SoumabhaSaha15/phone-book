import PhoneBook from "./index.js"
export type MenuString = ("Add a contact" | "Delete contact" | "Search contact" | "Edit a contact" | "Export contact" | "Import contact");
export type CommandString = ("add" | "delete" | "search" | "edit" | "export" | "import");
const Menu: Record<MenuString, Function> = {
  "Add a contact": PhoneBook.addContact,
  "Delete contact": PhoneBook.deleteContact,
  "Search contact": PhoneBook.searchContact,
  "Edit a contact": PhoneBook.editContact,
  "Export contact": PhoneBook.exportSelectedContact,
  "Import contact": PhoneBook.importContacts,
} as const;
export const Commands:Record<CommandString,Function> = {
  "add": PhoneBook.addContact,
  "delete": PhoneBook.deleteContact,
  "search": PhoneBook.searchContact,
  "edit": PhoneBook.editContact,
  "export": PhoneBook.exportSelectedContact,
  "import": PhoneBook.importContacts,
} as const;
export default Menu;