import { Component } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userProfile:any;
  constructor(private authService: AuthService,private router: Router,private profileService: ProfileService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    
    const fname = this.route.snapshot.paramMap.get('fname')??'';

    this.profileService.getUserProfile(fname).subscribe((data) => {
      this.userProfile = data[0];
    });
  }

  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
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
  

}
