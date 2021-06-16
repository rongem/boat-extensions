import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Boat3Service } from '../lib/boat3.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';

  constructor(private boat: Boat3Service, private router: Router) { }

  ngOnInit(): void {
    if (this.boat.token) {
      this.router.navigate(['contracts']);
    }
  }

  login() {
    this.boat.login(this.username, this.password);
    this.username = '';
    this.password = '';
  }

}
