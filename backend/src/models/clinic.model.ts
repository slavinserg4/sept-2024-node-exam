import { model, Schema } from "mongoose";

import { IClinic } from "../interfaces/clinic.interface";

const clinicSchema = new Schema(
    {
        name: { type: String, required: true },
        services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
        doctors: [{ type: Schema.Types.ObjectId, ref: "Doctor" }],
    },
    { timestamps: true, versionKey: false },
);

export const Clinic = model<IClinic>("Clinic", clinicSchema);
