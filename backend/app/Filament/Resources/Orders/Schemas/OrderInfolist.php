<?php

namespace App\Filament\Resources\Orders\Schemas;

use App\Models\Order;
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class OrderInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Section::make('Items')
                    ->columnSpan(2)
                    ->schema([
                        RepeatableEntry::make('items')
                            ->hiddenLabel()
                            ->columns(4)
                            ->schema([
                                TextEntry::make('product_name')->label('Product')->columnSpan(2),
                                TextEntry::make('quantity')->label('Qty'),
                                TextEntry::make('line_total')
                                    ->label('Total')
                                    ->money('MAD', locale: 'fr_MA', decimalPlaces: 0),
                            ]),
                        TextEntry::make('subtotal')->money('MAD', locale: 'fr_MA', decimalPlaces: 0),
                        TextEntry::make('shipping')->money('MAD', locale: 'fr_MA', decimalPlaces: 0),
                        TextEntry::make('total')
                            ->money('MAD', locale: 'fr_MA', decimalPlaces: 0)
                            ->weight('bold'),
                    ]),

                Section::make('Customer')
                    ->columnSpan(1)
                    ->schema([
                        TextEntry::make('reference')->copyable(),
                        TextEntry::make('status')->badge(),
                        TextEntry::make('customer_name')->label('Name'),
                        TextEntry::make('phone')
                            ->url(fn (Order $record): string => $record->whatsappUrl())
                            ->openUrlInNewTab()
                            ->helperText('Opens WhatsApp'),
                        TextEntry::make('city'),
                        TextEntry::make('address'),
                        TextEntry::make('notes')->placeholder('-'),
                        TextEntry::make('user.email')->label('Account')->placeholder('Guest'),
                        TextEntry::make('placed_via')
                            ->label('Placed via')
                            ->state(fn (Order $record): string => $record->placedFromAccount() ? 'Website account' : 'Guest (WhatsApp)')
                            ->badge()
                            ->color(fn (Order $record): string => $record->placedFromAccount() ? 'primary' : 'success'),
                        TextEntry::make('payment_method')
                            ->formatStateUsing(fn (string $state): string => str($state)->replace('_', ' ')->title()),
                        TextEntry::make('created_at')->label('Placed')->dateTime(),
                    ]),
            ]);
    }
}
