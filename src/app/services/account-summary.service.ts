import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountSummaryService {

  private apiUrl = 'https://jsonserver.online/user/XTz-bRp-5gc/accsummary/'; // Update the URL with your JSON Server endpoint

  constructor(private http: HttpClient) {}

  getAccountSummary(fname: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?fname=${fname}`);
  }
}
