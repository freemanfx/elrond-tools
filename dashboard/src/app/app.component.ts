import {Component, OnInit} from '@angular/core';
import {ApiService} from './data/api.service';
import {Transaction} from './data/models/transaction';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  account = '';
  transactionsCount = 2;
  transactions: Transaction[] = [];
  egldPriceUSD = 250;
  numberFormat = '1.2-2';
  dateTimeFormat = 'MMM dd, yyyy hh:mm:ss a';
  status = 'all';

  constructor(private api: ApiService) {
  }

  ngOnInit(): void {
    this.api.getPriceEGLD().subscribe(egldPrice => this.egldPriceUSD = egldPrice);
    this.loadData();
  }

  public loadData(): void {
    if (this.account.length === 62 && this.transactionsCount > 1) {
      this.api.getTransactions(this.account, this.transactionsCount)
        .subscribe(transactions => {
          if (this.status !== 'all') {
            this.transactions = _.filter(transactions, t => t.status === this.status);
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
}
