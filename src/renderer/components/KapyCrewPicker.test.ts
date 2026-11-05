import { describe, expect, it } from 'vitest';

import type { KapyCrewMember } from '../../shared/contracts';
import {
  assignKapyCrewRole,
  toggleKapyCrewMember,
} from './KapyCrewPicker';

const baseCrew: readonly KapyCrewMember[] = [
  { packId: 'classic', role: 'planner' },
  { packId: 'twilight', role: 'artist' },
  { packId: 'hellokitty', role: 'engineer' },
];

describe('KapyCrewPicker helpers', () => {
  it('adds a unique pack in the first unfilled role', () => {
    expect(toggleKapyCrewMember(baseCrew, 'mosslight')).toEqual([
      ...baseCrew,
      { packId: 'mosslight', role: 'tester' },
    ]);
  });

  it('enforces the two-to-four member limits', () => {
    const minimum = baseCrew.slice(0, 2);
    expect(toggleKapyCrewMember(minimum, 'classic')).toEqual(minimum);

    const maximum = toggleKapyCrewMember(baseCrew, 'mosslight');
    expect(toggleKapyCrewMember(maximum, 'starforge')).toEqual(maximum);
  });

  it('removes a selected member when the crew remains valid', () => {
    expect(toggleKapyCrewMember(baseCrew, 'twilight')).toEqual([
      { packId: 'classic', role: 'planner' },
      { packId: 'hellokitty', role: 'engineer' },
    ]);
  });

  it('swaps occupied roles instead of producing duplicate assignments', () => {
    expect(assignKapyCrewRole(baseCrew, 'hellokitty', 'planner')).toEqual([
      { packId: 'classic', role: 'engineer' },
      { packId: 'twilight', role: 'artist' },
      { packId: 'hellokitty', role: 'planner' },
    ]);
  });
});
