import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {forkJoin} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AccountDetailsService {
  private apiUrl = 'https://jsonserver.online/user/XTz-bRp-5gc/accdetails'; // Update the URL with your JSON Server endpoint

  constructor(private http: HttpClient) {}

  getAccountDetails(accountNumber: string): Observable<any> {
    const accountSummaryUrl = `https://jsonserver.online/user/XTz-bRp-5gc/accsummary?acc_number=${accountNumber}`;
    const accDetailsUrl = `${this.apiUrl}/?acc_number=${accountNumber}&_sort=date&_order=desc`;
    const destinationAccDetailsUrl = `${this.apiUrl}/?destination_acc=${accountNumber}&_sort=date&_order=desc`;

    const accountSummary$ = this.http.get<any>(accountSummaryUrl);
    const accDetails$ = this.http.get<any>(accDetailsUrl);
    const destinationAccDetails$ = this.http.get<any>(destinationAccDetailsUrl);

    return forkJoin([accountSummary$, accDetails$, destinationAccDetails$]).pipe(
      map(([accountSummary, accDetails, destinationAccDetails]) => {
        const transactions = accDetails.concat(destinationAccDetails.map((transaction: any) => ({
          ...transaction,
          trans_type: 'Credit'
        })));
  
        return {
          accountDetails: accountSummary[0],
          transactions
        };
      })
    );
  }
}
