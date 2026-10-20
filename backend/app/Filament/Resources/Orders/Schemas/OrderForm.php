<?php

namespace App\Filament\Resources\Orders\Schemas;

use App\Enums\OrderStatus;
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
                    ->required(),
                Textarea::make('notes')
                    ->rows(3)
                    ->maxLength(500)
                    ->columnSpanFull(),
            ]);
    }
}
