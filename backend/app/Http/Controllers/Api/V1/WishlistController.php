<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class WishlistController extends Controller
{
    /**
     * The signed-in customer's saved products that are still in the shop, most recent first.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $products = $request->user()
            ->wishlist()
            ->active()
            ->with('category')
            ->orderByPivot('created_at', 'desc')
            ->get();

        return ProductResource::collection($products);
    }

    public function store(Request $request, Product $product): Response
    {
        abort_unless($product->is_active, 404);

        $request->user()->wishlist()->syncWithoutDetaching([$product->id]);

        return response()->noContent();
    }

    public function destroy(Request $request, Product $product): Response
    {
        $request->user()->wishlist()->detach($product->id);

        return response()->noContent();
    }
}
