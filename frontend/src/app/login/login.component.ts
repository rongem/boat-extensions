import { Component, OnInit } from '@angular/core';
import { Boat3Service } from '../lib/boat3.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';

  constructor(private boat: Boat3Service) { }

  ngOnInit(): void {
  }

  login() {
    this.boat.login(this.username, this.password);
    this.username = '';
    this.password = '';
  }

}
