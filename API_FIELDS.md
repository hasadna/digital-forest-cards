# Digital Forest API Fields Documentation

Based on analysis of 100 tree records from the API endpoint: `https://api.digital-forest.org.il/api/query`

## Field Coverage Statistics

| Coverage | Field Count | Description |
|----------|-------------|-------------|
| 100% | 21 fields | Always present in data |
| 99-98% | 5 fields | Nearly always available |
| 50-99% | 1 field | Commonly available |
| 1-50% | 9 fields | Sometimes available |
| 0% | 29 fields | Reserved for future use |

---

## Fields by Category

### 📍 Meta Information (100% coverage)

| Field | Type | Description | Currently Displayed |
|-------|------|-------------|-------------------|
| `meta-tree-id` | string | Plus Code identifier (e.g., "8G4P4VXP+GR5V") | ✅ Yes |
| `meta-internal-id` | string | Internal ID from source system | ✅ Yes (in badges) |
| `meta-source` | string | Name of data source (e.g., "סקר עצים הוד השרון") | ✅ Yes |
| `meta-date` | string | Date of data collection (YYYY-MM-DD) | ✅ Yes |
| `meta-collection-type` | string | Collection method (e.g., "סקר רגלי", "חישה מרחוק") | ❌ **Should Add** |
| `meta-source-type` | string | Source type (e.g., "מוניציפלי", "ממשלתי", "פרטי") | ❌ **Should Add** |
| `meta-url` | string | Source URL (99% coverage) | ❌ Could Add |
| `_source` | string | Original file path/URL | ❌ Internal use |
| `idx` | number | Database index | ❌ Internal use |
| `cluster-size` | number | Number of data sources for this tree | ❌ Internal use |

### 🌳 Tree Attributes

| Field | Type | Coverage | Description | Currently Displayed |
|-------|------|----------|-------------|-------------------|
| `attributes-species` | string | 99% | Original species name from source | ❌ No |
| `attributes-species-clean-he` | string | 98% | Cleaned Hebrew species name | ✅ Yes |
| `attributes-species-clean-en` | string | 98% | Cleaned English species name | ❌ **Should Add** |
| `attributes-genus` | string | 98% | Genus name (scientific) | ❌ **Should Add** |
| `attributes-bark-diameter` | number | 14% | Trunk diameter in cm | ✅ Yes |
| `attributes-height` | number | 14% | Tree height in meters | ✅ Yes |
| `attributes-canopy-area` | number | 1% | Canopy area in m² | ✅ Yes |
| `attributes-canopy-diameter` | number | 0% | Canopy diameter in meters | ✅ Yes (when available) |
| `attributes-bark-circumference` | number | 0% | Trunk circumference in cm | ❌ No |
| `attributes-num-barks` | number | 0% | Number of trunks | ❌ **Should Add** |
| `attributes-age` | number | 0% | Actual age in years | ❌ No |
| `attributes-age-estimated` | string | 0% | Whether age is estimated | ✅ Yes |
| `attributes-year-planted` | number | 0% | Year planted | ❌ **Should Add** |
| `attributes-description` | string | 0% | Free text description | ❌ No |
| `attributes-health-score` | number | 0% | Health rating | ❌ **Should Add** |
| `attributes-good-status` | string | 0% | Tree condition | ❌ **Should Add** |

### 📍 Location Information

| Field | Type | Coverage | Description | Currently Displayed |
|-------|------|----------|-------------|-------------------|
| `location-x` | number | 100% | Longitude (WGS84) | ✅ Yes (in coordinates) |
| `location-y` | number | 100% | Latitude (WGS84) | ✅ Yes (in coordinates) |
| `location-x-il` | number | 100% | X coordinate (ITM - Israeli Transverse Mercator) | ❌ No |
| `location-y-il` | number | 100% | Y coordinate (ITM) | ❌ No |
| `coords` | string | 100% | JSON array "[lon, lat]" | ❌ No (parsed) |
| `location-address` | string | 85% | Full address or location description | ❌ **Should Add** |
| `location-street` | string | 15% | Street name (alt format) | ❌ No (have road_name) |
| `location-city` | string | 14% | City name | ❌ No (have muni_name) |
| `location-grid` | string | 14% | Coordinate system (e.g., "epsg:2039") | ❌ No |
| `location-street-number` | string | 2% | Street number | ❌ Could Add |
| `location-elevation` | number | 0% | Elevation in meters | ❌ No |
| `location-accuracy` | number | 0% | Location accuracy in meters | ❌ No |
| `location-block` | string | 0% | Block number | ❌ No |
| `location-plot` | string | 0% | Plot number | ❌ No |

### 🏛️ Municipality & Administrative

| Field | Type | Coverage | Description | Currently Displayed |
|-------|------|----------|-------------|-------------------|
| `muni_name` | string | 100% | Municipality name (Hebrew) | ✅ Yes |
| `muni_name_en` | string | 100% | Municipality name (English) | ❌ No |
| `muni_code` | string | 100% | Municipality code | ❌ No |
| `muni_region` | string | 100% | Region (e.g., "מרכז", "דרום", "צפון") | ❌ **Should Add** |
| `stat_area_code` | string | 100% | Statistical area code | ❌ No |
| `cad_code` | string | 100% | Cadastral parcel code "gush/parcel" | ✅ Yes |
| `cad_gush` | string | 100% | Cadastral block (gush) | ❌ No (included in cad_code) |
| `cad_parcel` | string | 100% | Cadastral parcel | ❌ No (included in cad_code) |

### 🛣️ Road Information

| Field | Type | Coverage | Description | Currently Displayed |
|-------|------|----------|-------------|-------------------|
| `road_name` | string | 7% | Street/road name | ✅ Yes |
| `road_id` | string | 7% | Full road identifier with city | ❌ No |
| `road_type` | string | 7% | Road classification (trunk, tertiary, residential) | ❌ Could Add |

### 🌿 Environment (All 0-1% coverage - mostly unused)

| Field | Type | Coverage | Description |
|-------|------|----------|-------------|
| `environment-type` | string | 0% | Tree space type (e.g., "מדרכה") |
| `environment-irrigated` | string | 1% | Irrigation status |
| `environment-irrigation-type` | string | 0% | Type of irrigation |
| `environment-irrigation-water-quality` | string | 0% | Water quality |
| `environment-habitat` | string | 0% | Habitat type |
| `environment-habitat-volume` | number | 0% | Habitat volume |
| `environment-grass` | string | 0% | Grass presence |
| `environment-pavement` | string | 0% | Pavement type |
| `environment-lighting` | string | 0% | Lighting availability |
| `environment-signage` | string | 0% | Signage presence |
| `environment-sitting-area` | string | 0% | Sitting area nearby |
| `environment-description` | string | 0% | Environment description |

### ⭐ Importance Classifications (All 0% - unused)

| Field | Type | Description |
|-------|------|-------------|
| `importance-aesthetic` | boolean/string | Aesthetic significance |
| `importance-botanical` | boolean/string | Botanical importance |
| `importance-community` | boolean/string | Community value |
| `importance-historic` | boolean/string | Historic significance |
| `importance-symbolic` | boolean/string | Symbolic meaning |

### 📸 Photos (All 0% in sample)

| Field | Type | Coverage | Description | Currently Displayed |
|-------|------|----------|-------------|-------------------|
| `photos-general` | string | 0% | General tree photo URL | ✅ Yes |
| `photos-bark` | string | 0% | Bark close-up URL | ❌ No |
| `photos-fruit` | string | 0% | Fruit photo URL | ❌ No |
| `photos-leaf` | string | 0% | Leaf photo URL | ❌ No |
| `photos-ground` | string | 0% | Ground view URL | ❌ No |
| `photos-top-view` | string | 0% | Aerial/top view URL | ❌ No |
| `photos-wide-view` | string | 0% | Wide angle view URL | ❌ No |

---

## Recommendations for Card Display

### ✅ Already Displayed (Good Coverage)
- ✅ Species (Hebrew) - 98%
- ✅ Coordinates - 100%
- ✅ Municipality - 100%
- ✅ Parcel - 100%
- ✅ Internal IDs - 100%
- ✅ Data sources - 100%

### 🎯 Should Definitely Add (Good Coverage)

1. **`attributes-species-clean-en`** (98%) - English species name
   - Display alongside Hebrew name
   - Useful for international users and scientific reference

2. **`attributes-genus`** (98%) - Scientific genus
   - Important botanical information
   - Could show in parentheses or as secondary info

3. **`muni_region`** (100%) - Region
   - Shows broader geographic context (North, South, Center, etc.)

4. **`meta-collection-type`** (100%) - Collection method
   - Shows how data was gathered ("סקר רגלי" vs "חישה מרחוק")
   - Important for data quality context

5. **`meta-source-type`** (100%) - Source type
   - "מוניציפלי", "ממשלתי", "פרטי"
   - Shows data authority/reliability

6. **`location-address`** (85%) - Full address/description
   - More descriptive than just street name
   - Examples: "גן דווידוף", "קאנטרי נווה גולן"

### 🤔 Consider Adding (Lower Coverage)

7. **`road_type`** (7%) - Road classification
   - When available, shows context (trunk road, residential, etc.)

8. **`location-street-number`** (2%) - Street number
   - When available, makes address more precise

### ⏸️ Not Worth Adding (No Data in Sample)
- All environment-* fields (0% except irrigated at 1%)
- All importance-* fields (0%)
- Most photo types (0%)
- Age, year planted, health score (0%)
- Canopy diameter, bark circumference, num-barks (0%)

---

## Sample Tree Record

```json
{
  "meta-tree-id": "8G4P4VXP+GR5V",
  "meta-internal-id": "3913",
  "meta-source": "סקר עצים הוד השרון",
  "meta-date": "2023-12-01",
  "meta-collection-type": "סקר רגלי",
  "meta-source-type": "מוניציפלי",
  
  "attributes-species-clean-he": "מייש דרומי",
  "attributes-species-clean-en": "Celtis Australis",
  "attributes-genus": "Celtis",
  "attributes-bark-diameter": 17,
  "attributes-height": 5,
  "attributes-canopy-diameter": 7,
  
  "muni_name": "הוד השרון",
  "muni_region": "מרכז",
  "road_name": "שלמה בן יוסף",
  "cad_code": "6442/410",
  "location-address": "שלמה בן יוסף",
  
  "location-x": 34.8871029253277,
  "location-y": 32.1487724834198,
  
  "photos-general": "https://s3.eu-west-2.wasabisys.com/opentreebase-public/source/hod-hasharon/photos/3913.jpg"
}
```

---

## Implementation Status

### Currently in TreeCard Interface
```typescript
interface TreeData {
  id: string;              // ✅ meta-tree-id
  species?: string;        // ✅ attributes-species-clean-he
  trunkDiameter?: number;  // ✅ attributes-bark-diameter
  height?: number;         // ✅ attributes-height
  canopyArea?: number;     // ✅ attributes-canopy-area
  crownDiameter?: number;  // ✅ attributes-canopy-diameter
  municipality?: string;   // ✅ muni_name
  street?: string;         // ✅ road_name
  parcel?: string;         // ✅ cad_code
  coordinates?: string;    // ✅ location-x, location-y
  treeSpace?: string;      // ✅ environment-type
  internalIds?: string[];  // ✅ meta-internal-id
  photoUrl?: string;       // ✅ photos-general
  dataSources?: DataSource[]; // ✅ meta-source + meta-date
  status: "identified" | "suspected"; // ✅ derived
  ageEstimated?: boolean;  // ✅ attributes-age-estimated
}
```

### Recommended Additions (High Value)
```typescript
interface TreeData {
  // ... existing fields ...
  
  // NEW - High Priority (98-100% coverage)
  speciesEnglish?: string;      // attributes-species-clean-en
  genus?: string;                // attributes-genus
  region?: string;               // muni_region
  collectionType?: string;       // meta-collection-type
  sourceType?: string;           // meta-source-type
  fullAddress?: string;          // location-address (85%)
  
  // NEW - Medium Priority (when available)
  roadType?: string;             // road_type (7%)
  streetNumber?: string;         // location-street-number (2%)
}
```

---

## Notes

1. **Photo fields**: In the 100-tree sample, no photos were found, but we know they exist in some trees (like tree 8G4P4VXP+GR5V which has a photo).

2. **Environment & Importance fields**: Currently not populated in the database but reserved for future use.

3. **Measurements**: Only 14% of trees in this sample have diameter/height data, suggesting these come from more detailed survey sources.

4. **Location hierarchy**: Multiple location fields exist:
   - `location-address` (85%) - Most descriptive
   - `road_name` (7%) - Street name
   - `location-street` (15%) - Alternative street field
   - Both can be useful depending on data source

5. **Coordinate systems**: Data includes both WGS84 (standard GPS) and ITM (Israeli grid).






