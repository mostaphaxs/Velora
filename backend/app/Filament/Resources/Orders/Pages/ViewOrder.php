<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Resources\Orders\OrderResource;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;
use Filament\Support\Icons\Heroicon;

class ViewOrder extends ViewRecord
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('whatsapp')
                ->label('Contact on WhatsApp')
                ->icon(Heroicon::OutlinedChatBubbleLeftRight)
                ->color('success')
                ->url(fn (): string => $this->getRecord()->whatsappUrl())
                ->openUrlInNewTab(),
            EditAction::make()->label('Update status'),
        ];
    }
}
