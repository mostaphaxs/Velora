<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AccountController extends Controller
{
    public function show(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    /**
     * The signed-in customer's own orders, newest first.
     */
    public function orders(Request $request): AnonymousResourceCollection
    {
        $orders = $request->user()
            ->orders()
            ->with('items')
            ->latest()
            ->paginate(10);

        return OrderResource::collection($orders);
    }
}
