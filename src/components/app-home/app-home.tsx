import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
})
export class AppHome {
  render() {
    return [
      <ion-header class="ion-no-border">
        <ion-toolbar>
          <ion-title>Accordion List</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content class="ion-padding">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Accordion List</ion-title>
          </ion-toolbar>
        </ion-header>

        <my-accordion-group>
          <my-accordion-item>
            <h3 slot="header">Overview</h3>
            <div slot="content">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a type specimen book.
              </p>
            </div>
          </my-accordion-item>
          <my-accordion-item>
            <h3 slot="header">Characters</h3>
            <ul style={{ paddingLeft: `10px` }} slot="content">
              <li>Mace Tyrell</li>
              <li>Tyrion Lannister</li>
              <li>Sansa Stark</li>
              <li>Catelyn Stark</li>
              <li>Roose Bolton</li>
              <li>Jon Snow</li>
              <li>Hot Pie</li>
            </ul>
          </my-accordion-item>
          <my-accordion-item>
            <h3 slot="header">Plot</h3>
            <p slot="content">Hello there.</p>
            <p slot="content">Hello there.</p>
            <p slot="content">Hello there.</p>
            <p slot="content">Hello there.</p>
            <p slot="content">Hello there.</p>
            <p slot="content">Hello there.</p>
          </my-accordion-item>
          <my-accordion-item>
            <h3 slot="header">Production</h3>
            <div slot="content">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a type specimen book.
              </p>
            </div>
          </my-accordion-item>
          <my-accordion-item>
            <h3 slot="header">Awards</h3>
            <div slot="content">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a type specimen book.
              </p>
            </div>
          </my-accordion-item>
        </my-accordion-group>
      </ion-content>,
    ];
  }
}
