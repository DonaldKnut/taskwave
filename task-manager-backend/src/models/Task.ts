import { Schema, model, Document, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  completed: boolean;
  userId: Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Task = model<ITask>("Task", taskSchema);
