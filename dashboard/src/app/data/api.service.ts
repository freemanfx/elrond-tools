import { Injectable } from '@angular/core';
import {Transaction} from './models/transaction';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Economics} from './models/economics';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getTransactions(account: string, count: number): Observable<Transaction[]> {
    const url = `https://api.elrond.com/accounts/${account}/transactions?size=${count}`;
    return this.http.get<Transaction[]>(url);
  }

  getPriceEGLD(): Observable<number> {
    const url = `https://api.elrond.com/economics`;
    return this.http.get<Economics>(url).pipe(
      map((economics: Economics) => economics.price)
    );
  }
}
