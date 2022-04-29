import { Schema } from "mongoose";

import { mainDb } from "../connections/MainDb";

const ClientsSchema = new Schema({
  apiKey: {
    type: String,
  },
});

const Clients = mainDb.model("Clients", ClientsSchema, "Clients");
export default Clients;
