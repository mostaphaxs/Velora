<?php

namespace App\Http\Resources;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Order
 */
class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'reference' => $this->reference,
            'status' => $this->status->value,
            'customerName' => $this->customer_name,
            'phone' => $this->phone,
            'city' => $this->city,
            'address' => $this->address,
            'notes' => $this->notes,
            'subtotal' => $this->subtotal,
            'shipping' => $this->shipping,
            'total' => $this->total,
            'paymentMethod' => $this->payment_method,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
