<?php

namespace App\Support;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Sends the shop owner a Telegram message for every new order.
 * Does nothing until TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set.
 */
class TelegramAlerts
{
    public static function isConfigured(): bool
    {
        return filled(config('services.telegram.bot_token')) && filled(config('services.telegram.chat_id'));
    }

    /**
     * Queue the alert to run after the response is sent, so checkout is never slowed down.
     */
    public static function orderPlaced(Order $order): void
    {
        if (! self::isConfigured()) {
            return;
        }

        dispatch(static fn () => self::send(self::orderMessage($order)))->afterResponse();
    }

    public static function orderMessage(Order $order): string
    {
        $mad = fn (int $amount): string => number_format($amount, 0, ',', ' ').' MAD';

        $items = $order->items->map(fn ($item): string => "• {$item->quantity} × {$item->product_name}"
            .($item->color ? " ({$item->color})" : '').' — '.$mad($item->line_total));

        return implode("\n", [
            "🛍️ New order {$order->reference}",
            '',
            ...$items,
            '',
            'Total: '.$mad($order->total).($order->shipping === 0 ? ' (free shipping)' : ''),
            '',
            "👤 {$order->customer_name}",
            "📞 {$order->phone}",
            "📍 {$order->city}, {$order->address}",
            ...($order->notes ? ["📝 {$order->notes}"] : []),
            '',
            $order->placedFromAccount() ? 'Placed from an account: contact them to confirm.' : 'Guest order: they should message you on WhatsApp.',
            url("/admin/orders/{$order->id}"),
        ]);
    }

    /**
     * @return bool Whether Telegram accepted the message
     */
    public static function send(string $text): bool
    {
        try {
            Http::timeout(5)
                ->post('https://api.telegram.org/bot'.config('services.telegram.bot_token').'/sendMessage', [
                    'chat_id' => config('services.telegram.chat_id'),
                    'text' => $text,
                    'disable_web_page_preview' => true,
                ])
                ->throw();

            return true;
        } catch (Throwable $exception) {
            Log::warning('Could not send the Telegram order alert.', ['error' => $exception->getMessage()]);

            return false;
        }
    }
}
