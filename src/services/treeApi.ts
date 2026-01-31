const API_BASE_URL = "https://api.digital-forest.org.il/api/query";

export interface TreeApiResponse {
  rows: TreeRow[];
}

export interface TreeRow {
  "meta-tree-id": string;
  "attributes-species-clean-he"?: string;
  "attributes-species-clean-en"?: string;
  "attributes-genus"?: string;
  "attributes-bark-diameter"?: number;
  "attributes-height"?: number;
  "attributes-canopy-area"?: number;
  "attributes-canopy-diameter"?: number;
  "attributes-age-estimated"?: string;
  "attributes-num-barks"?: number;
  "attributes-health-score"?: number;
  "attributes-good-status"?: string;
  "muni_name"?: string;
  "muni_region"?: string;
  "road_name"?: string;
  "cad_code"?: string;
  "location-x"?: number;
  "location-y"?: number;
  "location-address"?: string;
  "environment-type"?: string;
  "meta-internal-id"?: string;
  "photos-general"?: string;
  "meta-source"?: string;
  "meta-date"?: string;
  "meta-collection-type"?: string;
  "meta-source-type"?: string;
}

export const fetchTreeData = async (
  searchValue: string,
  searchType: "tree-id" | "internal-id" = "tree-id"
): Promise<TreeRow[]> => {
  // Create the SQL query based on search type
  const sql =
    searchType === "tree-id"
      ? `SELECT * FROM trees_processed WHERE "meta-tree-id" = '${searchValue}'`
      : `SELECT * FROM trees_processed WHERE "meta-internal-id" = '${searchValue}'`;
  
  // Encode the query in base64
  const encodedQuery = btoa(sql);
  
  // Build the API URL
  const url = `${API_BASE_URL}?query=${encodedQuery}&num_rows=1000`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: TreeApiResponse = await response.json();
    
    // Return all rows (there may be multiple sources for the same tree)
    if (data.rows && data.rows.length > 0) {
      return data.rows;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching tree data:", error);
    throw error;
  }
};

const escapeSqlLiteral = (value: string) => value.replace(/'/g, "''");

export const fetchTreeDataByTreeIds = async (treeIds: string[]): Promise<TreeRow[]> => {
  if (!treeIds || treeIds.length === 0) return [];
  const uniqueIds = Array.from(new Set(treeIds));
  const inClause = uniqueIds.map((id) => `'${escapeSqlLiteral(id)}'`).join(", ");
  const sql = `SELECT * FROM trees_processed WHERE "meta-tree-id" IN (${inClause})`;
  const encodedQuery = btoa(sql);
  const url = `${API_BASE_URL}?query=${encodedQuery}&num_rows=1000`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: TreeApiResponse = await response.json();
    return data.rows ?? [];
  } catch (error) {
    console.error("Error fetching tree data by ids:", error);
    throw error;
  }
};

// Group tree rows by meta-tree-id (to handle multiple municipalities)
export const groupByTreeId = (rows: TreeRow[]) => {
  const grouped = new Map<string, TreeRow[]>();
  
  for (const row of rows) {
    const treeId = row["meta-tree-id"];
    if (!grouped.has(treeId)) {
      grouped.set(treeId, []);
    }
    grouped.get(treeId)!.push(row);
  }
  
  return Array.from(grouped.entries()).map(([treeId, rows]) => ({
    treeId,
    rows,
    municipality: rows[0]["muni_name"] || "לא ידוע",
  }));
};

export const transformTreeData = (apiDataRows: TreeRow[]) => {
  if (!apiDataRows || apiDataRows.length === 0) return null;

  // Merge data from all rows (different sources may have different fields)
  const mergedData: Partial<TreeRow> & { "meta-tree-id": string } = {
    "meta-tree-id": apiDataRows[0]["meta-tree-id"]
  };

  // Collect data sources and internal IDs from all rows
  const dataSources: Array<{ name: string; date: string }> = [];
  const internalIds: string[] = [];
  
  for (const row of apiDataRows) {
    // Merge fields, preferring non-null values
    for (const key in row) {
      if (row[key as keyof TreeRow] !== null && row[key as keyof TreeRow] !== undefined) {
        if (!mergedData[key as keyof typeof mergedData]) {
          (mergedData as any)[key] = row[key as keyof TreeRow];
        }
      }
    }

    // Collect data sources
    if (row["meta-source"] && row["meta-date"]) {
      dataSources.push({
        name: row["meta-source"],
        date: row["meta-date"]
      });
    }

    // Collect internal IDs
    if (row["meta-internal-id"]) {
      internalIds.push(row["meta-internal-id"]);
    }
  }

  // Format coordinates
  let coordinates: string | undefined;
  if (mergedData["location-y"] && mergedData["location-x"]) {
    const y = Number(mergedData["location-y"]);
    const x = Number(mergedData["location-x"]);
    if (!isNaN(y) && !isNaN(x)) {
      coordinates = `${y.toFixed(6)}, ${x.toFixed(6)}`;
    }
  }

  // Determine status - if any field has species info, it's identified
  const hasSpecies = !!mergedData["attributes-species-clean-he"];

  return {
    id: mergedData["meta-tree-id"],
    metaDate: mergedData["meta-date"],
    species: mergedData["attributes-species-clean-he"],
    speciesEnglish: mergedData["attributes-species-clean-en"],
    genus: mergedData["attributes-genus"],
    trunkDiameter: mergedData["attributes-bark-diameter"],
    height: mergedData["attributes-height"],
    canopyArea: mergedData["attributes-canopy-area"],
    crownDiameter: mergedData["attributes-canopy-diameter"],
    numTrunks: mergedData["attributes-num-barks"],
    healthScore: mergedData["attributes-health-score"],
    goodStatus: mergedData["attributes-good-status"],
    ageEstimated: mergedData["attributes-age-estimated"] === "true",
    municipality: mergedData["muni_name"],
    street: mergedData["road_name"],
    fullAddress: mergedData["location-address"],
    parcel: mergedData["cad_code"],
    coordinates,
    treeSpace: mergedData["environment-type"],
    collectionType: mergedData["meta-collection-type"],
    sourceType: mergedData["meta-source-type"],
    internalIds: internalIds.length > 0 ? internalIds : undefined,
    photoUrl: mergedData["photos-general"],
    dataSources: dataSources.length > 0 ? dataSources : undefined,
    status: (hasSpecies ? "identified" : "suspected") as "identified" | "suspected",
  };
};

