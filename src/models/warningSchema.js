const { model, Schema } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

let warningSchema = new Schema({
  GuildID: String,
  UserID: String,
  Content: Array,
});

module.exports = model("warning", warningSchema);
