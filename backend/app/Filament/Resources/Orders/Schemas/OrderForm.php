<?php

namespace App\Filament\Resources\Orders\Schemas;

use App\Enums\OrderStatus;
use App\Models\Order;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

/**
 * Admins may only move an order through its statuses and adjust delivery notes.
 * Totals and line items are a record of what the customer agreed to and stay read-only.
 */
class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('status')
                    ->options(OrderStatus::class)
                    ->required()
                    // Cancelled orders already returned their stock, so they stay cancelled
                    ->disabled(fn (?Order $record): bool => $record?->status === OrderStatus::Cancelled)
                    ->helperText(fn (?Order $record): string => $record?->status === OrderStatus::Cancelled
                        ? 'This order is cancelled and its items were returned to stock.'
                        : 'Cancelling returns the items to stock.'),
                Textarea::make('notes')
                    ->rows(3)
                    ->maxLength(500)
                    ->columnSpanFull(),
            ]);
    }
}
