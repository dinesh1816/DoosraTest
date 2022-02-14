import { Schema } from "mongoose";

import * as mongoConnect from "../connections/MongoConnect";

const { mainDb } = mongoConnect;

const ClientsSchema = new Schema({
  metro_auth_key: {
    type: String,
  },
});

const Clients = mainDb.model("Clients", ClientsSchema, "Client");
export default Clients;
