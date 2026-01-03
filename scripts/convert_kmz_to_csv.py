import zipfile
import csv
import xml.etree.ElementTree as ET
import os

def clean_text(text):
    if not text:
        return ""
    # Remove LTR marker and strip whitespace
    return text.replace('\u200e', '').strip()

# Mapping based on analysis
STYLE_MAPPING = {
    # Lemon
    '#icon-ci-5': {'fruit': 'Lemon', 'legitimacy': 'Semi-Legitimate'},
    '#icon-ci-6': {'fruit': 'Lemon', 'legitimacy': 'Legitimate'},
    '#icon-ci-7': {'fruit': 'Lemon', 'legitimacy': 'Not Legitimate'},
    
    # Orange/Clementine
    '#icon-ci-8': {'fruit': 'Orange/Clementine', 'legitimacy': 'Semi-Legitimate'},
    '#icon-ci-9': {'fruit': 'Orange/Clementine', 'legitimacy': 'Legitimate'},
    '#icon-ci-10': {'fruit': 'Orange/Clementine', 'legitimacy': 'Not Legitimate'},
    '#icon-ci-11': {'fruit': 'Orange/Clementine', 'legitimacy': 'Legitimate'},
    '#icon-ci-12': {'fruit': 'Orange/Clementine', 'legitimacy': 'Semi-Legitimate'},
    '#icon-ci-13': {'fruit': 'Orange/Clementine', 'legitimacy': 'Not Legitimate'},

    # Grapefruit/Pomelo
    '#icon-ci-14': {'fruit': 'Grapefruit/Pomelo', 'legitimacy': 'Legitimate'},
    '#icon-ci-15': {'fruit': 'Grapefruit/Pomelo', 'legitimacy': 'Semi-Legitimate'},
    '#icon-ci-16': {'fruit': 'Grapefruit/Pomelo', 'legitimacy': 'Not Legitimate'},
    '#icon-ci-17': {'fruit': 'Grapefruit/Pomelo', 'legitimacy': 'Semi-Legitimate'}, # Mixed but leaning semi
    '#icon-ci-18': {'fruit': 'Grapefruit/Pomelo', 'legitimacy': 'Legitimate'},
    '#icon-ci-19': {'fruit': 'Grapefruit/Pomelo', 'legitimacy': 'Legitimate'},

    # Passionfruit/Pitanga
    '#icon-ci-20': {'fruit': 'Passionfruit/Pitanga', 'legitimacy': 'Legitimate'},
    '#icon-ci-21': {'fruit': 'Passionfruit/Pitanga', 'legitimacy': 'Legitimate'},
    '#icon-ci-22': {'fruit': 'Passionfruit/Pitanga', 'legitimacy': 'Semi-Legitimate'},
    '#icon-ci-23': {'fruit': 'Passionfruit/Pitanga', 'legitimacy': 'Not Legitimate'},
    '#icon-ci-24': {'fruit': 'Passionfruit/Pitanga', 'legitimacy': 'Semi-Legitimate'},

    # Kumquat
    '#icon-ci-25': {'fruit': 'Kumquat', 'legitimacy': 'Semi-Legitimate'},
    '#icon-ci-26': {'fruit': 'Kumquat', 'legitimacy': 'Legitimate'},
    '#icon-ci-27': {'fruit': 'Kumquat', 'legitimacy': 'Not Legitimate'},

    # Banana/Papaya/Guava/Avocado
    '#icon-ci-28': {'fruit': 'Banana/Papaya/Guava/Avocado', 'legitimacy': 'Not Legitimate'},
    '#icon-ci-29': {'fruit': 'Banana/Papaya/Guava/Avocado', 'legitimacy': 'Semi-Legitimate'},
    '#icon-ci-30': {'fruit': 'Banana/Papaya/Guava/Avocado', 'legitimacy': 'Semi-Legitimate'}, # Small sample
    '#icon-ci-31': {'fruit': 'Banana/Papaya/Guava/Avocado', 'legitimacy': 'Not Legitimate'},
    '#icon-ci-32': {'fruit': 'Banana/Papaya/Guava/Avocado', 'legitimacy': 'Legitimate'},
    '#icon-ci-33': {'fruit': 'Banana/Papaya/Guava/Avocado', 'legitimacy': 'Legitimate'},
    '#icon-ci-34': {'fruit': 'Banana/Papaya/Guava/Avocado', 'legitimacy': 'Legitimate'},
    '#icon-ci-35': {'fruit': 'Banana/Papaya/Guava/Avocado', 'legitimacy': 'Legitimate'},
    '#icon-ci-36': {'fruit': 'Banana/Papaya/Guava/Avocado', 'legitimacy': 'Semi-Legitimate'},
    '#icon-ci-37': {'fruit': 'Banana/Papaya/Guava/Avocado', 'legitimacy': 'Legitimate'},
    '#icon-ci-38': {'fruit': 'Banana/Papaya/Guava/Avocado', 'legitimacy': 'Legitimate'},
    '#icon-ci-39': {'fruit': 'Banana/Papaya/Guava/Avocado', 'legitimacy': 'Not Legitimate'},

    # Loquat/Mulberry
    '#icon-ci-40': {'fruit': 'Loquat/Mulberry', 'legitimacy': 'Legitimate'},
    '#icon-ci-41': {'fruit': 'Loquat/Mulberry', 'legitimacy': 'Semi-Legitimate'},
    '#icon-ci-42': {'fruit': 'Loquat/Mulberry', 'legitimacy': 'Not Legitimate'},
    '#icon-ci-43': {'fruit': 'Loquat/Mulberry', 'legitimacy': 'Legitimate'},
    '#icon-ci-44': {'fruit': 'Loquat/Mulberry', 'legitimacy': 'Semi-Legitimate'},
    '#icon-ci-45': {'fruit': 'Loquat/Mulberry', 'legitimacy': 'Not Legitimate'}, # Mixed but leaning no

    # Olive/Pomegranate/Fig/etc
    '#icon-ci-46': {'fruit': 'Olive/Pomegranate/Fig', 'legitimacy': 'Legitimate'},
    '#icon-ci-47': {'fruit': 'Olive/Pomegranate/Fig', 'legitimacy': 'Semi-Legitimate'},
    '#icon-ci-48': {'fruit': 'Olive/Pomegranate/Fig', 'legitimacy': 'Semi-Legitimate'},
    '#icon-ci-49': {'fruit': 'Olive/Pomegranate/Fig', 'legitimacy': 'Semi-Legitimate'},
    '#icon-ci-50': {'fruit': 'Olive/Pomegranate/Fig', 'legitimacy': 'Not Legitimate'},
    '#icon-ci-51': {'fruit': 'Olive/Pomegranate/Fig', 'legitimacy': 'Legitimate'},
    '#icon-ci-52': {'fruit': 'Olive/Pomegranate/Fig', 'legitimacy': 'Not Legitimate'},
    '#icon-ci-53': {'fruit': 'Olive/Pomegranate/Fig', 'legitimacy': 'Not Legitimate'},
    '#icon-ci-54': {'fruit': 'Olive/Pomegranate/Fig', 'legitimacy': 'Legitimate'},

    # Mango/Apricot/Pecan
    '#icon-ci-55': {'fruit': 'Mango/Apricot/Pecan', 'legitimacy': 'Semi-Legitimate'},
    '#icon-ci-56': {'fruit': 'Mango/Apricot/Pecan', 'legitimacy': 'Not Legitimate'},
    '#icon-ci-57': {'fruit': 'Mango/Apricot/Pecan', 'legitimacy': 'Legitimate'},
    '#icon-ci-58': {'fruit': 'Mango/Apricot/Pecan', 'legitimacy': 'Legitimate'},
    '#icon-ci-59': {'fruit': 'Mango/Apricot/Pecan', 'legitimacy': 'Not Legitimate'},

    # Others
    '#icon-ci-1': {'fruit': 'Carob/Sycamore', 'legitimacy': 'Semi-Legitimate'},
    '#icon-ci-2': {'fruit': 'Carob/Sycamore', 'legitimacy': 'Semi-Legitimate'},
    '#icon-ci-3': {'fruit': 'Carob/Sycamore', 'legitimacy': 'Legitimate'},
    '#icon-ci-4': {'fruit': 'Carob/Sycamore', 'legitimacy': 'Legitimate'},
    
    # Defaults for specific IDs found
    '#icon-959-009D57': {'fruit': 'Olive/Pomegranate/Fig', 'legitimacy': 'Legitimate'},
    '#icon-961-009D57': {'fruit': 'Mango/Apricot/Pecan', 'legitimacy': 'Legitimate'},
    '#icon-960-009D57': {'fruit': 'Olive/Pomegranate/Fig', 'legitimacy': 'Legitimate'},
    '#icon-962-009D57': {'fruit': 'Olive/Pomegranate/Fig', 'legitimacy': 'Legitimate'},
}

def convert_kmz_to_csv(kmz_path, csv_path):
    """
    Converts a KMZ file to a CSV file extracting Placemark data.
    Includes Layer (Folder), Icon, Color, Style URL.
    Infers Fruit Type and Legitimacy from Style URL.
    """
    if not os.path.exists(kmz_path):
        print(f"Error: File not found: {kmz_path}")
        return

    try:
        with zipfile.ZipFile(kmz_path, 'r') as z:
            # Find the KML file (usually doc.kml)
            kml_filename = None
            for name in z.namelist():
                if name.endswith('.kml'):
                    kml_filename = name
                    break
            
            if not kml_filename:
                print("Error: No KML file found in KMZ archive.")
                return

            print(f"Processing KML file: {kml_filename}")
            
            with z.open(kml_filename) as kml_file:
                tree = ET.parse(kml_file)
                root = tree.getroot()

                ns = {}
                if '}' in root.tag:
                    ns_url = root.tag.split('}')[0].strip('{')
                    ns = {'kml': ns_url}

                # 1. Parse Styles
                styles = {} # id -> {color, icon}
                for style in root.findall('.//kml:Style', ns) if ns else root.findall('.//Style'):
                    style_id = style.get('id')
                    if not style_id:
                        continue
                    
                    icon_style = style.find('.//kml:IconStyle', ns) if ns else style.find('.//IconStyle')
                    color = None
                    icon_href = None
                    
                    if icon_style is not None:
                        c_elem = icon_style.find('kml:color', ns) if ns else icon_style.find('color')
                        if c_elem is not None:
                            color = c_elem.text
                        
                        i_elem = icon_style.find('.//kml:href', ns) if ns else icon_style.find('.//href')
                        if i_elem is not None:
                            icon_href = i_elem.text
                    
                    styles[style_id] = {'color': color, 'icon': icon_href}

                # 2. Parse StyleMaps
                style_maps = {} # id -> normal_style_id
                for sm in root.findall('.//kml:StyleMap', ns) if ns else root.findall('.//StyleMap'):
                    sm_id = sm.get('id')
                    if not sm_id:
                        continue
                    
                    # Find 'normal' pair
                    normal_style = None
                    pairs = sm.findall('kml:Pair', ns) if ns else sm.findall('Pair')
                    for pair in pairs:
                        key = pair.find('kml:key', ns) if ns else pair.find('key')
                        if key is not None and key.text == 'normal':
                            url = pair.find('kml:styleUrl', ns) if ns else pair.find('styleUrl')
                            if url is not None:
                                normal_style = url.text.strip('#')
                            break
                    
                    if normal_style:
                        style_maps[sm_id] = normal_style

                # Prepare CSV
                with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
                    fieldnames = ['name', 'description', 'longitude', 'latitude', 'layer', 'icon', 'color', 'style_url', 'fruit_type', 'legitimacy']
                    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                    writer.writeheader()

                    count = 0

                    def process_element(element, current_layer):
                        nonlocal count
                        tag = element.tag.split('}')[-1]

                        if tag in ['Folder', 'Document']:
                            name_elem = element.find('kml:name', ns) if ns else element.find('name')
                            layer_name = name_elem.text if name_elem is not None else current_layer
                            if tag == 'Document':
                                pass
                            else:
                                current_layer = layer_name

                            # Process children
                            for child in element:
                                process_element(child, current_layer)
                        
                        elif tag == 'Placemark':
                            data = {
                                'name': '',
                                'description': '',
                                'longitude': '',
                                'latitude': '',
                                'layer': clean_text(current_layer),
                                'icon': '',
                                'color': '',
                                'style_url': '',
                                'fruit_type': '',
                                'legitimacy': ''
                            }

                            # Name
                            name_elem = element.find('kml:name', ns) if ns else element.find('name')
                            if name_elem is not None:
                                data['name'] = clean_text(name_elem.text)

                            # Description
                            desc_elem = element.find('kml:description', ns) if ns else element.find('description')
                            if desc_elem is not None:
                                data['description'] = clean_text(desc_elem.text)

                            # Coordinates
                            point_elem = element.find('.//kml:Point', ns) if ns else element.find('.//Point')
                            if point_elem is not None:
                                coords_elem = point_elem.find('kml:coordinates', ns) if ns else point_elem.find('coordinates')
                                if coords_elem is not None and coords_elem.text:
                                    coords = coords_elem.text.strip().split(',')
                                    if len(coords) >= 2:
                                        data['longitude'] = coords[0]
                                        data['latitude'] = coords[1]
                            
                            # Style
                            style_url_elem = element.find('kml:styleUrl', ns) if ns else element.find('styleUrl')
                            if style_url_elem is not None and style_url_elem.text:
                                raw_style_url = style_url_elem.text.strip()
                                data['style_url'] = raw_style_url
                                
                                # Infer from mapping
                                if raw_style_url in STYLE_MAPPING:
                                    mapping = STYLE_MAPPING[raw_style_url]
                                    data['fruit_type'] = mapping['fruit']
                                    data['legitimacy'] = mapping['legitimacy']

                                style_ref = raw_style_url.strip('#')
                                
                                # Resolve StyleMap
                                if style_ref in style_maps:
                                    style_ref = style_maps[style_ref]
                                
                                # Get Style info
                                if style_ref in styles:
                                    s = styles[style_ref]
                                    data['color'] = s['color'] if s['color'] else ''
                                    data['icon'] = s['icon'] if s['icon'] else ''

                            writer.writerow(data)
                            count += 1

                    # Start processing from root
                    for child in root:
                        process_element(child, "Unknown Layer")
                    
                    print(f"Successfully converted {count} placemarks to {csv_path}")

    except zipfile.BadZipFile:
        print("Error: Bad Zip File")
    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    kmz_file = "/Users/jhalperin/digital-forest-cards/עצי פרי 2022 ).kmz"
    csv_file = "fruit_trees_2022.csv"
    convert_kmz_to_csv(kmz_file, csv_file)
