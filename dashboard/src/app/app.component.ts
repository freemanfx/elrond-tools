import {Component, OnInit} from '@angular/core';
import {ApiService} from './data/api.service';
import {Transaction} from './data/models/transaction';
import * as _ from 'lodash';
import {Profile} from './data/models/profile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  profile: Profile = {
    account: '',
    transactionsCount: 2,
    status: 'all'
  };

  transactions: Transaction[] = [];
  egldPriceUSD = 250;
  numberFormat = '1.2-2';
  dateTimeFormat = 'MMM dd, yyyy hh:mm:ss a';

  constructor(private api: ApiService) {
  }

  ngOnInit(): void {
    this.loadSettings();
    this.api.getPriceEGLD().subscribe(egldPrice => this.egldPriceUSD = egldPrice);
    this.loadData();
  }

  public loadData(): void {
    this.storeSettings();
    if (this.profile.account.length === 62 && this.profile.transactionsCount > 1) {
      this.api.getTransactions(this.profile.account, this.profile.transactionsCount)
        .subscribe(transactions => {
          if (this.profile.status !== 'all') {
            this.transactions = _.filter(transactions, t => t.status === this.profile.status);
          } else {
            this.transactions = transactions;
          }
          this.transactions = _.reverse(_.sortBy(this.transactions, 'timestamp'));
        });
    }
  }

  public description(transaction: Transaction): string {
    if (transaction.action) {
      return transaction.action.description;
    } else {
      return 'Transfer';
    }
  }

  public eGLDToUSD(egld: number): number {
    return this.egldPriceUSD * egld / Math.pow(10, 18);
  }

  public eGLD(egld: number): number {
    return egld / Math.pow(10, 18);
  }

  public totalUSD(field: string): number {
    let sum = 0;
    this.transactions.forEach((transaction: any) => sum = sum + this.eGLDToUSD(transaction[field]));
    return sum;
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
