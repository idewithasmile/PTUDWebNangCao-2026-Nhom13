import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

path = 'backend/src/Infrastructure/Data/Datasets/recipes_master_dataset.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

categories = data.get('categories', [])
recipes = data.get('recipes', [])

print(f"Total categories: {len(categories)}")
print(f"Total recipes: {len(recipes)}")

# Check suspicious fake keywords in entire JSON text
raw_text = open(path, 'r', encoding='utf-8').read().lower()
suspicious = ['lorem', 'ipsum', 'bogus', 'faker', 'placeholder', 'dummy', 'foobar']
found_suspicious = {w: len(re.findall(r'\b' + w + r'\b', raw_text)) for w in suspicious}
print("Suspicious keyword occurrences:", found_suspicious)

# Ingredient stats
ing_counts = [len(r.get('ingredients', [])) for r in recipes]
print(f"Ingredients per recipe: min={min(ing_counts)}, max={max(ing_counts)}, avg={sum(ing_counts)/len(recipes):.1f}")

# Check for invalid quantities or units
bad_ing = 0
for r in recipes:
    for ing in r.get('ingredients', []):
        q = ing.get('quantity')
        u = ing.get('unit')
        name = ing.get('name')
        if q is None or q <= 0 or not u or not name:
            bad_ing += 1
print(f"Bad ingredients count: {bad_ing}")

# Step stats
step_counts = [len(r.get('steps', [])) for r in recipes]
print(f"Steps per recipe: min={min(step_counts)}, max={max(step_counts)}, avg={sum(step_counts)/len(recipes):.1f}")

# Check step images
bad_steps = 0
for r in recipes:
    for s in r.get('steps', []):
        img = s.get('imageUrl')
        if not img or not img.startswith('/culinary-blog/recipes/'):
            bad_steps += 1
print(f"Steps without valid imageUrl: {bad_steps}")

# Cover uniqueness
covers = [img['url'] for r in recipes for img in r.get('images', []) if img.get('isPrimary')]
print(f"Total primary covers: {len(covers)}, Unique primary covers: {len(set(covers))}")

# Sample 10 recipe titles and categories
print("\nSample 10 recipes:")
for r in recipes[:10]:
    cat = r.get("categorySlug")
    title = r.get("title")
    n_ing = len(r.get("ingredients", []))
    n_steps = len(r.get("steps", []))
    print(f" - [{cat}] {title} ({n_ing} ing, {n_steps} steps)")

# Let's inspect ingredients and steps of showcase dish:
pho = next((r for r in recipes if r.get('slug') == 'pho-bo-tai-lan-chuan-vi-ha-thanh'), None)
if pho:
    print("\nShowcase Recipe: " + pho.get('title'))
    print("Ingredients:")
    for ing in pho.get('ingredients', [])[:5]:
        print(f"   * {ing.get('name')}: {ing.get('quantity')} {ing.get('unit')} ({ing.get('notes')})")
    print("Steps:")
    for step in pho.get('steps', [])[:3]:
        print(f"   Step {step.get('stepNumber')}: {step.get('title')} - {step.get('description')[:60]}... | Img: {step.get('imageUrl')}")
