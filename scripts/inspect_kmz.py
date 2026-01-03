import zipfile
import sys
import os

kmz_path = "/Users/jhalperin/digital-forest-cards/עצי פרי 2022 ).kmz"

if not os.path.exists(kmz_path):
    print(f"File not found: {kmz_path}")
    sys.exit(1)

try:
    with zipfile.ZipFile(kmz_path, 'r') as z:
        print(f"Contents of {os.path.basename(kmz_path)}:")
        for filename in z.namelist():
            print(f" - {filename}")
except zipfile.BadZipFile:
    print("Error: Bad Zip File")
except Exception as e:
    print(f"Error: {e}")
