export interface Pagination {
    currentPage: number,
    itemsPerPage: number,
    totalCount: number,
    totalPages: number
}

export class PaginationResult<T> {
    result!: T;
    pagination!: Pagination;
}