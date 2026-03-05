import { test, expect } from "@playwright/test";

test.describe.configure({ mode: 'serial' });

test.setTimeout( 3 *60 * 1000);

test("Test Picture File Upload (JPG/PNG)", async ({ page }) => {

  await test.step('Load the form page', async () => {
    await page.goto('https://demoqa.com/automation-practice-form',{
    waitUntil: 'domcontentloaded',
    timeout: 3 * 60 * 1000
    });
  });

  await test.step('Check Picture File Upload : png ( Valid )', async () => {
    await page.getByRole('textbox', { name: 'First Name' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill("Picture");
    await page.getByRole('textbox', { name: 'Last Name' }).click();
    await page.getByRole('textbox', { name: 'Last Name' }).fill("Test");
    await page.getByRole('radio', { name: 'Male', exact: true }).check();
    await page.getByRole('textbox', { name: 'Mobile Number' }).click();
    await page.getByRole('textbox', { name: 'Mobile Number' }).fill("0000000019");
    await page.getByRole('button', { name: 'Choose File' }).setInputFiles( "./testdata/TestPicture.png");
    await expect(page.getByRole('button', { name: 'Choose File' })).toHaveValue(/TestPicture.png/);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('cell', { name: 'TestPicture.png' })).toBeVisible();
    await page.keyboard.press('Escape');
  });

  await test.step('Check Picture File Upload : jpg ( Valid )', async () => {
    await page.getByRole('button', { name: 'Choose File' }).setInputFiles( "./testdata/TestPicture.jpg");
    await expect(page.getByRole('button', { name: 'Choose File' })).toHaveValue(/TestPicture.jpg/);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('cell', { name: 'TestPicture.jpg' })).toBeVisible();
    await page.keyboard.press('Escape');
  });

  await test.step('Check Picture File Upload : txt ( Invalid )', async () => {
    await page.getByRole('button', { name: 'Choose File' }).setInputFiles( "./testdata/TestPicture.txt");
    await expect(page.getByRole('button', { name: 'Choose File' })).toHaveValue(/TestPicture.txt/);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('cell', { name: 'TestPicture.txt' })).toBeHidden();
    await page.keyboard.press('Escape');
  });
});