import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserModalComponent } from 'src/app/modals/user-modal/user-modal.component';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  users: Partial<User[]> = [];

  bsModalRef!: BsModalRef;

  constructor(private adminService: AdminService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.adminService.getMembersWithRoles().subscribe( users => {
      this.users = users;
    })
  }

  openModal(user: User) {

    const config = {
      class: 'model-dialog-center',
      initialState: {
        user: user,
        roles: this.getRoles(user)
      }
    }

    this.bsModalRef = this.modalService.show(UserModalComponent, config);
    this.bsModalRef.content.updateSelectedRoles.subscribe( (values: any) => {
      const rolesToUpdate = {
        roles: [...values.filter((el: any) => el.checked === true).map((el: any) => el.name)]
      }
      if(rolesToUpdate) {
        this.adminService.updateUserRoles(user.username, rolesToUpdate.roles).subscribe( () => {
          user.roles = [...rolesToUpdate.roles]
        })
      }
    })
  }

  getRoles(user: User): any[] {
    const roles: any[] = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      {name: 'Admin', value: 'Admin'},
      {name: 'Moderator', value: 'Moderator'},
      {name: 'Member', value: 'Member'}
    ];

    availableRoles.forEach( role => {
      let isMatch = false;
      for(let userRole of userRoles) {
        if(userRole === role.name) {
          isMatch = true;
          role.checked = true;
          roles.push(role);
          break;
        }
      }
      if(!isMatch) {
        role.checked = false;
        roles.push(role)
      }
    })

    return roles;
  }

}
