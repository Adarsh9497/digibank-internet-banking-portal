import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountDetailsService } from '../services/account-details.service';
import { AuthService } from '../services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent {
  accountDetails: any = {};
  dataSource: MatTableDataSource<any>;
  transactions: any[] = [];
  first_name:any;
  paginator: any;
  sort: any;
  constructor(private route: ActivatedRoute, private currencyService: CurrencyService,private accountDetailsService: AccountDetailsService, private authService: AuthService,private router: Router) {
    this.dataSource = new MatTableDataSource();
  }
  displayedColumns: string[] = ['date','acc_number','description', 'amt', 'balance'];
  
  ngOnInit(): void {
    // Get the account number from the URL
    this.first_name=this.authService.getLoggedInUser().fname;
    const accountNumber = this.route.snapshot.paramMap.get('id');

    // Check if accountNumber is not null before using it
    if (accountNumber !== null) {
      // Fetch account details
      this.accountDetailsService.getAccountDetails(accountNumber).subscribe(
        (data) => {
          console.log('Combined Data:', data);

          // Assign data directly to component properties
          this.accountDetails = data.accountDetails;
          this.transactions = data.transactions;
          this.dataSource.data = this.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (error) => {
          console.error('Error fetching account details:', error);
        }
      );
    } else {
      console.error('Account number is null');
      // Handle the case where accountNumber is null (e.g., redirect to an error page)
    }
  }

  getTransactionDetail(src:string,dest:string):string{

   
    if(this.accountDetails.acc_number===src){
      return 'Sent to '+ dest;
    }else{
      return 'Received from ' +src; 
    }
  }


  calculateEquivalentValue(amount: number): number {
    const equivalentValue = this.currencyService.calculateEquivalentValue(amount);
    return equivalentValue;
  }


  getAmount(typee:any,amt:number):string{
   let temp= this.formatBalance(this.calculateEquivalentValue(amt));
      if(typee==="Credit" ){
        return temp;
      }
      else{
        return temp;
      }
  }

  currencySymbol:string|undefined;


  formatBalance(balance: number): string {
    this.currencySymbol = this.currencyService.getCurrencySymbol();
    return new Intl.NumberFormat('en-US', { style: 'currency', currency:this.currencySymbol,minimumFractionDigits: 2,
    maximumFractionDigits: 2, }).format(balance);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getClosingBalance(transData:any):any{
      if(transData.acc_number==this.accountDetails.acc_number){
          return this.formatBalance(this.calculateEquivalentValue(transData.srcClosingBalance));
      }else if(transData.destination_acc==this.accountDetails.acc_number){
        return this.formatBalance(this.calculateEquivalentValue(transData.destClosingBalance));
    }else
      return null;
  }

  logout(): void {
    this.authService.logout();
    // Navigate to the login page after logout
    this.router.navigate(['/login']);
  }

  getDate(dateInt:number): string {
    const today = new Date(dateInt);
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    return mm + '/' + dd + '/' + yyyy;
  }

  navigateToTransfer(): void {
    this.router.navigate(['/transfer']);
  }

  navigateToTransaction(): void {
    this.router.navigate(['/transactions']);
  }
  navigateToDashboard(): void {
    this.router.navigate(['/account-summary']);
  }
  
  
  filterValue:string | undefined;
  applyFilter(event: Event) {
    this.filterValue= (event.target as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = this.filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = this.filterValue;
  }


}
