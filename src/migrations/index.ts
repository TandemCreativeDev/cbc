import * as migration_20261112_223130_initial from './20261112_223130_initial';

export const migrations = [
  {
    up: migration_20261112_223130_initial.up,
    down: migration_20261112_223130_initial.down,
    name: '20261112_223130_initial'
  },
];
