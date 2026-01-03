import zipfile
import xml.etree.ElementTree as ET
import os

def inspect_kml_fields(kmz_path):
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

            print(f"Parsing {kml_filename}...")
            with z.open(kml_filename) as kml_file:
                tree = ET.parse(kml_file)
                root = tree.getroot()
                
                ns = {}
                if '}' in root.tag:
                    ns_url = root.tag.split('}')[0].strip('{')
                    ns = {'kml': ns_url}

                unique_tags = set()
                extended_data_fields = set()

                placemarks = root.findall('.//kml:Placemark', ns) if ns else root.findall('.//Placemark')
                print(f"Found {len(placemarks)} Placemarks.")

                for pm in placemarks:
                    for child in pm:
                        tag = child.tag.split('}')[-1]
                        unique_tags.add(tag)
                        
                        if tag == 'ExtendedData':
                            # Check for SimpleData or Data
                            for data in child:
                                data_tag = data.tag.split('}')[-1]
                                if data_tag == 'Data':
                                    name = data.get('name')
                                    extended_data_fields.add(f"Data: {name}")
                                elif data_tag == 'SchemaData':
                                    for simple in data:
                                        name = simple.get('name')
                                        extended_data_fields.add(f"SimpleData: {name}")

                print("\nUnique Tags within Placemark:")
                for tag in sorted(unique_tags):
                    print(f"- {tag}")

                if extended_data_fields:
                    print("\nExtendedData Fields:")
                    for field in sorted(extended_data_fields):
                        print(f"- {field}")
                else:
                    print("\nNo ExtendedData fields found.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_kml_fields("/Users/jhalperin/digital-forest-cards/עצי פרי 2022 ).kmz")
