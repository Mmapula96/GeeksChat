import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { SearchComponent } from './search/search.component';
import { UserService } from './user.service';
import { SearchResultsComponent } from './search-results/search-results.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ChatlistComponent } from './chatlist/chatlist.component';




@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    SearchComponent,
    SearchResultsComponent,
    ChatlistComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    MatDialogModule
   
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
