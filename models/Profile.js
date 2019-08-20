const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },
  username: {
    type: String,
    required: true,
    max: 30
  },
  profilepic: {
   type:String
  },
  website: {
    type: String
  },
  country: {
    type: String
  },
  languages: {
    type: String,
    required: true
  },
  portfolio: {
    type: String
  },
  social: {
    youtube: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    github: {
      type: String
    }
  }
});

module.exports = Profile = mongoose.model("myProfile", ProfileSchema);
