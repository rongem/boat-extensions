import { Component } from '@angular/core';
import { Boat3Service } from './lib/boat3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BOAT3 Importer';
  username = '';
  password = '';
  get appBusy() {
    return false;
  }

  get error() {
    return undefined;
  }

  get authenticated() {
    return this.boat.authenticated;
  }

  get authenticatedUser() {
    return this.boat.username;
  }

  constructor(private boat: Boat3Service) {}

  login() {
    this.boat.login(this.username, this.password);
  }

}
