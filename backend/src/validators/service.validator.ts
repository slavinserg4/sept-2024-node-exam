import joi from "joi";

import { RegexEnum } from "../enums/regex.enum";
import { SortDirectionEnum } from "../enums/sort-direction.enum";

export class ServiceValidator {
    private static serviceNameForCreate = joi
        .string()
        .regex(RegexEnum.SERVICE_NAME);

    private static sortDirection = joi
        .string()
        .valid(SortDirectionEnum.ASC, SortDirectionEnum.DESC)
        .default(SortDirectionEnum.ASC);

    public static createSchema = joi.object({
        name: this.serviceNameForCreate.required(),
    });

    public static searchSchema = joi.object({
        name: joi.string().required(),
        sort: this.sortDirection.optional(),
    });

    // Для GET /services - валідація query
    public static getAllSchema = joi.object({
        sort: this.sortDirection.optional(),
    });
}
