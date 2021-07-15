import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/paginations';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit {

  members: Member[] = [];

  pagination!: Pagination;
  page: number = 1;
  itemsPerPage: number = 5

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(this.page, this.itemsPerPage).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;

      console.log(response);
    })
  }

  pageChanged(event: any) {
    this.page = event.page;
    this.loadMembers();
  }

}
