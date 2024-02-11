import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInUser: any; // store the logged-in user

  // Sample data, replace it with your actual data from JSON Server
  private users = [
    { fname: 'adarsh', password: 'pass1' },
    { fname: 'nayan', password: 'pass2' },
    { fname: 'user', password: 'pass' },
  ];

  login(username: string, password: string): boolean  {
    const user = this.users.find(u => u.fname === username && u.password === password);

    if (user) {
      this.loggedInUser = user;
      console.log('Login successful! User:', user);
      localStorage.setItem('loggedInUser', JSON.stringify({ fname: username }));
      return true;
      // You can navigate to the next page or perform other actions upon successful login
    } else {
      console.log('Invalid username or password');
      return false;
    }
  }

  isLoggedIn(): boolean {
    return !!this.loggedInUser;
  }


  getLoggedInUserFname(): string {
    return this.loggedInUser ? this.loggedInUser.fname : '';
  }

  getLoggedInUser(): any {
    const userJson = localStorage.getItem('loggedInUser');
    console.log(userJson);
    return userJson ? JSON.parse(userJson) : null;
  }

  logout(): void {
    this.loggedInUser = null;
    localStorage.removeItem('loggedInUser');
    console.log('Logged out');
    // You can navigate to the login page or perform other actions upon logout
  }
}
