import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

@Injectable({
  providedIn: 'root'
})
export class PreventLeaveGuard implements CanDeactivate<unknown> {

  canDeactivate(editComponent: MemberEditComponent): boolean {

    if(editComponent.editForm.dirty) {
      return confirm('All changes will be discarded. Do you want to continue');
    }

    return true;
  }

}
