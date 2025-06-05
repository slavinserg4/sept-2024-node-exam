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

    private static pagination = {
        pageSize: joi.number().min(1),
        page: joi.number().min(1),
    };

    public static createSchema = joi.object({
        name: this.serviceNameForCreate.required(),
    });

    public static searchSchema = joi.object({
        name: joi.string().required(),
        sort: this.sortDirection.optional(),
        pageSize: this.pagination.pageSize.optional(),
        page: this.pagination.page.optional(),
    });

    public static getAllSchema = joi.object({
        sort: this.sortDirection.optional(),
        pageSize: this.pagination.pageSize.optional(),
        page: this.pagination.page.optional(),
    });
}
