#!/usr/bin/env node
/**
 * Query Runner Script for Digital Forest API
 * 
 * Usage:
 *   npx tsx scripts/run-query.ts "SELECT * FROM trees_processed LIMIT 5"
 *   npx tsx scripts/run-query.ts --example sample
 *   npx tsx scripts/run-query.ts --example findByMunicipality "תל אביב"
 */

import { runQuery, runQueryWithLogging, exampleQueries } from '../src/services/queryRunner';

// Get command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
Digital Forest API Query Runner

Usage:
  npx tsx scripts/run-query.ts "<SQL_QUERY>"
  npx tsx scripts/run-query.ts --example <example_name> [args...]
  npx tsx scripts/run-query.ts --list-examples

Examples:
  npx tsx scripts/run-query.ts "SELECT * FROM trees_processed LIMIT 5"
  npx tsx scripts/run-query.ts --example getSample 10
  npx tsx scripts/run-query.ts --example findByTreeId "8G4P4VXP+GR5V"
  npx tsx scripts/run-query.ts --example findByMunicipality "תל אביב"
  npx tsx scripts/run-query.ts --example countBySpecies

Available Example Queries:
  - getSample(limit)
  - findByTreeId(treeId)
  - findByInternalId(internalId)
  - findByMunicipality(municipality)
  - findByRegion(region)
  - findBySpecies(species)
  - findByGenus(genus)
  - findWithPhotos()
  - findWithMeasurements()
  - findBySourceType(sourceType)
  - findByCollectionType(collectionType)
  - findByDataSource(sourceName)
  - findByBoundingBox(minLat, maxLat, minLon, maxLon)
  - findByRoad(roadName)
  - findByParcel(cadCode)
  - findWithHealthScore(minScore?)
  - countByMunicipality()
  - countBySpecies()
  - countByRegion()
  - recentDataSources(days)
  - findWithAddress()
  - searchSpecies(searchTerm)
`);
  process.exit(0);
}

async function main() {
  try {
    if (args[0] === '--list-examples') {
      console.log('Available example queries:');
      Object.keys(exampleQueries).forEach(key => {
        console.log(`  - ${key}`);
      });
      return;
    }

    let sql: string;

    if (args[0] === '--example') {
      const exampleName = args[1];
      const exampleArgs = args.slice(2);

      if (!(exampleName in exampleQueries)) {
        console.error(`Unknown example: ${exampleName}`);
        console.error(`Available examples: ${Object.keys(exampleQueries).join(', ')}`);
        process.exit(1);
      }

      const exampleFn = (exampleQueries as any)[exampleName];
      
      // Handle different example functions
      switch (exampleName) {
        case 'getSample':
          sql = exampleFn(exampleArgs[0] ? parseInt(exampleArgs[0]) : 10);
          break;
        case 'findByTreeId':
        case 'findByInternalId':
        case 'findByMunicipality':
        case 'findByRegion':
        case 'findBySpecies':
        case 'findByGenus':
        case 'findBySourceType':
        case 'findByCollectionType':
        case 'findByDataSource':
        case 'findByRoad':
        case 'findByParcel':
        case 'searchSpecies':
          if (!exampleArgs[0]) {
            console.error(`Example ${exampleName} requires an argument`);
            process.exit(1);
          }
          sql = exampleFn(exampleArgs[0]);
          break;
        case 'findByBoundingBox':
          if (exampleArgs.length < 4) {
            console.error('findByBoundingBox requires 4 arguments: minLat maxLat minLon maxLon');
            process.exit(1);
          }
          sql = exampleFn(
            parseFloat(exampleArgs[0]),
            parseFloat(exampleArgs[1]),
            parseFloat(exampleArgs[2]),
            parseFloat(exampleArgs[3])
          );
          break;
        case 'findWithHealthScore':
          sql = exampleFn(exampleArgs[0] ? parseFloat(exampleArgs[0]) : undefined);
          break;
        case 'recentDataSources':
          sql = exampleFn(exampleArgs[0] ? parseInt(exampleArgs[0]) : 30);
          break;
        case 'findWithPhotos':
        case 'findWithMeasurements':
        case 'countByMunicipality':
        case 'countBySpecies':
        case 'countByRegion':
        case 'findWithAddress':
          sql = exampleFn();
          break;
        default:
          console.error(`Example ${exampleName} not yet supported in CLI`);
          process.exit(1);
      }
    } else {
      // Direct SQL query
      sql = args.join(' ');
    }

    // Run the query with logging
    const results = await runQueryWithLogging(sql);

    // If results are empty, show a message
    if (results.length === 0) {
      console.log('No results found.');
    } else if (results.length > 1) {
      console.log(`\nShowing first ${Math.min(5, results.length)} of ${results.length} results:`);
      results.slice(0, 5).forEach((row, index) => {
        console.log(`\n--- Result ${index + 1} ---`);
        console.log(JSON.stringify(row, null, 2));
      });
      if (results.length > 5) {
        console.log(`\n... and ${results.length - 5} more results`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();

