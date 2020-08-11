import { Component, Listen, Element, h } from '@stencil/core';
import { createAnimation, Animation } from '@ionic/core';

@Component({
  tag: 'my-accordion-group',
  styleUrl: 'my-accordion-group.css',
  shadow: true,
})
export class MyAccordionGroup {
  @Element() hostElement: HTMLElement;

  public elementsToShift: Array<any>;
  public blocker: HTMLElement;
  public currentlyOpen: CustomEvent = null;

  public shiftDownAnimation: Animation;
  public blockerDownAnimation: Animation;

  componentDidLoad() {
    this.blocker = this.hostElement.shadowRoot.querySelector('.blocker');
  }

  @Listen('toggle')
  async handleToggle(ev) {
    ev.detail.shouldOpen ? await this.animateOpen(ev) : await this.animateClose(ev);
    ev.detail.endTransition();
  }

  async closeOpenItem() {
    if (this.currentlyOpen !== null) {
      const itemToClose = this.currentlyOpen.detail;

      itemToClose.startTransition();
      await this.animateClose(this.currentlyOpen);
      itemToClose.endTransition();
      itemToClose.setClosed();
      return true;
    }
  }

  async animateOpen(ev) {
    // Close any open item first
    await this.closeOpenItem();
    this.currentlyOpen = ev;

    // Create an array of all accordion items
    const items = Array.from(this.hostElement.children);

    // Find the item being opened, and create a new array with only the elements beneath the element being opened
    let splitOnIndex = 0;

    items.forEach((item, index) => {
      if (item === ev.detail.element) {
        splitOnIndex = index;
      }
    });

    this.elementsToShift = [...items].splice(splitOnIndex + 1, items.length - (splitOnIndex + 1));

    // Set item content to be visible
    ev.detail.content.style.display = 'block';

    // Calculate the amount other items need to be shifted
    const amountToShift = ev.detail.content.clientHeight;
    const openAnimationTime = 300;

    // Initially set all items below the one being opened to cover the new content
    // but then animate back to their normal position to reveal the content
    this.shiftDownAnimation = createAnimation()
      .addElement(this.elementsToShift)
      .delay(20)
      .beforeStyles({
        ['transform']: `translateY(-${amountToShift}px)`,
        ['position']: 'relative',
        ['z-index']: '1',
      })
      .afterClearStyles(['position', 'z-index'])
      .to('transform', 'translateY(0)')
      .duration(openAnimationTime)
      .easing('cubic-bezier(0.32,0.72,0,1)');

    // This blocker element is placed after the last item in the accordion list
    // It will change its height to the height of the content being displayed so that
    // the content doesn't leak out the bottom of the list
    this.blockerDownAnimation = createAnimation()
      .addElement(this.blocker)
      .delay(20)
      .beforeStyles({
        ['transform']: `translateY(-${amountToShift}px)`,
        ['height']: `${amountToShift}px`,
      })
      .to('transform', 'translateY(0)')
      .duration(openAnimationTime)
      .easing('cubic-bezier(0.32,0.72,0,1)');

    return await Promise.all([this.shiftDownAnimation.play(), this.blockerDownAnimation.play()]);
  }

  async animateClose(ev) {
    this.currentlyOpen = null;
    const amountToShift = ev.detail.content.clientHeight;

    const closeAnimationTime = 300;

    // Now we first animate up the elements beneath the content that was opened to cover it
    // and then we set the content back to display: none and remove the transform completely
    // With the content gone, there will be no noticeable position change when removing the transform
    const shiftUpAnimation: Animation = createAnimation()
      .addElement(this.elementsToShift)
      .afterStyles({
        ['transform']: 'translateY(0)',
      })
      .to('transform', `translateY(-${amountToShift}px)`)
      .afterAddWrite(() => {
        this.shiftDownAnimation.destroy();
        this.blockerDownAnimation.destroy();
      })
      .duration(closeAnimationTime)
      .easing('cubic-bezier(0.32,0.72,0,1)');

    const blockerUpAnimation: Animation = createAnimation()
      .addElement(this.blocker)
      .afterStyles({
        ['transform']: 'translateY(0)',
      })
      .to('transform', `translateY(-${amountToShift}px)`)
      .duration(closeAnimationTime)
      .easing('cubic-bezier(0.32,0.72,0,1)');

    await Promise.all([shiftUpAnimation.play(), blockerUpAnimation.play()]);

    ev.detail.content.style.display = 'none';

    shiftUpAnimation.destroy();
    blockerUpAnimation.destroy();

    return true;
  }

  render() {
    return [<slot></slot>, <div class="blocker"></div>];
  }
}
