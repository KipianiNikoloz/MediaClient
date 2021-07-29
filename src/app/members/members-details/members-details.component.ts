import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { MessagesService } from 'src/app/_services/messages.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-members-details',
  templateUrl: './members-details.component.html',
  styleUrls: ['./members-details.component.css']
})
export class MembersDetailsComponent implements OnInit, OnDestroy {

  galleryOptions!: NgxGalleryOptions[];
  galleryImages!: NgxGalleryImage[];

  member!: Member;
  messages: Message[] = [];

  user!: User;

  @ViewChild('tabs' , {static: true}) tabs!: TabsetComponent;
  activeTab!: TabDirective;

  constructor(private route: ActivatedRoute, private messageService: MessagesService, public presenceService: PresenceService, 
    private accountService: AccountService, private router: Router) {
      this.accountService.currentUser$.pipe(take(1)).subscribe( user => {
        this.user = user as User;
      })

      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }
  
  ngOnDestroy(): void {
    this.messageService.stopConnection();
  }

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
      this.messageService.getHubConnection(this.user, this.member.userName)
    } else {
      this.messageService.stopConnection();
    }
  }

  setTab(index: number) {
    this.tabs.tabs[index].active = true;
  }

}
