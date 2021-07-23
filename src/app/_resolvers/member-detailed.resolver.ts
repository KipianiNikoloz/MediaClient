import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { MembersService } from '../_services/members.service';

@Injectable({
  providedIn: 'root'
})
export class MemberDetailedResolver implements Resolve<boolean> {

  constructor(private memberService: MembersService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.memberService.getMember(route.paramMap.get('username') as string);
  }
}
