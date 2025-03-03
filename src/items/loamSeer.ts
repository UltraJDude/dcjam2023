import { Bless, Bravery, oneOpponent, onlyMe, opponents } from "../actions";
import isDefined from "../tools/isDefined";
import { oneOf } from "../tools/rng";
import Item from "../types/Item";

export const Cornucopia: Item = {
  name: "Cornucopia",
  restrict: ["Loam Seer"],
  slot: "Hand",
  type: "Catalyst",
  bonus: {},
  action: Bless,
};

export const JacketAndRucksack: Item = {
  name: "Jacket and Rucksack",
  restrict: ["Loam Seer"],
  slot: "Body",
  type: "Armour",
  bonus: {},
  action: {
    name: "Search",
    tags: [],
    sp: 4,
    targets: oneOpponent,
    act({ g, targets }) {
      g.addEffect(() => ({
        name: "Search",
        duration: Infinity,
        affects: targets,
        // TODO: enemy is more likely to drop items
      }));
    },
  },
};

export const IoliteCross: Item = {
  name: "Iolite Cross",
  restrict: ["Loam Seer"],
  slot: "Hand",
  type: "Catalyst",
  bonus: { spirit: 1 },
  action: {
    name: "Vanish",
    tags: ["movement"],
    sp: 2,
    targets: onlyMe,
    act() {
      // TODO opponents in the three closest spots will give up and find better targets to approach. If the party's fully surrounded or all your allies are down this doesn't do much
    },
  },
};

export const BeekeeperBrooch: Item = {
  name: "Beekeeper's Brooch of Needling",
  restrict: ["Loam Seer"],
  slot: "Hand",
  type: "Catalyst",
  bonus: {},
  action: {
    name: "Swarm",
    tags: ["attack", "spell"],
    sp: 2,
    targets: opponents(3, [0, 1, 3]),
    act({ g, me, targets }) {
      g.applyDamage(me, targets, 3, "hp", "magic");
    },
  },
};

export const RockringSleeve: Item = {
  name: "Rockring Sleeve",
  restrict: ["Loam Seer"],
  slot: "Body",
  type: "Armour",
  bonus: { dr: 2 },
  action: Bravery,
};

export const Mosscloak: Item = {
  name: "Mosscloak",
  restrict: ["Loam Seer"],
  slot: "Body",
  type: "Armour",
  bonus: {},
  action: {
    name: "Study",
    tags: [],
    sp: 1,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect(() => ({
        name: "Study",
        duration: 2,
        affects: [me],
        onAfterDamage({ target, type }) {
          if (this.affects.includes(target) && type === "hp")
            target.sp = Math.min(target.sp + 2, target.maxSP);
        },
      }));
    },
  },
};

export const WandOfWorkedFlint: Item = {
  name: "Wand of Worked Flint",
  restrict: ["Loam Seer"],
  slot: "Special",
  bonus: {},
  action: {
    name: "Crackle",
    tags: ["attack", "spell"],
    sp: 2,
    x: true,
    targets: { type: "enemy" },
    act({ g, me, targets, x }) {
      for (let i = 0; i < x; i++) {
        const alive = targets.filter((t) => t.alive);
        if (!alive.length) return;

        const target = oneOf(alive);
        const amount = g.roll(me) + 2;
        g.applyDamage(me, [target], amount, "hp", "magic");
      }
    },
  },
};

export const TortoiseFamiliar: Item = {
  name: "Tortoise Familiar",
  restrict: ["Loam Seer"],
  slot: "Special",
  bonus: { camaraderie: 1 },
  action: {
    name: "Reforge",
    tags: ["heal", "spell"],
    sp: 5,
    targets: onlyMe,
    act({ g, me }) {
      g.heal(me, [me], Infinity);
    },
  },
};

export const MantleOfClay: Item = {
  name: "Mantle of Clay",
  restrict: ["Loam Seer"],
  slot: "Special",
  bonus: { dr: 1 },
  action: {
    name: "Rumble",
    tags: ["attack", "spell"],
    sp: 4,
    targets: opponents(),
    act({ g, me }) {
      const amount = g.roll(me) + 10;
      const opponent = g.getOpponent(me);
      const others = [
        g.getOpponent(me, 1),
        g.getOpponent(me, 2),
        g.getOpponent(me, 3),
      ].filter(isDefined);

      const targets = [opponent, oneOf(others)].filter(isDefined);
      g.applyDamage(me, targets, amount, "hp", "magic");
      g.applyDamage(me, targets, 1, "spirit", "magic");
    },
  },
};

Cornucopia.lore = `The proverbial horn of plenty, or rather a replica crafted by the artists of Haringlee, then bestowed by its priests with a magickal knack for exuding a sweet restorative nectar.`;

JacketAndRucksack.lore = `Clothes and containers of simple leather. Sensible wear for foragers and druidic types; not truly intended for fighting.`;

IoliteCross.lore = `A semi-precious crux. Light generated by uncanny phosphorous plants - or by the setting sun - hits this substance at a remarkable, almost magickal angle.`;

BeekeeperBrooch.lore = `The badge of office for any who ally with insectkind. Bids fierce clouds of bees to deliver a salvo of stings to the assailants of one truly in harmony with the earth, if they are humble and bereft of secret ambition.`;

RockringSleeve.lore = `A set of four polished hoops of granite, fit to mold closely to its wearer's forearm. Studied practitioners of the power that dwells within rock can share the protection of such a carapace with their compatriots.`;

Mosscloak.lore = `Deep into the wilderness where wood meets river, a type of silver-grey-green moss flourishes that piles on so thick that, when carefully detached from the tree trunk it hugs, can retain its integrity as a naturally-occurring fabric. This specimen reaches all the way from shoulder to foot and trails some length along the ground behind you!`;

WandOfWorkedFlint.lore = `A spike of sparking rock, decorated with one twisting groove from haft to tip. Rubbing your thumb along the thing produces a faint sizzling sound.`;

TortoiseFamiliar.lore = `The tortoise is one of the ground's favoured children, fashioned in its image. This one seems to have an interest in your cause.`;

MantleOfClay.lore = `Pots of runny clay, into which fingers and paintbrushes can be dipped. It grips the skin tight as any tattoo when applied in certain patterns, like veins; so too can the shaman who wears these marks espy the "veins" of the rocks below them and, with a tug, bid them tremble.`;
