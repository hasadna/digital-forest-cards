#!/usr/bin/env node
/**
 * Export CSV with one example tree from each municipality where meta-internal-id is not None
 * and does not start with "canopy"
 */

import { runQuery } from '../src/services/queryRunner';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Convert a row object to CSV format
 */
function objectToCSVRow(obj: Record<string, any>): string {
  return Object.values(obj)
    .map(value => {
      if (value === null || value === undefined) {
        return '';
      }
      const str = String(value);
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    })
    .join(',');
}

/**
 * Convert array of objects to CSV string
 */
function arrayToCSV(data: Record<string, any>[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const headerRow = headers.join(',');
  const dataRows = data.map(row => objectToCSVRow(row));
  
  return [headerRow, ...dataRows].join('\n');
}

async function main() {
  try {
    console.log('Fetching one example tree from each municipality with internal ID (excluding canopy IDs)...');
    
    // Query to get one tree per municipality where meta-internal-id is not None
    // and does not start with "canopy"
    // Using a subquery with ROW_NUMBER() to get one example per municipality
    const sql = `
      SELECT *
      FROM (
        SELECT *,
               ROW_NUMBER() OVER (PARTITION BY "muni_name" ORDER BY "meta-tree-id") as rn
        FROM trees_processed
        WHERE "meta-internal-id" IS NOT NULL 
          AND "meta-internal-id" != 'None' 
          AND "meta-internal-id" != ''
          AND "muni_name" IS NOT NULL
          AND NOT "meta-internal-id" LIKE 'canopy%'
      ) ranked
      WHERE rn = 1
      ORDER BY "muni_name"
    `;
    
    console.log('Executing query...');
    const results = await runQuery(sql, 10000);
    
    if (results.length === 0) {
      console.log('No results found.');
      return;
    }
    
    console.log(`Found ${results.length} municipalities with example trees`);
    
    // Remove the temporary 'rn' column if it exists
    const cleanedResults = results.map(({ rn, ...rest }) => rest);
    
    // Convert to CSV
    const csv = arrayToCSV(cleanedResults);
    
    // Save to file
    const outputPath = join(process.cwd(), 'municipality-examples-no-canopy.csv');
    writeFileSync(outputPath, csv, 'utf-8');
    
    console.log(`\nCSV file saved to: ${outputPath}`);
    console.log(`Total rows: ${results.length}`);
    console.log(`\nFirst few municipalities:`);
    results.slice(0, 5).forEach((row, i) => {
      console.log(`  ${i + 1}. ${row['muni_name']} (Tree ID: ${row['meta-tree-id']}, Internal ID: ${row['meta-internal-id']})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();


