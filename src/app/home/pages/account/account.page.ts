import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { environment } from '../../../../environments/environment';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user';
import { EditProfileImageModalComponent } from '../../../components/edit-profile-image-modal/edit-profile-image-modal.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  user!: User;
  authUserImageUrl!: string;
  isVerified: boolean = false;
  private uploadsUrl = environment.uploadsUrl;

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getUserById();
  }

  getUserById() {
    const jsonUserId = this.userService.get('userId');

    if (jsonUserId) {
      const userId = parseInt(jsonUserId, 10);

      this.userService.getUserById(userId).subscribe({
        next: (user: User) => {
          console.log(user);
          if (user.is_verified === 1) {
            this.isVerified = true;
          }

          if (user.email_address?.endsWith('@gmail.com') && user.profile_image_url) {
            this.authUserImageUrl = user.profile_image_url.slice(37);
          }

          if (user.profile_image_url === `${this.uploadsUrl}/uploads/photos/null`) {
            user.profile_image_url = '/assets/placeholder-images/user.png';
          }

          this.user = user;
        }
      });
    }
  }

  onEditProfileImg(id: number) {
    this.userService.getUserById(id).subscribe({
      next: (user: User) => {
        this.modalCtrl.create({
          component: EditProfileImageModalComponent,
          componentProps: { selectedUser: user }
        }).then(modalEl => modalEl.present());
      }
    });
  }
}
