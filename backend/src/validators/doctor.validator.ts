import joi from "joi";

import { RegexEnum } from "../enums/regex.enum";
import { SortDirectionEnum, SortFieldEnum } from "../enums/sort-direction.enum";

export class DoctorValidator {
    private static email = joi.string().email().trim();
    private static password = joi.string().regex(RegexEnum.PASSWORD);
    private static firstName = joi.string().regex(RegexEnum.NAME);
    private static lastName = joi.string().regex(RegexEnum.NAME);
    private static phone = joi.string().regex(RegexEnum.PHONE);
    private static clinics = joi.string();
    private static services = joi.string();

    private static sortDirection = joi
        .string()
        .valid(SortDirectionEnum.ASC, SortDirectionEnum.DESC)
        .default(SortDirectionEnum.ASC);

    private static sortField = joi
        .string()
        .valid(SortFieldEnum.FIRST_NAME, SortFieldEnum.LAST_NAME)
        .default(SortDirectionEnum.ASC);

    public static createSchema = joi.object({
        firstName: this.firstName.required(),
        lastName: this.lastName.required(),
        email: this.email.required(),
        password: this.password.required(),
        phone: this.phone.required(),
        clinics: this.clinics.required(),
        services: this.services.required(),
    });

    public static getAllSchema = joi
        .object({
            sortDirection: this.sortDirection.optional(),
            sortField: this.sortField.optional(),
        })
        .unknown(true);
}
