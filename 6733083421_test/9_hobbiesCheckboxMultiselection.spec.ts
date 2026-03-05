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

  await test.step('Check Hobbies checkbox : check and uncheck', async () => {
    await page.getByRole('textbox', { name: 'First Name' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill("Hobbies");
    await page.getByRole('textbox', { name: 'Last Name' }).click();
    await page.getByRole('textbox', { name: 'Last Name' }).fill("Test");
    await page.getByRole('radio', { name: 'Male', exact: true }).check();
    await page.getByRole('textbox', { name: 'Mobile Number' }).click();
    await page.getByRole('textbox', { name: 'Mobile Number' }).fill("0000000019");
    await page.getByRole('checkbox', { name: 'Sports' }).check();
    await page.getByRole('checkbox', { name: 'Sports' }).uncheck();
    await page.getByRole('checkbox', { name: 'Reading' }).check();
    await page.getByRole('checkbox', { name: 'Reading' }).uncheck();
    await page.getByRole('checkbox', { name: 'Music' }).check();
    await page.getByRole('checkbox', { name: 'Music' }).uncheck();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('tbody')).not.toContainText('Sports');
    await expect(page.locator('tbody')).not.toContainText('Reading');
    await expect(page.locator('tbody')).not.toContainText('Music');
    await page.keyboard.press('Escape');
  });

  await test.step('Check Hobbies Checkbox : Selection 1', async () => {
    // Sports
    await page.getByRole('checkbox', { name: 'Sports' }).check();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('tbody')).toContainText('Sports');
    await expect(page.locator('tbody')).not.toContainText('Reading');
    await expect(page.locator('tbody')).not.toContainText('Music');
    await page.keyboard.press('Escape');
    await page.getByRole('checkbox', { name: 'Sports' }).uncheck();
    // Reading
    await page.getByRole('checkbox', { name: 'Reading' }).check();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('tbody')).toContainText('Reading');
    await expect(page.locator('tbody')).not.toContainText('Sports');
    await expect(page.locator('tbody')).not.toContainText('Music');
    await page.keyboard.press('Escape');
    await page.getByRole('checkbox', { name: 'Reading' }).uncheck();
    // Music
    await page.getByRole('checkbox', { name: 'Music' }).check();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('tbody')).toContainText('Music');
    await expect(page.locator('tbody')).not.toContainText('Sports');
    await expect(page.locator('tbody')).not.toContainText('Reading');
    await page.keyboard.press('Escape');
    await page.getByRole('checkbox', { name: 'Music' }).uncheck();
  });
  
  await test.step('Check Hobbies Checkbox : Selection 2', async () => {
    // Sports and Reading
    await page.getByRole('checkbox', { name: 'Sports' }).check();
    await page.getByRole('checkbox', { name: 'Reading' }).check();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('tbody')).toContainText('Sports');
    await expect(page.locator('tbody')).toContainText('Reading');
    await expect(page.locator('tbody')).not.toContainText('Music');
    await page.keyboard.press('Escape');
    await page.getByRole('checkbox', { name: 'Reading' }).uncheck();
    // Sports and Music
    await page.getByRole('checkbox', { name: 'Music' }).check();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('tbody')).toContainText('Sports');
    await expect(page.locator('tbody')).toContainText('Music');
    await expect(page.locator('tbody')).not.toContainText('Reading');
    await page.keyboard.press('Escape');
    await page.getByRole('checkbox', { name: 'Sports' }).uncheck();
    // Reading and Music
    await page.getByRole('checkbox', { name: 'Reading' }).check();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('tbody')).toContainText('Reading');
    await expect(page.locator('tbody')).toContainText('Music');
    await expect(page.locator('tbody')).not.toContainText('Sports');
    await page.keyboard.press('Escape');
    await page.getByRole('checkbox', { name: 'Reading' }).uncheck();
    await page.getByRole('checkbox', { name: 'Music' }).uncheck();
  });

  await test.step('Check Hobbies Checkbox : Selection 3', async () => {
    await page.getByRole('checkbox', { name: 'Sports' }).check();
    await page.getByRole('checkbox', { name: 'Reading' }).check();
    await page.getByRole('checkbox', { name: 'Music' }).check();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('tbody')).toContainText('Sports');
    await expect(page.locator('tbody')).toContainText('Reading');
    await expect(page.locator('tbody')).toContainText('Music');
    await page.keyboard.press('Escape');
  });
});