#!/usr/bin/env python3
"""
Separate pants/leggings from boots by creating a "Legs" subcategory.
Items with keywords like "Pants", "Leggings", "Legguards" will be moved to "Legs".
Boots will remain in "Feet".
"""

import json
import re

ITEMS_JSON_PATH = "database/items.json"

# Keywords that indicate pants/leggings (not boots)
PANTS_KEYWORDS = [
    'pants', 'leggings', 'leg guards', 'legguards', 'leg armor', 
    'trousers', 'breeches', 'chausses', 'hose'
]

# Keywords that indicate boots/shoes (keep in Feet)
BOOTS_KEYWORDS = [
    'boots', 'shoes', 'sabatons', 'footwear', 'sandals', 'slippers',
    'leggingswithboots', 'leggings with boots'  # Combined items stay in Feet
]

def is_pants(item_name, icon_name):
    """Check if an item is pants/leggings based on name"""
    name_lower = (item_name + ' ' + icon_name).lower()
    
    # Check for boot keywords first (more specific)
    for keyword in BOOTS_KEYWORDS:
        if keyword in name_lower:
            return False
    
    # Check for pants keywords
    for keyword in PANTS_KEYWORDS:
        if keyword in name_lower:
            return True
    
    return False

def main():
    print("Separating pants from boots in Armor category...")
    
    # Load items
    with open(ITEMS_JSON_PATH, 'r', encoding='utf-8-sig') as f:
        items = json.load(f)
    
    # Find armor items with Feet subcategory
    feet_items = [item for item in items 
                  if item.get('Category') == 'Armor' 
                  and item.get('SubCategory') == 'Feet']
    
    print(f"\nFound {len(feet_items)} items in Armor > Feet")
    
    # Separate into pants and boots
    pants_items = []
    boots_items = []
    
    for item in feet_items:
        item_name = item.get('EnglishName', '') or item.get('BaseName', '')
        icon_name = item.get('IconFile', '')
        
        if is_pants(item_name, icon_name):
            pants_items.append(item)
        else:
            boots_items.append(item)
    
    print(f"\nIdentified:")
    print(f"  Pants/Leggings: {len(pants_items)}")
    print(f"  Boots/Shoes: {len(boots_items)}")
    
    # Show some examples
    print(f"\nSample pants items:")
    for item in pants_items[:10]:
        print(f"  - {item.get('EnglishName', item.get('BaseName'))} ({item.get('IconFile')})")
    
    print(f"\nSample boots items:")
    for item in boots_items[:10]:
        print(f"  - {item.get('EnglishName', item.get('BaseName'))} ({item.get('IconFile')})")
    
    # Update items
    updated_count = 0
    items_by_icon = {item['IconFile']: item for item in items}
    
    for item in pants_items:
        icon_file = item['IconFile']
        if icon_file in items_by_icon:
            items_by_icon[icon_file]['SubCategory'] = 'Legs'
            updated_count += 1
    
    # Save updated items
    if updated_count > 0:
        with open(ITEMS_JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(items, f, indent=4, ensure_ascii=False)
        
        print(f"\nSUCCESS: Updated {updated_count} items to 'Legs' subcategory")
        print(f"SUCCESS: Saved to {ITEMS_JSON_PATH}")
    else:
        print("\nNo updates needed.")

if __name__ == "__main__":
    main()

