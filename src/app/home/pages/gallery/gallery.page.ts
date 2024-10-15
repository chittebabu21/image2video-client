import { Component, OnInit, SecurityContext } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { saveAs } from 'file-saver';

import { UserService } from '../../../services/user.service';
import { VideoService } from '../../../services/video.service';
import { DownloadService } from '../../../services/download.service';
import { Video } from '../../../interfaces/video';
import { JsonResponse } from '../../../interfaces/json-response';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  trustedVideoUrlArray: SafeResourceUrl[] = [];
  userId!: number;
  videos!: Video[];
  errorMsg!: string;

  constructor(
    private userService: UserService,
    private videoService: VideoService,
    private downloadService: DownloadService,
    private domSanitizer: DomSanitizer,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    const userId = this.userService.get('userId')!;
    this.userId = parseInt(userId);

    this.videoService.getVideosByUserId(this.userId).subscribe({
      next: (response: Video[]) => {
        if (response.length) {
          this.videos = response;
        
          for (let video of this.videos) {
            this.trustedVideoUrlArray.push(this.domSanitizer.bypassSecurityTrustResourceUrl(video.video_url));
          }

          console.log(this.trustedVideoUrlArray);
        } else {
          this.errorMsg = 'No videos found.';
        }
      },
      error: (err) => {
        console.log(err);
        this.errorMsg = 'Error in retrieving the videos.';
      }
    });
  }

  downloadVideo(trustedVideo: SafeResourceUrl, index: number) {
    const videoUrl = this.domSanitizer.sanitize(SecurityContext.URL, trustedVideo);

    if (videoUrl) {
      this.downloadService.download(videoUrl).subscribe(blob => saveAs(blob, `video-${index}.mp4`));
    } else {
      this.errorMsg = 'Failed to download video.';
    }
  }

  deleteVideo(index: number, videoId: number) {
    this.videoService.deleteVideo(videoId).subscribe({
      next: (response: any) => {
        const jsonResponse = response as JsonResponse;

        if (jsonResponse.success === 1) {
          this.trustedVideoUrlArray.splice(index, 1);
          this.videos.splice(index, 1);
        } else {
          this.errorMsg = 'Error in deleting video.';
          console.log(jsonResponse.message);
        }
      },
      error: (err) => {
        console.log(err);
        this.errorMsg = err.message;
      }
    });
  }

  async confirmDeleteVideo(index: number, videoId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this video?',
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'DELETE',
          handler: () => {
            this.deleteVideo(index, videoId);
          }
        }
      ]
    });

    await alert.present();
  }
}
