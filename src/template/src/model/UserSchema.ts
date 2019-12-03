import { Document, Schema, Model, model } from "mongoose";
import { IItemModel } from "./ItemSchema";

export interface IUserModel extends Document {
  email: string;
  username: string;
  password: string;
  isVerified: boolean;
  verificationKey: string;

  following: Array<IUserModel>;
  followers: Array<IUserModel>;
  items: Array<IItemModel>;
  likedItems: Array<IItemModel>;
}

export var UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationKey: { type: String, required: true },
  isVerified: { type: Boolean, default: false },

  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  likedItems: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);
