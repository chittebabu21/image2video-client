import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../../shared/shared/shared.module';
import { Helper } from '../../../utility/helper';

import { GeneratePageRoutingModule } from './generate-routing.module';

import { GeneratePage } from './generate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeneratePageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [GeneratePage],
  providers: [Helper]
})
export class GeneratePageModule {}
