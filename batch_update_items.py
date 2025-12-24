#!/usr/bin/env python3
"""
Batch update items.json from a CSV file with item names.
Format: icon_filename.png,English Name,Polish Name (optional)
"""

import json
import csv
import sys
import os

ITEMS_JSON_PATH = "database/items.json"

def load_items():
    """Load items from JSON"""
    with open(ITEMS_JSON_PATH, 'r', encoding='utf-8-sig') as f:
        return json.load(f)

def save_items(items, path):
    """Save items to JSON"""
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=4, ensure_ascii=False)

def update_from_csv(csv_file):
    """Update items from CSV file"""
    items = load_items()
    items_by_icon = {item['IconFile']: item for item in items}
    
    updates = []
    with open(csv_file, 'r', encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) < 2:
                continue
            
            icon_file = row[0].strip()
            english_name = row[1].strip()
            polish_name = row[2].strip() if len(row) > 2 and row[2].strip() else english_name
            
            if icon_file in items_by_icon:
                item = items_by_icon[icon_file]
                old_english = item.get('EnglishName', '')
                old_polish = item.get('PolishName', '')
                
                if old_english != english_name or old_polish != polish_name:
                    updates.append((icon_file, english_name, polish_name, old_english, old_polish))
                    item['EnglishName'] = english_name
                    item['PolishName'] = polish_name
    
    if updates:
        save_items(items, ITEMS_JSON_PATH)
        print(f"Updated {len(updates)} items:")
        for icon_file, eng, pol, old_eng, old_pol in updates:
            print(f"  {icon_file}: '{old_eng}' -> '{eng}'")
        return len(updates)
    else:
        print("No updates found.")
        return 0

def create_template_csv():
    """Create a template CSV file for manual editing"""
    items = load_items()
    
    # Group by category for reference images
    categories = {
        "Materials": ["LeatherandHides", "ThreadsandCanvas"],
        "Armor": ["LegArmour_Shoes", "ChestArmour_v2", "GauntletsandShields", "HelmetsandShoulderArmour"]
    }
    
    with open("item_updates_template.csv", 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["IconFile", "EnglishName", "PolishName", "Notes"])
        
        for cat, refs in categories.items():
            cat_items = [item for item in items if item.get('Category') == cat]
            for item in cat_items:
                writer.writerow([
                    item['IconFile'],
                    item.get('EnglishName', ''),
                    item.get('PolishName', ''),
                    f"From: {', '.join(refs)}"
                ])
    
    print(f"Created template: item_updates_template.csv with {len(items)} items")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == "--template":
            create_template_csv()
        else:
            csv_file = sys.argv[1]
            if os.path.exists(csv_file):
                update_from_csv(csv_file)
            else:
                print(f"Error: File not found: {csv_file}")
    else:
        # Try to use existing reference_matching.csv if it exists
        if os.path.exists("database/reference_matching.csv"):
            print("Found database/reference_matching.csv")
            print("Updating items from CSV...")
            # Convert reference_matching.csv format to our format
            items = load_items()
            items_by_icon = {item['IconFile']: item for item in items}
            
            updates = []
            with open("database/reference_matching.csv", 'r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    icon_file = row.get('IconFile', '').strip()
                    correct_english = row.get('CorrectEnglishName', '').strip()
                    correct_polish = row.get('CorrectPolishName', '').strip()
                    
                    if icon_file and correct_english and icon_file in items_by_icon:
                        item = items_by_icon[icon_file]
                        old_english = item.get('EnglishName', '')
                        if old_english != correct_english:
                            item['EnglishName'] = correct_english
                            item['PolishName'] = correct_polish or correct_english
                            updates.append((icon_file, correct_english, old_english))
            
            if updates:
                save_items(items, ITEMS_JSON_PATH)
                print(f"\nUpdated {len(updates)} items:")
                for icon_file, new_name, old_name in updates[:20]:
                    print(f"  {icon_file}: '{old_name}' -> '{new_name}'")
                if len(updates) > 20:
                    print(f"  ... and {len(updates) - 20} more")
            else:
                print("No updates found in CSV (CorrectEnglishName column is empty)")
        else:
            print("Usage: python batch_update_items.py <updates.csv>")
            print("   or: python batch_update_items.py --template")
            print("\nCSV format: IconFile,EnglishName,PolishName")
            print("Example: icon_Leather.png,Leather,Skóra")

