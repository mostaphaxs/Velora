<?php

namespace App\Filament\Resources\Products\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('images')
                    ->label('Photos')
                    ->disk('public')
                    ->square()
                    ->stacked()
                    ->limit(3)
                    ->limitedRemainingText(),
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->description(fn ($record): string => $record->material),
                TextColumn::make('category.name')
                    ->badge()
                    ->sortable(),
                TextColumn::make('price')
                    ->money('MAD', locale: 'fr_MA', decimalPlaces: 0)
                    ->sortable(),
                TextColumn::make('stock')
                    ->badge()
                    ->color(fn (int $state): string => match (true) {
                        $state === 0 => 'danger',
                        $state <= 5 => 'warning',
                        default => 'success',
                    })
                    ->sortable(),
                IconColumn::make('is_active')
                    ->label('Visible')
                    ->boolean(),
                IconColumn::make('is_bestseller')
                    ->label('Bestseller')
                    ->boolean()
                    ->toggleable(),
                IconColumn::make('is_featured')
                    ->label('In hero')
                    ->boolean()
                    ->toggleable(),
                IconColumn::make('is_new')
                    ->label('New')
                    ->boolean()
                    ->toggleable(),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->relationship('category', 'name'),
                TernaryFilter::make('is_active')
                    ->label('Visible in shop'),
                TernaryFilter::make('is_featured')
                    ->label('In homepage hero'),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
