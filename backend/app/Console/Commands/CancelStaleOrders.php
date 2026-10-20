<?php

namespace App\Console\Commands;

use App\Enums\OrderStatus;
use App\Models\Order;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('velora:cancel-stale-orders')]
#[Description('Cancel orders that stayed pending too long, returning their items to stock')]
class CancelStaleOrders extends Command
{
    public function handle(): int
    {
        $cutoff = now()->subDays(config('store.cancel_pending_after_days'));
        $cancelled = 0;

        Order::where('status', OrderStatus::Pending)
            ->where('created_at', '<', $cutoff)
            ->chunkById(100, function ($orders) use (&$cancelled): void {
                foreach ($orders as $order) {
                    // The order observer restocks the items
                    $order->update(['status' => OrderStatus::Cancelled]);
                    $cancelled++;
                }
            });

        $this->info("Cancelled {$cancelled} stale order(s).");

        return self::SUCCESS;
    }
}
