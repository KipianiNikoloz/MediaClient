import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { getPaginatedList, getParams } from '../_helpers/paginationHelper';
import { Message } from '../_models/message';
import { User } from '../_models/user';
import { BusyService } from './busy.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private baseUrl = environment.apiUrl;
  private hubUrl = environment.hubUrl;

  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  private hub!: HubConnection;

  constructor(private http: HttpClient, private busyService: BusyService) { }

  getHubConnection(user: User, username: string) {
    this.busyService.busy();
    this.hub = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'messages?user=' + username, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hub.start()
      .catch(error => console.log(error))
      .finally(() => this.busyService.idle());

    this.hub.on('ReceiveMessageThread', (thread: Message[]) => {
      this.messageThreadSource.next(thread);
    });

    this.hub.on("NewMessage", message => {
      this.messageThread$.pipe(take(1)).subscribe( messages => {
        this.messageThreadSource.next([...messages, message]);
      });
    });
  }

  stopConnection() {
    if(this.hub) {
      this.messageThreadSource.next([]);
      this.hub.stop();
    }
  }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = getParams(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedList(`${this.baseUrl}messages`, params, this.http);
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(`${this.baseUrl}messages/thread/${username}`)
  }

  sendMessage(username: string, content: string) {
    return this.hub.invoke("SendMessage", {recipientUsername: username, content })
  }

  deleteMessage(id: number) {
    return this.http.delete(`${this.baseUrl}messages/${id}`);
  }
}
