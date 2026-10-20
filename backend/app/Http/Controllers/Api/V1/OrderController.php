<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\PlaceOrder;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    /**
     * Place an order. Works for guests; signed-in customers get it linked to their account.
     */
    public function store(StoreOrderRequest $request, PlaceOrder $placeOrder): JsonResponse
    {
        $order = $placeOrder->handle($request->validated(), $request->user('sanctum'));

        return (new OrderResource($order))->response()->setStatusCode(201);
    }
}
