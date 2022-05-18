import { Schema } from "mongoose";

const ClientsSchema = new Schema({
  apiKey: {
    type: String,
  },
});

export default ClientsSchema;
