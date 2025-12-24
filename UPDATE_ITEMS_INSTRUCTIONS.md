# How to Update Item Names from Reference Images

## Quick Method

1. **Open the CSV file**: `database/reference_matching.csv`
2. **Open the reference images**:
   - `E:\PIR3\GV_LeatherandHides.png`
   - `E:\PIR3\GV_LegArmour_Shoes.png`
   - `E:\PIR3\GV_ThreadsandCanvas.png`
   - `E:\PIR3\GV_ChestArmour_v2.png`
   - `E:\PIR3\GV_GauntletsandShields.png`
   - `E:\PIR3\GV_HelmetsandShoulderArmour.png`

3. **Fill in the CSV**:
   - Look at each item icon in the reference images
   - Find the matching row in the CSV by `IconFile`
   - Enter the correct English name in `CorrectEnglishName` column
   - Enter the correct Polish name in `CorrectPolishName` column (if different)

4. **Apply updates**:
   ```powershell
   python batch_update_items.py
   ```

## CSV Format

The CSV has these columns:
- `ReferenceImage` - Which reference image this item is from
- `IconFile` - The icon filename (e.g., `icon_Leather.png`)
- `BaseName` - Current base name
- `CurrentEnglishName` - Current English name
- `CurrentPolishName` - Current Polish name
- `Category` - Item category
- `SubCategory` - Item subcategory
- `CorrectEnglishName` - **Fill this in with correct name from reference image**
- `CorrectPolishName` - **Fill this in with correct Polish name**
- `Notes` - Optional notes

## Example

If you see "Leather" in the reference image next to `icon_Leather.png`:
- `CorrectEnglishName`: `Leather`
- `CorrectPolishName`: `Skóra` (or leave same as English if you don't know Polish)

Then run: `python batch_update_items.py`

The script will automatically update `database/items.json` with all the corrected names.

