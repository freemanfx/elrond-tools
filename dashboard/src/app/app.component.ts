import {Component, OnDestroy, OnInit} from '@angular/core';
import {Profile} from './data/models/profile';
import {ApiService} from './data/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  profile: Profile = {
    account: '',
    transactionsCount: 2,
    status: 'all'
  };

  egldPriceUSD = 250;

  constructor(private api: ApiService) {
  }

 ngOnInit(): void {
   this.loadSettings();
   this.api.getPriceEGLD().subscribe(egldPrice => this.egldPriceUSD = egldPrice);
 }

 ngOnDestroy(): void {
   this.storeSettings();
 }

  private storeSettings(): void {
    localStorage.setItem('profile', JSON.stringify(this.profile));
  }

  private loadSettings(): void {
    const value = localStorage.getItem('profile');
    if (value) {
      this.profile = JSON.parse(value);
    }
  }
}
