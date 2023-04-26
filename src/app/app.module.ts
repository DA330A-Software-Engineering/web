import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { GroupsComponent } from './groups/groups.component';
import { RoutinesComponent } from './routines/routines.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { DevicesModule } from './devices/devices.module';
import { DeviceContainerComponent } from './devices/device-container/device-container.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgToastModule } from 'ng-angular-popup'
import { AuthGuard } from './guards/auth.guard';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { EditGroupDialogComponent } from './edit-group-dialog/edit-group-dialog.component';
import { SignupComponent } from './signup/signup.component';


const appRoute: Routes = [
  {path:'home', component: HomeComponent, canActivate:[AuthGuard]},
  {path:'devices', component: DeviceContainerComponent, canActivate:[AuthGuard]},
  {path:'groups', component: GroupsComponent, canActivate:[AuthGuard]},
  {path:'routines', component: RoutinesComponent, canActivate:[AuthGuard]},
  {path:'aboutus', component: AboutusComponent, canActivate:[AuthGuard]},
  {path:'login', component: LoginComponent},
  {path:'signup', component: SignupComponent},
  {path:'', component: LoginComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    GroupsComponent,
    RoutinesComponent,
    AboutusComponent,
    LoginComponent,
    EditGroupDialogComponent,
    SignupComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    RouterModule.forRoot(appRoute),
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    MatSlideToggleModule,
    MatButtonToggleModule,
    DevicesModule,
    FormsModule,
    ReactiveFormsModule,
    NgToastModule,
    MatDialogModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass:TokenInterceptor,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
