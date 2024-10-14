import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private userService: UserService) { }

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

  insertVideo(generationId: string, imageId: number) {
    const token = this.userService.get('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${cleanedToken}`
    });

    return this.http.post(`${this.baseUrl}/videos`, { generation_id: generationId, image_id: imageId }, { headers: headers });
  }
}
