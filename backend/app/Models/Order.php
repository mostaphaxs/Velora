<?php

namespace App\Models;

use App\Enums\OrderStatus;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable([
    'reference',
    'user_id',
    'customer_name',
    'phone',
    'city',
    'address',
    'notes',
    'subtotal',
    'shipping',
    'total',
    'status',
    'payment_method',
])]
class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'subtotal' => 'integer',
            'shipping' => 'integer',
            'total' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Order $order): void {
            $order->reference ??= static::generateReference();
        });
    }

    /**
     * A short, human-friendly order number such as "VEL-7K2M9Q".
     */
    public static function generateReference(): string
    {
        do {
            $reference = 'VEL-'.Str::upper(Str::random(6));
        } while (static::where('reference', $reference)->exists());

        return $reference;
    }

    /**
     * Whether the customer placed this order from a signed-in account.
     * Guest orders are confirmed by the customer over WhatsApp instead.
     */
    public function placedFromAccount(): bool
    {
        return $this->user_id !== null;
    }

    /**
     * WhatsApp chat link to the customer, with a ready-to-send message about this order.
     */
    public function whatsappUrl(): string
    {
        $digits = preg_replace('/\D/', '', $this->phone);
        $international = str_starts_with($digits, '212') ? $digits : '212'.ltrim($digits, '0');

        $firstName = Str::before($this->customer_name, ' ');
        $total = number_format($this->total, 0, ',', ' ').' MAD';
        $message = "Hello {$firstName}, this is Velora about your order {$this->reference} ({$total}). ";

        return "https://wa.me/{$international}?text=".rawurlencode($message);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
