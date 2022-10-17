import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//configure the routing
import { IssuesComponent } from './issues/issues.component'; 
import { HomeComponent } from './home/home.component'; 

const routes: Routes = [
  { path: 'issueForm/:id', component: IssuesComponent },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
export const routing: ModuleWithProviders<any> =
RouterModule.forRoot(routes);