import joi from "joi";

import { RegexEnum } from "../enums/regex.enum";
import { SortDirectionEnum } from "../enums/sort-direction.enum";

export class ClinicValidator {
    private static clinicNameForCreate = joi
        .string()
        .regex(RegexEnum.CLINIC_NAME);
    private static clinicNameForSearch = joi.string().min(1);
    private static serviceNameForSearch = joi.string().min(1);
    private static doctorNameForSearch = joi.string().min(1);

    private static sortDirection = joi
        .string()
        .valid(SortDirectionEnum.ASC, SortDirectionEnum.DESC)
        .default(SortDirectionEnum.ASC);

    public static createSchema = joi.object({
        name: this.clinicNameForCreate.required(),
    });
    public static getAllSchema = joi.object({
        sortDirection: this.sortDirection.optional(),
        clinicName: this.clinicNameForSearch.optional(),
        serviceName: this.serviceNameForSearch.optional(),
        doctorName: this.doctorNameForSearch.optional(),
    });
}
