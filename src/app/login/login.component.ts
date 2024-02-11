import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  msg='';
 
  showRequiredUsername=false;
  showRequiredPassword=false;
  constructor(private authService: AuthService, private router: Router) {} // Inject Router

  login(): void {
    const isAuthenticated = this.authService.login(this.username, this.password);
    if(this.username==='' && this.password===''){
      this.showRequiredUsername=true;
      this.showRequiredPassword=true;
      return;
    }else
    if(this.username===''){
      this.showRequiredUsername=true;
      return;
    }else 
    if(this.password===''){
      this.showRequiredPassword=true;
      return;
    }
    
    if (isAuthenticated) {
      this.router.navigate(['/account-summary']);
    } else {
      console.log('Invalid username or password');
      this.msg='Invalid username or password';
    }
  }
  
    resetMsg():void{
      this.msg='';
      this.showRequiredPassword=false;
      this.showRequiredUsername=false;
    }

    private messages: string[] = [
      "Experience Seamless Banking: Secure, Convenient, and Tailored Just for You.",
      "Your Financial Hub Awaits! Log in to Digibank and Manage Your Finances with Ease.",
      "At Digibank, Your Security and Convenience Are Our Top Priorities. Login Now.",
      "Transforming Banking for You: Digibank Online – Accessible, Secure, Anytime.",
      "Bringing Banking to Your Fingertips: Securely Access Your Accounts at Digibank.",
      "Secure, Swift, and Simple. Log in to Digibank Online Banking for a Seamless Experience."
    ];

    
  ngOnInit(): void {
    this.updateMessage();
  }

    currentMessage= 'Experience Seamless Banking: Secure, Convenient, and Tailored Just for You.';
    private updateMessage(): void {
      let index = 1;
      setInterval(() => {
        this.currentMessage = this.messages[index];
        index = (index + 1) % this.messages.length;
      }, 2500);
    }

  }
