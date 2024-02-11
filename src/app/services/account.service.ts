import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AccountService {


  myCurrency:string="INR";

  getAccountByAccNumber(accNumber: string): Observable<any> {
    try{  
      const url = `${this.apiUrl}/accsummary?acc_number=${accNumber}`;
    return this.http.get<any>(url);
  }catch(Error){
      console.log('Account does not exist');
      throw Error;
    }
  }

  private apiUrl = 'https://jsonserver.online/user/XTz-bRp-5gc';
  constructor(private http: HttpClient,private authService: AuthService) {}

  getAccounts(username: string): Observable<any[]> {
    this.fetchCurrency();
    const url = `${this.apiUrl}/accsummary?fname=${username}`;
    return this.http.get<any[]>(url);
  }

  private currency():Observable<any>{
    const url = `${this.apiUrl}/currency`;
    return this.http.get<any[]>(url);
  }

  fetchCurrency():void{
    this.currency().subscribe(
      (data) => {
     this.myCurrency=data.currency;
     localStorage.setItem('currency', this.myCurrency);
      },
      (error) => {
        console.error('Error fetching currency:', error);
      }
    );
  }

  getCurrency():string{
    return localStorage.getItem('currency')??"INR";
  }

  postTransaction(transactionData: any): Observable<any> {
   return  this.http.post<any>(`${this.apiUrl}/accdetails`, transactionData);
    
  }




  updateAccountBalance(id:number,data :any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/accsummary/${id}`, data);
    
}

getAllTransactions(): Observable<any[]> {
  const loggedInUser = this.authService.getLoggedInUser();
  if (loggedInUser) {
    const userTransactionsUrl = `${this.apiUrl}/accdetails?fname=${loggedInUser.fname}`;
    return this.http.get<any[]>(userTransactionsUrl);
  } else {
    // Handle case where user is not logged in
    return new Observable<any[]>(observer => observer.next([]));
  }
}

}
