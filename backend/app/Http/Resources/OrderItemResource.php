<?php

namespace App\Http\Resources;

use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin OrderItem
 */
class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'productName' => $this->product_name,
            'unitPrice' => $this->unit_price,
            'quantity' => $this->quantity,
            'lineTotal' => $this->line_total,
        ];
    }
}
