import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController, ModalController, NavController } from '@ionic/angular';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reset-password-modal',
  templateUrl: './reset-password-modal.component.html',
  styleUrls: ['./reset-password-modal.component.scss'],
})
export class ResetPasswordModalComponent implements OnInit {
  resetPasswordLinkForm!: FormGroup;
  errorMsg = '';

  constructor(
    private navCtrl: NavController, 
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.resetPasswordLinkForm = new FormGroup({
      email_address: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.email]
      })
    });
  }

  onSubmit() {
    if (this.resetPasswordLinkForm.valid) {
      const emailAddress = this.resetPasswordLinkForm.get('email_address')?.value;

      this.userService.sendResetPasswordLink(emailAddress).subscribe({
        next: (response: { success: number; message: string; info: any }) => {
          if (response.success === 1) {
            this.errorMsg = '';
            this.resetPasswordLinkForm.reset();
            this.showSuccessAlert();
  
            setTimeout(() => {
              this.modalCtrl.dismiss();
            }, 5000);
          }
        },
        error: (err) => {
          console.log(err);
          this.errorMsg = 'Invalid email address. Please try again.';
          this.resetPasswordLinkForm.reset();
        }
      });
    }
  }

  async showSuccessAlert() {
    const successAlert = await this.alertCtrl.create({
      header: 'SENT!',
      message: 'Reset password link has been sent to your email successfully! Please check your email.',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.modalCtrl.dismiss();
        }
      }]
    });

    await successAlert.present();

    setTimeout(() => {
      successAlert.dismiss();
    }, 3000);
  }

  onClose() {
    this.modalCtrl.dismiss();
  }

}
