import { Document, Schema, Model, model } from "mongoose";
import { IUserModel } from "./UserSchema";
import { IItemModel } from "./ItemSchema";

export interface IMediaModel extends Document {
  uploadedBy: IUserModel;
  uploadedOn: Date;
  filename: string;
  filesize: number;
  mimetype: string;
  itemAssociatedWith: String;
}

let getDate = () => new Date();

export var MediaSchema: Schema = new Schema({
  uploadedBy: {
    type: String
  },
  itemAssociatedWith: {
    type: String,
    default: null
  },
  uploadedOn: {
    type: Date,
    default: getDate()
  },
  filename: {
    type: String,
    required: true
  },
  filesize: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String
  }
});

export const Media: Model<IMediaModel> = model<IMediaModel>(
  "Media",
  MediaSchema
);
