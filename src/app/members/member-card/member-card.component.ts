import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  @Input() member!: Member;
  @Output() likesUpdated = new EventEmitter();

  constructor(private memberService: MembersService, private toastr: ToastrService) { }

  ngOnInit(): void {
    console.log(this.member);
  }

  addLike(username: string) {
    this.memberService.addLike(username).subscribe(() => {
      this.toastr.success(`Action performed on ${username}`);
    })

    this.likesUpdated.emit();
  }

}
