import csv
import collections
import re

def analyze_styles(csv_path):
    style_data = collections.defaultdict(list)

    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            style = row.get('style_url')
            layer = row.get('layer')
            desc = row.get('description')
            style_data[style].append({'layer': layer, 'desc': desc})

    print(f"{'Style':<20} | {'Count':<5} | {'Common Layer':<30} | {'Legitimacy Keywords'}")
    print("-" * 100)

    for style, rows in style_data.items():
        count = len(rows)
        
        # Most common layer
        layers = [r['layer'] for r in rows]
        common_layer = collections.Counter(layers).most_common(1)[0][0] if layers else "None"
        
        # Check legitimacy keywords in description
        legit_counts = collections.Counter()
        for r in rows:
            desc = r['desc']
            if 'חצי לגיטימי' in desc:
                legit_counts['semi'] += 1
            elif 'לא לגיטימי' in desc:
                legit_counts['no'] += 1
            elif 'לגיטימי' in desc: # Check this last as it's a substring of others
                legit_counts['yes'] += 1
        
        legit_summary = f"Yes:{legit_counts['yes']}, Semi:{legit_counts['semi']}, No:{legit_counts['no']}"
        
        print(f"{style:<20} | {count:<5} | {common_layer[:30]:<30} | {legit_summary}")

if __name__ == "__main__":
    analyze_styles("fruit_trees_2022.csv")
