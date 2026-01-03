import zipfile
import xml.etree.ElementTree as ET
import os

def find_linestring(kmz_path):
    if not os.path.exists(kmz_path):
        print(f"Error: File not found: {kmz_path}")
        return

    try:
        with zipfile.ZipFile(kmz_path, 'r') as z:
            kml_filename = None
            for name in z.namelist():
                if name.endswith('.kml'):
                    kml_filename = name
                    break
            
            if not kml_filename:
                print("Error: No KML file found.")
                return

            with z.open(kml_filename) as kml_file:
                tree = ET.parse(kml_file)
                root = tree.getroot()
                
                ns = {}
                if '}' in root.tag:
                    ns_url = root.tag.split('}')[0].strip('{')
                    ns = {'kml': ns_url}

                placemarks = root.findall('.//kml:Placemark', ns) if ns else root.findall('.//Placemark')
                
                for pm in placemarks:
                    linestring = pm.find('.//kml:LineString', ns) if ns else pm.find('.//LineString')
                    if linestring is not None:
                        print("Found Placemark with LineString:")
                        
                        name = pm.find('kml:name', ns) if ns else pm.find('name')
                        print(f"Name: {name.text if name is not None else 'None'}")
                        
                        desc = pm.find('kml:description', ns) if ns else pm.find('description')
                        print(f"Description: {desc.text if desc is not None else 'None'}")
                        
                        coords = linestring.find('kml:coordinates', ns) if ns else linestring.find('coordinates')
                        print(f"Coordinates (snippet): {coords.text[:100] if coords is not None else 'None'}...")
                        return

                print("No LineString found.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_linestring("/Users/jhalperin/digital-forest-cards/עצי פרי 2022 ).kmz")
