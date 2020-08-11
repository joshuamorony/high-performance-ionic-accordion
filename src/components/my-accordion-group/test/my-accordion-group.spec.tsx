import { newSpecPage } from '@stencil/core/testing';
import { MyAccordionGroup } from '../my-accordion-group';

describe('my-accordion-group', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MyAccordionGroup],
      html: `<my-accordion-group></my-accordion-group>`,
    });
    expect(page.root).toEqualHtml(`
      <my-accordion-group>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </my-accordion-group>
    `);
  });
});
