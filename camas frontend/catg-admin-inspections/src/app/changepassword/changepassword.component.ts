import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CryptoService } from '../crypto.service';
import { CommonModule } from '@angular/common';
import { ApicallService } from '../apicall.service';

@Component({
  selector: 'app-changepassword',
  imports: [FormsModule, CommonModule],
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.css'
})
export class ChangepasswordComponent {
  constructor(private encservice: CryptoService, private apicall: ApicallService,) { }

  userId: any;
  user: any;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  showCurrent: boolean = false;
  showNew: boolean = false;
  showConfirm: boolean = false;


  ngOnInit() {
    const userstoragedecryptData = this.encservice.decrypt(localStorage.getItem('user') || '{}')
    //console.log(userstoragedecryptData);
    const userData = JSON.parse(userstoragedecryptData);
    //console.log('User from localStorage:', userData);

    this.userId = userData?.id || null;
    // Assign the whole user object to userProfile
    this.user = {
      name: userData?.name,
      role: userData?.role,
      designation: userData?.desig,
      zone: userData?.zone,
      division: userData?.division

    };
  }

  onChangePassword() {
    if (!this.isFormValid()) {
      alert('Please fill in all fields correctly.');
      return;
    }

    const cpdata = JSON.stringify({
      "userid": this.userId,
      "currentPassword": this.currentPassword,
      "newPassword": this.newPassword,
    });

    this.apicall.changepassword(cpdata).subscribe({
      next: (response: any) => {
       // console.log(response);
        if (response.status === "true") {
          alert('Password changed successfully.');
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.showCurrent = false;
          this.showNew = false;
          this.showConfirm = false;
          localStorage.clear();
        } else if (response.status === "usrnotfound") {
          alert('User not found');
        } else if (response.status === "invalidpassword") {
          alert('Current Password is wrong');
        }
      },
      error: (error: any) => {
        console.error(error);
        alert('Error changing password.');
      }


    });


    // Call API to update password
  //  console.log('Password changed successfully!' + cpdata);
  }

  isFormValid(): boolean {
    return (
      this.currentPassword.trim().length > 0 &&
      this.newPassword.trim().length > 0 &&
      this.confirmPassword.trim().length > 0 &&
      this.newPassword === this.confirmPassword
    );
  }

}
