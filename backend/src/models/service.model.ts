import { model, Schema } from "mongoose";

import { IService } from "../interfaces/service.interface";

const serviceSchema = new Schema(
    {
        name: { type: String, required: true },
        doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
        clinicId: { type: Schema.Types.ObjectId, ref: "Clinic" },
    },
    { timestamps: true, versionKey: false },
);
export const Service = model<IService>("Service", serviceSchema);
