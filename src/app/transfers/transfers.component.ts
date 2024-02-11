import { Component } from '@angular/core';
import { TransfersService } from '../services/transfers.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../services/account.service';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.css']
})
export class TransfersComponent {
  sourceAccounts: any[] = [];
  finalAccountUpdate:any[]=[];
  transferFormModel: any = {
    sourceAccount: '',
    destinationAccount: '',
    amount: null,
    description: '',
    date:'',
    fname:'',
  };

  http: any;
  accountSummaryService: any;
  accounts: any[] = [];
  loggedInUser: any;
  first_name: any;
  sourceClosingBalance=0;
  destClosingBalance=0;
  currencySymbol: string="INR";


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private transferService: TransfersService,
    private authService: AuthService,
    private currencyService: CurrencyService,
   
  ) {}

  formatBalance(balance: number): string {
    this.currencySymbol = this.currencyService.getCurrencySymbol();
    return new Intl.NumberFormat('en-US', { style: 'currency', currency:this.currencySymbol,minimumFractionDigits: 2,
    maximumFractionDigits: 2, }).format(balance);
  }

   calculateEquivalentValue(amount: number): number {
    const equivalentValue = this.currencyService.calculateEquivalentValue(amount);
    return equivalentValue;
  }

  getCurrentDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    return mm + '/' + dd + '/' + yyyy;
  }

  printCurrencySymbol(): string {
    this.currencySymbol = this.currencyService.getCurrencySymbol();
    switch (this.currencySymbol) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'JPY':
        return '¥';
      case 'GBP':
        return '£';
      default:
        return '₹';
    }
  }


  convertToINR(n:number):number{
    this.currencySymbol = this.currencyService.getCurrencySymbol();
    switch (this.currencySymbol) {
      case 'USD':
        return (n*83.40);
      case 'EUR':
        return (n*89.95);
      case 'JPY':
        return (n*0.57);
      case 'GBP':
        return (n*104.65);
      default:
        return n;
    }
  }

  ngOnInit(): void {
    this.first_name=this.authService.getLoggedInUser().fname;
    // Fetch source accounts for dropdown
    const loggedInUser = this.authService.getLoggedInUser();
    if (loggedInUser) {
      this.accountService.getAccounts(loggedInUser.fname).subscribe(
        (data) => {
          this.sourceAccounts = data;

          // Set default source account based on URL parameter
          this.route.params.subscribe(params => {
            this.transferFormModel.sourceAccount = params['id'];
          });
        },
        (error) => {
          console.error('Error fetching source accounts:', error);
        }
      );
    }
  }

  // transferMoney():void{
  //   this.transferFormModel.date=this.getCurrentDate();
  //   console.log(this.transferFormModel);
  // }

  getCurrentDateTime(): number {
    return new Date().getTime();
  }

  msg='';

  async transferMoney():Promise<void>{
    // Fetch the logged-in user

    if(this.transferFormModel.amount<=0 || this.transferFormModel.amount>=1000000){
      Swal.fire({
        title: "Transaction failed",
        text: "Transaction amount should be between 1 and 1,000,000.",
        icon: "error"
      });
      return;
    }

    if(this.transferFormModel.sourceAccount==this.transferFormModel.destinationAccount){
      Swal.fire({
        title: "Transaction failed",
        text: "Source and destination account cannot be same.",
        icon: "error"
      });
      return;
    }

    const loggedInUser = this.authService.getLoggedInUser();
    if (loggedInUser) {
      // Prepare the transaction data
      let transactionData = {
        acc_number: this.transferFormModel.sourceAccount,
        destination_acc: this.transferFormModel.destinationAccount,
        trans_amt: this.convertToINR(this.transferFormModel.amount),
        date: this.getCurrentDateTime(),
        description: this.transferFormModel.description,
        trans_type: 'Debit',
        fname:loggedInUser.fname,
        srcClosingBalance:0,
        destClosingBalance:0,
      };  
      // Update source account balance  
    const sourceAccountData = await this.accountService.getAccountByAccNumber(transactionData.acc_number).toPromise();
    this.finalAccountUpdate = sourceAccountData;

    if(this.calculateEquivalentValue(this.finalAccountUpdate[0].balance)<transactionData.trans_amt){
      Swal.fire({
        title: "Insufficient funds",
        text: "Oops! It seems there are insufficient funds in your account "+transactionData.acc_number,
        icon: "warning"
      });
      return;
    }


    this.finalAccountUpdate[0].balance -= transactionData.trans_amt;

    await this.accountService.updateAccountBalance(this.finalAccountUpdate[0].id, this.finalAccountUpdate[0]).toPromise();

    if (this.finalAccountUpdate[0].balance >= 0) {
      this.sourceClosingBalance = this.finalAccountUpdate[0].balance;
    }
      
    
    // Update destination account balance  
    const destAccountData = await this.accountService.getAccountByAccNumber(transactionData.destination_acc).toPromise();
    this.finalAccountUpdate = destAccountData;
    this.finalAccountUpdate[0].balance += transactionData.trans_amt;

    await this.accountService.updateAccountBalance(this.finalAccountUpdate[0].id, this.finalAccountUpdate[0]).toPromise();

    if (this.finalAccountUpdate[0].balance >= 0) {
      this.destClosingBalance = this.finalAccountUpdate[0].balance;
    }



    transactionData.srcClosingBalance = this.sourceClosingBalance;
    transactionData.destClosingBalance = this.destClosingBalance;
      

    //post transaction
     await this.accountService.postTransaction(transactionData).toPromise();
    //  .subscribe(
    //       (response) => {
           
    //         // Reset the form or perform other actions as needed
    //       },
    //       (error) => {
    //         console.error('Error posting transaction:', error);
    //         // Handle the error as needed
    //       }
    //     );

    } else {
      alert('Please log in to continue');
          this.router.navigate(['/login']);
    }
    Swal.fire({
      title: "Transaction Successfull!",
      text: "Transaction ID - 3343000042944",
      icon: "success"
    });
    this.router.navigate(['/account-summary']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/account-summary']);
  }
  
  logout(): void {
    this.authService.logout();
    // Navigate to the login page after logout
    this.router.navigate(['/login']);
  }

  navigateToTransaction(): void {
    this.router.navigate(['/transactions']);
  }

}
