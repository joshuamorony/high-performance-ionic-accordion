import { Component, Listen, Element, writeTask, h } from '@stencil/core';
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

    // Shift all of the elements below the item being opened up so that the content that was just
    // made visible, is hidden by the elements below it
    /*this.elementsToShift.forEach(element => {
      writeTask(() => {
        element.style.transition = '';
        element.style.transform = `translateY(-${amountToShift}px)`;

        // Required to display these elements on top of the blocker, but keep the blocker above
        // the content of the item being revealed
        element.style.position = `relative`;
        element.style.zIndex = `1`;
      });
    });*/

    // Position the blocker element so that the content does not leak out the bottom of the accordion group
    /*writeTask(() => {
      this.blocker.style.transition = '';
      this.blocker.style.height = `${amountToShift}px`;
      this.blocker.style.transform = `translateY(-${amountToShift}px)`;
    });*/

    // Wait for DOM updates
    //await new Promise(resolve => setTimeout(resolve, 20));

    // Now remove the transforms so that the shifted elements animate back to their normal position, revealing the
    // new content with an animation
    const openAnimationTime = 300;

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

    await Promise.all([this.shiftDownAnimation.play(), this.blockerDownAnimation.play()]);
    /*this.elementsToShift.forEach(element => {
      writeTask(() => {
        element.style.transition = `transform ${openAnimationTime}ms cubic-bezier(0.32,0.72,0,1)`;
        element.style.transform = 'translateY(0)';
      });
    });*/

    /*writeTask(() => {
      this.blocker.style.transition = `transform ${openAnimationTime}ms cubic-bezier(0.32,0.72,0,1)`;
      this.blocker.style.transform = 'translateY(0)';
    });*/

    // Wait for animation to finish
    //await new Promise(resolve => setTimeout(resolve, openAnimationTime));

    // Reset z-index and position
    /*this.elementsToShift.forEach(element => {
      writeTask(() => {
        element.style.position = '';
        element.style.zIndex = '';
      });
    });*/

    return true;
  }

  async animateClose(ev) {
    this.currentlyOpen = null;
    const amountToShift = ev.detail.content.clientHeight;

    const closeAnimationTime = 300;

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

    // Animate elements up to hide the content that is currently displayed
    /*this.elementsToShift.forEach(element => {
      writeTask(() => {
        element.style.transition = `transform ${closeAnimationTime}ms cubic-bezier(0.32,0.72,0,1)`;
        element.style.transform = `translateY(-${amountToShift}px)`;
      });
    });

    writeTask(() => {
      this.blocker.style.transition = `transform ${closeAnimationTime}ms cubic-bezier(0.32,0.72,0,1)`;
      this.blocker.style.transform = `translateY(-${amountToShift}px)`;
    });*/

    // Wait for animation to complete
    //await new Promise(resolve => setTimeout(resolve, closeAnimationTime));

    // Hide the content of the item being closed
    //ev.detail.content.style.display = 'none';

    // Remove transforms (the items will remain in the same position, since their resting position is now the same
    // as the transformed position because the content has been set to display: none)
    /*this.elementsToShift.forEach(element => {
      writeTask(() => {
        element.style.transition = '';
        element.style.transform = `translateY(0)`;
      });
    });*/

    /*writeTask(() => {
      this.blocker.style.transition = '';
      this.blocker.style.transform = `translateY(0)`;
    });*/

    return true;
  }

  render() {
    return [<slot></slot>, <div class="blocker"></div>];
  }
}
