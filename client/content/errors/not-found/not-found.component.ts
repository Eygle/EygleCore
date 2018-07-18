import { Component, OnInit } from '@angular/core';
import {ConfigService} from "../../../services/config.service";

@Component({
  selector: 'core-not-found',
  template: require('./not-found.component.html'),
  styles: [require('./not-found.component.scss')]
})
export class NotFoundComponent implements OnInit {

  constructor(config: ConfigService) {
      config.setSettings({
          layout: {
              navbar: true,
              toolbar: false
          }
      });
  }

  ngOnInit() {
  }

}
