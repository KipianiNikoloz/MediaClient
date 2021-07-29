import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMembersWithRoles() {
    return this.http.get<Partial<User[]>>(`${this.baseUrl}admin/users-with-roles`);
  }

  updateUserRoles(username: string, roles: string[]) {
    return this.http.post(`${this.baseUrl}admin/edit-roles/${username}?userRoles=${roles}`, {});
  }

  approvePhoto(photoId: number) {
    return this.http.put(`${this.baseUrl}admin/${photoId}`, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(`${this.baseUrl}admin/${photoId}`);
  }
}
