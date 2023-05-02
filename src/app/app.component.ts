import { Component, HostListener } from '@angular/core';
import { AuthService } from './service/auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-web';

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.listenForTabClose();
  }

  listenForTabClose(): void {
    window.addEventListener('unload', () => {
      this.authService.signOut();
    });
  }


  /*
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
    this.authService.signOut();
    return '';
  }*/
  
}
