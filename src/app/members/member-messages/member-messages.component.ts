import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/_models/message';
import { MessagesService } from 'src/app/_services/messages.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

  messages: Message[] = [];
  @Input() username: string = '';

  @ViewChild('messageForm') messageForm!: NgForm;

  messageContent: string = '';

  constructor(public messageService: MessagesService) { }

  ngOnInit(): void {

  }

  onSubmit(username: string, messageContent: string) {
    this.messageService.sendMessage(username, messageContent).then(() => {
      this.messageForm.reset();
    })
  }

}
