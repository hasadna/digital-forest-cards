import zipfile
import xml.etree.ElementTree as ET
import os

def inspect_kml_structure(kmz_path):
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

                # 1. List Styles and StyleMaps
                styles = root.findall('.//kml:Style', ns) if ns else root.findall('.//Style')
                print(f"\nFound {len(styles)} Styles.")
                
                style_maps = root.findall('.//kml:StyleMap', ns) if ns else root.findall('.//StyleMap')
                print(f"Found {len(style_maps)} StyleMaps.")

                # 2. Inspect Folders (Layers)
                print("\nInspecting Folder Structure:")
                
                def print_structure(element, level=0):
                    tag = element.tag.split('}')[-1]
                    
                    # Print name if it's a Folder or Document
                    if tag in ['Folder', 'Document']:
                        name = element.find('kml:name', ns) if ns else element.find('name')
                        name_text = name.text if name is not None else "Unnamed"
                        print(f"{'  ' * level}{tag}: {name_text}")
                        
                        placemarks = element.findall('kml:Placemark', ns) if ns else element.findall('Placemark')
                        if placemarks:
                            print(f"{'  ' * (level+1)}Contains {len(placemarks)} Placemarks")
                            # Print first placemark details
                            pm = placemarks[0]
                            pm_style = pm.find('kml:styleUrl', ns) if ns else pm.find('styleUrl')
                            print(f"{'  ' * (level+1)}Sample Placemark StyleUrl: {pm_style.text if pm_style is not None else 'None'}")

                    # Recurse
                    # We need to look for children that are Folders or Document
                    # But actually we should just iterate over all children to be safe, or specific tags
                    # For KML, Document contains Folders, Folders contain Folders/Placemarks
                    
                    # Find direct children that are Folder or Document
                    for child in element:
                        child_tag = child.tag.split('}')[-1]
                        if child_tag in ['Folder', 'Document']:
                            print_structure(child, level + 1)

                print_structure(root)

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_kml_structure("/Users/jhalperin/digital-forest-cards/עצי פרי 2022 ).kmz")
