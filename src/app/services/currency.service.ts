import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  currency:string='INR';

  private exchangeRates: { [currency: string]: number } = {
    'INR': 1,  //rupee
    'USD': 0.012,  //dollar
    'EUR': 0.011,  //euro  b
    'JPY': 1.75,  //Japanese Yen
    'GBP': 0.0096, //Pound
  };

  constructor() {}

  getCurrencySymbol(): string {
   this.currency= localStorage.getItem('currency') || 'INR';
   return this.currency;
  }

    calculateEquivalentValue(amount: number): number {
    this.currency= localStorage.getItem('currency') || 'INR';
    const exchangeRate = this.exchangeRates[this.currency] || 1;
    return (amount) * (exchangeRate);
  }
}
