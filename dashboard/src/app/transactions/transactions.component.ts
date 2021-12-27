import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Transaction} from '../data/models/transaction';
import {ApiService} from '../data/api.service';
import * as _ from 'lodash';
import {Profile} from '../data/models/profile';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnChanges {

  @Input()
  profile: Profile = {
    account: '',
    transactionsCount: 2,
    status: 'all'
  };

  @Input()
  egldPriceUSD = 250;

  transactions: Transaction[] = [];
  numberFormat = '1.2-2';
  dateTimeFormat = 'MMM dd, yyyy hh:mm:ss a';

  constructor(private api: ApiService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadData();
  }

  public loadData(): void {
    if (this.profile.account.length === 62 && this.profile.transactionsCount > 0) {
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

}
