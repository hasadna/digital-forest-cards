import type { TreeRow, TreeApiResponse } from './treeApi';

const API_BASE_URL = "https://api.digital-forest.org.il/api/query";

/**
 * Execute a raw SQL query against the Digital Forest API
 * @param sql - SQL query string
 * @param numRows - Maximum number of rows to return (default: 1000)
 * @returns Promise with array of TreeRow results
 */
export const runQuery = async (
  sql: string,
  numRows: number = 1000
): Promise<TreeRow[]> => {
  // Encode the query in base64
  const encodedQuery = btoa(sql);
  
  // Build the API URL
  const url = `${API_BASE_URL}?query=${encodedQuery}&num_rows=${numRows}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data: TreeApiResponse = await response.json();
    
    return data.rows || [];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

/**
 * Example queries based on API_FIELDS.md documentation
 */
export const exampleQueries = {
  /**
   * Find trees by tree ID
   */
  findByTreeId: (treeId: string) => 
    `SELECT * FROM trees_processed WHERE "meta-tree-id" = '${treeId}'`,

  /**
   * Find trees by internal ID
   */
  findByInternalId: (internalId: string) => 
    `SELECT * FROM trees_processed WHERE "meta-internal-id" = '${internalId}'`,

  /**
   * Find trees by municipality
   */
  findByMunicipality: (municipality: string) => 
    `SELECT * FROM trees_processed WHERE "muni_name" = '${municipality}'`,

  /**
   * Find trees by region
   */
  findByRegion: (region: string) => 
    `SELECT * FROM trees_processed WHERE "muni_region" = '${region}'`,

  /**
   * Find trees by species (Hebrew)
   */
  findBySpecies: (species: string) => 
    `SELECT * FROM trees_processed WHERE "attributes-species-clean-he" = '${species}'`,

  /**
   * Find trees by genus
   */
  findByGenus: (genus: string) => 
    `SELECT * FROM trees_processed WHERE "attributes-genus" = '${genus}'`,

  /**
   * Find trees with photos
   */
  findWithPhotos: () => 
    `SELECT * FROM trees_processed WHERE "photos-general" IS NOT NULL AND "photos-general" != ''`,

  /**
   * Find trees with measurements (diameter and height)
   */
  findWithMeasurements: () => 
    `SELECT * FROM trees_processed WHERE "attributes-bark-diameter" IS NOT NULL AND "attributes-height" IS NOT NULL`,

  /**
   * Find trees by source type
   */
  findBySourceType: (sourceType: string) => 
    `SELECT * FROM trees_processed WHERE "meta-source-type" = '${sourceType}'`,

  /**
   * Find trees by collection type
   */
  findByCollectionType: (collectionType: string) => 
    `SELECT * FROM trees_processed WHERE "meta-collection-type" = '${collectionType}'`,

  /**
   * Find trees by data source name
   */
  findByDataSource: (sourceName: string) => 
    `SELECT * FROM trees_processed WHERE "meta-source" = '${sourceName}'`,

  /**
   * Find trees in a bounding box (lat/lon)
   */
  findByBoundingBox: (
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number
  ) => 
    `SELECT * FROM trees_processed WHERE "location-y" >= ${minLat} AND "location-y" <= ${maxLat} AND "location-x" >= ${minLon} AND "location-x" <= ${maxLon}`,

  /**
   * Find trees by road name
   */
  findByRoad: (roadName: string) => 
    `SELECT * FROM trees_processed WHERE "road_name" = '${roadName}'`,

  /**
   * Find trees by cadastral parcel code
   */
  findByParcel: (cadCode: string) => 
    `SELECT * FROM trees_processed WHERE "cad_code" = '${cadCode}'`,

  /**
   * Find trees with health score
   */
  findWithHealthScore: (minScore?: number) => 
    minScore !== undefined
      ? `SELECT * FROM trees_processed WHERE "attributes-health-score" >= ${minScore}`
      : `SELECT * FROM trees_processed WHERE "attributes-health-score" IS NOT NULL`,

  /**
   * Count trees by municipality
   */
  countByMunicipality: () => 
    `SELECT "muni_name", COUNT(*) as count FROM trees_processed GROUP BY "muni_name" ORDER BY count DESC`,

  /**
   * Count trees by species
   */
  countBySpecies: () => 
    `SELECT "attributes-species-clean-he", COUNT(*) as count FROM trees_processed WHERE "attributes-species-clean-he" IS NOT NULL GROUP BY "attributes-species-clean-he" ORDER BY count DESC`,

  /**
   * Count trees by region
   */
  countByRegion: () => 
    `SELECT "muni_region", COUNT(*) as count FROM trees_processed GROUP BY "muni_region" ORDER BY count DESC`,

  /**
   * Get recent data sources
   */
  recentDataSources: (days: number = 30) => 
    `SELECT DISTINCT "meta-source", "meta-date" FROM trees_processed WHERE "meta-date" >= CURRENT_DATE - INTERVAL '${days}' DAY ORDER BY "meta-date" DESC`,

  /**
   * Find trees with full address
   */
  findWithAddress: () => 
    `SELECT * FROM trees_processed WHERE "location-address" IS NOT NULL AND "location-address" != ''`,

  /**
   * Search trees by partial species name
   */
  searchSpecies: (searchTerm: string) => 
    `SELECT * FROM trees_processed WHERE "attributes-species-clean-he" ILIKE '%${searchTerm}%' OR "attributes-species-clean-en" ILIKE '%${searchTerm}%'`,

  /**
   * Get sample trees (for testing)
   */
  getSample: (limit: number = 10) => 
    `SELECT * FROM trees_processed LIMIT ${limit}`,
};

/**
 * Helper function to safely escape SQL strings (basic protection)
 * Note: For production use, consider using parameterized queries if the API supports them
 */
export const escapeSqlString = (value: string): string => {
  return value.replace(/'/g, "''");
};

/**
 * Run a query and log results
 */
export const runQueryWithLogging = async (
  sql: string,
  numRows: number = 1000
): Promise<TreeRow[]> => {
  console.log('Executing query:');
  console.log(sql);
  console.log('---');
  
  const startTime = Date.now();
  const results = await runQuery(sql, numRows);
  const duration = Date.now() - startTime;
  
  console.log(`Query completed in ${duration}ms`);
  console.log(`Returned ${results.length} rows`);
  console.log('---');
  
  if (results.length > 0) {
    console.log('Sample result (first row):');
    console.log(JSON.stringify(results[0], null, 2));
  }
  
  return results;
};

/**
 * Run multiple queries sequentially
 */
export const runQueries = async (
  queries: string[],
  numRows: number = 1000
): Promise<TreeRow[][]> => {
  const results: TreeRow[][] = [];
  
  for (const sql of queries) {
    const result = await runQuery(sql, numRows);
    results.push(result);
  }
  
  return results;
};

// If running as a script (e.g., with tsx or ts-node)
if (import.meta.url === `file://${process.argv[1]}`) {
  // Example usage
  const example = async () => {
    try {
      // Example 1: Get a sample of trees
      console.log('Example 1: Getting sample trees');
      const sample = await runQueryWithLogging(exampleQueries.getSample(5));
      
      // Example 2: Count by municipality
      console.log('\nExample 2: Counting trees by municipality');
      const counts = await runQuery(exampleQueries.countByMunicipality());
      console.log(JSON.stringify(counts.slice(0, 5), null, 2));
      
    } catch (error) {
      console.error('Error running examples:', error);
    }
  };
  
  example();
}

