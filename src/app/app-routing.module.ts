import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SearchComponent } from './search/search.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ChatlistComponent } from './chatlist/chatlist.component';



const routes: Routes = [
  {path:'login',
component:LoginComponent},


{
  path:'register',
  component:RegisterComponent
},


{ path: 'search', component: SearchComponent },
  { path: 'search-results', component: SearchResultsComponent, data: { results: [] } },
  { path: 'chatlist', component: ChatlistComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
