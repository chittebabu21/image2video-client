import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { JsonResponse } from '../interfaces/json-response';
import { Video } from '../interfaces/video';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private baseUrl = environment.baseUrl;
  private uploadsUrl = environment.uploadsUrl;

  constructor(private http: HttpClient, private userService: UserService) { }

  getVideosByUserId(userId: number) {
    const token = this.userService.get('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${cleanedToken}`
    });

    return this.http.get<JsonResponse>(`${this.baseUrl}/videos/user/${userId}`, { headers: headers }).pipe(
      map(res => res.data.map((video: Video) => {
        video.video_url = `${this.uploadsUrl}/uploads/videos/${video.video_url}`;
        video.generated_on = new Date(video.generated_on);
        return video;
      })),
      map(videos => videos.sort((a: Video, b: Video) => b.generated_on.getTime() - a.generated_on.getTime()))
    );
  }

  generateVideo(body: { image: File; width: string; height: string; }) {
    const token = this.userService.get('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${cleanedToken}`
    });

    const formData = new FormData();
    formData.append('image', body.image);
    formData.append('width', body.width);
    formData.append('height', body.height);

    return this.http.post(`${this.baseUrl}/videos/generate`, formData, { headers: headers });
  }

  insertVideo(generationId: string, userId: number) {
    const token = this.userService.get('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${cleanedToken}`
    });

    return this.http.post(`${this.baseUrl}/videos`, { generation_id: generationId, user_id: userId }, { headers: headers });
  }

  deleteVideo(videoId: number) {
    const token = this.userService.get('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${cleanedToken}`
    });

    return this.http.delete(`${this.baseUrl}/videos/${videoId}`, { headers: headers });
  }
}
