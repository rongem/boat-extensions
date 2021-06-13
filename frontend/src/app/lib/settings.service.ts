import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class SettingsService {
    // Formularfelder für Export
  withPersons = !!localStorage.getItem('withPersons');
  withText = !!localStorage.getItem('withText');
  withTimes = !!localStorage.getItem('withTimes');
  withContract = !!localStorage.getItem('withContract');

  saveSettings() {
    try {
      localStorage.setItem('withTimes', this.withTimes ? '1' : '');
      localStorage.setItem('withPersons', this.withPersons ? '1' : '');
      localStorage.setItem('withText', this.withText ? '1' : '');
      localStorage.setItem('withContract', this.withContract ? '1' : '');
    } catch (error) {
      console.log(error);
    }
  }

}