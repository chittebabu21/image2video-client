import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { UserService } from '../../../services/user.service';
import { VideoService } from '../../../services/video.service';
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
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    const userId = this.userService.get('userId')!;
    this.userId = parseInt(userId);

    this.videoService.getVideosByUserId(this.userId).subscribe({
      next: (response: Video[]) => {
        this.videos = response;
        
        for (let video of this.videos) {
          this.trustedVideoUrlArray.push(this.domSanitizer.bypassSecurityTrustResourceUrl(video.video_url));
        }
      },
      error: (err) => {
        console.log(err);
        this.errorMsg = 'No videos found.';
      }
    });
  }

}
