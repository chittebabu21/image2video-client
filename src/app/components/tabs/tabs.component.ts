import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent  implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

  onNavigation(page: string) {
    this.navCtrl.navigateForward(`/${page}`);
  }
}
