import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {
  displayedColumns: string[] = ['id','acc_number', 'destination_acc', 'trans_amt', 'date', 'description'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  first_name: any;
  currencySymbol: string="INR";

  constructor(private accountService: AccountService, private authService: AuthService,private router: Router,  private currencyService: CurrencyService) {
    this.dataSource = new MatTableDataSource();
  }


  formatBalance(balance: number): string {
    this.currencySymbol = this.currencyService.getCurrencySymbol();
    return new Intl.NumberFormat('en-US', { style: 'currency', currency:this.currencySymbol,minimumFractionDigits: 2,
    maximumFractionDigits: 2, }).format(balance);
  }

  calculateEquivalentValue(amount: number): number {
    const equivalentValue = this.currencyService.calculateEquivalentValue(amount);
    return equivalentValue;
  }
  
  ngOnInit(): void {
    this.first_name=this.authService.getLoggedInUser().fname;
    this.loadData();
  }

  
  navigateToDashboard(): void {
    this.router.navigate(['/account-summary']);
  }

  logout(): void {
    this.authService.logout();
    // Navigate to the login page after logout
    this.router.navigate(['/login']);
  }
  navigateToTransfer(): void {
    this.router.navigate(['/transfer']);
  }

  getDate(dateInt:number): string {
    const today = new Date(dateInt);
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    return mm + '/' + dd + '/' + yyyy;
  }
  

  loadData(): void {
    this.accountService.getAllTransactions().subscribe(data => {
      this.dataSource.data = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filterValue:string | undefined;
  applyFilter(event: Event) {
    this.filterValue= (event.target as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = this.filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = this.filterValue;
  }
}
