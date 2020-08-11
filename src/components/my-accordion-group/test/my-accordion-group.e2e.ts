import { newE2EPage } from '@stencil/core/testing';

describe('my-accordion-group', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<my-accordion-group></my-accordion-group>');

    const element = await page.find('my-accordion-group');
    expect(element).toHaveClass('hydrated');
  });
});
