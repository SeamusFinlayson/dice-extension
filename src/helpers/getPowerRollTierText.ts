import { DiceRoll } from "../types/DiceRoll";

export const getPowerRollTierText = (
  diceRoll: DiceRoll,
  rollValues: Record<string, number | null>
) => {
  if (
    !diceRoll.specialRollData ||
    diceRoll.specialRollData.type !== "POWER_ROLL"
  )
    return null;
  if (![-2, -1, 0, 1, 2].includes(diceRoll.specialRollData.netEdges))
    throw new Error("Invalid Net Edges Value");

  // Make roll
  const result = Object.entries(rollValues).map(entry => ({
    id: entry[0],
    result: entry[1],
  }));
  let total = 0;
  for (const roll of result) {
    if (roll.result === null) {
      throw new Error("Invalid result");
    }
    total += roll.result === 0 ? 10 : roll.result;
  }
  const naturalResult = total;
  if (naturalResult >= 19) return "Critical";

  // Apply single edges
  const rollResult = naturalResult + (diceRoll.bonus ? diceRoll.bonus : 0);

  // Get tier
  let tier = 0;
  if (rollResult < 12) tier = 1;
  else if (rollResult < 17) tier = 2;
  else tier = 3;

  // Apply double edges
  switch (diceRoll.specialRollData.netEdges) {
    case -2:
      if (tier > 1) tier -= 1;
      break;
    case 2:
      if (tier < 3) tier += 1;
      break;
  }

  return `Tier ${tier}`;
};
