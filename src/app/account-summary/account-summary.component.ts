import { Component } from '@angular/core';
import { AccountSummaryService } from '../services/account-summary.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { CurrencyService } from '../services/currency.service';


@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.css']
})
export class AccountSummaryComponent {
  accounts: any[] = [];
  loggedInUser: any;
  first_name:any;
  currencySymbol:string|undefined;

displayedColumns: string[] = ['acc_number', 'acc_type', 'balance'];

  constructor(
    private accountSummaryService: AccountSummaryService,
    private authService: AuthService,
    private accountService: AccountService,
    private currencyService: CurrencyService,
    private router: Router) { }

  
    formatBalance(balance: number): string {
      this.currencySymbol = this.currencyService.getCurrencySymbol();
      return new Intl.NumberFormat('en-US', { style: 'currency', currency:this.currencySymbol,minimumFractionDigits: 2,
      maximumFractionDigits: 2, }).format(balance);
    }
    

    totalBalance=0;
  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.loggedInUser = this.authService.getLoggedInUser();
    if (this.loggedInUser) {
      this.accountService.getAccounts(this.loggedInUser.fname).subscribe(
        (data) => {
          this.accounts = data;
          this.totalBalance = this.accounts.reduce((sum, account) => sum + account.balance, 0);

        },
        (error) => {
          console.error('Error fetching accounts:', error);
        }
      );
    }
   // this.loadAccountSummary();
  }

  logout(): void {
    this.authService.logout();
    // Navigate to the login page after logout
    this.router.navigate(['/login']);
  }

  navigateToTransfer(): void {
    this.router.navigate(['/transfer']);
  }

  navigateToTransaction(): void {
    this.router.navigate(['/transactions']);
  }

  navigateToDetails(accNumber: string) {
    this.router.navigate(['/account-details', accNumber]);
  }

  calculateEquivalentValue(amount: number): number {
    const equivalentValue = this.currencyService.calculateEquivalentValue(amount);
    return equivalentValue;
  }

  loadAccountSummary(): void {
    const loggedInUserFname = this.authService.getLoggedInUserFname();
    this.first_name=loggedInUserFname;
    // Fetch the account summary based on the logged-in user's fname
    this.accountSummaryService.getAccountSummary(loggedInUserFname).subscribe(
      (data) => {
        this.accounts = data;
      },
      (error) => {
        console.error('Error fetching account summary:', error);
      }
    );
  }



}

