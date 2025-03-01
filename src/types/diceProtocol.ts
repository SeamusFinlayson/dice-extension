// Destination for the broadcast API should always be set to "LOCAL"

//////////////////////////////////////////////
// channel: "general.dice.hello";
//////////////////////////////////////////////
export type CheckForDiceExtensions = {
  replyChannel: string; // set by the requesting extension
};

//////////////////////////////////////////////
// channel ex: "requestingExtension.hello";
//////////////////////////////////////////////
export type DiceExtensionResponse = {
  requestChannel: string; // set by the dice extension
  dieTypes: DieType[];
  styles?: DieStyle[]; // An empty array indicates that this feature is not supported
  unstructuredFeatures?: UnstructuredFeature[];
  structuredFeatures?: StructuredFeature[];
};

export type UnstructuredFeature =
  | "advantage"
  | "disadvantage"
  | "keepHighest"
  | "keepLowest"
  | "exploding"
  | string; // exhaustive list of features: https://dice-roller.github.io/documentation/guide/notation/
export type StructuredFeature = "multiColor" | string;
export type DieStyle = { style: string; code: string }; // style is an identifier that the dice extension understands, code is a hex color or css color that the requesting extension can use to generate ui to show the user options
export type DieType =
  | "D2"
  | "D4"
  | "D6"
  | "D8"
  | "D10"
  | "D20"
  | "D30"
  | "D100";

//////////////////////////////////////////////
// channel ex: "diceExtension.roll";
//////////////////////////////////////////////
export type RollRequest = {
  replyChannel: string; // set by requesting extension
  hidden: boolean;
  style?: string;
} & (StructuredRoll | UnstructuredRoll);

export type UnstructuredRoll = { type: "unstructured"; equation: string };
export type StructuredRoll = { type: "structured"; dice: Die[] };

export type Die = { id: string; style?: string; type: DieType };

//////////////////////////////////////////////
// channel ex: "requestingExtension.result"
//////////////////////////////////////////////
export type RollResult = StructuredResult | UnstructuredResult;

export type UnstructuredResult = {
  type: "unstructured"; // Must match request type
  result: string; // good formatting standard: https://dice-roller.github.io/documentation/
  total: number;
};
export type StructuredResult = {
  type: "structured";
  result: { [id: string]: number }[];
};
