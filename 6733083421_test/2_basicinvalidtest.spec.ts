import fs from 'fs';
import path from 'path';
import { test, expect } from "@playwright/test";
import { parse } from 'csv-parse/sync';

const records = parse(fs.readFileSync(path.join(__dirname, '.\\testData\\missingFields.csv')), {
  columns: true,
  skip_empty_lines: true,
});

const mandatoryFields = [ 'Gender' , 'First Name', 'Last Name' , 'Mobile Number' ];

test.setTimeout( 3 *60 * 1000);

test("Invalid test by leaving each mandatory field empty", async ({ page }) => {

  await test.step('Load the form page', async () => {
    await page.goto('https://demoqa.com/automation-practice-form',{
    waitUntil: 'domcontentloaded',
    timeout: 3 * 60 * 1000
    });
  });
  
  let i = 0;

  for ( const record of records as any) {
    await test.step(`Fill form with out : ${mandatoryFields[i]}`, async () => {
      await page.getByRole('textbox', { name: 'First Name' }).click();
      await page.getByRole('textbox', { name: 'First Name' }).fill(record.First_Name);
      await page.getByRole('textbox', { name: 'Last Name' }).click();
      await page.getByRole('textbox', { name: 'Last Name' }).fill(record.Last_Name);
      if( i != 0 ){
        await page.getByRole('radio', { name: record.Gender, exact: true }).check();
      }
      await page.getByRole('textbox', { name: 'Mobile Number' }).click();
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill(record.Mobile);
      await page.getByRole('button', { name: 'Submit' }).click();
      await expect(page.getByText('Thanks for submitting the form')).toBeHidden();
      if ( i != 0){
        await expect(page.getByRole('textbox', { name: mandatoryFields[i] })).toBeEmpty();
      }else{
        await expect(page.getByRole('radio', { name: 'Male', exact: true })).not.toBeChecked();
        await expect(page.getByRole('radio', { name: 'Female', exact: true })).not.toBeChecked();
        await expect(page.getByRole('radio', { name: 'Other', exact: true })).not.toBeChecked();
      }
      i++ ;
    });
  }
});