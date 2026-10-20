<?php

namespace App\Http\Resources;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @mixin Product
 */
class ProductResource extends JsonResource
{
    private const LOW_STOCK = 3;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $images = $this->urls($this->images);
        $colors = $this->variants->map(fn (ProductVariant $variant): array => [
            'name' => $variant->name,
            'hex' => $variant->hex,
            'inStock' => $variant->stock > 0,
            // Only reveal the exact count when it is low enough to be useful to customers
            'onlyLeft' => $variant->stock > 0 && $variant->stock <= self::LOW_STOCK ? $variant->stock : null,
            'images' => $this->urls($variant->images),
        ])->values()->all();

        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'category' => $this->whenLoaded('category', fn (): string => $this->category->slug),
            'price' => $this->price,
            'compareAtPrice' => $this->compare_at_price,
            'material' => $this->material,
            'description' => $this->description,
            // Products photographed only per color still get a main image
            'image' => $images[0] ?? ($colors[0]['images'][0] ?? null),
            'images' => $images,
            'colors' => $colors,
            'inStock' => $this->availableStock() > 0,
            'isNew' => $this->is_new,
            'isBestseller' => $this->is_bestseller,
            'isFeatured' => $this->is_featured,
        ];
    }

    /**
     * @param  list<string>|null  $paths
     * @return list<string>
     */
    private function urls(?array $paths): array
    {
        return collect($paths ?? [])
            ->map(fn (string $path): string => Storage::disk('public')->url($path))
            ->values()
            ->all();
    }
}
