import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MembersService } from 'src/app/_services/members.service';
import { MessagesService } from 'src/app/_services/messages.service';

@Component({
  selector: 'app-members-details',
  templateUrl: './members-details.component.html',
  styleUrls: ['./members-details.component.css']
})
export class MembersDetailsComponent implements OnInit {

  galleryOptions!: NgxGalleryOptions[];
  galleryImages!: NgxGalleryImage[];

  member!: Member;
  messages: Message[] = [];

  @ViewChild('tabs' , {static: true}) tabs!: TabsetComponent;
  activeTab!: TabDirective;

  constructor(private memberService: MembersService, private route: ActivatedRoute, private messageService: MessagesService) { }

  ngOnInit(): void {

    this.route.data.subscribe( data => {
      this.member = data.member;
      this.galleryImages = this.getImages();
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]

    this.route.queryParams.subscribe( params => {
      params.tab ? this.setTab(params.tab) : this.setTab(0);
    })
  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for(const photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }
    return imageUrls;
  }

  loadMessages() {
    this.messageService.getMessageThread(this.member.userName).subscribe( messages => {
      this.messages = messages;
    }) 
  }

  tabSelected(data: TabDirective) {
    this.activeTab = data;
    if(this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      this.loadMessages();
    } 
  }

  setTab(index: number) {
    this.tabs.tabs[index].active = true;
  }

}
