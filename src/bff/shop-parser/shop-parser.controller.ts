import { Controller, Get } from '@nestjs/common';
import { ShopParserService } from './shop-parser.service';

@Controller('/shop')
export class ShopParserController {
    constructor(private readonly shopParserService: ShopParserService) { }

    @Get('/today-price')
    getTodayPrice(): Product {
        return this.shopParserService.getTodayPrice();
    }
}