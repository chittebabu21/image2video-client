import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'generate',
        loadChildren: () => import('./pages/generate/generate.module').then( m => m.GeneratePageModule)
      },
      {
        path: 'gallery',
        loadChildren: () => import('./pages/gallery/gallery.module').then( m => m.GalleryPageModule)
      },
      {
        path: 'account',
        loadChildren: () => import('./pages/account/account.module').then( m => m.AccountPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
