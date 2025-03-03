import Item from "../types/Item";
import * as cleavesman from "./cleavesman";
import * as farScout from "./farScout";
import * as flagSinger from "./flagSinger";
import * as loamSeer from "./loamSeer";
import * as martialist from "./martialist";
import * as warCaller from "./warCaller";

const allItems = Object.fromEntries(
  [cleavesman, farScout, flagSinger, loamSeer, martialist, warCaller].flatMap(
    (repository) => Object.values(repository).map((item) => [item.name, item])
  )
);

export function getItem(s: string): Item | undefined {
  return allItems[s];
}
