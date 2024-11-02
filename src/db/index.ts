import {drizzle} from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
const sqlite3 = new Database('./db.sqlite3');
export default drizzle(sqlite3);