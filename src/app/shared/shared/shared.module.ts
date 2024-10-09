import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from '../../components/header/header.component';
import { SubHeaderComponent } from 'src/app/components/sub-header/sub-header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { TabsComponent } from 'src/app/components/tabs/tabs.component';
import { ResetPasswordModalComponent } from 'src/app/components/reset-password-modal/reset-password-modal.component';


@NgModule({
  declarations: [
    HeaderComponent,
    SubHeaderComponent,
    FooterComponent,
    TabsComponent,
    ResetPasswordModalComponent
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
    ResetPasswordModalComponent
  ]
})
export class SharedModule { }
