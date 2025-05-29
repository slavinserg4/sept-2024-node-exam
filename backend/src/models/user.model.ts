import { model, Schema } from "mongoose";

import { RoleEnum } from "../enums/role.enum";
import { IUser } from "../interfaces/user.interface";

const userSchema = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: {
            enum: RoleEnum,
            type: String,
            required: true,
            default: RoleEnum.USER,
        },
        name: { type: String, required: true },
        surname: { type: String, required: true },
    },
    {
        versionKey: false,
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password;
                return ret;
            },
        },
    },
);
export const User = model<IUser>("User", userSchema);
