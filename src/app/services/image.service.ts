import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private userService: UserService) { }

  insertImage(body: { image_url: string; user_id: number }) {
    const token = this.userService.get('token');
    const cleanedToken = token?.replace(/^['"](.*)['"]$/, '$1');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${cleanedToken}`
    });

    return this.http.post(`${this.baseUrl}/images`, body, { headers: headers });
  }
}
