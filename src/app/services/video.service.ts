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

    return this.http.post(`${this.baseUrl}/videos/generate`, body, { headers: headers });
  }

  insertVideo(generation_id: string) {
    const token = this.userService.get('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${cleanedToken}`
    });

    return this.http.post(`${this.baseUrl}/videos`, { generation_id: generation_id }, { headers: headers });
  }
}
