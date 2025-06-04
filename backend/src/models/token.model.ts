import { model, Schema } from "mongoose";

import { IToken } from "../interfaces/token.interface";

const tokenSchema = new Schema(
    {
        accessToken: { type: String, required: true },
        refreshToken: { type: String, required: true },
        _userId: {
            type: Schema.Types.ObjectId,
            required: function () {
                return !this._doctorId;
            },
            ref: "User",
        },
        _doctorId: {
            type: Schema.Types.ObjectId,
            required: function () {
                return !this._userId;
            },
            ref: "Doctor",
        },
    },
    { timestamps: true, versionKey: false },
);

export const Token = model<IToken>("tokens", tokenSchema);
