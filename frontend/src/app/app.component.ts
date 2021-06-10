import { ChangeDetectorRef, Component } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Boat3Service } from './lib/boat3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BOAT3 Erweiterungen';
  // Formularfelder
  username = '';
  password = '';
  busy: boolean;
  get error() {
    return this.boat.error;
  }

  get authenticated() {
    return this.boat.authenticated;
  }

  get authenticatedUser() {
    return this.boat.username;
  }

  constructor(private boat: Boat3Service, private cd: ChangeDetectorRef) {
    this.busy = this.boat.working.value;
    this.boat.working.subscribe(value => {
      this.busy = value;
    });
  }

  login() {
    this.boat.login(this.username, this.password);
    this.username = '';
    this.password = '';
  }

}
