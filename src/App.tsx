import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";

import { InteractiveTray } from "./tray/InteractiveTray";
import { Sidebar } from "./controls/Sidebar";
import { useDiceRollStore } from "./dice/store";
import { useEffect, useMemo, useState } from "react";
import { DiceRoll } from "./types/DiceRoll";
import OBR from "@owlbear-rodeo/sdk";
import {
  CheckForDiceExtensions,
  DiceExtensionResponse,
  RollRequest,
  RollResult,
} from "./types/diceProtocol";
import { Die } from "./types/Die";

const HELLO_CHANNEL = "general.dice.hello";
const REQUEST_CHANNEL = "rodeo.owlbear.dice.request";

export function App() {
  const rollValues = useDiceRollStore(state => state.rollValues);
  const startRoll = useDiceRollStore(state => state.startRoll);

  const [activeRollRequest, setActiveRollRequest] =
    useState<RollRequest | null>(null);

  useEffect(
    () =>
      OBR.broadcast.onMessage(HELLO_CHANNEL, event => {
        console.log("connection request received");
        const data = event.data as CheckForDiceExtensions;
        OBR.broadcast.sendMessage(
          data.replyChannel,
          {
            requestChannel: REQUEST_CHANNEL,
            dieTypes: ["D4", "D6", "D8", "D10", "D12", "D20", "D100"],
            styles: [
              { style: "GALAXY", code: "#17191d" },
              { style: "GEMSTONE", code: "#443554" },
              { style: "GLASS", code: "#035978" },
              { style: "IRON", code: "#d3d5db" },
              { style: "NEBULA", code: "#5c67ac" },
              { style: "SUNRISE", code: "#6ba7d5" },
              { style: "SUNSET", code: "#ca3f3a" },
              { style: "WALNUT", code: "#714c3e" },
            ],
            structuredFeatures: ["multiColor"],
          } as DiceExtensionResponse,
          { destination: "LOCAL" }
        );
      }),
    []
  );

  useEffect(
    () =>
      OBR.broadcast.onMessage(REQUEST_CHANNEL, event => {
        const rollRequest = event.data as RollRequest;
        if (activeRollRequest !== null) {
          console.error(
            `Roll in progress, request for ${rollRequest.replyChannel} was aborted`
          );
          return;
        }
        if (rollRequest.type !== "structured") {
          console.error(`Unstructured roll requests are not supported`);
          return;
        }
        console.log("roll request received");
        const dice: DiceRoll = {
          dice: rollRequest.dice.map(
            die =>
              ({
                id: die.id,
                style: die.style
                  ? die.style
                  : rollRequest.style
                  ? rollRequest.style
                  : "GALAXY",
                type: die.type,
              } as Die)
          ),
          hidden: rollRequest.hidden,
        };
        startRoll(dice);
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
        [entry[0]]: entry[1],
      }));
      OBR.broadcast.sendMessage(
        activeRollRequest.replyChannel,
        { result, type: "structured" } as RollResult,
        {
          destination: "LOCAL",
        }
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
