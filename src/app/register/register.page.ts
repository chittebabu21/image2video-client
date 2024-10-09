import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';

import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';
import { catchError, EMPTY } from 'rxjs';

interface RegisterResponse {
  success: 0 | 1;
  data: User
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  errorMsg!: string;

  constructor(
    private userService: UserService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      email_address: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.email]
      }),
      password_hash: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)]
      }),
      confirm_password: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.errorMsg = 'Please complete the required fields...';
      return;
    }

    const password = this.registerForm.get('password_hash')?.value;
    const confirmPassword = this.registerForm.get('confirm_password')?.value;

    if (password !== confirmPassword) {
      this.errorMsg = 'Passwords do not match...';
      this.registerForm.reset();
      return;
    }

    const { email_address, password_hash } = this.registerForm.value;

    this.userService.insertUser({ email_address: email_address, password_hash: password_hash }).pipe(
      catchError((err) => {
        if (err.status !== 500) {
          this.errorMsg = 'Registration failed. Please try again...';
        }

        return EMPTY;
      })
    ).subscribe({
      next: (response: any) => {
        const jsonResponse = response as RegisterResponse;

        if (jsonResponse.success === 1) {
          this.userService.sendVerificationLink(email_address).subscribe({
            next: (response: any) => {
              console.log(response);
            },
            error: (err) => {
              console.log(err);
            }
          });
        }

        this.errorMsg = '';
        this.showSuccessAlert();
        this.registerForm.reset();

        setTimeout(() => {
          this.navCtrl.navigateBack('/');
        }, 3000);
      }
    });
  }


  async showSuccessAlert() {
    const successAlert = await this.alertCtrl.create({
      header: 'SUCCESS',
      subHeader: 'You have registered successfully!',
      message: 'A verification link has been sent to your email.',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.navigateBack('/');
        }
      }]
    });

    successAlert.present();

    setTimeout(() => {
      successAlert.dismiss();
    }, 3000);
  }
}
