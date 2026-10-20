<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

/**
 * Loads the starting Velora catalog (ported from the frontend's src/lib/products.ts).
 */
class CatalogSeeder extends Seeder
{
    /**
     * @var list<array{slug: string, name: string, tagline: string}>
     */
    private const CATEGORIES = [
        ['slug' => 'bags', 'name' => 'Bags', 'tagline' => 'Everyday carry, made to last'],
        ['slug' => 'rings', 'name' => 'Rings', 'tagline' => 'Stack them, or let one shine'],
        ['slug' => 'chains', 'name' => 'Chains', 'tagline' => 'Layers for every neckline'],
        ['slug' => 'earrings', 'name' => 'Earrings', 'tagline' => 'Small details, big finish'],
        ['slug' => 'bracelets', 'name' => 'Bracelets', 'tagline' => 'Wrist stacks and cuffs'],
    ];

    /**
     * @var list<array<string, mixed>>
     */
    private const PRODUCTS = [
        ['slug' => 'mira-leather-tote', 'name' => 'Mira Leather Tote', 'category' => 'bags', 'price' => 449, 'material' => 'Vegan leather', 'description' => 'A roomy, structured tote with a magnetic closure and an inner zip pocket. Fits a laptop up to 14 inches.', 'is_bestseller' => true],
        ['slug' => 'sola-crossbody', 'name' => 'Sola Crossbody', 'category' => 'bags', 'price' => 299, 'compare_at_price' => 349, 'material' => 'Pebbled leather', 'description' => 'A compact crossbody with an adjustable strap and gold-tone hardware. Holds your phone, cards and keys.', 'is_new' => true],
        ['slug' => 'nour-mini-bag', 'name' => 'Nour Mini Bag', 'category' => 'bags', 'price' => 249, 'material' => 'Satin with chain strap', 'description' => 'An evening mini bag with a detachable chain strap. Small enough for a clutch, big enough for the essentials.'],
        ['slug' => 'luna-signet-ring', 'name' => 'Luna Signet Ring', 'category' => 'rings', 'price' => 179, 'material' => '18k gold-plated stainless steel', 'description' => 'A classic oval signet with a polished face. Waterproof and tarnish-resistant.', 'is_bestseller' => true],
        ['slug' => 'aria-stacking-set', 'name' => 'Aria Stacking Set', 'category' => 'rings', 'price' => 149, 'material' => 'Sterling silver', 'description' => 'Three slim bands (plain, twisted and beaded) made to be worn together or apart.', 'is_new' => true],
        ['slug' => 'celeste-pearl-ring', 'name' => 'Celeste Pearl Ring', 'category' => 'rings', 'price' => 199, 'material' => 'Gold vermeil, freshwater pearl', 'description' => 'A single freshwater pearl on a delicate open band. Adjustable to most sizes.'],
        ['slug' => 'cuban-link-chain', 'name' => 'Cuban Link Chain', 'category' => 'chains', 'price' => 259, 'material' => '18k gold-plated stainless steel', 'description' => 'A bold 6mm Cuban link with a secure box clasp. Available in 45cm and 50cm.', 'is_bestseller' => true],
        ['slug' => 'figaro-fine-chain', 'name' => 'Figaro Fine Chain', 'category' => 'chains', 'price' => 159, 'material' => 'Sterling silver', 'description' => 'A fine figaro chain that layers well with pendants and other chains.'],
        ['slug' => 'paperclip-chain', 'name' => 'Paperclip Chain', 'category' => 'chains', 'price' => 179, 'compare_at_price' => 219, 'material' => 'Gold vermeil', 'description' => 'Elongated links in a modern silhouette. Wear it alone or clip on a charm.', 'is_new' => true],
        ['slug' => 'dune-hoop-earrings', 'name' => 'Dune Hoop Earrings', 'category' => 'earrings', 'price' => 139, 'material' => '18k gold-plated brass', 'description' => 'Chunky, lightweight hoops with a hinged closure.', 'is_bestseller' => true],
        ['slug' => 'stella-studs', 'name' => 'Stella Studs', 'category' => 'earrings', 'price' => 99, 'material' => 'Sterling silver, cubic zirconia', 'description' => 'Tiny star studs that sparkle without being too much.'],
        ['slug' => 'riva-cuff-bracelet', 'name' => 'Riva Cuff Bracelet', 'category' => 'bracelets', 'price' => 199, 'material' => '18k gold-plated stainless steel', 'description' => 'A smooth open cuff that slips on easily and stays put.', 'is_new' => true],
        ['slug' => 'tennis-bracelet', 'name' => 'Tennis Bracelet', 'category' => 'bracelets', 'price' => 279, 'material' => 'Sterling silver, cubic zirconia', 'description' => 'A line of brilliant-cut stones with a double safety clasp.'],
    ];

    public function run(): void
    {
        foreach (self::CATEGORIES as $index => $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                [...$category, 'sort_order' => $index],
            );
        }

        $categoryIds = Category::pluck('id', 'slug');

        foreach (self::PRODUCTS as $product) {
            $categorySlug = $product['category'];
            unset($product['category']);

            Product::updateOrCreate(
                ['slug' => $product['slug']],
                [...$product, 'category_id' => $categoryIds[$categorySlug], 'stock' => 25],
            );
        }
    }
}
