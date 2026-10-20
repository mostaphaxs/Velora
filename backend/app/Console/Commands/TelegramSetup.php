<?php

namespace App\Console\Commands;

use App\Support\TelegramAlerts;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

#[Signature('velora:telegram-setup')]
#[Description('Find your Telegram chat ID and send a test order alert')]
class TelegramSetup extends Command
{
    public function handle(): int
    {
        $token = config('services.telegram.bot_token');

        if (blank($token)) {
            $this->line('1. In Telegram, open @BotFather, send /newbot and follow the steps.');
            $this->line('2. Copy the token it gives you into backend/.env as TELEGRAM_BOT_TOKEN=...');
            $this->line('3. Open your new bot in Telegram and send it any message (e.g. "hi").');
            $this->line('4. Run this command again.');

            return self::SUCCESS;
        }

        if (blank(config('services.telegram.chat_id'))) {
            $updates = Http::timeout(10)->get("https://api.telegram.org/bot{$token}/getUpdates")->json('result', []);
            $chats = collect($updates)
                ->map(fn (array $update): ?array => $update['message']['chat'] ?? null)
                ->filter()
                ->unique('id');

            if ($chats->isEmpty()) {
                $this->warn('No messages found. Send your bot a message in Telegram, then run this again.');

                return self::FAILURE;
            }

            foreach ($chats as $chat) {
                $this->info('Chat found: '.($chat['first_name'] ?? $chat['title'] ?? 'chat').' → TELEGRAM_CHAT_ID='.$chat['id']);
            }
            $this->line('Put that line in backend/.env, then run this command once more to send a test alert.');

            return self::SUCCESS;
        }

        if (TelegramAlerts::send('✅ Velora order alerts are connected. New orders will appear here.')) {
            $this->info('Test alert sent. Check Telegram!');

            return self::SUCCESS;
        }

        $this->error('Telegram rejected the message. Check the token and chat ID in backend/.env.');

        return self::FAILURE;
    }
}
