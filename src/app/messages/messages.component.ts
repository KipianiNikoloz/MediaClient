import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { Message } from '../_models/message';
import { Pagination } from '../_models/paginations';
import { MessagesService } from '../_services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: Message[] = [];
  pageNumber: number = 1;
  pageSize: number = 5;
  container: string = "Unread";

  pagination!: Pagination;

  loading: boolean = false;

  constructor(private messageService: MessagesService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(response => {
      this.messages = response.result as Message[];
      this.pagination = response.pagination;
      this.loading = false;
    })
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadMessages();
  }

  deleteMessage(id: number) {
    let result = confirm("Do you want to delete message? this action cannot be undone");
    if(result) {
      this.messageService.deleteMessage(id).subscribe( () => {
        let index = this.messages.findIndex(m => m.id == id);
        console.log(index);
        this.messages.splice(index, 1);
        console.log(this.messages);
      })
    }
  }

}
