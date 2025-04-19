// import mongoose from "mongoose";

import mongoose, { Schema,model } from "mongoose";

// const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
});

export const Usermodel = model("user", UserSchema);

const ContentSchema = new Schema({
  title:String,
  link:String,
  tags: [{type:mongoose.Types.ObjectId, ref:'Tag'}],
  // foreign key is userId and ref to user collection
  userId: { type: mongoose.Types.ObjectId, ref: "user" ,require:true },
});

// const Tags = new Schema({
//   id: ObjectId,
//   title: String,
// });

// const Links = new Schema({
//   id: ObjectId,
//   userId: { type: Schema.Types.ObjectId, ref: "UserSchema" },
// });


export const Contenmodel = mongoose.model("content", ContentSchema);
// const Tagsmodel = mongoose.model("tags", Tags);

// const Linksmodel = mongoose.model("links", Links);


//  module.exports = {
//   Usermodel: Usermodel,
//   Contenmodel: Contenmodel,
//   Tagsmodel: Tagsmodel,
//   Linksmodel: Linksmodel,
// };
