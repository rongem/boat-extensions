import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Boat3Service } from './lib/boat3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'BOAT3 Erweiterungen';
  // Formularfelder
  username = '';
  password = '';
  busy = false;
  remainingTime: Subject<string> = new Subject();
  get error() {
    return this.boat.error;
  }

  get authenticated() {
    return this.boat.authenticated;
  }

  get authenticatedUser() {
    return this.boat.username;
  }

  constructor(private boat: Boat3Service, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.busy = this.boat.working.value;
    this.boat.working.subscribe(value => {
      this.busy = value;
      this.cd.detectChanges();
    });
    window.setInterval(() => {
      if (this.boat.expiryDate) {
        this.remainingTime.next(new Date(this.boat.expiryDate.valueOf() - Date.now()).toISOString().substr(11, 8));
      }
    }, 1000);
  }
  
  login() {
    this.boat.login(this.username, this.password);
    this.username = '';
    this.password = '';
  }

  logout() {
    this.boat.logout();
  }

}
