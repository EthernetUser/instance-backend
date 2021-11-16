import { SetMetadata } from '@nestjs/common';

export const TYPES_KEY = 'types';

export const TYPES = (...types: string[]) => SetMetadata(TYPES_KEY, types);
