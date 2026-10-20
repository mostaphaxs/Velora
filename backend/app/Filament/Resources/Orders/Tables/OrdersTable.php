<?php

namespace App\Filament\Resources\Orders\Tables;

use App\Enums\OrderStatus;
use App\Models\Order;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('reference')
                    ->searchable()
                    ->copyable()
                    ->weight('bold'),
                TextColumn::make('customer_name')
                    ->label('Customer')
                    ->searchable()
                    ->description(fn ($record): string => $record->phone),
                TextColumn::make('city')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('total')
                    ->money('MAD', locale: 'fr_MA', decimalPlaces: 0)
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->sortable(),
                TextColumn::make('placed_via')
                    ->label('Placed via')
                    ->state(fn (Order $record): string => $record->placedFromAccount() ? 'Account' : 'WhatsApp')
                    ->badge()
                    ->color(fn (Order $record): string => $record->placedFromAccount() ? 'primary' : 'success'),
                TextColumn::make('created_at')
                    ->label('Placed')
                    ->since()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options(OrderStatus::class),
            ])
            ->recordActions([
                Action::make('whatsapp')
                    ->label('WhatsApp')
                    ->icon(Heroicon::OutlinedChatBubbleLeftRight)
                    ->color('success')
                    ->url(fn (Order $record): string => $record->whatsappUrl())
                    ->openUrlInNewTab(),
                ViewAction::make(),
                EditAction::make()->label('Update status'),
            ]);
    }
}
