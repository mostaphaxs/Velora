<?php

namespace App\Observers;

use App\Enums\OrderStatus;
use App\Models\Order;

class OrderObserver
{
    /**
     * Cancelling an order returns its items to stock.
     */
    public function updated(Order $order): void
    {
        if ($order->wasChanged('status') && $order->status === OrderStatus::Cancelled) {
            $order->restock();
        }
    }
}
