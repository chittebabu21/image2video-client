import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { Helper } from '../../../utility/helper';
import { UserService } from '../../../services/user.service';
import { ImageService } from '../../../services/image.service';
import { VideoService } from '../../../services/video.service';
import { Image } from '../../../interfaces/image';
import { Video } from '../../../interfaces/video';
import { JsonResponse } from '../../../interfaces/json-response';
import { environment } from '../../../../environments/environment';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.page.html',
  styleUrls: ['./generate.page.scss'],
})
export class GeneratePage implements OnInit {
  baseUrl = environment.baseUrl;
  uploadImageForm!: FormGroup;
  userId!: number;
  imageName!: string;
  imageUrl!: string;
  imageFile!: File;
  errorMsg!: string;
  isGenerating: boolean = false;
  width: string = '1024';
  height: string = '576';

  constructor(
    private helper: Helper, // add as provider in module file
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private userService: UserService,
    private imageService: ImageService,
    private videoService: VideoService
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
      const userId = this.getUserId();
      const imageExtension = this.imageFile.type.slice(6);
      this.isGenerating = true;

      this.imageService.insertImage({ image_url: `user-${userId}-image.${imageExtension}`, user_id: userId }).pipe(
        switchMap((response: any) => {
          const jsonResponse = response as JsonResponse;
          const imageId = jsonResponse.data.image_id;

          return this.videoService.generateVideo({
            image: this.imageFile,
            width: this.width,
            height: this.height
          }).pipe(
            switchMap((videoResponse: any) => {
              const videoJsonResponse = videoResponse as JsonResponse;
              const generationId = videoJsonResponse.data.id;

              return this.videoService.insertVideo(generationId, imageId);
            })
          )
        })
      ).subscribe({
        next: (insertResponse: any) => {
          const jsonResponse = insertResponse as JsonResponse;
          const videoData = jsonResponse.data;
          const videoUrl = `${this.baseUrl}/uploads/videos/${videoData.video_url}`;

          console.log(videoUrl);
          this.errorMsg = '';
          this.imageUrl = '';
          this.showSuccessAlert();
          this.uploadImageForm.reset();
          console.log(jsonResponse);

          setTimeout(() => {
            this.navCtrl.navigateForward('/home/gallery');
          }, 5000);
        },
        error: (err) => {
          console.log(err);
          this.errorMsg = 'Error in generating video. Please try again.';
        },
        complete: () => {
          this.isGenerating = false;
          console.log('Video generated and inserted successfully!');
        }
      });
    } else {
      this.errorMsg = 'Unable to identify image file.';
    }
  }

  async showSuccessAlert() {
    const successAlert = await this.alertCtrl.create({
      header: 'SUCCESS!',
      message: 'Video generated successfully!',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.navigateForward('/home/gallery');
        }
      }]
    });

    await successAlert.present();

    setTimeout(() => {
      successAlert.dismiss();
    }, 3000);
  }

}
