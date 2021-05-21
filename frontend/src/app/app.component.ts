import { ChangeDetectorRef, Component } from '@angular/core';
import { tap } from 'rxjs/operators';
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
    return this.boat.working.pipe(
      tap(() => this.cd.detectChanges())
    );
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

  constructor(private boat: Boat3Service, private cd: ChangeDetectorRef) {}

  login() {
    this.boat.login(this.username, this.password);
  }

}
