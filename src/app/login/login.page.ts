import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';
import { JsonResponse } from '../interfaces/json-response';
import { ResetPasswordModalComponent } from '../components/reset-password-modal/reset-password-modal.component';
import { catchError, EMPTY, of, switchMap, tap } from 'rxjs';

interface LoginResponse {
  success: 0 | 1;
  message: string;
  token: string;
  data: User
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  errorMsg = '';
  token = '';
  isLoggedIn = false;

  constructor(
    private userService: UserService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private socialAuthService: SocialAuthService
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email_address: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.email]
      }),
      password_hash: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    // google login
    this.socialAuthService.authState.pipe(
      switchMap((user: SocialUser) => {
        const oAuthUser = {
          email_address: user.email,
          password_hash: user.id,
          profile_image_url: user.photoUrl,
          is_verified: 1
        }

        return this.userService.insertOAuthUser(oAuthUser).pipe(
          switchMap((response: any) => {
            const jsonResponse = response as JsonResponse;

            if (!jsonResponse) {
              return this.userService.login({ email_address: oAuthUser.email_address, password_hash: oAuthUser.password_hash }).pipe(
                switchMap((response: any) => {
                  const loginResponse = response as LoginResponse;
                  this.errorMsg = '';

                  this.userService.set('token', loginResponse.token);
                  this.userService.set('userId', loginResponse.data.user_id);
                  this.isLoggedIn = true;

                  return of(response);
                })
              );
            }

            return of(response);
          }),
          catchError((err) => {
            if (err.status === 409) {
              return this.userService.login({ email_address: oAuthUser.email_address, password_hash: oAuthUser.password_hash }).pipe(
                switchMap((response: any) => {
                  const loginResponse = response as LoginResponse;
                  this.errorMsg = '';

                  this.userService.set('token', loginResponse.token);
                  this.userService.set('userId', loginResponse.data.user_id);
                  this.isLoggedIn = true;

                  return of(response);
                })
              )
            }

            throw err;
          })
        )
      })
    ).subscribe({
      next: (response: any) => {
        console.log(response);

        this.showSuccessAlert();
        this.loginForm.reset();
        this.navCtrl.navigateForward('/home/generate');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const emailAddress = this.loginForm.get('email_address')?.value;
      const passwordHash = this.loginForm.get('password_hash')?.value;

      this.login(emailAddress, passwordHash);
    }
  }

  login(emailAddress: string, passwordHash: string) {
    this.userService.login({ email_address: emailAddress, password_hash: passwordHash }).subscribe({
      next: (response: any) => {
        const loginResponse = response as LoginResponse;

        if (loginResponse.success === 1 && loginResponse.data) {
          this.errorMsg = '';

          this.userService.set('token', loginResponse.token);
          this.userService.set('userId', loginResponse.data.user_id);
          this.isLoggedIn = true;

          this.showSuccessAlert();
          this.loginForm.reset();

          setTimeout(() => {
            this.navCtrl.navigateForward('/home/generate');
          }, 5000);
        }
      },
      error: (err) => {
        console.log(err);
        this.errorMsg = 'Invalid credentials. Please try again...';
        this.loginForm.reset();
      }
    });
  }

  async showSuccessAlert() {
    const successAlert = await this.alertCtrl.create({
      header: 'SUCCESS!',
      message: 'You are logged in successfully!',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.navigateForward('/home/generate');
        }
      }]
    });

    await successAlert.present();

    setTimeout(() => {
      successAlert.dismiss();
    }, 3000);
  }

  openModal() {
    this.modalCtrl.create({
      component: ResetPasswordModalComponent
    }).then(el => el.present());
  }
}
