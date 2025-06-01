import { model, Schema } from "mongoose";

import { IDoctor } from "../interfaces/doctor.interface";

const doctorSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        clinics: [
            { type: Schema.Types.ObjectId, ref: "Clinic", required: true },
        ],
        services: [
            { type: Schema.Types.ObjectId, ref: "Service", required: true },
        ],
    },
    { timestamps: true, versionKey: false },
);
export const Doctor = model<IDoctor>("Doctor", doctorSchema);
