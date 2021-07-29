import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  private hubUrl: string = environment.hubUrl;
  private hub!: HubConnection;

  private onlineUserSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUserSource.asObservable();

  constructor(private toastr: ToastrService, private router: Router) { }

  getHubConnection(user: User) {
    this.hub = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hub
      .start()
      .catch(error => console.log(error));

    this.hub.on('UserIsOnline', username => {
      this.onlineUsers$.pipe(take(1)).subscribe( usernames => {
        this.onlineUserSource.next([...usernames, username]);
      })
    });

    this.hub.on('UserIsOffline', username => {
      this.onlineUsers$.pipe(take(1)).subscribe( usernames => {
        this.onlineUserSource.next([...usernames.filter( name => name !== username)]);
      })
    });

    this.hub.on('GetOnlineUsers', users => {
      this.onlineUserSource.next(users);
    });

    this.hub.on('InformUserOfMessage', ({userName, knownAs}) => {
      console.log("hit");
      
      this.toastr.info(knownAs + " sent you a message")
        .onTap
        .pipe(take(1))
        .subscribe(() => 
        this.router.navigate(['./members/' + userName], { queryParams: { tab: 2 }}));
    });
  }

  stopHubConnection() {
    this.hub.stop().catch(error => console.log(error));
  }
}
