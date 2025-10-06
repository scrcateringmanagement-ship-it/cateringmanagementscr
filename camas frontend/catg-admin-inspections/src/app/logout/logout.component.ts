import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApicallService } from '../apicall.service';
import { CryptoService } from '../crypto.service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
    userId: string | null = null;
  constructor(private route:Router, private apicall:ApicallService,private encservice:CryptoService) { }
ngOnInit() {
   const TimecheckstoragedecryptData = this.encservice.decrypt(localStorage.getItem('Timecheck')||'')
 const TimeCheckid = TimecheckstoragedecryptData;
 const data = { "LoginInsertedId": TimeCheckid};
//console.log(data);
  this.apicall.logout(data).subscribe({
    next: (response: any) => {
      //console.log('Logout response:', response);
      if (response.status === "Loggedout") {
        this.handleLogoutSuccess();
      }
    },
    error: (error: any) => {
      console.error('Logout failed', error);
    }
  });
}


handleLogoutSuccess() {
  // Clear user session or token from local storage or session storage
  localStorage.clear();
  // Redirect to the login page or any other page after successful logout
  this.route.navigate(['']);
  // Optionally, you can show a success message or perform any other actions
  //console.log('User logged out successfully');
 }

}
