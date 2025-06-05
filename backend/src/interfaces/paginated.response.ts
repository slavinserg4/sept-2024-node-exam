export interface IPaginatedResponse<T> {
    totalItems: number;
    totalPages: number;
    previousPage: boolean;
    nextPage: boolean;
    data: T[];
}
