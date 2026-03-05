import fs from 'fs';
import path from 'path';
import { test, expect } from "@playwright/test";
import { parse } from 'csv-parse/sync';

const alphabeticPath = path.join(__dirname, '.\\testData\\testAlphabetic.csv');
const alphabeticRecords = parse(fs.readFileSync(alphabeticPath), {
  columns: true,
  skip_empty_lines: true,
});

const emailPath = path.join(__dirname, '.\\testData\\testEmail.csv');
const emailRecords = parse(fs.readFileSync(emailPath), {
  columns: true,
  skip_empty_lines: true,
});

const phonePath = path.join(__dirname, '.\\testData\\testPhone.csv');
const phoneRecords = parse(fs.readFileSync(phonePath), {
  columns: true,
  skip_empty_lines: true,
});


let isCloseButtonBroken: boolean = false;
let tenPhoneNumber: string = "0000000000";
test.describe.configure({ mode: 'serial' });

test.setTimeout( 3 *60 * 1000);

test("Test text input", async ({ page }) => {

  await test.step('Load the form page', async () => {
    await page.goto('https://demoqa.com/automation-practice-form',{
    waitUntil: 'domcontentloaded',
    timeout: 3 * 60 * 1000
    });
  });
  
  await test.step('Check Alphabetic Input: First Name , Last Name', async () => {
    for ( const record of alphabeticRecords as any) {
      await page.getByRole('textbox', { name: 'First Name' }).click();
      await page.getByRole('textbox', { name: 'First Name' }).fill(record.TextAlphabetic);
      await page.getByRole('textbox', { name: 'Last Name' }).click();
      await page.getByRole('textbox', { name: 'Last Name' }).fill(record.TextAlphabetic);
      await page.getByRole('radio', { name: 'Male', exact: true }).check();
      await page.getByRole('textbox', { name: 'Mobile Number' }).click();
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill("0000000000");
      await page.getByRole('button', { name: 'Submit' }).click();
      if (record.ResultType === "Valid") {
        try {
          // check Type I error ( False Positive ) : when the form reject valid input but tells user that the input is invalid.
          await expect(page.getByText('Thanks for submitting the form')).toBeVisible({ timeout: 500 });
        }catch (error) {
          expect.soft(true, `Alphabetic Type of First Name, Last Name ( Type I Error ) : ${record.TextAlphabetic} this should be ${record.ResultType} `).toBe(false);
        }
        await expect(page.getByRole('cell', { name: record.TextAlphabetic + ' ' + record.TextAlphabetic })).toBeVisible();
        await page.keyboard.press('Escape');
      }else{
        // check Type II error ( False Negative ) : when the form accept invalid input but tells user that the input is valid.
        try {
          await expect(page.getByText('Thanks for submitting the form')).toBeHidden({ timeout: 500 });
        }catch (error) {
          expect.soft(true, `Alphabetic Type of First Name, Last Name ( Type II Error ) : ${record.TextAlphabetic} this should be ${record.ResultType} `).toBe(false);
          await page.keyboard.press('Escape');
        }
      }
    }
  });

  await test.step('Check Email Format', async () => {
    for ( const record of emailRecords as any) {
      await page.getByRole('textbox', { name: 'First Name' }).click();
      await page.getByRole('textbox', { name: 'First Name' }).fill("emailTest");
      await page.getByRole('textbox', { name: 'Last Name' }).click();
      await page.getByRole('textbox', { name: 'Last Name' }).fill("emailTest");
      await page.getByRole('radio', { name: 'Male', exact: true }).check();
      await page.getByRole('textbox', { name: 'Mobile Number' }).click();
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill("0000000000");
      await page.getByRole('textbox', { name: 'name@example.com' }).click();
      await page.getByRole('textbox', { name: 'name@example.com' }).fill(record.TextEmail);
      await page.getByRole('button', { name: 'Submit' }).click();
      if (record.ResultType === "Valid") {
        try {
          // check Type I error ( False Positive ) : when the form reject valid input but tells user that the input is invalid.
          await expect(page.getByText('Thanks for submitting the form')).toBeVisible({ timeout: 500 });
        }catch (error) {
          expect.soft(true, `Email Format ( Type I Error ) : ${record.TextEmail} this should be ${record.ResultType} `).toBe(false);
        }
        await expect(page.getByRole('cell', { name: record.TextEmail })).toBeVisible();
        await page.keyboard.press('Escape');
      }else{
        // check Type II error ( False Negative ) : when the form accept invalid input but tells user that the input is valid.
        try {
          await expect(page.getByText('Thanks for submitting the form')).toBeHidden({ timeout: 500 });
        }catch (error) {
          expect.soft(true, `Email Format ( Type II Error ) : ${record.TextEmail} this should be ${record.ResultType} `).toBe(false);
          await page.keyboard.press('Escape');
        }
      }
    }
  });

  await test.step('Check Phone Number Format', async () => {
    for ( const record of phoneRecords as any) {
      await page.getByRole('textbox', { name: 'First Name' }).click();
      await page.getByRole('textbox', { name: 'First Name' }).fill("emailTest");
      await page.getByRole('textbox', { name: 'Last Name' }).click();
      await page.getByRole('textbox', { name: 'Last Name' }).fill("emailTest");
      await page.getByRole('radio', { name: 'Male', exact: true }).check();
      await page.getByRole('textbox', { name: 'Mobile Number' }).click();
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill(record.TextPhone);
      await page.getByRole('button', { name: 'Submit' }).click();
      if (record.ResultType === "Valid" || record.ResultType === "PleaseCheck") {
        if ( record.ResultType === "PleaseCheck"){
          tenPhoneNumber = record.TextPhone.substring(0, 10) ;
          try {
            // check Type I error ( False Positive ) : when the form reject valid input but tells user that the input is invalid.
            await expect(page.getByText('Thanks for submitting the form')).toBeVisible({ timeout: 500 });
          }catch (error) {
            expect.soft(true, `Phone Format ( Type I Error ) : ${tenPhoneNumber} this should be ${tenPhoneNumber} `).toBe(false);
          }
          await expect(page.getByRole('cell', { name: tenPhoneNumber })).toBeVisible();
          await page.keyboard.press('Escape');
        }else{
          try {
            // check Type I error ( False Positive ) : when the form reject valid input but tells user that the input is invalid.
            await expect(page.getByText('Thanks for submitting the form')).toBeVisible({ timeout: 500 });
          }catch (error) {
            expect.soft(true, `Phone Format ( Type I Error ) : ${record.TextPhone} this should be ${record.ResultType} `).toBe(false);
          }
          await expect(page.getByRole('cell', { name: record.TextPhone })).toBeVisible();
          await page.keyboard.press('Escape');
        }
      }else{
        // check Type II error ( False Negative ) : when the form accept invalid input but tells user that the input is valid.
        try {
          await expect(page.getByText('Thanks for submitting the form')).toBeHidden({ timeout: 500 });
        }catch (error) {
          expect.soft(true, `Phone Format ( Type II Error ) : ${record.TextPhone} this should be ${record.ResultType} `).toBe(false);
          await page.keyboard.press('Escape');
        }
      }
    }
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