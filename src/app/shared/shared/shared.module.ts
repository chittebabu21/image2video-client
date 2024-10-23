import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from '../../components/header/header.component';
import { SubHeaderComponent } from '../../components/sub-header/sub-header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { TabsComponent } from '../../components/tabs/tabs.component';
import { ResetPasswordModalComponent } from '../../components/reset-password-modal/reset-password-modal.component';
import { EditProfileImageModalComponent } from '../../components/edit-profile-image-modal/edit-profile-image-modal.component';
import { Helper } from '../../utility/helper';


@NgModule({
  declarations: [
    HeaderComponent,
    SubHeaderComponent,
    FooterComponent,
    TabsComponent,
    ResetPasswordModalComponent,
    EditProfileImageModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    SubHeaderComponent,
    FooterComponent,
    TabsComponent,
    ResetPasswordModalComponent,
    EditProfileImageModalComponent
  ],
  providers: [Helper]
})
export class SharedModule { }
