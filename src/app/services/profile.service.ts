import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = 'https://jsonserver.online/user/XTz-bRp-5gc';

  constructor(private http: HttpClient) {}

  getUserProfile(fname: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/login_user?fname=${fname}`);
  }
}
