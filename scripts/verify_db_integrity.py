import subprocess
import json

def run_psql(sql):
    cmd = ["docker", "exec", "-i", "culinary_postgres", "psql", "-U", "postgres", "-d", "culinary_blog", "-t", "-A", "-c", sql]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"PSQL Error: {result.stderr}")
    return result.stdout.strip()

def main():
    print("=== LIVE POSTGRESQL INTEGRITY VERIFICATION ===")
    
    # 1. Category Count
    cat_count = int(run_psql('SELECT count(*) FROM "Categories";'))
    print(f"Categories count: {cat_count} (Requirement: >= 20) -> {'PASS' if cat_count >= 20 else 'FAIL'}")
    
    # 2. Recipe Count
    recipe_count = int(run_psql('SELECT count(*) FROM "Recipes";'))
    print(f"Recipes count: {recipe_count} (Requirement: >= 100) -> {'PASS' if recipe_count >= 100 else 'FAIL'}")
    
    # 3. Status
    non_published = int(run_psql('SELECT count(*) FROM "Recipes" WHERE "Status" != \'Published\';'))
    print(f"Non-published recipes: {non_published} (Requirement: 0) -> {'PASS' if non_published == 0 else 'FAIL'}")
    
    # 4. Ingredients count < 10
    under_10_ingr = int(run_psql('SELECT count(*) FROM (SELECT "RecipeId" FROM "RecipeIngredients" GROUP BY "RecipeId" HAVING count(*) < 10) q;'))
    print(f"Recipes with < 10 ingredients: {under_10_ingr} (Requirement: 0) -> {'PASS' if under_10_ingr == 0 else 'FAIL'}")
    
    # 5. Steps count < 5
    under_5_steps = int(run_psql('SELECT count(*) FROM (SELECT "RecipeId" FROM "RecipeSteps" GROUP BY "RecipeId" HAVING count(*) < 5) q;'))
    print(f"Recipes with < 5 steps: {under_5_steps} (Requirement: 0) -> {'PASS' if under_5_steps == 0 else 'FAIL'}")
    
    # 6. Images count < 3
    under_3_images = int(run_psql('SELECT count(*) FROM (SELECT "RecipeId" FROM "RecipeImages" GROUP BY "RecipeId" HAVING count(*) < 3) q;'))
    print(f"Recipes with < 3 images: {under_3_images} (Requirement: 0) -> {'PASS' if under_3_images == 0 else 'FAIL'}")
    
    # 7. Exactly 1 primary image
    invalid_primary = int(run_psql('SELECT count(*) FROM (SELECT "RecipeId" FROM "RecipeImages" WHERE "IsPrimary" = true GROUP BY "RecipeId" HAVING count(*) != 1) q;'))
    print(f"Recipes without exactly 1 primary image: {invalid_primary} (Requirement: 0) -> {'PASS' if invalid_primary == 0 else 'FAIL'}")

    # 8. Showcase recipe
    showcase = run_psql('SELECT "Title", "Slug", "Status" FROM "Recipes" WHERE "Slug" = \'pho-bo-tai-lan-chuan-vi-ha-thanh\';')
    print(f"Showcase recipe 'pho-bo-tai-lan-chuan-vi-ha-thanh': {showcase}")

    # 9. Total ingredients, steps, images
    total_ingr = int(run_psql('SELECT count(*) FROM "RecipeIngredients";'))
    total_steps = int(run_psql('SELECT count(*) FROM "RecipeSteps";'))
    total_images = int(run_psql('SELECT count(*) FROM "RecipeImages";'))
    print(f"Total Ingredients: {total_ingr}, Total Steps: {total_steps}, Total Images: {total_images}")

    # 10. Check Category Slugs
    slugs = run_psql('SELECT "Slug" FROM "Categories" ORDER BY "OrderIndex" LIMIT 10;').splitlines()
    print(f"Sample Category Slugs: {slugs}")

if __name__ == "__main__":
    main()
