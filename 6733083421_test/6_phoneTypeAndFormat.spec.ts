import fs from 'fs';
import path from 'path';
import { test, expect } from "@playwright/test";
import { parse } from 'csv-parse/sync';

const phonePath = path.join(__dirname, './testData/testPhone.csv');
const phoneRecords = parse(fs.readFileSync(phonePath), {
  columns: true,
  skip_empty_lines: true,
});

let tenPhoneNumber: string = "0000000000";
test.describe.configure({ mode: 'serial' });

test.setTimeout( 3 *60 * 1000);

test("Test Phone Number Input", async ({ page }) => {

  await test.step('Load the form page', async () => {
    await page.goto('https://demoqa.com/automation-practice-form',{
    waitUntil: 'domcontentloaded',
    timeout: 3 * 60 * 1000
    });
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
});