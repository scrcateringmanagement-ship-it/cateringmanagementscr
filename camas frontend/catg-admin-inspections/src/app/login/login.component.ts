import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CryptoService } from '../crypto.service';
import { ApicallService } from '../apicall.service';
import { Base64Service } from '../base64.service';
import { SessionTimerService } from '../session-timer.service';

declare global {
  interface Window {
    onRecaptchaLoadCallback: () => void;
    grecaptcha: any;
  }
}
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements AfterViewInit {

  username: any = '';
  password: any = '';
  showPassword: boolean = false;

  siteKey = '6LdnfzMrAAAAAFxeBitSBN0Dgcq-yjP-bLse31_W';
  captchaToken = '';
  constructor(private route: Router, private encservice: CryptoService, private apicall: ApicallService, private base64: Base64Service,private sessionTimer: SessionTimerService) { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    window.onRecaptchaLoadCallback = () => {
      window.grecaptcha.render('recaptcha-container', {
        sitekey: this.siteKey,
        callback: (response: string) => {
          this.captchaToken = response;
        },
      });
    };

    if (window.grecaptcha && window.grecaptcha.render) {
      window.onRecaptchaLoadCallback();
    }
  }


  errorMessage: string = '';

  loginsubmit() {
    this.errorMessage = ''; // Clear any previous error message
    ////console.log(this.captchaToken);
    const usrname = this.encservice.encrypt(this.username);
    const pass = this.encservice.encrypt(this.password);
    const data = { "username": usrname, "password": pass, "captcha": this.captchaToken };
    const encodedData = this.base64.encode(data);
    const dataToSend = { "data": encodedData };
    //console.log(data);
    this.apicall.login(dataToSend).subscribe({

      next: async (res: any) => {
        this.captchaToken = '';
        const returnedData = res.body.data;
        const decodedData = this.base64.decode(returnedData);

        if (res.status == 200) {
          //console.log('Login Successfull', res);
          const userdata = this.encservice.encrypt(JSON.stringify(decodedData.user));
          const LoginTimecheckid = this.encservice.encrypt(JSON.stringify(decodedData.LoinInsertedId));

          localStorage.setItem('token', decodedData.access_token);
          localStorage.setItem('user', userdata);
          localStorage.setItem('Timecheck', LoginTimecheckid);

          const tokentimer = localStorage.getItem('token'); // or sessionStorage
          this.sessionTimer.initFromToken(tokentimer);
          this.route.navigate(['/home']);
        } else {
          this.errorMessage = res.message || 'Invalid credentials';
        }
      },
      error: (err: any) => {
        //console.log(err);
        this.errorMessage = err.error?.message || 'An error occurred during login';
      }
    });
  }

}
