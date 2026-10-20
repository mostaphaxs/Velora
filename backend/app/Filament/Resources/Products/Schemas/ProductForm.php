<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Section::make('Product')
                    ->columnSpan(2)
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (Set $set, ?string $state, string $operation): void {
                                if ($operation === 'create') {
                                    $set('slug', Str::slug((string) $state));
                                }
                            }),
                        TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->alphaDash()
                            ->unique(ignoreRecord: true)
                            ->helperText('Used in the product URL, e.g. /product/luna-signet-ring'),
                        Select::make('category_id')
                            ->label('Category')
                            ->relationship('category', 'name')
                            ->preload()
                            ->required(),
                        TextInput::make('material')
                            ->required()
                            ->maxLength(255),
                        Textarea::make('description')
                            ->required()
                            ->rows(4)
                            ->maxLength(2000)
                            ->columnSpanFull(),
                    ]),

                Section::make('Photos')
                    ->columnSpan(1)
                    ->schema([
                        FileUpload::make('images')
                            ->hiddenLabel()
                            ->image()
                            ->multiple()
                            ->reorderable()
                            ->appendFiles()
                            ->maxFiles(8)
                            ->panelLayout('grid')
                            ->imagePreviewHeight('180')
                            ->disk('public')
                            ->directory('products')
                            ->visibility('public')
                            ->maxSize(4096)
                            ->imageEditor()
                            ->imageAspectRatio('4:5')
                            ->automaticallyCropImagesToAspectRatio()
                            ->imageResizeTargetWidth('1200')
                            ->imageResizeTargetHeight('1500')
                            ->helperText('General photos, up to 8. Drag to reorder: the first is the main photo. Each color below can also have its own photos.'),
                    ]),

                Section::make('Pricing & stock')
                    ->columnSpan(2)
                    ->columns(3)
                    ->schema([
                        TextInput::make('price')
                            ->required()
                            ->integer()
                            ->minValue(1)
                            ->suffix('MAD'),
                        TextInput::make('compare_at_price')
                            ->label('Compare-at price')
                            ->integer()
                            ->minValue(1)
                            ->gt('price')
                            ->suffix('MAD')
                            ->helperText('Original price, shown crossed out for a sale.'),
                        TextInput::make('stock')
                            ->required()
                            ->integer()
                            ->minValue(0)
                            ->default(0)
                            // Products with colors track stock per color instead
                            ->visible(fn (Get $get): bool => blank($get('variants'))),
                    ]),

                Section::make('Colors')
                    ->description('Add the colors this product comes in. Each color has its own stock and photos; leave empty if the product has a single look.')
                    ->columnSpanFull()
                    ->schema([
                        Repeater::make('variants')
                            ->hiddenLabel()
                            ->relationship()
                            ->orderColumn('sort_order')
                            ->reorderable()
                            ->collapsible()
                            ->live()
                            ->defaultItems(0)
                            ->addActionLabel('Add a color')
                            ->itemLabel(fn (array $state): string => filled($state['name'] ?? null)
                                ? $state['name'].' · '.((int) ($state['stock'] ?? 0)).' in stock'
                                : 'New color')
                            ->columns(3)
                            ->schema([
                                TextInput::make('name')
                                    ->label('Color name')
                                    ->placeholder('e.g. Gold, Silver, Rose gold')
                                    ->required()
                                    ->maxLength(50)
                                    ->distinct()
                                    ->live(onBlur: true),
                                ColorPicker::make('hex')
                                    ->label('Swatch')
                                    ->required()
                                    ->regex('/^#[0-9a-fA-F]{6}$/')
                                    ->default('#c9a45c'),
                                TextInput::make('stock')
                                    ->label('Stock for this color')
                                    ->required()
                                    ->integer()
                                    ->minValue(0)
                                    ->default(0)
                                    ->live(onBlur: true),
                                FileUpload::make('images')
                                    ->label('Photos of this color')
                                    ->image()
                                    ->multiple()
                                    ->reorderable()
                                    ->appendFiles()
                                    ->maxFiles(6)
                                    ->panelLayout('grid')
                                    ->imagePreviewHeight('160')
                                    ->disk('public')
                                    ->directory('products/colors')
                                    ->visibility('public')
                                    ->maxSize(4096)
                                    ->imageEditor()
                                    ->imageAspectRatio('4:5')
                                    ->automaticallyCropImagesToAspectRatio()
                                    ->imageResizeTargetWidth('1200')
                                    ->imageResizeTargetHeight('1500')
                                    ->helperText('Shown on the product page when this color is selected.')
                                    ->columnSpanFull(),
                            ]),
                    ]),

                Section::make('Visibility')
                    ->columnSpan(1)
                    ->schema([
                        Toggle::make('is_active')
                            ->label('Visible in shop')
                            ->default(true),
                        Toggle::make('is_new')
                            ->label('Show "New" badge'),
                        Toggle::make('is_bestseller')
                            ->label('Bestseller'),
                        Toggle::make('is_featured')
                            ->label('Show in homepage hero')
                            ->helperText('Shown in the swipeable card stack at the top of the homepage. Needs at least one photo.'),
                    ]),
            ]);
    }
}
