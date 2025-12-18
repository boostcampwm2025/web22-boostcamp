import { Body, Controller, Post } from '@nestjs/common';

import type { AssessRequestDto } from './assess.dto';
import { AssessService } from './assess.service';

@Controller('assess')
export class AssessController {
  constructor(private readonly svc: AssessService) {}

  @Post()
  assess(@Body() body: AssessRequestDto) {
    return this.svc.assess(body);
  }
}
