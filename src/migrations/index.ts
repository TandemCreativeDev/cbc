import * as migration_20261112_223859_initial from './20261112_223859_initial';
import * as migration_20261112_232319_calendar from './20261112_232319_calendar';
import * as migration_20261112_232323_calendar_checks from './20261112_232323_calendar_checks';

export const migrations = [
  {
    up: migration_20261112_223859_initial.up,
    down: migration_20261112_223859_initial.down,
    name: '20261112_223859_initial',
  },
  {
    up: migration_20261112_232319_calendar.up,
    down: migration_20261112_232319_calendar.down,
    name: '20261112_232319_calendar',
  },
  {
    up: migration_20261112_232323_calendar_checks.up,
    down: migration_20261112_232323_calendar_checks.down,
    name: '20261112_232323_calendar_checks'
  },
];
