import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { getPaginatedList, getParams } from '../_helpers/paginationHelper';
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
    this.updateCurrentUser();
  }

  getMembers(userParams: UserParams) {
    let response = this.memberCache.get(Object.values(userParams).join('-'));
    if(response) return of(response);
    
    let params = getParams(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedList<Member[]>(`${this.baseUrl}users`, params, this.http).pipe(
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

  addLike(username: string) {
    return this.http.post(`${this.baseUrl}likes/${username}`, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getParams(pageNumber, pageSize);

    params = params.append('predicate', predicate);

    return getPaginatedList<Partial<Member[]>>(`${this.baseUrl}likes`, params, this.http);
  }

  updateCurrentUser(){
    this.accountService.currentUser$.subscribe(user => {
      this.user = user as User;
      if(user) {
        this.userParams = new UserParams(user as User);
      }
    })
  }
}
