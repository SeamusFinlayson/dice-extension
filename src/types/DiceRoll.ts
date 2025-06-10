import { Dice } from "./Dice";
import { DiceProtocol } from "./diceProtocol";

/**
 * The roll of a set of dice.
 * See `Dice` type for examples of usage
 */
export interface DiceRoll extends Dice {
  hidden?: boolean;
  specialRollData?: {
    type: "POWER_ROLL";
    netEdges: number;
  };
}
