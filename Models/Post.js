const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    body: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: false,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId, // This creates a reference to the User model
      ref: "User", // This must match the model name when you create the model
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: true,
    },
    authorProfilePics: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: true,
      default: null
    },
    category: {
      type: Array,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
