import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxGalleryThumbnailsComponent } from '@kolkov/ngx-gallery';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginationResult } from '../_models/paginations';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  members: Member[] = [];
  user!: User;
  userParams!: UserParams;

  baseUrl: string = environment.apiUrl;

  memberCache = new Map();

  constructor(private http: HttpClient, private accountService: AccountService) {
    accountService.currentUser$.pipe(take(1)).subscribe( user => {
      this.user = user as User;
      this.userParams = new UserParams(this.user);
    });
  }

  getMembers(userParams: UserParams) {
    let response = this.memberCache.get(Object.values(userParams).join('-'));
    if(response) return of(response);
    
    let params = this.getParams(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedList<Member[]>(`${this.baseUrl}users`, params).pipe(
      map( response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      }
    ));
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()]
    .reduce((arr, elem) => arr.concat(elem.result), [])
    .find((member: Member) => member.userName === username);

    if(member) return of(member);

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

  getUserParams() {
    return this.userParams;
  }

  setUserParams(userParams: UserParams) {
    this.userParams = userParams;
  }

  resetParams() {
    this.userParams = new UserParams(this.user);
  }

  private getParams(page?: number, itemsPerPage?: number) {
    let params = new HttpParams();

    if(page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page?.toString() as string);
      params = params.append('pageSize', itemsPerPage?.toString() as string);
    }

    return params;
  }

  private getPaginatedList<T>(url: string , params: HttpParams) {
    const paginatedResult: PaginationResult<T> = new PaginationResult<T>();
    return this.http.get<T>(url, {observe: 'response', params}).pipe(
      map(response => {
        paginatedResult.result = response.body as T;
        
        if(response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }

        return paginatedResult;
      })
    );
  }
}
