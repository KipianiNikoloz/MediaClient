import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  formModel: any = {};

  constructor(public accountService: AccountService, private router: Router, private toastr: ToastrService,
     private membersService: MembersService) { }

  ngOnInit(): void {
  }

  login(){
    this.accountService.login(this.formModel).subscribe(response => {
      this.router.navigate(['/members']);
      this.toastr.success("Logged in successfully");
      this.membersService.updateCurrentUser();
    },error => {
        if(Array.isArray(error)){
          for (let line of error){
            this.toastr.error(line);
          }
        }
    })
  }

  logout() {
    this.accountService.logout();
    this.router.navigate(['/']);
  }

}
