import { newE2EPage } from '@stencil/core/testing';

describe('my-accordion-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<my-accordion-item></my-accordion-item>');

    const element = await page.find('my-accordion-item');
    expect(element).toHaveClass('hydrated');
  });
});
