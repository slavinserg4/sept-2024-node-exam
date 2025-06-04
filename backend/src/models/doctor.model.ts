import { model, Schema } from "mongoose";

import { RoleEnum } from "../enums/role.enum";
import { IDoctor } from "../interfaces/doctor.interface";

const doctorSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        password: { type: String, required: true },
        role: {
            enum: RoleEnum,
            type: String,
            required: true,
            default: RoleEnum.DOCTOR,
        },
        clinics: [
            { type: Schema.Types.ObjectId, ref: "Clinic", required: true },
        ],
        services: [
            { type: Schema.Types.ObjectId, ref: "Service", required: true },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password;
                return ret;
            },
        },
    },
);
export const Doctor = model<IDoctor>("Doctor", doctorSchema);
