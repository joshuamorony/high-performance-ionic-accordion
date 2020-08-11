import { Component, Listen, State, Element, Host, h, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'my-accordion-item',
  styleUrl: 'my-accordion-item.css',
  shadow: true,
})
export class MyAccordionItem {
  @Element() hostElement: HTMLElement;
  @Event() toggle: EventEmitter;

  public content: HTMLDivElement;
  @State() isOpen: boolean = false;
  private isTransitioning: boolean = false;

  componentDidLoad() {
    this.content = this.hostElement.shadowRoot.querySelector('.content');
  }

  @Listen('click')
  toggleOpen() {
    if (this.isTransitioning) {
      return;
    }

    this.isOpen = !this.isOpen;
    this.isTransitioning = true;

    this.toggle.emit({
      element: this.hostElement,
      content: this.content,
      shouldOpen: this.isOpen,
      startTransition: () => {
        this.isTransitioning = true;
      },
      endTransition: () => {
        this.isTransitioning = false;
      },
      setClosed: () => {
        this.isOpen = false;
      },
    });
  }

  render() {
    return (
      <Host>
        <div class="header">
          <ion-icon name={this.isOpen ? 'chevron-down' : 'chevron-forward'}></ion-icon>
          <slot name="header"></slot>
        </div>
        <div class="content">
          <slot name="content"></slot>
        </div>
      </Host>
    );
  }
}
