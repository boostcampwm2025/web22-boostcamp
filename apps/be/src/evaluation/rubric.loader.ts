import { Injectable } from '@nestjs/common';

import { CsRubric, Level } from './rubric.types';
import { UDP_JUNIOR_RUBRIC } from './udp.junior';

@Injectable()
export class RubricLoader {
  // MVP: 하드코딩 맵 (나중에 DB/파일/자동생성으로 대체)
  private readonly rubrics: Record<string, CsRubric> = {
    'UDP:junior': UDP_JUNIOR_RUBRIC,
  };

  load(topic: string, level: Level): CsRubric {
    const key = `${topic}:${level}`;
    const rubric = this.rubrics[key];
    if (!rubric) throw new Error(`Rubric not found: ${key}`);
    return rubric;
  }
}
