import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//configure the routing
import { IssuesComponent } from './issues/issues.component'; 
import { HomeComponent } from './home/home.component'; 
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'issueForm/:id', component: IssuesComponent},
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent},
  { path: '', component: LoginComponent},
  { path: 'users', component: UsersComponent},
  { path: 'profile', component:ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
export const routing: ModuleWithProviders<any> =
RouterModule.forRoot(routes);