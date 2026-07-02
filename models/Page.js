const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    episode_id: {
      type: String,
      required: true,
      index: true,
    },
    image_url: {
      type: String,
      required: true,
    },
  
  },
  {
    versionKey: false,
    collection: "pages",
  }
);

module.exports = mongoose.model("Page", pageSchema);