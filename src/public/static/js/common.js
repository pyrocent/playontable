import {Room} from "./room.js";
import {diceConfig} from "./table/dice.js";
import {cardConfig} from "./table/card.js";
import {chipConfig} from "./table/chip.js";
import {otherConfig} from "./table/other.js";
import ably from "https://cdn.jsdelivr.net/npm/ably@2.12.0/+esm";
import {gsap} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm";
import {Draggable} from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/Draggable.min.js";

window.Room = Room;
window.ably = ably;
window.gsap = gsap;
window.Draggable = Draggable;
window.diceConfig = diceConfig();
window.cardConfig = cardConfig();
window.chipConfig = chipConfig();
window.otherConfig = otherConfig();
