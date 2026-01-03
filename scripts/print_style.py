import zipfile
import xml.etree.ElementTree as ET
import os

def print_style_definition(kmz_path, style_id):
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

                # Find the style
                # style_id usually starts with # in reference, but id attribute doesn't have #
                target_id = style_id.strip('#')
                
                # Look for Style
                style = None
                for s in root.findall('.//kml:Style', ns) if ns else root.findall('.//Style'):
                    if s.get('id') == target_id:
                        style = s
                        print(f"Found Style with ID: {target_id}")
                        icon_style = s.find('.//kml:IconStyle', ns) if ns else s.find('.//IconStyle')
                        if icon_style is not None:
                            color = icon_style.find('kml:color', ns) if ns else icon_style.find('color')
                            scale = icon_style.find('kml:scale', ns) if ns else icon_style.find('scale')
                            icon = icon_style.find('.//kml:href', ns) if ns else icon_style.find('.//href')
                            print(f"  IconStyle:")
                            print(f"    Color: {color.text if color is not None else 'None'}")
                            print(f"    Scale: {scale.text if scale is not None else 'None'}")
                            print(f"    Icon href: {icon.text if icon is not None else 'None'}")
                        return

                # Look for StyleMap
                for sm in root.findall('.//kml:StyleMap', ns) if ns else root.findall('.//StyleMap'):
                    if sm.get('id') == target_id:
                        print(f"Found StyleMap with ID: {target_id}")
                        pairs = sm.findall('kml:Pair', ns) if ns else sm.findall('Pair')
                        for pair in pairs:
                            key = pair.find('kml:key', ns) if ns else pair.find('key')
                            url = pair.find('kml:styleUrl', ns) if ns else pair.find('styleUrl')
                            print(f"  Pair: {key.text} -> {url.text}")
                        return

                print(f"Style or StyleMap with ID {target_id} not found.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Example style ID from previous output
    print_style_definition("/Users/jhalperin/digital-forest-cards/עצי פרי 2022 ).kmz", "#icon-959-009D57")
