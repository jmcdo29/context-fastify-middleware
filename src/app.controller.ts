import { Controller, Get, Req, Post } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(@Req() req): { regular: string; raw: string | undefined } {
    return {
      regular: req.custom,
      raw: req.raw?.custom,
    };
  }
  @Post()
  getPostHello(@Req() req): { regular: string; raw: string | undefined } {
    return {
      regular: req.custom,
      raw: req.raw?.custom,
    };
  }
}
