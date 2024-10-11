import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { Helper } from '../../../utility/helper';
import { UserService } from '../../../services/user.service';
import { ImageService } from '../../../services/image.service';
import { VideoService } from '../../../services/video.service';
import { Image } from '../../../interfaces/image';
import { Video } from '../../../interfaces/video';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.page.html',
  styleUrls: ['./generate.page.scss'],
})
export class GeneratePage implements OnInit {
  uploadImageForm!: FormGroup;
  userId!: number;
  imageUrl!: string;
  imageFile!: Blob;
  errorMsg!: string;

  constructor(
    private helper: Helper, // add as provider in module file
    private alertCtrl: AlertController,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.uploadImageForm = new FormGroup({
      image_url: new FormControl(null)
    });
  }

  private getUserId() {
    const jsonUserId = this.userService.get('userId')!;
    return parseInt(jsonUserId, 10);
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

      this.imageUrl = imageDataUrl;
      const supportedFormats = ['png', 'jpg', 'jpeg'];
      const match = this.imageUrl.match(/^data:image\/(png|jpg|jpeg);/);

      if (match && supportedFormats.includes(match[1])) {
        const format = match[1];
        const mimeType = `image/${format}`;

        try {
          const blob = this.helper.base64ToBlob(this.imageUrl.slice(23), mimeType);
          this.imageFile = new File([blob], `image.${format}`, { type: mimeType });
          console.log(this.imageFile);
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
    })
  }

  onGenerate() {
    if (this.imageFile) {

    }
  }

}
