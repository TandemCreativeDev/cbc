import * as migration_20261112_223859_initial from './20261112_223859_initial';
import * as migration_20261112_232319_calendar from './20261112_232319_calendar';
import * as migration_20261112_232323_calendar_checks from './20261112_232323_calendar_checks';
import * as migration_20261113_001547_carousel from './20261113_001547_carousel';
import * as migration_20261113_225308_visible_on_by_default from './20261113_225308_visible_on_by_default';

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
    name: '20261112_232323_calendar_checks',
  },
  {
    up: migration_20261113_001547_carousel.up,
    down: migration_20261113_001547_carousel.down,
    name: '20261113_001547_carousel',
  },
  {
    up: migration_20261113_225308_visible_on_by_default.up,
    down: migration_20261113_225308_visible_on_by_default.down,
    name: '20261113_225308_visible_on_by_default'
  },
];
