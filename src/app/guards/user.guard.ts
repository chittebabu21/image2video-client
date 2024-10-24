import { CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const userGuard: CanActivateFn = (route, state) => {
  const navCtrl = inject(NavController);
  const userService = inject(UserService);

  // check if token exists
  const token = userService.get('token');

  if (token) {
    return true;
  } else {
    localStorage.clear();
    navCtrl.navigateBack('/login');
    return false;
  }
};
