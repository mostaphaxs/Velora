<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    /**
     * List active products, optionally filtered by category, new, bestseller or featured (homepage hero).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->validate([
            'category' => ['nullable', 'string', 'max:50'],
            'new' => ['nullable', 'boolean'],
            'bestseller' => ['nullable', 'boolean'],
            'featured' => ['nullable', 'boolean'],
        ]);

        $products = Product::active()
            ->with('category')
            ->when($filters['category'] ?? null, fn (Builder $query, string $slug) => $query->whereRelation('category', 'slug', $slug))
            ->when($request->boolean('new'), fn (Builder $query) => $query->where('is_new', true))
            ->when($request->boolean('bestseller'), fn (Builder $query) => $query->where('is_bestseller', true))
            ->when($request->boolean('featured'), fn (Builder $query) => $query->where('is_featured', true))
            ->orderBy('id')
            ->get();

        return ProductResource::collection($products);
    }

    public function show(Product $product): ProductResource
    {
        abort_unless($product->is_active, 404);

        return new ProductResource($product->load('category'));
    }
}
