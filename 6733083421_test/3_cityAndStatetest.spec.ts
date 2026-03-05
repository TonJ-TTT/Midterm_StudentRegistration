import { test, expect } from "@playwright/test";

test.setTimeout( 3 *60 * 1000);

test("Check city options based on selected state ( have only 4 states )", async ({ page }) => {

  await test.step('Load the form page', async () => {
    await page.goto('https://demoqa.com/automation-practice-form',{
    waitUntil: 'domcontentloaded',
    timeout: 3 * 60 * 1000
    });
  });

  await test.step('Check City is disabled or empty by default', async () => {
    await expect(page.locator('div').filter({ hasText: /^Select City$/ }).first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Select City$/ }).first()).toContainText('Select City');
    await page.locator('div').filter({ hasText: /^Select City$/ }).first().click();
    await expect(page.locator('.css-26l3qy-menu')).toBeHidden();
  });

  await test.step(`City based on State`, async () => {
    await page.locator('div').filter({ hasText: /^Select State$/ }).nth(2).click();
    // select state
    await page.getByRole('option', { name: 'NCR' }).click();
    // check city options
    await page.locator('.css-1xc3v61-indicatorContainer > .css-8mmkcg').click();
    await expect(page.getByRole('option', { name: 'Delhi' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Gurgaon' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Noida' })).toBeVisible();
    // ---- next state ---- //
    await page.locator('.css-8mmkcg').first().click();
    await page.getByRole('option', { name: 'Uttar Pradesh' }).click();

    await page.locator('.css-1xc3v61-indicatorContainer > .css-8mmkcg').click();
    await expect(page.getByRole('option', { name: 'Agra' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Lucknow' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Merrut' })).toBeVisible();
    // ---- next state ---- //
    await page.locator('.css-8mmkcg').first().click();
    await page.getByRole('option', { name: 'Haryana' }).click();

    await page.locator('.css-1xc3v61-indicatorContainer > .css-8mmkcg').click();
    await expect(page.getByRole('option', { name: 'Karnal' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Panipat' })).toBeVisible();
    // ---- next state ---- //
    await page.locator('.css-8mmkcg').first().click();
    await page.getByRole('option', { name: 'Rajasthan' }).click();
    
    await page.locator('.css-1xc3v61-indicatorContainer > .css-8mmkcg').click();
    await expect(page.getByRole('option', { name: 'Jaipur' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Jaiselmer' })).toBeVisible();
    // ---- finish ---- //
  });

});