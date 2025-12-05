# Query Runner for Digital Forest API

This directory contains utilities for running SQL queries against the Digital Forest API.

## Files

- `run-query.ts` - CLI script for running queries
- `../src/services/queryRunner.ts` - Core query utilities and example queries

## Installation

Make sure you have the dependencies installed:

```bash
npm install
```

## Usage

### Using npm script (recommended)

```bash
# Run a custom SQL query
npm run query "SELECT * FROM trees_processed LIMIT 5"

# Use an example query
npm run query -- --example getSample 10
npm run query -- --example findByTreeId "8G4P4VXP+GR5V"
npm run query -- --example findByMunicipality "תל אביב"

# List all available examples
npm run query -- --list-examples
```

### Using tsx directly

```bash
npx tsx scripts/run-query.ts "SELECT * FROM trees_processed LIMIT 5"
npx tsx scripts/run-query.ts --example findBySpecies "אלון"
```

## Example Queries

### Basic Queries

```bash
# Get sample trees
npm run query -- --example getSample 10

# Find by tree ID
npm run query -- --example findByTreeId "8G4P4VXP+GR5V"

# Find by internal ID
npm run query -- --example findByInternalId "3913"
```

### Location Queries

```bash
# Find by municipality
npm run query -- --example findByMunicipality "תל אביב"

# Find by region
npm run query -- --example findByRegion "מרכז"

# Find trees with addresses
npm run query -- --example findWithAddress

# Find by bounding box (minLat, maxLat, minLon, maxLon)
npm run query -- --example findByBoundingBox 32.0 32.2 34.8 35.0
```

### Species Queries

```bash
# Find by species (Hebrew)
npm run query -- --example findBySpecies "אלון"

# Find by genus
npm run query -- --example findByGenus "Quercus"

# Search species (partial match)
npm run query -- --example searchSpecies "אלון"
```

### Data Quality Queries

```bash
# Find trees with photos
npm run query -- --example findWithPhotos

# Find trees with measurements
npm run query -- --example findWithMeasurements

# Find by source type
npm run query -- --example findBySourceType "מוניציפלי"

# Find by collection type
npm run query -- --example findByCollectionType "סקר רגלי"
```

### Aggregation Queries

```bash
# Count trees by municipality
npm run query -- --example countByMunicipality

# Count trees by species
npm run query -- --example countBySpecies

# Count trees by region
npm run query -- --example countByRegion
```

### Custom SQL Queries

You can also run any custom SQL query:

```bash
# Simple query
npm run query "SELECT * FROM trees_processed WHERE \"muni_name\" = 'תל אביב' LIMIT 10"

# Complex query
npm run query "SELECT \"attributes-species-clean-he\", COUNT(*) as count FROM trees_processed WHERE \"attributes-species-clean-he\" IS NOT NULL GROUP BY \"attributes-species-clean-he\" ORDER BY count DESC LIMIT 20"
```

## Using in Code

You can also import and use the query runner in your TypeScript/JavaScript code:

```typescript
import { runQuery, exampleQueries, runQueryWithLogging } from './services/queryRunner';

// Run a custom query
const results = await runQuery('SELECT * FROM trees_processed LIMIT 5');

// Use an example query
const trees = await runQuery(exampleQueries.findByMunicipality('תל אביב'));

// Run with logging
const loggedResults = await runQueryWithLogging(exampleQueries.getSample(10));
```

## API Reference

See `src/services/queryRunner.ts` for the full API documentation.

### Main Functions

- `runQuery(sql: string, numRows?: number)` - Execute a SQL query
- `runQueryWithLogging(sql: string, numRows?: number)` - Execute with console logging
- `runQueries(queries: string[], numRows?: number)` - Run multiple queries sequentially
- `exampleQueries` - Object with pre-built example queries

## Notes

- All queries are executed against the `trees_processed` table
- Queries are base64 encoded before being sent to the API
- The API endpoint is: `https://api.digital-forest.org.il/api/query`
- Default max rows is 1000, but can be customized
- Field names with hyphens must be quoted: `"meta-tree-id"`
- String values in WHERE clauses should be single-quoted: `'תל אביב'`

## Field Reference

See `API_FIELDS.md` in the project root for a complete list of available fields and their coverage statistics.


