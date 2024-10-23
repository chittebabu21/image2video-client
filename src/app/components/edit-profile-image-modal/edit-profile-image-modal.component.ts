import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { Helper } from '../../utility/helper';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { JsonResponse } from '../../interfaces/json-response';

@Component({
  selector: 'app-edit-profile-image-modal',
  templateUrl: './edit-profile-image-modal.component.html',
  styleUrls: ['./edit-profile-image-modal.component.scss'],
})
export class EditProfileImageModalComponent  implements OnInit {
  @Input() selectedUser!: User;
  editForm!: FormGroup;
  profileImageUrl!: string;
  profileImageFile!: File;
  errorMsg!: string;

  constructor(
    private helper: Helper,
    private userService: UserService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.editForm = new FormGroup({
      profile_image_url: new FormControl(null)
    });

    this.updateEditForm();
  }

  updateEditForm() {
    this.editForm.patchValue({
      profile_image_url: this.selectedUser.profile_image_url
    });
  }

  onImagePicked() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }

    Camera.getPhoto({
      quality: 100,
      source: CameraSource.Photos,
      correctOrientation: true,
      height: 320,
      width: 200, 
      resultType: CameraResultType.DataUrl
    }).then((image: any) => {
      const imageDataUrl = image.DataUrl || image.dataUrl;

      if (!imageDataUrl) {
        console.log('Image data is missing...');
        this.errorMsg = 'Image is missing...';
        return;
      }

      this.profileImageUrl = imageDataUrl;
      const supportedFormats = ['png', 'jpg', 'jpeg'];
      const match = this.profileImageUrl.match(/^data:image\/(png|jpg|jpeg);base64,(.+)$/);

      if (match && supportedFormats.includes(match[1])) {
        const format = match[1];
        const base64String = match[2];
        const mimeType = `image/${format}`;

        try {
          const blob = this.helper.base64ToBlob(base64String, mimeType);
          this.profileImageFile = new File([blob], `profile-image.${format}`, { type: mimeType });
        } catch (err) {
          console.log('Error in processing image: ' + err);
          return;
        }
      } else {
        console.log('Unsupported image format...');
        this.errorMsg = 'Unsupported image format. Please ensure that your image file extension is either png, jpg or jpeg.';
        return;
      }
    }).catch(err => {
      console.log(err);
      return;
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }

    const profileImageData = new FormData();
    profileImageData.append('profile_image_url', this.profileImageFile);

    this.userService.updateUser(this.selectedUser.user_id, profileImageData).subscribe({
      next: async (response: any) => {
        const jsonResponse = response as JsonResponse;
        console.log(jsonResponse);

        const successAlert = await this.alertCtrl.create({
          header: 'SUCCESS!',
          subHeader: 'Your profile picture is updated successfully!',
          message: 'Please clcik OK to continue.',
          cssClass: 'color: green',
          backdropDismiss: false,
          buttons: [{
            text: 'OK',
            handler: () => {
              this.modalCtrl.dismiss();
            }
          }]
        });

        successAlert.present();
        this.editForm.reset();
        this.profileImageUrl = '';
        this.errorMsg = '';
      },
      error: (err) => {
        console.log(err);
        this.errorMsg = 'Failed to update profile image. Please try again...';
        this.editForm.reset();
        this.profileImageUrl = '';
      }
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }
}
