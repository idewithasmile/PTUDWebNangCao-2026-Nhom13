import sys
from recipes_batch1 import RECIPES_BATCH_1
from recipes_batch2 import RECIPES_BATCH_2
from recipes_batch3 import RECIPES_BATCH_3
from recipes_batch4 import BATCH_4_RECIPES

batches = [('B1', RECIPES_BATCH_1), ('B2', RECIPES_BATCH_2), ('B3', RECIPES_BATCH_3), ('B4', BATCH_4_RECIPES)]
issues = []
for bname, batch in batches:
    for r in batch:
        slug = r.get('slug', 'unknown')
        ings = r.get('ingredients', [])
        steps = r.get('steps') or (r.get('instructions') if isinstance(r.get('instructions'), list) else [])
        if len(ings) < 10:
            issues.append(f"{bname} '{slug}': only {len(ings)} ingredients")
        if len(steps) < 5:
            issues.append(f"{bname} '{slug}': only {len(steps)} steps")

if issues:
    print(f"Found {len(issues)} issues:")
    for issue in issues:
        print(" -", issue)
else:
    print("All 104 recipes satisfy: >= 10 ingredients and >= 5 steps!")
