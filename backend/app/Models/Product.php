<?php

namespace App\Models;

use App\Observers\CatalogObserver;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'category_id',
    'slug',
    'name',
    'description',
    'material',
    'price',
    'compare_at_price',
    'stock',
    'images',
    'is_new',
    'is_bestseller',
    'is_featured',
    'is_active',
])]
#[ObservedBy(CatalogObserver::class)]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'compare_at_price' => 'integer',
            'stock' => 'integer',
            'images' => 'array',
            'is_new' => 'boolean',
            'is_bestseller' => 'boolean',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Only products that are visible in the shop.
     *
     * @param  Builder<Product>  $query
     */
    #[Scope]
    protected function active(Builder $query): void
    {
        $query->where('is_active', true);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
