import { test, expect } from "@playwright/test";

test.describe.configure({ mode: 'serial' });

test.setTimeout( 3 *60 * 1000);

test("Test Address Input", async ({ page }) => {

  await test.step('Load the form page', async () => {
    await page.goto('https://demoqa.com/automation-practice-form',{
    waitUntil: 'domcontentloaded',
    timeout: 3 * 60 * 1000
    });
  });

  await test.step('Check Address is Multiple Lines', async () => {
    await page.getByRole('textbox', { name: 'First Name' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill("Address");
    await page.getByRole('textbox', { name: 'Last Name' }).click();
    await page.getByRole('textbox', { name: 'Last Name' }).fill("Test");
    await page.getByRole('radio', { name: 'Male', exact: true }).check();
    await page.getByRole('textbox', { name: 'Mobile Number' }).click();
    await page.getByRole('textbox', { name: 'Mobile Number' }).fill("0000000010");
    await page.getByRole('textbox', { name: 'Current Address' }).click();

    // single line text
    await page.getByRole('textbox', { name: 'Current Address' }).fill('ddddddddd');
    await page.getByRole('button', { name: 'Submit' }).click();
    try {
      await expect(page.getByText('Thanks for submitting the form')).toBeVisible({ timeout: 500 });
    }catch (error) {
      expect.soft(true, `Address Format ( Type I Error ) : this Field single line should be Valid `).toBe(false);
    }
    await page.keyboard.press('Escape');

    // multiple line text
    await page.getByRole('textbox', { name: 'Current Address' }).fill('ddddddddd\ndddddd\ndddd');
    await page.getByRole('button', { name: 'Submit' }).click();
    try {
      await expect(page.getByText('Thanks for submitting the form')).toBeVisible({ timeout: 500 });
    }catch (error) {
      expect.soft(true, `Address Format ( Type I Error ) : this Field multiple line should be Valid `).toBe(false);
    }
    await page.keyboard.press('Escape');
    
    // Alphanumeric text valid
    await page.getByRole('textbox', { name: 'Current Address' }).fill('abcdefghigklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
    await page.getByRole('button', { name: 'Submit' }).click();
    try {
      await expect(page.getByText('Thanks for submitting the form')).toBeVisible({ timeout: 500 });
    }catch (error) {
      expect.soft(true, `Address Format ( Type I Error ) : this Field alphanumeric should be Valid `).toBe(false);
    }
    await page.keyboard.press('Escape');

    // Special characters should be invalid
    await page.getByRole('textbox', { name: 'Current Address' }).fill('!@#$%^&*()-+');
    await page.getByRole('button', { name: 'Submit' }).click();
    try {
      await expect(page.getByText('Thanks for submitting the form')).toBeHidden({ timeout: 500 });
    }catch (error) {
      expect.soft(true, `Address Format ( Type II Error ) : this Field special characters should be Invalid `).toBe(false);
      await page.keyboard.press('Escape');
    }
  });
});