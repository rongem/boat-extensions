import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../lib/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  // Formularfelder für Einstellungen
  get withContract() {
    return this.settings.withContract;
  }
  set withContract(value) {
    this.settings.withContract = value;
  }
  get withPersons() {
    return this.settings.withPersons;
  }
  set withPersons(value) {
    this.settings.withPersons = value;
  }
  get withTimes() {
    return this.settings.withTimes;
  }
  set withTimes(value) {
    this.settings.withTimes = value;
  }
  get withText() {
    return this.settings.withText;
  }
  set withText(value) {
    this.settings.withText = value;
  }

  constructor(private settings: SettingsService) { }

  ngOnInit(): void {
  }

  saveSettings() {
    this.settings.saveSettings();
  }

}
