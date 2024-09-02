import { DraftPick } from '../App'

export function currentPickNumber(picks: DraftPick[]) {
  for (let i = 0; i < picks.length; i++) {
    if (picks[i].pick_no !== i + 1) {
      return i + 1;
    }
  }
  return picks.length + 1;
}

export function formatPick(currentPick: number, teams = 10) {
  const round = Math.ceil(currentPick / teams);
  const pickInRound = currentPick % teams === 0 ? teams : currentPick % teams;
  return `${round}.${pickInRound}`;
}

export const initPositionCounts: any = {
  RB: 0,
  WR: 0,
  TE: 0,
  QB: 0,
  K: 0,
  DEF: 0,
};
export function countPlayersByPosition(picks: DraftPick[], currentPick: number) {
  let positionCounts = { ...initPositionCounts }; // Create a new copy of initPosoitionCounts to avoid runaway bug

  const validPicks = picks.filter((pick) => pick.pick_no < currentPick);

  validPicks.forEach((pick) => {
    const position: string = pick.metadata.position;
    if (position in positionCounts) {
      positionCounts[position] += 1;
    }
  });

  return positionCounts;
}

export const positionalPickNumber = (picks: DraftPick[], pick: any) => {
  // Filter the picks to include only those of the same position and earlier than the current pick
  const positionPicks = picks.filter(
    (p: any) =>
      p.metadata.position === pick.metadata.position && p.pick_no < pick.pick_no
  );

  // The length of the filtered array plus one gives us the positional pick number
  return positionPicks.length + 1;
};
