import { OpenAPIV3 } from "openapi-types";
import swaggerUI from "swagger-ui-express";

const swaggerDocument: OpenAPIV3.Document = {
    openapi: "3.0.0",
    info: {
        title: "Medical Clinic API Documentation",
        version: "1.0.0",
        description: "API documentation for Medical Clinic Management System",
    },
    servers: [
        {
            url: "http://localhost:3005",
            description: "Local server",
        },
    ],
    components: {
        schemas: {
            Error: {
                type: "object",
                properties: {
                    status: { type: "number" },
                    message: { type: "string" },
                },
            },
            TokenPair: {
                type: "object",
                properties: {
                    accessToken: { type: "string" },
                    refreshToken: { type: "string" },
                },
            },
            ServiceItem: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    price: { type: "number" },
                    description: { type: "string" },
                    clinics: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                _id: { type: "string" },
                                name: { type: "string" },
                            },
                        },
                    },
                    doctors: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                _id: { type: "string" },
                                firstName: { type: "string" },
                                lastName: { type: "string" },
                            },
                        },
                    },
                },
            },
            PagedServicesResponse: {
                type: "object",
                properties: {
                    data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/ServiceItem" },
                    },
                    totalItems: { type: "integer" },
                    totalPages: { type: "integer" },
                    previousPage: { type: "boolean" },
                    nextPage: { type: "boolean" },
                },
            },
        },
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    paths: {
        "/auth/sign-up": {
            post: {
                tags: ["Auth"],
                summary: "Register new user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: {
                                        type: "string",
                                        description:
                                            "Must contain upper and lowercase letters, numbers and special characters",
                                        pattern:
                                            "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\s:]).{8,16}$",
                                    },
                                    name: {
                                        type: "string",
                                        pattern: "^[A-Z][a-z]{1,9}$",
                                        description:
                                            "First letter uppercase, rest lowercase, 2-10 characters",
                                    },
                                    surname: {
                                        type: "string",
                                        pattern: "^[A-Z][a-z]{1,9}$",
                                        description:
                                            "First letter uppercase, rest lowercase, 2-10 characters",
                                    },
                                },
                                required: [
                                    "email",
                                    "password",
                                    "name",
                                    "surname",
                                ],
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "User successfully registered",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        user: {
                                            type: "object",
                                            properties: {
                                                _id: { type: "string" },
                                                email: { type: "string" },
                                                name: { type: "string" },
                                                surname: { type: "string" },
                                                role: { type: "string" },
                                                createdAt: { type: "string" },
                                                updatedAt: { type: "string" },
                                            },
                                        },
                                        tokens: {
                                            $ref: "#/components/schemas/TokenPair",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                },
            },
        },

        "/auth/sign-in": {
            post: {
                tags: ["Auth"],
                summary: "Login user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: { type: "string" },
                                },
                                required: ["email", "password"],
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Successfully logged in",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        user: {
                                            type: "object",
                                            properties: {
                                                _id: { type: "string" },
                                                email: { type: "string" },
                                                name: { type: "string" },
                                                surname: { type: "string" },
                                                role: { type: "string" },
                                            },
                                        },
                                        tokens: {
                                            $ref: "#/components/schemas/TokenPair",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Invalid email or password",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                },
            },
        },

        "/auth/recovery": {
            post: {
                tags: ["Auth"],
                summary: "Request password recovery",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: {
                                        type: "string",
                                        format: "email",
                                        description:
                                            "Email address for password recovery",
                                    },
                                },
                                required: ["email"],
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Recovery email sent",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        details: {
                                            type: "string",
                                            example: "Check your email",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "404": {
                        description: "User not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                },
            },
        },

        "/auth/recovery/{token}": {
            post: {
                tags: ["Auth"],
                summary: "Reset password using recovery token",
                parameters: [
                    {
                        name: "token",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Recovery token received in email",
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    password: {
                                        type: "string",
                                        description:
                                            "Must contain upper and lowercase letters, numbers and special characters",
                                        pattern:
                                            "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\s:]).{8,16}$",
                                    },
                                },
                                required: ["password"],
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Password successfully reset",
                    },
                    "400": {
                        description: "Invalid password format",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                    "404": {
                        description: "Invalid or expired recovery token",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                },
            },
        },

        "/auth/refresh": {
            post: {
                tags: ["Auth"],
                summary: "Refresh access token",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    refreshToken: {
                                        type: "string",
                                        description: "Valid refresh token",
                                    },
                                },
                                required: ["refreshToken"],
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "New token pair generated",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/TokenPair",
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Invalid refresh token",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                },
            },
        },
        "/clinics": {
            get: {
                tags: ["Clinics"],
                summary: "Get all clinics with pagination, filters & sorting",
                parameters: [
                    {
                        name: "clinicName",
                        in: "query",
                        schema: { type: "string" },
                        description: "Filter by clinic name",
                    },
                    {
                        name: "serviceName",
                        in: "query",
                        schema: { type: "string" },
                        description: "Filter by service name",
                    },
                    {
                        name: "doctorName",
                        in: "query",
                        schema: { type: "string" },
                        description: "Filter by doctor name",
                    },
                    {
                        name: "sort",
                        in: "query",
                        schema: {
                            type: "string",
                            enum: ["asc", "desc"],
                            default: "asc",
                        },
                        description: "Sort direction",
                    },
                    {
                        name: "page",
                        in: "query",
                        schema: { type: "integer", minimum: 1 },
                    },
                    {
                        name: "pageSize",
                        in: "query",
                        schema: { type: "integer", minimum: 1 },
                    },
                ],
                responses: {
                    "200": {
                        description: "List of clinics",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    _id: { type: "string" },
                                                    name: { type: "string" },
                                                    services: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                _id: {
                                                                    type: "string",
                                                                },
                                                                name: {
                                                                    type: "string",
                                                                },
                                                            },
                                                        },
                                                    },
                                                    doctors: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                _id: {
                                                                    type: "string",
                                                                },
                                                                firstName: {
                                                                    type: "string",
                                                                },
                                                                lastName: {
                                                                    type: "string",
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        totalItems: { type: "integer" },
                                        totalPages: { type: "integer" },
                                        previousPage: { type: "boolean" },
                                        nextPage: { type: "boolean" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ["Clinics"],
                summary: "Create new clinic (Admin only)",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string",
                                        pattern: "^(?:[A-Z][a-z]*\\s*)+$",
                                        description:
                                            "Clinic name - each word should start with capital letter",
                                    },
                                },
                                required: ["name"],
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Clinic created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        _id: { type: "string" },
                                        name: { type: "string" },
                                        services: {
                                            type: "array",
                                            items: { type: "string" },
                                        },
                                        doctors: {
                                            type: "array",
                                            items: { type: "string" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "403": { description: "Forbidden - Admin access required" },
                    "409": {
                        description: "Clinic already exists",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                                example: {
                                    status: 409,
                                    message: "Clinic is already exists",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/clinics/{id}": {
            get: {
                tags: ["Clinics"],
                summary: "Get clinic by ID",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Clinic ID",
                    },
                ],
                responses: {
                    "200": {
                        description: "Clinic details",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        _id: { type: "string" },
                                        name: { type: "string" },
                                        services: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    _id: { type: "string" },
                                                    name: { type: "string" },
                                                },
                                            },
                                        },
                                        doctors: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    _id: { type: "string" },
                                                    firstName: {
                                                        type: "string",
                                                    },
                                                    lastName: {
                                                        type: "string",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Clinic not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    status: 404,
                                    message: "Clinic not found",
                                },
                            },
                        },
                    },
                },
            },
            put: {
                tags: ["Clinics"],
                summary: "Update clinic (Admin only)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Clinic ID",
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string",
                                        pattern: "^(?:[A-Z][a-z]*\\s*)+$",
                                        description:
                                            "Clinic name - each word should start with capital letter",
                                    },
                                    services: {
                                        type: "array",
                                        items: { type: "string" },
                                        description: "Array of service IDs",
                                    },
                                    doctors: {
                                        type: "array",
                                        items: { type: "string" },
                                        description: "Array of doctor IDs",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Clinic updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        _id: { type: "string" },
                                        name: { type: "string" },
                                        services: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    _id: { type: "string" },
                                                    name: { type: "string" },
                                                },
                                            },
                                        },
                                        doctors: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    _id: { type: "string" },
                                                    firstName: {
                                                        type: "string",
                                                    },
                                                    lastName: {
                                                        type: "string",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "403": { description: "Forbidden - Admin access required" },
                    "404": {
                        description: "Clinic not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    status: 404,
                                    message: "Clinic not found",
                                },
                            },
                        },
                    },
                },
            },
            delete: {
                tags: ["Clinics"],
                summary: "Delete clinic (Admin only)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Clinic ID",
                    },
                ],
                responses: {
                    "204": { description: "Clinic deleted successfully" },
                    "401": { description: "Unauthorized" },
                    "403": { description: "Forbidden - Admin access required" },
                    "404": {
                        description: "Clinic not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    status: 404,
                                    message: "Clinic not found",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/doctors": {
            get: {
                tags: ["Doctors"],
                summary: "Get all doctors with filters, pagination & sorting",
                parameters: [
                    {
                        name: "firstName",
                        in: "query",
                        schema: { type: "string" },
                        description: "Filter by doctor's first name",
                    },
                    {
                        name: "lastName",
                        in: "query",
                        schema: { type: "string" },
                        description: "Filter by doctor's last name",
                    },
                    {
                        name: "phone",
                        in: "query",
                        schema: { type: "string" },
                        description: "Filter by phone number",
                    },
                    {
                        name: "email",
                        in: "query",
                        schema: { type: "string" },
                        description: "Filter by email",
                    },
                    {
                        name: "sortField",
                        in: "query",
                        schema: {
                            type: "string",
                            enum: ["firstName", "lastName"],
                            default: "firstName",
                        },
                    },
                    {
                        name: "sort",
                        in: "query",
                        schema: {
                            type: "string",
                            enum: ["asc", "desc"],
                            default: "asc",
                        },
                        description: "Sort direction",
                    },
                    {
                        name: "page",
                        in: "query",
                        schema: { type: "integer", minimum: 1 },
                    },
                    {
                        name: "pageSize",
                        in: "query",
                        schema: { type: "integer", minimum: 1 },
                    },
                ],
                responses: {
                    "200": {
                        description: "List of doctors",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    _id: { type: "string" },
                                                    firstName: {
                                                        type: "string",
                                                    },
                                                    lastName: {
                                                        type: "string",
                                                    },
                                                    email: { type: "string" },
                                                    phone: { type: "string" },
                                                    clinics: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                _id: {
                                                                    type: "string",
                                                                },
                                                                name: {
                                                                    type: "string",
                                                                },
                                                            },
                                                        },
                                                    },
                                                    services: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                _id: {
                                                                    type: "string",
                                                                },
                                                                name: {
                                                                    type: "string",
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        totalItems: { type: "integer" },
                                        totalPages: { type: "integer" },
                                        previousPage: { type: "boolean" },
                                        nextPage: { type: "boolean" },
                                    },
                                },
                            },
                        },
                    },
                    "404": {
                        description: "No doctors found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    status: 404,
                                    message: "No doctors found",
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ["Doctors"],
                summary: "Create new doctor (Admin only)",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    firstName: {
                                        type: "string",
                                        pattern: "^[A-Z][a-z]{1,9}$",
                                        description:
                                            "First letter uppercase, rest lowercase, 2-10 characters",
                                    },
                                    lastName: {
                                        type: "string",
                                        pattern: "^[A-Z][a-z]{1,9}$",
                                        description:
                                            "First letter uppercase, rest lowercase, 2-10 characters",
                                    },
                                    email: { type: "string", format: "email" },
                                    phone: {
                                        type: "string",
                                        pattern:
                                            "\\+38\\s\\(0[\\d]{2}\\)\\s[\\d]{3}-[\\d]{2}-[\\d]{2}",
                                        description:
                                            "Format: +38 (0XX) XXX-XX-XX",
                                    },
                                    password: {
                                        type: "string",
                                        pattern:
                                            "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\s:]).{8,16}$",
                                        description:
                                            "Must contain upper and lowercase letters, numbers and special characters",
                                    },
                                    clinics: {
                                        type: "array",
                                        items: { type: "string" },
                                        description: "Array of clinic IDs",
                                    },
                                    services: {
                                        type: "array",
                                        items: { type: "string" },
                                        description: "Array of service IDs",
                                    },
                                },
                                required: [
                                    "firstName",
                                    "lastName",
                                    "email",
                                    "phone",
                                    "password",
                                    "clinics",
                                    "services",
                                ],
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Doctor created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        _id: { type: "string" },
                                        firstName: { type: "string" },
                                        lastName: { type: "string" },
                                        email: { type: "string" },
                                        phone: { type: "string" },
                                        role: { type: "string" },
                                        clinics: {
                                            type: "array",
                                            items: { type: "string" },
                                        },
                                        services: {
                                            type: "array",
                                            items: { type: "string" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "403": { description: "Forbidden - Admin access required" },
                    "404": {
                        description:
                            "No clinics found, please create clinic first",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    status: 404,
                                    message:
                                        "No clinics found, please create clinic first",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/doctors/{id}": {
            get: {
                tags: ["Doctors"],
                summary: "Get doctor by ID",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Doctor ID",
                    },
                ],
                responses: {
                    "200": {
                        description: "Doctor details",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        _id: { type: "string" },
                                        firstName: { type: "string" },
                                        lastName: { type: "string" },
                                        email: { type: "string" },
                                        phone: { type: "string" },
                                        clinics: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    _id: { type: "string" },
                                                    name: { type: "string" },
                                                },
                                            },
                                        },
                                        services: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    _id: { type: "string" },
                                                    name: { type: "string" },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Doctor not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    status: 404,
                                    message: "Doctor not found",
                                },
                            },
                        },
                    },
                },
            },
            put: {
                tags: ["Doctors"],
                summary: "Update doctor (Admin only)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Doctor ID",
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    firstName: {
                                        type: "string",
                                        pattern: "^[A-Z][a-z]{1,9}$",
                                    },
                                    lastName: {
                                        type: "string",
                                        pattern: "^[A-Z][a-z]{1,9}$",
                                    },
                                    email: { type: "string", format: "email" },
                                    phone: {
                                        type: "string",
                                        pattern:
                                            "\\+38\\s\\(0[\\d]{2}\\)\\s[\\d]{3}-[\\d]{2}-[\\d]{2}",
                                    },
                                    clinics: {
                                        type: "array",
                                        items: { type: "string" },
                                    },
                                    services: {
                                        type: "array",
                                        items: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Doctor updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        _id: { type: "string" },
                                        firstName: { type: "string" },
                                        lastName: { type: "string" },
                                        email: { type: "string" },
                                        phone: { type: "string" },
                                        clinics: {
                                            type: "array",
                                            items: { type: "string" },
                                        },
                                        services: {
                                            type: "array",
                                            items: { type: "string" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "403": {
                        description:
                            "Forbidden - Admin or own Doctor access required",
                    },
                    "404": {
                        description: "Doctor not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    status: 404,
                                    message: "Doctor not found",
                                },
                            },
                        },
                    },
                },
            },
            delete: {
                tags: ["Doctors"],
                summary: "Delete doctor (Admin only)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Doctor ID",
                    },
                ],
                responses: {
                    "204": { description: "Doctor deleted successfully" },
                    "401": { description: "Unauthorized" },
                    "403": { description: "Forbidden - Admin access required" },
                    "404": {
                        description: "Doctor not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    status: 404,
                                    message: "Doctor not found",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/doctors/login": {
            post: {
                tags: ["Doctors"],
                summary: "Doctor login",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: { type: "string" },
                                },
                                required: ["email", "password"],
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Login successful",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        user: {
                                            type: "object",
                                            properties: {
                                                _id: { type: "string" },
                                                firstName: { type: "string" },
                                                lastName: { type: "string" },
                                                email: { type: "string" },
                                                role: { type: "string" },
                                            },
                                        },
                                        tokens: {
                                            $ref: "#/components/schemas/TokenPair",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Invalid credentials",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                },
            },
        },

        "/services": {
            get: {
                tags: ["Services"],
                summary: "Get all services with pagination & sorting",
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        schema: { type: "integer", minimum: 1 },
                    },
                    {
                        name: "pageSize",
                        in: "query",
                        schema: { type: "integer", minimum: 1 },
                    },
                    {
                        name: "sort",
                        in: "query",
                        schema: {
                            type: "string",
                            enum: ["asc", "desc"],
                            default: "asc",
                        },
                        description: "Sort direction",
                    },
                ],
                responses: {
                    "200": {
                        description: "List of services",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/PagedServicesResponse",
                                },
                            },
                        },
                    },
                    "404": {
                        description: "No services found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    status: 404,
                                    message: "No services found",
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ["Services"],
                summary: "Create new service (Admin only)",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string",
                                        pattern: "^(?:[A-Z][a-z]*\\s*)+$",
                                        description:
                                            "Service name - each word should start with capital letter",
                                    },
                                    price: {
                                        type: "number",
                                        minimum: 0,
                                        description: "Service price in UAH",
                                    },
                                    description: {
                                        type: "string",
                                        minLength: 10,
                                        maxLength: 500,
                                    },
                                },
                                required: ["name", "price", "description"],
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Service created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        _id: { type: "string" },
                                        name: { type: "string" },
                                        price: { type: "number" },
                                        description: { type: "string" },
                                        clinics: {
                                            type: "array",
                                            items: { type: "string" },
                                        },
                                        doctors: {
                                            type: "array",
                                            items: { type: "string" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "403": { description: "Forbidden - Admin access required" },
                    "409": {
                        description: "Service already exists",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    status: 409,
                                    message: "Service is already exists",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/services/{id}": {
            get: {
                tags: ["Services"],
                summary: "Get service by ID",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Service ID",
                    },
                ],
                responses: {
                    "200": {
                        description: "Service details",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        _id: { type: "string" },
                                        name: { type: "string" },
                                        price: { type: "number" },
                                        description: { type: "string" },
                                        clinics: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    _id: { type: "string" },
                                                    name: { type: "string" },
                                                },
                                            },
                                        },
                                        doctors: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    _id: { type: "string" },
                                                    firstName: {
                                                        type: "string",
                                                    },
                                                    lastName: {
                                                        type: "string",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Service not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    status: 404,
                                    message: "Service not found",
                                },
                            },
                        },
                    },
                },
            },
            put: {
                tags: ["Services"],
                summary: "Update service (Admin only)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Service ID",
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string",
                                        pattern: "^(?:[A-Z][a-z]*\\s*)+$",
                                    },
                                    price: { type: "number", minimum: 0 },
                                    description: {
                                        type: "string",
                                        minLength: 10,
                                        maxLength: 500,
                                    },
                                    clinics: {
                                        type: "array",
                                        items: { type: "string" },
                                    },
                                    doctors: {
                                        type: "array",
                                        items: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Service updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        _id: { type: "string" },
                                        name: { type: "string" },
                                        price: { type: "number" },
                                        description: { type: "string" },
                                        clinics: {
                                            type: "array",
                                            items: { type: "string" },
                                        },
                                        doctors: {
                                            type: "array",
                                            items: { type: "string" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "403": { description: "Forbidden - Admin access required" },
                    "404": {
                        description: "Service not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    status: 404,
                                    message: "Service not found",
                                },
                            },
                        },
                    },
                },
            },
            delete: {
                tags: ["Services"],
                summary: "Delete service (Admin only)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Service ID",
                    },
                ],
                responses: {
                    "204": { description: "Service deleted successfully" },
                    "401": { description: "Unauthorized" },
                    "403": { description: "Forbidden - Admin access required" },
                    "404": {
                        description: "Service not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    status: 404,
                                    message: "Service not found",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/services/search": {
            get: {
                tags: ["Services"],
                summary: "Search services by name",
                parameters: [
                    {
                        name: "name",
                        in: "query",
                        required: true,
                        schema: { type: "string" },
                        description: "Service name to search for",
                    },
                    {
                        name: "sort",
                        in: "query",
                        schema: {
                            type: "string",
                            enum: ["asc", "desc"],
                            default: "asc",
                        },
                        description: "Sort direction",
                    },
                    {
                        name: "page",
                        in: "query",
                        schema: { type: "integer", minimum: 1 },
                    },
                    {
                        name: "pageSize",
                        in: "query",
                        schema: { type: "integer", minimum: 1 },
                    },
                ],
                responses: {
                    "200": {
                        description:
                            "List of services matching search criteria",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/PagedServicesResponse",
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                            },
                        },
                    },
                    "404": {
                        description: "No services found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    status: 404,
                                    message: "No services found",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export { swaggerDocument, swaggerUI };
