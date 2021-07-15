import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxGalleryThumbnailsComponent } from '@kolkov/ngx-gallery';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginationResult } from '../_models/paginations';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  members: Member[] = [];
  paginatedResult: PaginationResult<Member[]> = new PaginationResult<Member[]>();

  page: number = 1;
  itemsPerPage: number = 5;

  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMembers(page?: number, itemsPerPage? : number) {
    let params = new HttpParams();

    if(this.page !== null && this.itemsPerPage !== null) {
      params = params.append('pageNumber', page?.toString() as string);
      params = params.append('pageSize', itemsPerPage?.toString() as string);
    }

    return this.http.get<Member[]>(`${this.baseUrl}users`, {observe: 'response', params}).pipe(
      map(response => {
        this.paginatedResult.result = response.body as Member[];
        
        if(response.headers.get('Pagination') !== null) {
          this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }

        return this.paginatedResult;
      })
    );
  }

  getMember(username: string) {
    const member = this.members.find(user => user.userName == username);
    if(member !== undefined) return of(member);
    return this.http.get<Member>(`${this.baseUrl}users/${username}`);
  }

  updateMember(member: Member) {
    return this.http.put(`${this.baseUrl}users`, member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(`${this.baseUrl}users/set-main-photo/${photoId}`, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(`${this.baseUrl}users/delete-photo/${photoId}`);
  }
}
