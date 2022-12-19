import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//configure the routing
import { IssuesComponent } from './issues/issues.component'; 
import { HomeComponent } from './home/home.component'; 
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';

const routes: Routes = [
  { path: 'issueForm/:id', component: IssuesComponent,canActivate:[RoleGuard]},
  { path: 'home', component: HomeComponent,canActivate:[AuthGuard] },
  { path: 'register', component: RegisterComponent},
  { path: '', component: LoginComponent},
  { path: 'users', component: UsersComponent,canActivate:[RoleGuard]},
  { path: 'profile', component:ProfileComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
export const routing: ModuleWithProviders<any> =
RouterModule.forRoot(routes);