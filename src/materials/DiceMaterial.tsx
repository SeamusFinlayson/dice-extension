import { DiceStyle } from "../types/DiceStyle";
import { DiceType } from "../types/DiceType";
import { GalaxyMaterial } from "./galaxy/GalaxyMaterial";
import { GalaxyMaterialD3 } from "./galaxyD3/GalaxyMaterialD3";
import { GemstoneMaterial } from "./gemstone/GemstoneMaterial";
import { GemstoneMaterial3D } from "./gemstoneD3/GemstoneMaterialD3";
import { GlassMaterial } from "./glass/GlassMaterial";
import { GlassMaterialD3 } from "./glassD3/GlassMaterialD3";
import { IronMaterial } from "./iron/IronMaterial";
import { IronMaterialD3 } from "./ironD3/IronMaterialD3";
import { NebulaMaterial } from "./nebula/NebulaMaterial";
import { NebulaMaterialD3 } from "./nebulaD3/NebulaMaterialD3";
import { SunriseMaterial } from "./sunrise/SunriseMaterial";
import { SunriseMaterialD3 } from "./sunriseD3/SunriseMaterialD3";
import { SunsetMaterial } from "./sunset/SunsetMaterial";
import { SunsetMaterialD3 } from "./sunsetD3/SunsetMaterialD3";
import { WalnutMaterial } from "./walnut/WalnutMaterial";
import { WalnutMaterialD3 } from "./walnutD3/WalnutMaterialD3";

export function DiceMaterial({
  diceStyle,
  diceType,
}: {
  diceStyle: DiceStyle;
  diceType: DiceType;
}) {
  switch (diceStyle) {
    case "GALAXY":
      if (diceType === "D3") return <GalaxyMaterialD3 />;
      return <GalaxyMaterial />;
    case "GEMSTONE":
      if (diceType === "D3") return <GemstoneMaterial3D />;
      return <GemstoneMaterial />;
    case "GLASS":
      if (diceType === "D3") return <GlassMaterialD3 />;
      return <GlassMaterial />;
    case "IRON":
      if (diceType === "D3") return <IronMaterialD3 />;
      return <IronMaterial />;
    case "NEBULA":
      if (diceType === "D3") return <NebulaMaterialD3 />;
      return <NebulaMaterial />;
    case "SUNRISE":
      if (diceType === "D3") return <SunriseMaterialD3 />;
      return <SunriseMaterial />;
    case "SUNSET":
      if (diceType === "D3") return <SunsetMaterialD3 />;
      return <SunsetMaterial />;
    case "WALNUT":
      if (diceType === "D3") return <WalnutMaterialD3 />;
      return <WalnutMaterial />;
    default:
      throw Error(`Dice style ${diceStyle} error: not implemented`);
  }
}
