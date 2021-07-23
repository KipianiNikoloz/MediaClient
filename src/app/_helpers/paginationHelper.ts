import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginationResult } from "../_models/paginations";

export function getParams(page?: number, itemsPerPage?: number) {
    let params = new HttpParams();

    if(page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page?.toString() as string);
      params = params.append('pageSize', itemsPerPage?.toString() as string);
    }

    return params;
}

export function getPaginatedList<T>(url: string , params: HttpParams, http: HttpClient) {
    const paginatedResult: PaginationResult<T> = new PaginationResult<T>();
    return http.get<T>(url, {observe: 'response', params}).pipe(
      map(response => {
        paginatedResult.result = response.body as T;
        
        if(response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }

        return paginatedResult;
      })
    );
}