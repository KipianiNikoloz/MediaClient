import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './home/registration/registration.component';
import { ListsComponent } from './lists/lists.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MembersDetailsComponent } from './members/members-details/members-details.component';
import { MembersListComponent } from './members/members-list/members-list.component';
import { MessagesComponent } from './messages/messages.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { TestErrorsComponent } from './_errors/test-errors/test-errors.component';
import { AuthGuard } from './_guards/auth.guard';
import { HomeGuard } from './_guards/home.guard';
import { PreventLeaveGuard } from './_guards/prevent-leave.guard';
import { MemberDetailedResolver } from './_resolvers/member-detailed.resolver';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [HomeGuard]},
  { path: '', runGuardsAndResolvers: 'always', canActivate: [AuthGuard], children: [
    { path: 'members', component: MembersListComponent },
    { path: 'members/:username', component: MembersDetailsComponent, resolve: {member: MemberDetailedResolver} },
    { path: 'member/edit', component: MemberEditComponent, canDeactivate: [PreventLeaveGuard] },
    { path: 'lists', component: ListsComponent },
    { path: 'messages', component: MessagesComponent },
  ]},
  { path: 'registration', component: RegistrationComponent},
  { path: 'errors', component: TestErrorsComponent },
  { path: 'not-found', component: NotFoundComponent},
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
