import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";

import { InteractiveTray } from "./tray/InteractiveTray";
import { Sidebar } from "./controls/Sidebar";
import { useDiceRollStore } from "./dice/store";
import { useEffect, useMemo, useState } from "react";
import { DiceRoll } from "./types/DiceRoll";
import OBR from "@owlbear-rodeo/sdk";

import { Die } from "./types/Die";
import { DiceProtocol } from "./types/diceProtocol";

export function App() {
  const rollValues = useDiceRollStore(state => state.rollValues);
  const startRoll = useDiceRollStore(state => state.startRoll);

  const [activeRollRequest, setActiveRollRequest] =
    useState<DiceProtocol.RollRequest | null>(null);

  useEffect(() => {
    const sendConfig = () => {
      console.log("request received");
      OBR.broadcast.sendMessage(
        DiceProtocol.DICE_CLIENT_HELLO_CHANNEL,
        {
          rollRequestChannel: DiceProtocol.ROLL_REQUEST_CHANNEL,
          dieTypes: ["D4", "D6", "D8", "D10", "D12", "D20", "D100"],
          styles: [
            { id: "GALAXY", color: "#17191d" },
            { id: "GEMSTONE", color: "#443554" },
            { id: "GLASS", color: "#035978" },
            { id: "IRON", color: "#d3d5db" },
            { id: "NEBULA", color: "#5c67ac" },
            { id: "SUNRISE", color: "#6ba7d5" },
            { id: "SUNSET", color: "#ca3f3a" },
            { id: "WALNUT", color: "#714c3e" },
          ],
          structuredFeatures: ["multiColor"],
        } as DiceProtocol.DiceRollerConfig,
        { destination: "LOCAL" }
      );
    };

    sendConfig();
    return OBR.broadcast.onMessage(
      DiceProtocol.DICE_ROLLER_HELLO_CHANNEL,
      sendConfig
    );
  }, []);

  useEffect(
    () =>
      OBR.broadcast.onMessage(DiceProtocol.ROLL_REQUEST_CHANNEL, event => {
        const rollRequest = event.data as DiceProtocol.RollRequest;
        if (activeRollRequest !== null) {
          throw new Error(
            `Roll request ${rollRequest.id} was rejected because another roll is in progress.`
          );
        }
        const diceRoll: DiceRoll = {
          dice: rollRequest.dice.map(
            die =>
              ({
                id: die.id,
                style: die.styleId
                  ? die.styleId
                  : rollRequest.styleId
                  ? rollRequest.styleId
                  : "GALAXY",
                type: die.type,
              } as Die)
          ),
          hidden: rollRequest.gmOnly,
          combination: rollRequest.combination
            ? rollRequest.combination
            : "SUM",
          bonus: rollRequest.bonus ? rollRequest.bonus : 0,
        };
        startRoll(diceRoll);
        OBR.action.open();
        setActiveRollRequest(rollRequest);
      }),
    [activeRollRequest]
  );

  const finishedRolling = useMemo(() => {
    const values = Object.values(rollValues);
    if (values.length === 0) {
      return false;
    } else {
      return values.every(value => value !== null);
    }
  }, [rollValues]);

  useEffect(() => {
    if (finishedRolling && activeRollRequest !== null) {
      const result = Object.entries(rollValues).map(entry => ({
        id: entry[0],
        result: entry[1],
      }));
      OBR.broadcast.sendMessage(
        activeRollRequest.replyChannel,
        {
          id: activeRollRequest.id,
          gmOnly: activeRollRequest.gmOnly,
          result,
        } as DiceProtocol.RollResult,
        { destination: "LOCAL" }
      );

      setActiveRollRequest(null);
    }
  }, [finishedRolling, rollValues]);

  return (
    <Container disableGutters maxWidth="md">
      <Stack direction="row" justifyContent="center">
        <Sidebar />
        <InteractiveTray />
      </Stack>
    </Container>
  );
}

function sendDiceRollerConfig() {
  OBR.broadcast.sendMessage(
    "general.diceClient.hello",
    {
      rollRequestChannel: DiceProtocol.ROLL_REQUEST_CHANNEL,
      dieTypes: ["D4", "D6", "D8", "D10", "D12", "D20", "D100"],
      styles: [
        { id: "GALAXY", color: "#17191d" },
        { id: "GEMSTONE", color: "#443554" },
        { id: "GLASS", color: "#035978" },
        { id: "IRON", color: "#d3d5db" },
        { id: "NEBULA", color: "#5c67ac" },
        { id: "SUNRISE", color: "#6ba7d5" },
        { id: "SUNSET", color: "#ca3f3a" },
        { id: "WALNUT", color: "#714c3e" },
      ],
      structuredFeatures: ["multiColor"],
    } as DiceProtocol.DiceRollerConfig,
    { destination: "LOCAL" }
  );
}
