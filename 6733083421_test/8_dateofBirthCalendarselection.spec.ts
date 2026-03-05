import { test, expect } from "@playwright/test";

test.describe.configure({ mode: 'serial' });

test.setTimeout( 3 *60 * 1000);

const today = new Date();
const options = { day: '2-digit', month: 'short', year: 'numeric' } as const;
const formattedToday = today.toLocaleDateString('en-GB', options);

test("Test Date of Birth Calendar Selection", async ({ page }) => {

  await test.step('Load the form page', async () => {
    await page.goto('https://demoqa.com/automation-practice-form',{
    waitUntil: 'domcontentloaded',
    timeout: 3 * 60 * 1000
    });
  });
  await test.step('Check Date of Birth Default Is Today', async () => {
    await expect(page.locator('#dateOfBirthInput')).toHaveValue(formattedToday);
  });

  await test.step('Check Date of Birth Calendar Selectpast', async () => {
    await page.getByRole('textbox', { name: 'First Name' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill("DateofBirth");
    await page.getByRole('textbox', { name: 'Last Name' }).click();
    await page.getByRole('textbox', { name: 'Last Name' }).fill("Test");
    await page.getByRole('radio', { name: 'Male', exact: true }).check();
    await page.getByRole('textbox', { name: 'Mobile Number' }).click();
    await page.getByRole('textbox', { name: 'Mobile Number' }).fill("0000000018");
    await page.locator('#dateOfBirthInput').click();
    await page.getByRole('combobox').nth(0).selectOption('January');
    await page.getByRole('combobox').nth(1).selectOption('1977');
    await page.getByRole('gridcell', { name: 'Choose Saturday, January 1st,' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('tbody')).toContainText('01 January,1977');
    await page.keyboard.press('Escape');
  });

  await test.step('Check Date of Birth Calendar SelectFuture', async () => {
    await page.getByRole('textbox', { name: 'First Name' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill("Address");
    await page.getByRole('textbox', { name: 'Last Name' }).click();
    await page.getByRole('textbox', { name: 'Last Name' }).fill("Test");
    await page.getByRole('radio', { name: 'Male', exact: true }).check();
    await page.getByRole('textbox', { name: 'Mobile Number' }).click();
    await page.getByRole('textbox', { name: 'Mobile Number' }).fill("0000000018");
    await page.locator('#dateOfBirthInput').click();
    await page.getByRole('combobox').nth(0).selectOption('March');
    await page.getByRole('combobox').nth(1).selectOption('2100');
    await page.getByRole('gridcell', { name: 'Choose Monday, March 1st,' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    if ((await page.locator('tbody').textContent())?.includes('01 March,2100')) {
      console.warn(`[warning] Date of Birth Calendar Selection: Future date should be Invalid `);
      test.info().annotations.push({
        type: 'warning',
        description: 'Date of Birth Calendar Selection: Future date should be Invalid'
      });
      expect.soft(true, `[warning] Date of Birth Calendar Selection: Future date should be Invalid `).toBe(false);
    }
  });
});