import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'core-not-found',
  template: require('./not-found.component.html'),
  styles: [require('./not-found.component.scss')]
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
