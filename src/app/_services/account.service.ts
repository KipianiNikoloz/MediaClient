import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseUrl: string = environment.apiUrl;

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user: User = response;
        if(user) {
          this.setCurrentUser(user);
          this.presence.getHubConnection(user);
        }

        return user;
      })
    );
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((response: User) => {
        const user: User = response;
        if(user) {
          this.setCurrentUser(user);
          this.presence.getHubConnection(user);
        }

        return user;
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presence.stopHubConnection();
  }

  setCurrentUser(user: User) {
    user.roles = [];
    let roles: string[] = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  getDecodedToken(token: any) {
    return JSON.parse(atob(token.split(".")[1]));
  }

  constructor(private http: HttpClient, private presence: PresenceService) { }
}
