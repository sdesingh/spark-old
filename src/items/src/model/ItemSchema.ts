import { Document, Schema, Model, model } from "mongoose";
import { IMediaModel } from "./MediaSchema";

export interface IItemModel extends Document {
  user: String;
  parent: IItemModel | null;
  type: ItemType;
  media: String[];
  timestamp: Number;
  retweeted: number;
  likes: number;
  content: string;
}

export enum ItemType {
  POST = "post",
  RETWEET = "retweet",
  REPLY = "reply"
}

let getDate = () => parseInt((new Date().getTime() / 1000).toFixed(0));

export var ItemSchema: Schema = new Schema({
  user: {
    type: String,
    required: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "Item",
    default: null
  },
  content: {
    type: String,
    required: true
  },
  media: [{ type: String }],
  timestamp: {
    type: Number,
    default: getDate
  },
  retweeted: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },

  type: {
    type: String,
    required: true,
    default: "post"
  }
});

ItemSchema.index({
  content: "text"
});

export const Item: Model<IItemModel> = model<IItemModel>("Item", ItemSchema);
