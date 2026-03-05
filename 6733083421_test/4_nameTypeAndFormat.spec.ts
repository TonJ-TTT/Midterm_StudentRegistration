import fs from 'fs';
import path from 'path';
import { test, expect } from "@playwright/test";
import { parse } from 'csv-parse/sync';

const alphabeticPath = path.join(__dirname, './testdata/testAlphabetic.csv');
const alphabeticRecords = parse(fs.readFileSync(alphabeticPath), {
  columns: true,
  skip_empty_lines: true,
});

test.describe.configure({ mode: 'serial' });

test.setTimeout( 3 *60 * 1000);

test("Test First Name and Last Name Input", async ({ page }) => {

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
});