<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @mixin Product
 */
class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $images = collect($this->images ?? [])
            ->map(fn (string $path): string => Storage::disk('public')->url($path))
            ->values()
            ->all();

        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'category' => $this->whenLoaded('category', fn (): string => $this->category->slug),
            'price' => $this->price,
            'compareAtPrice' => $this->compare_at_price,
            'material' => $this->material,
            'description' => $this->description,
            'image' => $images[0] ?? null,
            'images' => $images,
            'inStock' => $this->stock > 0,
            'isNew' => $this->is_new,
            'isBestseller' => $this->is_bestseller,
            'isFeatured' => $this->is_featured,
        ];
    }
}
