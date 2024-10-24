import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';

import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { JsonResponse } from '../../interfaces/json-response';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-update-password-modal',
  templateUrl: './update-password-modal.component.html',
  styleUrls: ['./update-password-modal.component.scss'],
})
export class UpdatePasswordModalComponent  implements OnInit {
  @Input() selectedUser!: User;
  updatePasswordForm!: FormGroup;
  errorMsg = '';

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.updatePasswordForm = new FormGroup({
      email_address: new FormControl({ value: null, disabled: true }, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.email]
      }),
      old_password: new FormControl(null, {
        validators: [Validators.required]
      }),
      password_hash: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)]
      }),
      confirm_password: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.updateForm();
  }

  updateForm() {
    this.updatePasswordForm.patchValue({
      email_address: this.selectedUser.email_address
    });

    this.updatePasswordForm.get('email_address')?.disable();
  }

  onUpdatePassword() {
    if (this.updatePasswordForm.invalid) {
      this.errorMsg = 'Please complete the required fields...';
      return;
    }

    const oldPassword = this.updatePasswordForm.get('old_password')?.value;
    const newPassword = this.updatePasswordForm.get('password_hash')?.value;
    const confirmPassword = this.updatePasswordForm.get('confirm_password')?.value;

    this.userService.validatePassword(this.selectedUser.user_id, oldPassword).subscribe({
      next: (response: any) => {
        const jsonResponse = response as JsonResponse;

        if (jsonResponse.success === 0) {
          this.errorMsg = 'Old password is incorrect. Please try again...';
          return;
        } else {
          if (newPassword !== confirmPassword) {
            this.errorMsg = 'Passwords do not match. Please try again...';
            this.updatePasswordForm.reset();
            return;
          } 

          this.userService.updateUser(this.selectedUser.user_id, { password_hash: newPassword }).subscribe({
            next: async (response: any) => {
              const jsonResponse = response as JsonResponse;
              console.log(jsonResponse);

              const successAlert = await this.alertCtrl.create({
                header: 'SUCCESS!',
                subHeader: 'Your password is updated successfully!',
                message: 'Please click OK to continue.',
                cssClass: 'color: green',
                backdropDismiss: false,
                buttons: [{
                  text: 'OK',
                  handler: () => {
                    this.modalCtrl.dismiss();
                  }
                }]
              });

              await successAlert.present();
              this.updatePasswordForm.reset();
              this.errorMsg = '';
            },
            error: (err) => {
              console.log(err);
              this.errorMsg = 'Failed to update password. Please try again...';
              this.updatePasswordForm.reset();
            }
          });
        }
      },
      error: (err) => {
        console.log(err);
        this.errorMsg = 'Failed to validate old password. Please try again...';
        this.updatePasswordForm.reset();
      }
    });
  }

  onClose() {
    this.modalCtrl.dismiss();
  }
}
