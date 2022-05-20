import * as mainDbConnection from "../../connections/MainDb";
import ClientsSchema from "./ClientsSchema";
import UsersSchema from "./UsersSchema";

const conn = mainDbConnection.getDbInstance();
export const Users = conn.model("Users", UsersSchema, "Users");
export const Clients = conn.model("Clients", ClientsSchema, "Clients");
