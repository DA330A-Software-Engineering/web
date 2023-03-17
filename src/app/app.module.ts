import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
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
import { DoorComponent } from './devices/door/door.component';
import { ToggleComponent } from './devices/toggle/toggle.component';
import { DevicesModule } from './devices/devices.module';
import { DeviceContainerComponent } from './devices/device-container/device-container.component';



const appRoute: Routes = [
  {path:'home', component: HomeComponent},
  {path:'devices', component: DeviceContainerComponent},
  {path:'groups', component: GroupsComponent},
  {path:'routines', component: RoutinesComponent},
  {path:'aboutus', component: AboutusComponent},
  {path:'login', component: LoginComponent},
  {path:'', component: HomeComponent}, 
  //{path:'', redirectTo: 'login', pathMatch: 'full'}
  
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
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    RouterModule.forRoot(appRoute),
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    MatSlideToggleModule,
    MatButtonToggleModule,
    DevicesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
