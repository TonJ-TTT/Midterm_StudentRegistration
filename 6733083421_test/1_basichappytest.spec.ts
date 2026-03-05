import fs from 'fs';
import path from 'path';
import { test, expect } from "@playwright/test";
import { parse } from 'csv-parse/sync';

const records = parse(fs.readFileSync(path.join(__dirname, '.\\testData\\mandatoryFields.csv')), {
  columns: true,
  skip_empty_lines: true,
});

let isCloseButtonBroken: boolean = false;
test.describe.configure({ mode: 'serial' });

test.setTimeout( 3 *60 * 1000);

test("1. Only mandatory fields( valid data )", async ({ page }) => {

  await test.step('Fill mandatory fields and submit form', async () => {
    await page.goto('https://demoqa.com/automation-practice-form',{
    waitUntil: 'domcontentloaded',
    timeout: 3 * 60 * 1000
    });
  });
  
  for ( const record of records as any) {
    await test.step(`Fill form with data: ${record.First_Name}`, async () => {
      await page.getByRole('textbox', { name: 'First Name' }).click();
      await page.getByRole('textbox', { name: 'First Name' }).fill(record.First_Name);
      await page.getByRole('textbox', { name: 'Last Name' }).click();
      await page.getByRole('textbox', { name: 'Last Name' }).fill(record.Last_Name);
      await page.getByRole('textbox', { name: 'name@example.com' }).click();
      await page.getByRole('textbox', { name: 'name@example.com' }).fill(record.Email);
      await page.getByRole('radio', { name: record.Gender, exact: true }).check();
      await page.getByRole('textbox', { name: 'Mobile Number' }).click();
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill(record.Mobile);
      await page.getByRole('button', { name: 'Submit' }).click();
      await expect(page.getByText('Thanks for submitting the form')).toBeVisible();
      await expect(page.getByRole('cell', { name: record.First_Name + ' ' + record.Last_Name })).toBeVisible();
      await expect(page.getByRole('cell', { name: record.Gender }).nth(2)).toBeVisible();
      await expect(page.getByRole('cell', { name: record.Email })).toBeVisible();
      await expect(page.getByRole('cell', { name: record.Mobile })).toBeVisible();

      if (isCloseButtonBroken) {
        await page.keyboard.press('Escape');
      }else {
        try {
          await page.getByRole('button', { name: 'Close' }).click({ force: true });
          await expect(page.getByRole('button', { name: 'Close' })).toBeHidden({ timeout: 5000 });
          await expect(page.getByRole('textbox', { name: 'First Name' })).toBeEmpty();
        }catch (error) {
          isCloseButtonBroken = true;
          test.info().annotations.push({
            type: 'Issue',
            description: 'Close Modal: Close button went wrong'
          });
          await page.keyboard.press('Escape');
        }
      }
    });
  }
});

test("2. Full fill test case( valid data )", async ({ page }) => {
  await test.step('Load the form page', async () => {
    await page.goto('https://demoqa.com/automation-practice-form',{
    waitUntil: 'domcontentloaded',
    timeout: 3 * 60 * 1000
    });
  });
  await test.step('Fill a mandatory fields', async () => {
    await page.getByRole('textbox', { name: 'First Name' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill('full');
    await page.getByRole('textbox', { name: 'Last Name' }).click();
    await page.getByRole('textbox', { name: 'Last Name' }).fill('fill');
    await page.getByRole('textbox', { name: 'name@example.com' }).click();
    await page.getByRole('textbox', { name: 'name@example.com' }).fill('happy@gmail.com');
    await page.getByRole('radio', { name: 'Male', exact: true }).check();
    await page.getByRole('textbox', { name: 'Mobile Number' }).click();
    await page.getByRole('textbox', { name: 'Mobile Number' }).fill('0000000004');
  });
  await test.step('Select date of birth', async () => {
    await page.locator('#dateOfBirthInput').click();
    await page.getByRole('combobox').nth(0).selectOption('January');
    await page.getByRole('combobox').nth(1).selectOption('2007');
    await page.getByRole('gridcell', { name: 'Choose Monday, January 1st,' }).click();
  });
  await test.step('Select subjects', async () => {
    // complete subjects test in this test file
    await page.locator('.subjects-auto-complete__input-container').click();
    await page.locator('#subjectsInput').fill('m');
    await page.getByRole('option', { name: 'Maths' }).click();
    await page.locator('.subjects-auto-complete__input-container').click();
    await page.locator('#subjectsInput').fill('c');
    await page.getByRole('option', { name: 'Chemistry' }).click();
    await page.locator('#subjectsInput').fill('p');
    await page.getByRole('option', { name: 'Physics' }).click();
    await expect(page.getByText('Maths').first()).toBeVisible();
    await expect(page.getByText('Chemistry').first()).toBeVisible();
    await expect(page.getByText('Physics').first()).toBeVisible();
    await page.getByRole('button', { name: 'Remove Maths' }).click();
    await expect(page.locator('.subjects-auto-complete__multi-value__label').filter({ hasText: 'Maths' })).toBeHidden();
  });
  await test.step('Select hobbies', async () => {
    await page.getByRole('checkbox', { name: 'Sports' }).check();
    await page.getByRole('checkbox', { name: 'Reading' }).check();
  });
  await test.step('Upload picture', async () => {
    // select file to upload
    await page.getByRole('button', { name: 'Choose File' }).setInputFiles( ".\\testdata\\TestPicture.png");
    await expect(page.getByRole('button', { name: 'Choose File' })).toHaveValue(/TestPicture.png/);
  });
  await test.step('Fill current address and select state and city', async () => {
    await page.getByRole('textbox', { name: 'Current Address' }).click();
    await page.getByRole('textbox', { name: 'Current Address' }).fill('Ap@1/2');
    await page.locator('div').filter({ hasText: /^Select State$/ }).nth(2).click();
    await page.getByRole('option', { name: 'NCR' }).click();
    await page.locator('div').filter({ hasText: /^Select City$/ }).nth(2).click();
    await page.getByRole('option', { name: 'Delhi' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
  });
  await test.step('Check result', async () => {
    // check result
    await expect(page.getByRole('cell', { name: 'full fill' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'happy@gmail.com' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Male' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '0000000004' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'January,2007' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Chemistry, Physics' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Sports, Reading' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'TestPicture.png' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Ap@1/' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'NCR Delhi' })).toBeVisible();
  });
  
  //exit code
  if (isCloseButtonBroken) {
        await page.keyboard.press('Escape');
      }else {
        try {
          await page.getByRole('button', { name: 'Close' }).click({ force: true });
          await expect(page.getByRole('button', { name: 'Close' })).toBeHidden({ timeout: 5000 });
          await expect(page.getByRole('textbox', { name: 'First Name' })).toBeEmpty();
        }catch (error) {
          isCloseButtonBroken = true;
          test.info().annotations.push({
            type: 'Issue',
            description: 'Close Modal: Close button went wrong'
          });
          await page.keyboard.press('Escape');
        }
      }
  // // เลือก input และระบุไฟล์ที่ต้องการ upload
  // await page.setInputFiles('input[type="file"]', ".\\testdata\\TestPicture.png");
});

test("Close Modal work?", async ({ page }) => {
  if (isCloseButtonBroken) {
    expect.soft(true, 'Close Modal: Close button went wrong, used Escape instead').toBe(false);
  }
});



