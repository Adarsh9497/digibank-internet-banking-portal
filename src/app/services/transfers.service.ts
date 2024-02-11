import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransfersService {
  private apiUrl = 'https://jsonserver.online/user/XTz-bRp-5gc/accdetails'; // Update the URL with your JSON Server endpoint

  constructor(private http: HttpClient) {}

  transferMoney(
    sourceAccount: number,
    destinationAccount: number,
    amount: number,
    description: string
  ): void {
    // Implement logic to transfer money and update server data
    console.log('Transfer initiated:', sourceAccount, destinationAccount, amount, description);
  }
  
  addTransfer(transferDetails: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, transferDetails);
  }

}
