import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TGB from 'node-telegram-bot-api';
import { ShopParserService } from '../shop-parser/shop-parser.service';
import { SALE_MESSAGE, GREETING_MESSAGE, SALES_KEYBOARD_CONFIG } from './constants';

@Injectable()
export class TelegramBotService implements OnModuleInit {
    private bot: TGB;
    private chatId: number;

    constructor(private shopParserService: ShopParserService) {
        this.bot = new TGB(process.env.TELEGRAM_BOT_TOKEN, { polling: true, filepath: false, });
    }

    onModuleInit() {
        this.initialize();
    }

    private initialize() {
        this.bot.on('message', (msg) => {
            this.chatId = msg.chat.id;
            this.sendGreeting();
        });
        this.handleKeyboardInput();
    }

    private handleKeyboardInput() {
        this.bot.on('callback_query', (query) => {
            switch (query.data) {
                case 'getNewYearSale':
                    this.sendSale();
                    break;
                case 'forceUpdate':
                    this.shopParserService.updateGood();
                    this.sendSale();
                    break;
            }
        });
    }

    private sendSale() {
        const sale = this.shopParserService.getSale();
        const { imgSrc, ...good } = sale.goods[0];
        this.bot.sendPhoto(this.chatId, imgSrc, {
            caption: SALE_MESSAGE(good, new Date(sale.dates[0])),
            parse_mode: 'HTML'
        });
    }

    private sendGreeting() {
        this.bot.sendMessage(this.chatId, GREETING_MESSAGE, {
            reply_markup: {
                inline_keyboard: SALES_KEYBOARD_CONFIG
            },
        });
    }
}
