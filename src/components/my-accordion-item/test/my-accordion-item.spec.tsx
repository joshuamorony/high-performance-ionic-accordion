import { newSpecPage } from '@stencil/core/testing';
import { MyAccordionItem } from '../my-accordion-item';

describe('my-accordion-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MyAccordionItem],
      html: `<my-accordion-item></my-accordion-item>`,
    });
    expect(page.root).toEqualHtml(`
      <my-accordion-item>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </my-accordion-item>
    `);
  });
});
