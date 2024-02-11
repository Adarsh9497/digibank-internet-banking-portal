import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountSummaryComponent } from './account-summary/account-summary.component';
import { LoginComponent } from './login/login.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { TransfersComponent } from './transfers/transfers.component';
import { AuthGuard } from './services/auth.guard';
import { TransactionsComponent } from './transactions/transactions.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
 { path: 'login', component: LoginComponent },
  {
    path: 'account-summary',
    component: AccountSummaryComponent,
    canActivate: [AuthGuard]
  },
  { path: 'profile/:fname', component: ProfileComponent,    canActivate: [AuthGuard]
},
  { path: 'transfer', component: TransfersComponent , canActivate: [AuthGuard] },
  { path: 'account-details/:id', component: AccountDetailsComponent, canActivate: [AuthGuard] },
  { path: 'transactions', component: TransactionsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
