"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // globalExternal:nearley
  var require_nearley = __commonJS({
    "globalExternal:nearley"(exports, module) {
      module.exports = globalThis.nearley;
    }
  });

  // node_modules/nanoclone/src/index.js
  function clone(src, seen = /* @__PURE__ */ new Map()) {
    if (!src || typeof src !== "object")
      return src;
    if (seen.has(src))
      return seen.get(src);
    let copy;
    if (src.nodeType && "cloneNode" in src) {
      copy = src.cloneNode(true);
      seen.set(src, copy);
    } else if (src instanceof Date) {
      copy = new Date(src.getTime());
      seen.set(src, copy);
    } else if (src instanceof RegExp) {
      copy = new RegExp(src);
      seen.set(src, copy);
    } else if (Array.isArray(src)) {
      copy = new Array(src.length);
      seen.set(src, copy);
      for (let i = 0; i < src.length; i++)
        copy[i] = clone(src[i], seen);
    } else if (src instanceof Map) {
      copy = /* @__PURE__ */ new Map();
      seen.set(src, copy);
      for (const [k, v] of src.entries())
        copy.set(k, clone(v, seen));
    } else if (src instanceof Set) {
      copy = /* @__PURE__ */ new Set();
      seen.set(src, copy);
      for (const v of src)
        copy.add(clone(v, seen));
    } else if (src instanceof Object) {
      copy = {};
      seen.set(src, copy);
      for (const [k, v] of Object.entries(src))
        copy[k] = clone(v, seen);
    } else {
      throw Error(`Unable to clone ${src}`);
    }
    return copy;
  }
  function src_default(src) {
    return clone(src, /* @__PURE__ */ new Map());
  }

  // src/tools/isDefined.ts
  function isDefined(item) {
    return typeof item !== "undefined";
  }

  // src/tools/rng.ts
  function random(max) {
    return Math.floor(Math.random() * max);
  }
  function oneOf(items) {
    return items[random(items.length)];
  }
  function pickN(items, count) {
    const left = items.slice();
    if (count >= items.length)
      return left;
    const picked = /* @__PURE__ */ new Set();
    for (let i = 0; i < count; i++) {
      const item = oneOf(left);
      picked.add(item);
      left.splice(left.indexOf(item), 1);
    }
    return Array.from(picked);
  }

  // src/tools/sets.ts
  function intersection(a, b) {
    return a.filter((item) => b.includes(item));
  }

  // src/actions.ts
  var onlyMe = { type: "self" };
  var ally = (count) => ({ type: "ally", count });
  var allAllies = { type: "ally" };
  var oneOpponent = {
    type: "enemy",
    distance: 1,
    count: 1,
    offsets: [0]
  };
  var opponents = (count, offsets) => ({
    type: "enemy",
    distance: 1,
    count,
    offsets
  });
  var generateAttack = (plus = 0, sp = 2) => ({
    name: "Attack",
    tags: ["attack"],
    sp,
    targets: oneOpponent,
    act({ g, targets, me }) {
      const bonus = me.attacksInARow;
      const amount = g.roll(me) + plus + bonus;
      g.applyDamage(me, targets, amount, "hp", "normal");
    }
  });
  var endTurnAction = {
    name: "End Turn",
    tags: [],
    sp: 0,
    targets: allAllies,
    useMessage: "",
    act({ g }) {
      g.endTurn();
    }
  };
  var Barb = {
    name: "Barb",
    tags: ["counter"],
    sp: 3,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect(() => ({
        name: "Barb",
        duration: 2,
        affects: [me],
        onAfterDamage(e) {
          if (this.affects.includes(e.target)) {
            const targets = [
              g.getOpponent(me, 0),
              g.getOpponent(me, 1),
              g.getOpponent(me, 3)
            ].filter(isDefined);
            if (targets.length) {
              const target = oneOf(targets);
              const amount = g.roll(me);
              g.addToLog(`${e.target.name} flails around!`);
              g.applyDamage(me, [target], amount, "hp", "normal");
            }
          }
        }
      }));
    }
  };
  var Bless = {
    name: "Bless",
    tags: ["heal", "spell"],
    sp: 1,
    targets: ally(1),
    targetFilter: (c) => c.hp < c.maxHP,
    act({ g, me, targets }) {
      for (const target of targets) {
        const amount = Math.max(0, target.camaraderie) + 2;
        g.heal(me, [target], amount);
      }
    }
  };
  var Brace = {
    name: "Brace",
    tags: ["buff"],
    sp: 3,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect((destroy) => ({
        name: "Brace",
        duration: 2,
        affects: [me],
        buff: true,
        onCalculateDamage(e) {
          if (this.affects.includes(e.target)) {
            e.multiplier /= 2;
            destroy();
          }
        }
      }));
    }
  };
  var Bravery = {
    name: "Bravery",
    tags: ["buff"],
    sp: 3,
    targets: allAllies,
    act({ g, targets }) {
      g.addEffect(() => ({
        name: "Bravery",
        duration: 2,
        affects: targets,
        buff: true,
        onCalculateDR(e) {
          if (this.affects.includes(e.who))
            e.value += 2;
        }
      }));
    }
  };
  var Deflect = {
    name: "Deflect",
    tags: ["buff"],
    sp: 2,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect((destroy) => ({
        name: "Deflect",
        duration: Infinity,
        affects: [me],
        onCalculateDamage(e) {
          if (this.affects.includes(e.target)) {
            g.addToLog(`${me.name} deflects the blow.`);
            e.multiplier = 0;
            destroy();
            return;
          }
        }
      }));
    }
  };
  var Defy = {
    name: "Defy",
    tags: ["buff"],
    sp: 3,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect(() => ({
        name: "Defy",
        duration: 2,
        affects: [me],
        onAfterDamage({ target, attacker }) {
          if (!this.affects.includes(target))
            return;
          g.addToLog(`${me.name} stuns ${attacker.name} with their defiance!`);
          g.addEffect(() => ({
            name: "Defied",
            duration: 1,
            affects: [attacker],
            onCanAct(e) {
              if (this.affects.includes(e.who))
                e.cancel = true;
            }
          }));
        }
      }));
    }
  };
  var DuoStab = {
    name: "DuoStab",
    tags: ["attack"],
    sp: 3,
    targets: opponents(Infinity, [0, 2]),
    act({ g, me, targets }) {
      g.applyDamage(me, targets, 6, "hp", "normal");
    }
  };
  var Flight = {
    name: "Flight",
    tags: ["attack"],
    sp: 4,
    targets: opponents(1, [1, 3]),
    act({ g, me, targets }) {
      const amount = g.roll(me) + 10;
      g.applyDamage(me, targets, amount, "hp", "normal");
    }
  };
  var Parry = {
    name: "Parry",
    tags: ["counter", "buff"],
    sp: 3,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect((destroy) => ({
        name: "Parry",
        duration: Infinity,
        affects: [me],
        onBeforeAction(e) {
          if (intersection(this.affects, e.targets).length && e.action.tags.includes("attack")) {
            g.addToLog(`${me.name} counters!`);
            const amount = g.roll(me);
            g.applyDamage(me, [e.attacker], amount, "hp", "normal");
            destroy();
            e.cancel = true;
            return;
          }
        }
      }));
    }
  };
  var Sand = {
    name: "Sand",
    tags: ["duff"],
    sp: 3,
    targets: oneOpponent,
    act({ g, targets }) {
      g.addEffect(() => ({
        name: "Sand",
        duration: Infinity,
        affects: targets,
        onCalculateDetermination(e) {
          if (this.affects.includes(e.who))
            e.value--;
        }
      }));
    }
  };
  var Scar = {
    name: "Scar",
    tags: ["attack"],
    sp: 3,
    targets: oneOpponent,
    act({ g, me, targets }) {
      const amount = 4;
      g.applyDamage(me, targets, amount, "hp", "normal");
      g.applyDamage(me, targets, amount, "hp", "normal");
      g.applyDamage(me, targets, amount, "hp", "normal");
    }
  };
  var Trick = {
    name: "Trick",
    tags: ["duff"],
    sp: 3,
    targets: oneOpponent,
    act({ g, targets }) {
      g.addEffect(() => ({
        name: "Trick",
        duration: Infinity,
        affects: targets,
        onCalculateCamaraderie(e) {
          if (this.affects.includes(e.who))
            e.value--;
        }
      }));
    }
  };

  // src/tools/numbers.ts
  function wrap(n, max) {
    const m = n % max;
    return m < 0 ? m + max : m;
  }

  // src/enemies.ts
  var Lash = {
    name: "Lash",
    tags: ["attack", "duff"],
    sp: 3,
    targets: oneOpponent,
    act({ g, me, targets }) {
      if (g.applyDamage(me, targets, 3, "hp", "normal") > 0) {
        g.addEffect(() => ({
          name: "Lash",
          duration: 2,
          affects: targets,
          onCalculateDetermination(e) {
            if (this.affects.includes(e.who))
              e.value--;
          }
        }));
      }
    }
  };
  var EnemyObjects = {
    eNettleSage: 100,
    eEveScout: 110,
    eSneedCrawler: 120,
    eMullanginanMartialist: 130
  };
  var enemies = {
    "Eve Scout": {
      object: EnemyObjects.eEveScout,
      animation: { delay: 300, frames: [110, 111, 112, 113] },
      name: "Eve Scout",
      maxHP: 10,
      maxSP: 5,
      camaraderie: 3,
      determination: 3,
      spirit: 4,
      dr: 0,
      actions: [generateAttack(0, 1), Deflect, Sand, Trick]
    },
    "Sneed Crawler": {
      object: EnemyObjects.eSneedCrawler,
      animation: { delay: 300, frames: [120, 121, 122, 123, 124, 125] },
      name: "Sneed Crawler",
      maxHP: 13,
      maxSP: 4,
      camaraderie: 1,
      determination: 5,
      spirit: 4,
      dr: 0,
      actions: [generateAttack(0, 1), Scar, Barb]
    },
    "Mullanginan Martialist": {
      object: EnemyObjects.eMullanginanMartialist,
      animation: { delay: 300, frames: [130, 131, 130, 132] },
      name: "Mullanginan Martialist",
      maxHP: 14,
      maxSP: 4,
      camaraderie: 3,
      determination: 4,
      spirit: 4,
      dr: 0,
      actions: [generateAttack(0, 1), Parry, Defy, Flight]
    },
    "Nettle Sage": {
      object: EnemyObjects.eNettleSage,
      animation: { delay: 300, frames: [100, 101, 100, 102] },
      name: "Nettle Sage",
      maxHP: 12,
      maxSP: 7,
      camaraderie: 2,
      determination: 2,
      spirit: 6,
      dr: 0,
      actions: [generateAttack(0, 1), Bravery, Bless, Lash]
    }
  };
  var EnemyNames = Object.keys(enemies);
  function isEnemyName(name) {
    return EnemyNames.includes(name);
  }
  var Enemy = class {
    constructor(g, template) {
      this.g = g;
      this.template = template;
      this.isPC = false;
      this.animation = template.animation;
      this.frame = 0;
      this.delay = this.animation.delay;
      this.name = template.name;
      this.baseMaxHP = template.maxHP;
      this.baseMaxSP = template.maxSP;
      this.hp = this.maxHP;
      this.sp = this.maxSP;
      this.baseCamaraderie = template.camaraderie;
      this.baseDetermination = template.determination;
      this.baseSpirit = template.spirit;
      this.baseDR = template.dr;
      this.actions = template.actions;
      this.attacksInARow = 0;
      this.usedThisTurn = /* @__PURE__ */ new Set();
    }
    get alive() {
      return this.hp > 0;
    }
    getStat(stat, base) {
      return this.g.applyStatModifiers(this, stat, base);
    }
    get maxHP() {
      return this.getStat("maxHP", this.baseMaxHP);
    }
    get maxSP() {
      return this.getStat("maxHP", this.baseMaxSP);
    }
    get dr() {
      return this.getStat("dr", this.baseDR);
    }
    get camaraderie() {
      return this.getStat("camaraderie", this.baseCamaraderie);
    }
    get determination() {
      return this.getStat("determination", this.baseDetermination);
    }
    get spirit() {
      return this.getStat("spirit", this.baseSpirit);
    }
    advanceAnimation(time) {
      this.delay -= time;
      if (this.delay < 0) {
        this.frame = wrap(this.frame + 1, this.animation.frames.length);
        this.delay += this.animation.delay;
      }
    }
    get object() {
      return this.animation.frames[this.frame];
    }
  };
  function spawn(g, name) {
    return new Enemy(g, enemies[name]);
  }

  // src/tools/shuffle.ts
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // src/types/Dir.ts
  var Dir = /* @__PURE__ */ ((Dir2) => {
    Dir2[Dir2["N"] = 0] = "N";
    Dir2[Dir2["E"] = 1] = "E";
    Dir2[Dir2["S"] = 2] = "S";
    Dir2[Dir2["W"] = 3] = "W";
    return Dir2;
  })(Dir || {});
  var Dir_default = Dir;

  // src/CombatManager.ts
  var CombatManager = class {
    constructor(g, enemyInitialDelay = 3e3, enemyTurnDelay = 1e3, enemyFrameTime = 100) {
      this.g = g;
      this.enemyInitialDelay = enemyInitialDelay;
      this.enemyTurnDelay = enemyTurnDelay;
      this.enemyFrameTime = enemyFrameTime;
      this.end = () => {
        this.resetEnemies();
        this.inCombat = false;
        this.g.draw();
        clearInterval(this.enemyAnimationInterval);
        this.enemyAnimationInterval = void 0;
      };
      this.enemyTick = () => {
        if (!this.inCombat) {
          this.enemyTurnTimeout = void 0;
          return;
        }
        const moves = this.allEnemies.flatMap(
          (enemy2) => enemy2.actions.map((action2) => {
            if (!this.g.canAct(enemy2, action2))
              return;
            const { amount: amount2, possibilities: possibilities2 } = this.g.getTargetPossibilities(
              enemy2,
              action2
            );
            if (possibilities2.length)
              return { enemy: enemy2, action: action2, amount: amount2, possibilities: possibilities2 };
          }).filter(isDefined)
        );
        if (!moves.length) {
          this.enemyTurnTimeout = void 0;
          return this.endTurn();
        }
        const { enemy, action, amount, possibilities } = oneOf(moves);
        const targets = pickN(possibilities, amount);
        this.g.act(enemy, action, targets);
        this.enemyTurnTimeout = setTimeout(this.enemyTick, this.enemyTurnDelay);
      };
      this.onKilled = (c) => {
        if (!c.isPC)
          this.pendingRemoval.push(c);
        else {
          const alive = this.g.party.find((p) => p.alive);
          if (alive)
            return;
          const index = this.g.party.indexOf(c);
          this.g.partyIsDead(index);
        }
      };
      this.onAfterAction = () => {
        for (const e of this.pendingRemoval)
          this.removeEnemy(e);
        this.pendingRemoval = [];
      };
      this.animateEnemies = () => {
        for (const e of this.allEnemies) {
          e.advanceAnimation(this.enemyFrameTime);
        }
        this.g.draw();
      };
      this.effects = [];
      this.resetEnemies();
      this.inCombat = false;
      this.index = 0;
      this.side = "player";
      this.pendingRemoval = [];
      g.eventHandlers.onKilled.add(({ who }) => this.onKilled(who));
      g.eventHandlers.onCombatOver.add(this.end);
      g.eventHandlers.onAfterAction.add(this.onAfterAction);
    }
    resetEnemies() {
      this.enemies = { 0: [], 1: [], 2: [], 3: [] };
    }
    get aliveCombatants() {
      return [
        ...this.g.party,
        ...this.enemies[0],
        ...this.enemies[1],
        ...this.enemies[2],
        ...this.enemies[3]
      ].filter((c) => c.alive);
    }
    get allEnemies() {
      return [
        ...this.enemies[0],
        ...this.enemies[1],
        ...this.enemies[2],
        ...this.enemies[3]
      ];
    }
    begin(enemies2, type) {
      for (const e of this.effects.slice())
        if (!e.permanent)
          this.g.removeEffect(e);
      this.resetEnemies();
      const dirs = shuffle([Dir_default.N, Dir_default.E, Dir_default.S, Dir_default.W]);
      let i = 0;
      for (const name of enemies2) {
        const enemy = spawn(this.g, name);
        this.enemies[dirs[i]].push(enemy);
        i = wrap(i + 1, dirs.length);
      }
      for (const c of this.aliveCombatants) {
        c.usedThisTurn.clear();
        c.sp = Math.min(c.spirit, c.maxSP);
      }
      this.inCombat = true;
      this.side = "player";
      this.g.fire("onCombatBegin", { type });
      this.g.draw();
      this.enemyAnimationInterval = setInterval(
        this.animateEnemies,
        this.enemyFrameTime
      );
    }
    getFromOffset(dir, offset) {
      return this.enemies[dir][offset - 1];
    }
    getPosition(c) {
      if (c.isPC)
        return { dir: this.g.party.indexOf(c), distance: -1 };
      for (let dir = 0; dir < 4; dir++) {
        const distance = this.enemies[dir].indexOf(c);
        if (distance >= 0)
          return { dir, distance };
      }
      throw new Error(`${c.name} not found in combat`);
    }
    endTurn() {
      this.side = this.side === "player" ? "enemy" : "player";
      const combatants = this.side === "player" ? this.g.party : this.allEnemies;
      for (const c of combatants) {
        c.usedThisTurn.clear();
        if (!c.alive)
          continue;
        const newSp = c.sp < c.spirit ? c.spirit : c.sp + 1;
        c.sp = Math.min(newSp, c.maxSP);
      }
      for (const e of this.effects.slice()) {
        if (--e.duration < 1)
          this.g.removeEffect(e);
      }
      if (this.side === "enemy")
        this.enemyTurnTimeout = setTimeout(
          this.enemyTick,
          this.enemyInitialDelay
        );
      this.g.draw();
    }
    removeEnemy(e) {
      const { dir, distance } = this.getPosition(e);
      this.enemies[dir].splice(distance, 1);
      this.g.draw();
    }
    checkOver() {
      const alive = this.g.party.find((pc) => pc.alive);
      const winners = alive ? this.allEnemies.length === 0 ? "party" : void 0 : "enemies";
      if (winners) {
        if (alive)
          this.g.addToLog(`You have vanquished your foes.`);
        else
          this.g.addToLog(`You have failed.`);
        this.g.fire("onCombatOver", { winners });
      }
    }
  };

  // src/Colours.ts
  var Colours = {
    background: "rgb(32,32,32)",
    logShadow: "rgba(0,0,0,0.4)",
    majorHighlight: "rgb(96,96,64)",
    minorHighlight: "rgb(48,48,32)",
    mapVisited: "rgb(64,64,64)",
    hp: "rgb(223,113,38)",
    sp: "rgb(99,155,255)",
    currentChosenClass: "rgb(255,255,192)",
    currentClass: "rgb(160,160,160)",
    chosenClass: "rgb(192,192,64)",
    otherClass: "rgb(96,96,96)"
  };
  var Colours_default = Colours;

  // src/tools/geometry.ts
  var xy = (x, y) => ({ x, y });
  var xyi = (x, y) => ({
    x: Math.floor(x),
    y: Math.floor(y)
  });
  function addXY(a, b) {
    return { x: a.x + b.x, y: a.y + b.y };
  }
  var displacements = [xy(0, -1), xy(1, 0), xy(0, 1), xy(-1, 0)];
  function move(pos, dir) {
    return addXY(pos, displacements[dir]);
  }
  function rotate(dir, clockwise) {
    return (dir + clockwise + 4) % 4;
  }
  function dirFromInitial(initial) {
    switch (initial) {
      case "E":
        return Dir_default.E;
      case "S":
        return Dir_default.S;
      case "W":
        return Dir_default.W;
      case "N":
      default:
        return Dir_default.N;
    }
  }
  function getCardinalOffset(start, destination) {
    const dx = destination.x - start.x;
    const dy = destination.y - start.y;
    if (dx && dy)
      return;
    if (dy < 0)
      return { dir: Dir_default.N, offset: -dy };
    if (dx > 0)
      return { dir: Dir_default.E, offset: dx };
    if (dy > 0)
      return { dir: Dir_default.S, offset: dy };
    if (dx < 0)
      return { dir: Dir_default.W, offset: -dx };
  }
  var dirOffsets = {
    [Dir_default.N]: { [Dir_default.N]: 0, [Dir_default.E]: 1, [Dir_default.S]: 2, [Dir_default.W]: 3 },
    [Dir_default.E]: { [Dir_default.N]: 3, [Dir_default.E]: 0, [Dir_default.S]: 1, [Dir_default.W]: 2 },
    [Dir_default.S]: { [Dir_default.N]: 2, [Dir_default.E]: 3, [Dir_default.S]: 0, [Dir_default.W]: 1 },
    [Dir_default.W]: { [Dir_default.N]: 1, [Dir_default.E]: 2, [Dir_default.S]: 3, [Dir_default.W]: 0 }
  };
  function getDirOffset(start, end) {
    return dirOffsets[start][end];
  }
  function lerpXY(from, to, ratio) {
    if (ratio <= 0)
      return from;
    if (ratio >= 1)
      return to;
    const fr = 1 - ratio;
    return xy(from.x * fr + to.x * ratio, from.y * fr + to.y * ratio);
  }

  // src/tools/withTextStyle.ts
  function withTextStyle(ctx, {
    textAlign,
    textBaseline,
    fillStyle,
    fontSize = 10,
    fontFace = "sans-serif",
    globalAlpha = 1
  }) {
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.fillStyle = fillStyle;
    ctx.font = `${fontSize}px ${fontFace}`;
    ctx.globalAlpha = globalAlpha;
    return {
      lineHeight: fontSize + 4,
      measure: (text) => ctx.measureText(text),
      draw: (text, x, y, maxWidth) => ctx.fillText(text, x, y, maxWidth)
    };
  }

  // src/CombatRenderer.ts
  var CombatRenderer = class {
    constructor(g, position = xy(60, 0), size = xy(144, 160), padding = xy(2, 2), rowPadding = 5) {
      this.g = g;
      this.position = position;
      this.size = size;
      this.padding = padding;
      this.rowPadding = rowPadding;
    }
    render() {
      const { padding, position, rowPadding, size } = this;
      const { combat, ctx, facing, party } = this.g;
      const active = combat.side === "player" ? party[facing] : void 0;
      if (active == null ? void 0 : active.alive) {
        ctx.fillStyle = Colours_default.logShadow;
        ctx.fillRect(position.x, position.y, size.x, size.y);
        const { draw, lineHeight } = withTextStyle(ctx, {
          textAlign: "left",
          textBaseline: "middle",
          fillStyle: "white"
        });
        const x = position.x;
        let y = position.y + padding.y + lineHeight / 2;
        draw(`${active.name} has ${active.sp}SP:`, x + padding.x, y);
        y += lineHeight;
        const rowHeight = lineHeight + rowPadding * 2;
        const actions = active.actions;
        for (let i = 0; i < actions.length; i++) {
          const action = actions[i];
          const possible = this.g.canAct(active, action);
          if (i === combat.index) {
            ctx.fillStyle = possible ? Colours_default.majorHighlight : Colours_default.minorHighlight;
            ctx.fillRect(x, y, size.x, rowHeight);
          }
          ctx.fillStyle = possible ? "white" : "silver";
          draw(
            `${action.name} (${action.sp})`,
            x + padding.x,
            y + rowHeight / 2,
            void 0
          );
          y += rowHeight;
        }
      }
    }
  };

  // src/DScript/logic.ts
  function bool(value, readOnly = false) {
    return { _: "bool", value, readOnly };
  }
  function num(value, readOnly = false) {
    return { _: "number", value, readOnly };
  }
  function str(value, readOnly = false) {
    return { _: "string", value, readOnly };
  }
  function box(value) {
    switch (typeof value) {
      case "undefined":
        return void 0;
      case "boolean":
        return bool(value);
      case "number":
        return num(value);
      case "string":
        return str(value);
      default:
        throw new Error(`Cannot box ${typeof value}`);
    }
  }
  function unbox(value) {
    if (value._ === "function" || value._ === "native")
      return value;
    return value.value;
  }
  function truthy(value) {
    return !!value;
  }
  function unary(op, value) {
    switch (op) {
      case "-":
        if (value._ === "number")
          return num(-value.value);
        throw new Error(`Cannot negate a ${value._}`);
      case "not":
        return bool(!truthy(value.value));
    }
  }
  function binary(op, left, right) {
    switch (op) {
      case "+":
        if (left._ === "string" && right._ === "string")
          return str(left.value + right.value);
        if (left._ === "number" && right._ === "number")
          return num(left.value + right.value);
        throw new Error(`Cannot add ${left._} and ${right._}`);
      case "-":
        if (left._ === "number" && right._ === "number")
          return num(left.value - right.value);
        throw new Error(`Cannot subtract ${left._} and ${right._}`);
      case "*":
        if (left._ === "number" && right._ === "number")
          return num(left.value * right.value);
        throw new Error(`Cannot multiply ${left._} and ${right._}`);
      case "/":
        if (left._ === "number" && right._ === "number")
          return num(left.value / right.value);
        throw new Error(`Cannot divide ${left._} and ${right._}`);
      case "^":
        if (left._ === "number" && right._ === "number")
          return num(Math.pow(left.value, right.value));
        throw new Error(`Cannot exponentiate ${left._} and ${right._}`);
      case "==":
        return bool(left.value === right.value);
      case "!=":
        return bool(left.value !== right.value);
      case ">":
        return bool(left.value > right.value);
      case ">=":
        return bool(left.value >= right.value);
      case "<":
        return bool(left.value < right.value);
      case "<=":
        return bool(left.value <= right.value);
      case "and":
        return truthy(left.value) ? right : left;
      case "or":
        return truthy(left.value) ? left : right;
      case "xor": {
        const lt = truthy(left.value);
        const rt = truthy(right.value);
        return bool(!(lt === rt));
      }
    }
  }
  function convertToFunction(stmt) {
    return {
      _: "function",
      name: stmt.name.value,
      args: stmt.args,
      readOnly: true,
      type: stmt.type === null ? void 0 : stmt.type,
      value: stmt.program
    };
  }
  function run(scope, prg) {
    scope.exited = false;
    scope.returned = void 0;
    return runInScope(scope, prg, true);
  }
  function runInScope(scope, prg, checkReturnValue) {
    var _a, _b, _c, _d;
    for (const stmt of prg) {
      switch (stmt._) {
        case "assignment":
          assignment(scope, stmt);
          break;
        case "call":
          callFunction(
            scope,
            lookup(scope, stmt.fn.value),
            stmt.args.map((arg) => evaluate(scope, arg))
          );
          break;
        case "function":
          scope.env.set(stmt.name.value, convertToFunction(stmt));
          break;
        case "if": {
          if (truthy(evaluate(scope, stmt.expr).value)) {
            runInScope(scope, stmt.positive, false);
          } else if (stmt.negative) {
            runInScope(scope, stmt.negative, false);
          }
          break;
        }
        case "return": {
          const returnValue = stmt.expr ? evaluate(scope, stmt.expr) : void 0;
          if (isTypeMatch(scope.type, returnValue == null ? void 0 : returnValue._)) {
            scope.exited = true;
            scope.returned = returnValue;
            return returnValue;
          }
          throw new Error(
            `trying to return ${(_a = returnValue == null ? void 0 : returnValue._) != null ? _a : "void"} when '${scope.name}' requires ${(_b = scope.type) != null ? _b : "void"}`
          );
        }
      }
      if (scope.exited)
        break;
    }
    if (checkReturnValue && !isTypeMatch(scope.type, (_c = scope.returned) == null ? void 0 : _c._))
      throw new Error(
        `exited '${scope.name}' without returning ${(_d = scope.type) != null ? _d : "void"}`
      );
    return scope.returned;
  }
  function lookup(scope, name, canBeNew = false) {
    let found;
    let current = scope;
    while (current) {
      found = current.env.get(name);
      if (found)
        break;
      current = current.parent;
    }
    if (!found && !canBeNew)
      throw new Error(`Could not resolve: ${name}`);
    return found;
  }
  function evaluate(scope, expr) {
    switch (expr._) {
      case "bool":
      case "number":
      case "string":
        return expr;
      case "id":
        return lookup(scope, expr.value);
      case "unary":
        return unary(expr.op, evaluate(scope, expr.value));
      case "binary":
        return binary(
          expr.op,
          evaluate(scope, expr.left),
          evaluate(scope, expr.right)
        );
      case "call": {
        const value = callFunction(
          scope,
          lookup(scope, expr.fn.value),
          expr.args.map((arg) => evaluate(scope, arg))
        );
        if (!value)
          throw new Error(`${expr.fn.value}() returned no value`);
        return value;
      }
    }
  }
  function isTypeMatch(want, got) {
    if (want === "any")
      return true;
    if (want === got)
      return true;
    if (want === "function" && got === "native")
      return true;
    return false;
  }
  function checkFunctionArgs(fn, got) {
    const argTypes = fn._ === "function" ? fn.args.map((arg) => arg.type) : fn.args;
    const fail = () => {
      throw new Error(
        `${fn.name} wants (${argTypes.join(", ")}) but got (${got.map((arg) => arg._).join(", ")})`
      );
    };
    if (argTypes.length !== got.length)
      fail();
    for (let i = 0; i < argTypes.length; i++) {
      if (!isTypeMatch(argTypes[i], got[i]._))
        fail();
    }
  }
  function callFunction(parent, fn, args) {
    if (fn._ !== "function" && fn._ !== "native")
      throw new Error(`Cannot call a ${fn._}`);
    checkFunctionArgs(fn, args);
    if (fn._ === "native") {
      const result = fn.value.call(void 0, ...args.map(unbox));
      return box(result);
    }
    const scope = {
      parent,
      name: `function ${fn.name}`,
      env: /* @__PURE__ */ new Map(),
      type: fn.type
    };
    for (let i = 0; i < args.length; i++)
      scope.env.set(fn.args[i].name.value, args[i]);
    return run(scope, fn.value);
  }
  var opMapping = {
    "+=": "+",
    "-=": "-",
    "*=": "*",
    "/=": "/",
    "^=": "^"
  };
  function assignment(scope, stmt) {
    const right = evaluate(scope, stmt.expr);
    const left = lookup(scope, stmt.name.value, true);
    if (!left) {
      if (stmt.op === "=") {
        scope.env.set(stmt.name.value, src_default(right));
        return;
      }
      throw new Error(`Could not resolve: ${stmt.name.value}`);
    }
    if (left._ !== right._)
      throw new Error(`Cannot assign ${right._} to ${left._}`);
    if (left.readOnly)
      throw new Error(`Cannot assign to ${stmt.name.value}, it is read only`);
    if (stmt.op === "=")
      left.value = right.value;
    else
      left.value = binary(opMapping[stmt.op], left, right).value;
  }

  // src/DScript/parser.ts
  var import_nearley = __toESM(require_nearley());

  // src/tools/leftPad.ts
  function leftPad(s, n, char = " ") {
    return Array(n).join(char) + s;
  }

  // src/DScript/Lexer.ts
  var wsPattern = /[ \r\n\t]/;
  var isWhiteSpace = (ch) => wsPattern.test(ch);
  var nlPattern = /[\r\n]/;
  var isNewline = (ch) => nlPattern.test(ch);
  var numberPattern = /^[0-9]+$/;
  var isNumber = (w) => numberPattern.test(w);
  var wordPattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;
  var isWord = (w) => wordPattern.test(w);
  var keywords = [
    "and",
    "any",
    "bool",
    "else",
    "end",
    "false",
    "function",
    "if",
    "not",
    "number",
    "or",
    "return",
    "string",
    "true",
    "xor"
  ];
  var isKeyword = (w) => keywords.includes(w);
  var punctuation = /* @__PURE__ */ new Set([
    "=",
    "+=",
    "-=",
    "*=",
    "/=",
    "^=",
    "(",
    ")",
    ":",
    ",",
    ">",
    ">=",
    "<",
    "<=",
    "==",
    "!=",
    "+",
    "-",
    "*",
    "/",
    "^"
  ]);
  var isPunctuation = (w) => punctuation.has(w);
  var commentChar = ";";
  var Lexer = class {
    constructor() {
      this.reset("");
    }
    get col() {
      return this.index - this.lastLineBreak + 1;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    has(_type) {
      return true;
    }
    reset(data, state) {
      this.buffer = data;
      this.index = 0;
      this.line = state ? state.line : 1;
      this.lastLineBreak = state ? -state.col : 0;
    }
    next() {
      const { line, col, index } = this;
      const [type, value] = this.getNextToken();
      if (type === "EOF")
        return;
      return { line, col, offset: index, type, value };
    }
    save() {
      const { line, col } = this;
      return { line, col: col - 1 };
    }
    formatError(token, message = "Syntax error") {
      const lines = this.buffer.replace(/\r/g, "").split("\n");
      const min = Math.max(0, token.line - 3);
      const max = Math.min(token.line + 2, lines.length - 1);
      const lineNoSize = max.toString().length;
      const context = [];
      for (let i = min; i < max; i++) {
        const line = lines[i];
        const showLineNo = i + 1;
        const raw = showLineNo.toString();
        const lineNo = leftPad(raw, lineNoSize - raw.length);
        context.push(`${lineNo} ${line}`);
        if (showLineNo === token.line)
          context.push(leftPad("^", token.col + lineNoSize + 1, "-"));
      }
      return [
        `${message} at line ${token.line} col ${token.col}`,
        ...context
      ].join("\n");
    }
    isEOF() {
      return this.index >= this.buffer.length;
    }
    peek() {
      return this.buffer[this.index];
    }
    consume() {
      const ch = this.peek();
      this.consumed += ch;
      this.index++;
      if (ch === "\n") {
        this.line++;
        this.lastLineBreak = this.index;
      }
      return ch;
    }
    repeater(isValid) {
      this.consume();
      while (true) {
        if (this.isEOF())
          break;
        const maybe = this.consumed + this.peek();
        if (!isValid(maybe))
          break;
        this.consume();
      }
      return this.consumed;
    }
    getNextToken() {
      this.consumed = "";
      if (this.isEOF())
        return ["EOF", ""];
      const ch = this.peek();
      if (isWhiteSpace(ch)) {
        while (isWhiteSpace(this.peek()))
          this.consume();
        return ["ws", this.consumed];
      }
      if (isNumber(ch)) {
        const number2 = this.repeater(isNumber);
        return ["number", number2];
      }
      if (isWord(ch)) {
        const word2 = this.repeater(isWord);
        if (isKeyword(word2))
          return ["keyword", word2];
        return ["word", word2];
      }
      if (isPunctuation(ch)) {
        const punctuation2 = this.repeater(isPunctuation);
        return ["punctuation", punctuation2];
      }
      if (ch === '"' || ch === "'") {
        this.consume();
        while (true) {
          if (this.isEOF())
            return ["UNCLOSED_STRING", ch];
          const next = this.consume();
          if (next === ch)
            return [ch === "'" ? "sqstring" : "dqstring", this.consumed];
        }
      }
      if (ch === commentChar) {
        this.consume();
        while (!this.isEOF() && !isNewline(this.peek()))
          this.consume();
        return ["comment", this.consumed];
      }
      return ["INVALID", ch];
    }
  };

  // src/DScript/grammar.ts
  function id(d) {
    return d[0];
  }
  var always = (value) => () => value;
  var val = ([tok]) => tok.value;
  var lexer = new Lexer();
  var grammar = {
    Lexer: lexer,
    ParserRules: [
      { "name": "document", "symbols": ["_", "program"], "postprocess": ([, prog]) => prog },
      { "name": "program$ebnf$1", "symbols": [] },
      { "name": "program$ebnf$1", "symbols": ["program$ebnf$1", "declp"], "postprocess": (d) => d[0].concat([d[1]]) },
      { "name": "program", "symbols": ["program$ebnf$1"], "postprocess": id },
      { "name": "declp", "symbols": ["decl", "_"], "postprocess": id },
      { "name": "decl", "symbols": ["stmt"], "postprocess": id },
      { "name": "stmt", "symbols": ["assignment"], "postprocess": id },
      { "name": "stmt", "symbols": ["call"], "postprocess": id },
      { "name": "stmt", "symbols": ["function_def"], "postprocess": id },
      { "name": "stmt", "symbols": ["if_stmt"], "postprocess": id },
      { "name": "stmt", "symbols": ["return_stmt"], "postprocess": id },
      { "name": "assignment", "symbols": ["name", "_", "assignop", "_", "expr"], "postprocess": ([name, , op, , expr]) => ({ _: "assignment", name, op, expr }) },
      { "name": "assignop", "symbols": [{ "literal": "=" }], "postprocess": val },
      { "name": "assignop", "symbols": [{ "literal": "+=" }], "postprocess": val },
      { "name": "assignop", "symbols": [{ "literal": "-=" }], "postprocess": val },
      { "name": "assignop", "symbols": [{ "literal": "*=" }], "postprocess": val },
      { "name": "assignop", "symbols": [{ "literal": "/=" }], "postprocess": val },
      { "name": "assignop", "symbols": [{ "literal": "^=" }], "postprocess": val },
      { "name": "function_def$ebnf$1", "symbols": ["function_type_clause"], "postprocess": id },
      { "name": "function_def$ebnf$1", "symbols": [], "postprocess": () => null },
      { "name": "function_def", "symbols": [{ "literal": "function" }, "__", "name", { "literal": "(" }, "function_args", { "literal": ")" }, "function_def$ebnf$1", "document", "__", { "literal": "end" }], "postprocess": ([, , name, , args, , type, program]) => ({ _: "function", name, args, type, program }) },
      { "name": "function_type_clause", "symbols": [{ "literal": ":" }, "_", "vtype"], "postprocess": ([, , type]) => type },
      { "name": "function_args", "symbols": [], "postprocess": always([]) },
      { "name": "function_args", "symbols": ["name_with_type"] },
      { "name": "function_args", "symbols": ["function_args", "_", { "literal": "," }, "_", "name_with_type"], "postprocess": ([list, , , , value]) => list.concat([value]) },
      { "name": "if_stmt$ebnf$1", "symbols": ["else_clause"], "postprocess": id },
      { "name": "if_stmt$ebnf$1", "symbols": [], "postprocess": () => null },
      { "name": "if_stmt", "symbols": [{ "literal": "if" }, "__", "expr", "__", { "literal": "then" }, "document", "if_stmt$ebnf$1", "__", { "literal": "end" }], "postprocess": ([, , expr, , , positive, negative]) => ({ _: "if", expr, positive, negative }) },
      { "name": "else_clause", "symbols": ["__", { "literal": "else" }, "document"], "postprocess": ([, , clause]) => clause },
      { "name": "return_stmt$ebnf$1$subexpression$1", "symbols": ["__", "expr"], "postprocess": ([, expr]) => expr },
      { "name": "return_stmt$ebnf$1", "symbols": ["return_stmt$ebnf$1$subexpression$1"], "postprocess": id },
      { "name": "return_stmt$ebnf$1", "symbols": [], "postprocess": () => null },
      { "name": "return_stmt", "symbols": [{ "literal": "return" }, "return_stmt$ebnf$1"], "postprocess": ([, expr]) => ({ _: "return", expr }) },
      { "name": "expr", "symbols": ["maths"], "postprocess": id },
      { "name": "maths", "symbols": ["logic"], "postprocess": id },
      { "name": "logic", "symbols": ["logic", "_", "logicop", "_", "boolean"], "postprocess": ([left, , op, , right]) => ({ _: "binary", left, op, right }) },
      { "name": "logic", "symbols": ["boolean"], "postprocess": id },
      { "name": "boolean", "symbols": ["boolean", "_", "boolop", "_", "sum"], "postprocess": ([left, , op, , right]) => ({ _: "binary", left, op, right }) },
      { "name": "boolean", "symbols": ["sum"], "postprocess": id },
      { "name": "sum", "symbols": ["sum", "_", "sumop", "_", "product"], "postprocess": ([left, , op, , right]) => ({ _: "binary", left, op, right }) },
      { "name": "sum", "symbols": ["product"], "postprocess": id },
      { "name": "product", "symbols": ["product", "_", "mulop", "_", "exp"], "postprocess": ([left, , op, , right]) => ({ _: "binary", left, op, right }) },
      { "name": "product", "symbols": ["exp"], "postprocess": id },
      { "name": "exp", "symbols": ["unary", "_", "expop", "_", "exp"], "postprocess": ([left, , op, , right]) => ({ _: "binary", left, op, right }) },
      { "name": "exp", "symbols": ["unary"], "postprocess": id },
      { "name": "unary", "symbols": [{ "literal": "-" }, "value"], "postprocess": ([op, value]) => ({ _: "unary", op: op.value, value }) },
      { "name": "unary", "symbols": [{ "literal": "not" }, "_", "value"], "postprocess": ([op, , value]) => ({ _: "unary", op: op.value, value }) },
      { "name": "unary", "symbols": ["value"], "postprocess": id },
      { "name": "logicop", "symbols": [{ "literal": "and" }], "postprocess": val },
      { "name": "logicop", "symbols": [{ "literal": "or" }], "postprocess": val },
      { "name": "logicop", "symbols": [{ "literal": "xor" }], "postprocess": val },
      { "name": "boolop", "symbols": [{ "literal": ">" }], "postprocess": val },
      { "name": "boolop", "symbols": [{ "literal": ">=" }], "postprocess": val },
      { "name": "boolop", "symbols": [{ "literal": "<" }], "postprocess": val },
      { "name": "boolop", "symbols": [{ "literal": "<=" }], "postprocess": val },
      { "name": "boolop", "symbols": [{ "literal": "==" }], "postprocess": val },
      { "name": "boolop", "symbols": [{ "literal": "!=" }], "postprocess": val },
      { "name": "sumop", "symbols": [{ "literal": "+" }], "postprocess": val },
      { "name": "sumop", "symbols": [{ "literal": "-" }], "postprocess": val },
      { "name": "mulop", "symbols": [{ "literal": "*" }], "postprocess": val },
      { "name": "mulop", "symbols": [{ "literal": "/" }], "postprocess": val },
      { "name": "expop", "symbols": [{ "literal": "^" }], "postprocess": val },
      { "name": "value", "symbols": ["literal_number"], "postprocess": id },
      { "name": "value", "symbols": ["literal_boolean"], "postprocess": id },
      { "name": "value", "symbols": ["literal_string"], "postprocess": id },
      { "name": "value", "symbols": ["name"], "postprocess": id },
      { "name": "value", "symbols": ["call"], "postprocess": id },
      { "name": "call", "symbols": ["name", { "literal": "(" }, "call_args", { "literal": ")" }], "postprocess": ([fn, , args]) => ({ _: "call", fn, args }) },
      { "name": "call_args", "symbols": [], "postprocess": always([]) },
      { "name": "call_args", "symbols": ["expr"] },
      { "name": "call_args", "symbols": ["call_args", "_", { "literal": "," }, "_", "expr"], "postprocess": ([list, , , , value]) => list.concat([value]) },
      { "name": "literal_number", "symbols": [lexer.has("number") ? { type: "number" } : number], "postprocess": ([tok]) => ({ _: "number", value: Number(tok.value) }) },
      { "name": "literal_number", "symbols": [lexer.has("number") ? { type: "number" } : number, { "literal": "." }, lexer.has("number") ? { type: "number" } : number], "postprocess": ([whole, , frac]) => ({ _: "number", value: Number(whole.value + "." + frac.value) }) },
      { "name": "literal_boolean", "symbols": [{ "literal": "true" }], "postprocess": always({ _: "bool", value: true }) },
      { "name": "literal_boolean", "symbols": [{ "literal": "false" }], "postprocess": always({ _: "bool", value: false }) },
      { "name": "literal_string", "symbols": [lexer.has("sqstring") ? { type: "sqstring" } : sqstring], "postprocess": ([tok]) => ({ _: "string", value: tok.value.slice(1, -1) }) },
      { "name": "literal_string", "symbols": [lexer.has("dqstring") ? { type: "dqstring" } : dqstring], "postprocess": ([tok]) => ({ _: "string", value: tok.value.slice(1, -1) }) },
      { "name": "name_with_type", "symbols": ["name", { "literal": ":" }, "_", "vtype"], "postprocess": ([name, , , type]) => ({ _: "arg", type, name }) },
      { "name": "vtype", "symbols": [{ "literal": "any" }], "postprocess": val },
      { "name": "vtype", "symbols": [{ "literal": "bool" }], "postprocess": val },
      { "name": "vtype", "symbols": [{ "literal": "function" }], "postprocess": val },
      { "name": "vtype", "symbols": [{ "literal": "number" }], "postprocess": val },
      { "name": "vtype", "symbols": [{ "literal": "string" }], "postprocess": val },
      { "name": "name", "symbols": [lexer.has("word") ? { type: "word" } : word], "postprocess": ([tok]) => ({ _: "id", value: tok.value }) },
      { "name": "_", "symbols": ["ws"], "postprocess": always(null) },
      { "name": "_", "symbols": ["comment"], "postprocess": always(null) },
      { "name": "_", "symbols": [], "postprocess": always(null) },
      { "name": "__", "symbols": ["ws"], "postprocess": always(null) },
      { "name": "ws", "symbols": [lexer.has("ws") ? { type: "ws" } : ws], "postprocess": always(null) },
      { "name": "comment", "symbols": ["_", lexer.has("comment") ? { type: "comment" } : comment, "_"], "postprocess": always(null) }
    ],
    ParserStart: "document"
  };
  var grammar_default = grammar;

  // src/tools/uniq.ts
  function uniq(items) {
    const set = new Set(items);
    return Array.from(set.values());
  }

  // src/DScript/parser.ts
  function makeEOFToken(p, src) {
    var _a, _b, _c, _d;
    return {
      col: (_b = (_a = p.lexerState) == null ? void 0 : _a.col) != null ? _b : p.lexer.col,
      line: (_d = (_c = p.lexerState) == null ? void 0 : _c.line) != null ? _d : p.lexer.line,
      offset: src.length,
      type: "EOF",
      value: ""
    };
  }
  var ParseError = class extends Error {
    constructor(p, token, src) {
      super("Syntax error");
      this.p = p;
      this.token = token;
      this.src = src;
      const col = p.table[p.current];
      const expected = col.states.map((s) => {
        const ns = s.rule.symbols[s.dot];
        if (typeof ns === "object") {
          if (ns.literal)
            return `"${ns.literal}"`;
          if (ns.type)
            return ns.type;
        }
        if (typeof ns === "string")
          return `(${ns})`;
      }).filter(isDefined);
      const message = token.type === "UNCLOSED_STRING" ? "Unclosed string" : `Got ${token.type} token${token.value ? ` "${token.value}"` : ""}, expected one of: ${uniq(expected).sort().join(", ")}`;
      this.message = [p.lexer.formatError(token), message].join("\n");
    }
  };
  function parse(src) {
    const p = new import_nearley.Parser(import_nearley.Grammar.fromCompiled(grammar_default));
    try {
      p.feed(src.trim());
    } catch (error) {
      throw new ParseError(p, error.token, src);
    }
    const result = p.results;
    if (result.length === 0)
      throw new ParseError(p, makeEOFToken(p, src), src);
    if (result.length > 1) {
      for (let i = 0; i < result.length; i++) {
        console.log(`--- PARSE #${i}`);
        console.dir(result[0], { depth: Infinity });
      }
      throw new Error("Ambiguous parse.");
    }
    return result[0];
  }

  // src/DefaultControls.ts
  var DefaultControls = [
    ["ArrowUp", ["Forward", "MenuUp"]],
    ["KeyW", ["Forward", "MenuUp"]],
    ["ArrowRight", ["TurnRight"]],
    ["KeyE", ["TurnRight"]],
    ["ArrowDown", ["Back", "MenuDown"]],
    ["KeyS", ["Back", "MenuDown"]],
    ["ArrowLeft", ["TurnLeft"]],
    ["KeyQ", ["TurnLeft"]],
    ["Shift+ArrowRight", ["SlideRight"]],
    ["KeyD", ["SlideRight"]],
    ["Shift+ArrowLeft", ["SlideLeft"]],
    ["KeyA", ["SlideLeft"]],
    ["Ctrl+ArrowRight", ["RotateRight"]],
    ["Ctrl+KeyD", ["RotateRight"]],
    ["Ctrl+ArrowLeft", ["RotateLeft"]],
    ["Ctrl+KeyA", ["RotateLeft"]],
    ["Alt+ArrowRight", ["SwapRight"]],
    ["Alt+KeyD", ["SwapRight"]],
    ["Alt+ArrowDown", ["SwapBehind"]],
    ["Alt+KeyS", ["SwapBehind"]],
    ["Alt+ArrowLeft", ["SwapLeft"]],
    ["Alt+KeyA", ["SwapLeft"]],
    ["Space", ["ToggleLog"]],
    ["Enter", ["Interact", "MenuChoose"]],
    ["Return", ["Interact", "MenuChoose"]],
    ["Escape", ["Cancel"]]
  ];
  var DefaultControls_default = DefaultControls;

  // src/tools/getCanvasContext.ts
  function getCanvasContext(canvas, type, options) {
    const ctx = canvas.getContext(type, options);
    if (!ctx)
      throw new Error(`canvas.getContext(${type})`);
    return ctx;
  }

  // src/tools/xyTags.ts
  function xyToTag(pos) {
    return `${pos.x},${pos.y}`;
  }

  // src/fov.ts
  var facingDisplacements = {
    [Dir_default.E]: [0, 1, -1, 0],
    [Dir_default.N]: [1, 0, 0, 1],
    [Dir_default.S]: [-1, 0, 0, -1],
    [Dir_default.W]: [0, -1, 1, 0]
  };
  function getDisplacement(from, to, facing) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const [a, b, c, d] = facingDisplacements[facing];
    const x = dx * a + dy * b;
    const y = dx * c + dy * d;
    return [x, y];
  }
  var FovCalculator = class {
    constructor(g) {
      this.g = g;
      this.entries = /* @__PURE__ */ new Map();
    }
    calculate(width, depth) {
      const position = this.g.position;
      this.propagate(position, width, depth);
      return [...this.entries.values()].sort((a, b) => {
        const zd = a.dz - b.dz;
        if (zd)
          return zd;
        const xd = Math.abs(a.dx) - Math.abs(b.dx);
        return -xd;
      });
    }
    displacement(position) {
      return getDisplacement(this.g.position, position, this.g.facing);
    }
    propagate(position, width, depth) {
      if (width <= 0 || depth <= 0)
        return;
      const { g } = this;
      const { facing } = g;
      const tag = xyToTag(position);
      const old = this.entries.get(tag);
      if (old) {
        if (old.width >= width && old.depth >= depth)
          return;
      }
      const { x, y } = position;
      const cell = g.getCell(x, y);
      if (!cell)
        return;
      const [dx, dz] = this.displacement(position);
      const leftVisible = dx <= 0;
      const rightVisible = dx >= 0;
      this.entries.set(tag, {
        x,
        y,
        dx,
        dz,
        width,
        depth,
        leftVisible,
        rightVisible
      });
      if (leftVisible) {
        const leftDir = rotate(facing, 3);
        const leftWall = cell.sides[leftDir];
        if (!(leftWall == null ? void 0 : leftWall.wall))
          this.propagate(move(position, leftDir), width - 1, depth);
      }
      if (rightVisible) {
        const rightDir = rotate(facing, 1);
        const rightWall = cell.sides[rightDir];
        if (!(rightWall == null ? void 0 : rightWall.wall))
          this.propagate(move(position, rightDir), width - 1, depth);
      }
      const forwardWall = cell.sides[facing];
      if (!(forwardWall == null ? void 0 : forwardWall.wall))
        this.propagate(move(position, facing), width, depth - 1);
    }
  };
  function getFieldOfView(g, width, depth) {
    const calc = new FovCalculator(g);
    return calc.calculate(width, depth);
  }

  // src/DungeonRenderer.ts
  var tileTag = (id2, type, tile) => `${type}${id2}:${tile.x},${tile.z}`;
  var DungeonRenderer = class {
    constructor(g, dungeon, atlasImage, offset = xy(91, 21)) {
      this.g = g;
      this.dungeon = dungeon;
      this.atlasImage = atlasImage;
      this.offset = offset;
      this.imageData = /* @__PURE__ */ new Map();
    }
    addAtlas(layers, image) {
      const atlasCanvas = document.createElement("canvas");
      atlasCanvas.width = image.width;
      atlasCanvas.height = image.height;
      const atlasCtx = getCanvasContext(atlasCanvas, "2d", {
        willReadFrequently: true
      });
      atlasCtx.drawImage(image, 0, 0);
      const promises = [];
      for (const layer of layers) {
        for (const entry of layer.tiles) {
          const imageData = atlasCtx.getImageData(
            entry.coords.x,
            entry.coords.y,
            entry.coords.w,
            entry.coords.h
          );
          const tmpCanvas = document.createElement("canvas");
          tmpCanvas.width = entry.coords.w;
          tmpCanvas.height = entry.coords.h;
          const tmpCtx = getCanvasContext(tmpCanvas, "2d");
          if (entry.flipped) {
            const data = this.flipImage(
              entry.coords.w,
              entry.coords.h,
              imageData.data
            );
            imageData.data.set(data);
          }
          tmpCtx.putImageData(imageData, 0, 0);
          this.imageData.set(tileTag(layer.id, entry.type, entry.tile), entry);
          promises.push(
            createImageBitmap(imageData).then((bmp) => {
              entry.image = bmp;
              return entry;
            })
          );
        }
      }
      return Promise.all(promises);
    }
    getImage(id2, type, x, z) {
      const tag = tileTag(id2, type, { x, z });
      return this.imageData.get(tag);
    }
    flipImage(w, h, data) {
      const flippedData = new Uint8Array(w * h * 4);
      for (let col = 0; col < w; col++) {
        for (let row = 0; row < h; row++) {
          const index = (w - 1 - col) * 4 + row * w * 4;
          const index2 = col * 4 + row * w * 4;
          flippedData[index2] = data[index];
          flippedData[index2 + 1] = data[index + 1];
          flippedData[index2 + 2] = data[index + 2];
          flippedData[index2 + 3] = data[index + 3];
        }
      }
      return flippedData;
    }
    getLayersOfType(type) {
      return this.dungeon.layers.filter((layer) => layer.type === type);
    }
    project(x, z) {
      const { facing, position } = this.g;
      switch (facing) {
        case Dir_default.N:
          return [position.x + x, position.y + z];
        case Dir_default.E:
          return [position.x - z, position.y + x];
        case Dir_default.S:
          return [position.x - x, position.y - z];
        case Dir_default.W:
          return [position.x + z, position.y - x];
      }
    }
    draw(result) {
      const dx = result.screen.x - (result.flipped ? result.coords.w : 0);
      const dy = result.screen.y;
      this.g.ctx.drawImage(result.image, dx + this.offset.x, dy + this.offset.y);
    }
    drawFront(result, x) {
      const dx = result.screen.x + x * result.coords.fullWidth;
      const dy = result.screen.y;
      this.g.ctx.drawImage(result.image, dx + this.offset.x, dy + this.offset.y);
    }
    drawImage(id2, type, x, z) {
      const result = this.getImage(id2, type, x, z);
      if (result)
        this.draw(result);
    }
    drawFrontImage(id2, type, x, z) {
      const result = this.getImage(id2, type, 0, z);
      if (result)
        this.drawFront(result, x);
    }
    render() {
      const rightSide = rotate(this.g.facing, 1);
      const leftSide = rotate(this.g.facing, 3);
      const tiles = getFieldOfView(
        this.g,
        this.dungeon.width,
        this.dungeon.depth
      );
      for (const pos of tiles) {
        const cell = this.g.getCell(pos.x, pos.y);
        if (!cell)
          continue;
        if (cell.ceiling)
          this.drawImage(cell.ceiling, "ceiling", pos.dx, pos.dz);
        if (cell.floor)
          this.drawImage(cell.floor, "floor", pos.dx, pos.dz);
      }
      for (const pos of tiles) {
        const cell = this.g.getCell(pos.x, pos.y);
        if (!cell)
          continue;
        if (pos.leftVisible) {
          const left = cell.sides[leftSide];
          if (left == null ? void 0 : left.wall)
            this.drawImage(left.wall, "side", pos.dx - 1, pos.dz);
          if (left == null ? void 0 : left.decal)
            this.drawImage(left.decal, "side", pos.dx - 1, pos.dz);
        }
        if (pos.rightVisible) {
          const right = cell.sides[rightSide];
          if (right == null ? void 0 : right.wall)
            this.drawImage(right.wall, "side", pos.dx + 1, pos.dz);
          if (right == null ? void 0 : right.decal)
            this.drawImage(right.decal, "side", pos.dx + 1, pos.dz);
        }
        const front = cell.sides[this.g.facing];
        if (front == null ? void 0 : front.wall)
          this.drawFrontImage(front.wall, "front", pos.dx, pos.dz - 1);
        if (front == null ? void 0 : front.decal)
          this.drawFrontImage(front.decal, "front", pos.dx, pos.dz - 1);
        if (cell.object)
          this.drawFrontImage(cell.object, "object", pos.dx, pos.dz);
      }
    }
  };

  // src/tools/getKeyNames.ts
  function getKeyNames(key, shift, alt, ctrl) {
    const names = [key];
    if (shift)
      names.unshift("Shift+" + key);
    if (alt)
      names.unshift("Alt+" + key);
    if (ctrl)
      names.unshift("Ctrl+" + key);
    return names;
  }

  // src/DungeonScreen.ts
  var DungeonScreen = class {
    constructor(g, renderSetup) {
      this.g = g;
      this.renderSetup = renderSetup;
      void g.jukebox.play("explore");
    }
    onKey(e) {
      const keys = getKeyNames(e.code, e.shiftKey, e.altKey, e.ctrlKey);
      for (const key of keys) {
        const input = this.g.controls.get(key);
        if (input) {
          e.preventDefault();
          for (const check of input) {
            if (this.g.processInput(check))
              return;
          }
        }
      }
    }
    render() {
      const { renderSetup } = this;
      const { canvas, ctx, res } = this.g;
      if (!renderSetup) {
        const { draw } = withTextStyle(ctx, {
          textAlign: "center",
          textBaseline: "middle",
          fillStyle: "white"
        });
        draw(
          `Loading: ${res.loaded}/${res.loading}`,
          canvas.width / 2,
          canvas.height / 2
        );
        this.g.draw();
        return;
      }
      renderSetup.dungeon.render();
      renderSetup.hud.render();
      if (this.g.showLog)
        renderSetup.log.render();
      if (this.g.combat.inCombat)
        renderSetup.combat.render();
    }
  };

  // src/DScript/host.ts
  var DScriptHost = class {
    constructor() {
      this.env = /* @__PURE__ */ new Map();
      this.name = "<Host>";
    }
    addNative(name, args, type, value) {
      this.env.set(name, {
        _: "native",
        name,
        args,
        readOnly: true,
        type,
        value
      });
    }
  };

  // src/types/Combatant.ts
  var AttackableStats = [
    "hp",
    "sp",
    "camaraderie",
    "determination",
    "spirit"
  ];

  // src/tools/combatants.ts
  function isStat(s) {
    return AttackableStats.includes(s);
  }

  // src/EngineScripting.ts
  var EngineScripting = class extends DScriptHost {
    constructor(g) {
      super();
      this.g = g;
      this.env.set("NORTH", num(Dir_default.N, true));
      this.env.set("EAST", num(Dir_default.E, true));
      this.env.set("SOUTH", num(Dir_default.S, true));
      this.env.set("WEST", num(Dir_default.W, true));
      this.onTagEnter = /* @__PURE__ */ new Map();
      this.onTagInteract = /* @__PURE__ */ new Map();
      const getCell = (x, y) => {
        const cell = g.getCell(x, y);
        if (!cell)
          throw new Error(`Invalid cell: ${x},${y}`);
        return cell;
      };
      const getDir = (dir) => {
        if (dir < 0 || dir > 3)
          throw new Error(`Invalid dir: ${dir}`);
        return dir;
      };
      const getPC = (index) => {
        if (index < 0 || index > 4)
          throw new Error(`Tried to get PC ${index}`);
        return g.party[index];
      };
      const getStat = (stat) => {
        if (!isStat(stat))
          throw new Error(`Invalid stat: ${stat}`);
        return stat;
      };
      const getEnemy = (name) => {
        if (!isEnemyName(name))
          throw new Error(`Invalid enemy: ${name}`);
        return name;
      };
      const getThisCell = () => getCell(g.position.x, g.position.y);
      const getPositionByTag = (tag) => {
        const position = g.findCellWithTag(tag);
        if (!position)
          throw new Error(`Cannot find tag: ${tag}`);
        return position;
      };
      const getSide = (x, y, d) => {
        const dir = getDir(d);
        const cell = getCell(x, y);
        const side = cell.sides[dir];
        if (!side)
          throw new Error(
            `script tried to unlock ${x},${y},${d} -- side does not exist`
          );
        return side;
      };
      this.addNative("addArenaEnemy", ["string"], void 0, (name) => {
        const enemy = getEnemy(name);
        g.pendingArenaEnemies.push(enemy);
      });
      this.addNative("addNormalEnemy", ["string"], void 0, (name) => {
        const enemy = getEnemy(name);
        g.pendingNormalEnemies.push(enemy);
      });
      this.addNative(
        "damagePC",
        ["number", "string", "number"],
        void 0,
        (index, type, amount) => {
          const pc = getPC(index);
          const stat = getStat(type);
          g.applyDamage(pc, [pc], amount, stat, "normal");
        }
      );
      this.addNative(
        "debug",
        ["any"],
        void 0,
        (thing) => console.log("[debug]", thing)
      );
      this.addNative(
        "getPCName",
        ["number"],
        "string",
        (index) => getPC(index).name
      );
      this.addNative("getNumber", ["string"], "number", (key) => {
        const cell = getThisCell();
        if (!(key in cell.numbers))
          throw new Error(
            `Tried to get non-existant #NUMBER ${key} at ${g.position.x},${g.position.y}`
          );
        return cell.numbers[key];
      });
      this.addNative("getString", ["string"], "string", (key) => {
        const cell = getThisCell();
        if (!(key in cell.strings))
          throw new Error(
            `Tried to get non-existant #STRING ${key} at ${g.position.x},${g.position.y}`
          );
        return cell.strings[key];
      });
      this.addNative("giveItem", ["string"], void 0, (name) => {
        if (!g.addToInventory(name))
          throw new Error(`Invalid item: ${name}`);
      });
      this.addNative(
        "isArenaFightPending",
        [],
        "bool",
        () => g.pendingArenaEnemies.length > 0
      );
      this.addNative(
        "isSolid",
        ["number", "number", "number"],
        "bool",
        (x, y, d) => {
          var _a, _b;
          const dir = getDir(d);
          const cell = getCell(x, y);
          return (_b = (_a = cell.sides[dir]) == null ? void 0 : _a.solid) != null ? _b : false;
        }
      );
      this.addNative("makePartyFace", ["number"], void 0, (d) => {
        const dir = getDir(d);
        g.facing = dir;
        g.draw();
      });
      this.addNative(
        "message",
        ["string"],
        void 0,
        (msg) => g.addToLog(msg)
      );
      this.addNative("movePartyToTag", ["string"], void 0, (tag) => {
        const position = getPositionByTag(tag);
        g.position = position;
        g.markVisited();
        g.draw();
      });
      this.addNative(
        "skillCheck",
        ["string", "number"],
        "bool",
        (type, dc) => {
          const stat = getStat(type);
          const pcIndex = this.env.get("pcIndex").value;
          const pc = g.party[pcIndex];
          const roll = g.roll(pc) + pc[stat];
          return roll >= dc;
        }
      );
      this.addNative("startArenaFight", [], "bool", () => {
        const count = g.pendingArenaEnemies.length;
        if (!count)
          return false;
        const enemies2 = g.pendingArenaEnemies.splice(0, count);
        g.combat.begin(enemies2, "arena");
        return true;
      });
      this.addNative("startNormalFight", [], "bool", () => {
        const count = g.pendingNormalEnemies.length;
        if (!count)
          return false;
        const enemies2 = g.pendingNormalEnemies.splice(0, count);
        g.combat.begin(enemies2, "normal");
        return true;
      });
      this.addNative(
        "onTagInteract",
        ["string", "function"],
        void 0,
        (tag, cb) => {
          this.onTagInteract.set(tag, cb);
        }
      );
      this.addNative(
        "onTagEnter",
        ["string", "function"],
        void 0,
        (tag, cb) => {
          this.onTagEnter.set(tag, cb);
        }
      );
      this.addNative("random", ["number"], "number", random);
      this.addNative(
        "removeObject",
        ["number", "number"],
        void 0,
        (x, y) => {
          const cell = getCell(x, y);
          cell.object = void 0;
          g.draw();
        }
      );
      this.addNative(
        "removeTag",
        ["number", "number", "string"],
        void 0,
        (x, y, tag) => {
          const cell = getCell(x, y);
          const index = cell.tags.indexOf(tag);
          if (index >= 0)
            cell.tags.splice(index, 1);
          else
            console.warn(
              `script tried to remove tag ${tag} at ${x},${y} -- not present`
            );
        }
      );
      this.addNative(
        "selectTileWithTag",
        ["string"],
        void 0,
        (tag) => {
          const position = getPositionByTag(tag);
          this.env.set("selectedX", num(position.x, true));
          this.env.set("selectedY", num(position.y, true));
        }
      );
      this.addNative(
        "setDecal",
        ["number", "number", "number", "number"],
        void 0,
        (x, y, d, t) => {
          const side = getSide(x, y, d);
          side.decal = t;
          g.draw();
        }
      );
      this.addNative(
        "setSolid",
        ["number", "number", "number", "bool"],
        void 0,
        (x, y, d, solid) => {
          const side = getSide(x, y, d);
          side.solid = solid;
        }
      );
      this.addNative(
        "tileHasTag",
        ["number", "number", "string"],
        "bool",
        (x, y, tag) => getCell(x, y).tags.includes(tag)
      );
      this.addNative(
        "unlock",
        ["number", "number", "number"],
        void 0,
        (x, y, d) => {
          const side = getSide(x, y, d);
          side.solid = false;
          const otherSide = move({ x, y }, d);
          const opposite = getSide(otherSide.x, otherSide.y, rotate(d, 2));
          if (opposite)
            opposite.solid = false;
        }
      );
      this.addNative("obstacle", [], void 0, () => g.setObstacle(true));
      this.addNative("clearObstacle", [], void 0, () => g.setObstacle(false));
    }
    run(program) {
      return run(this, program);
    }
    runCallback(fn, ...args) {
      this.env.set("partyX", num(this.g.position.x, true));
      this.env.set("partyY", num(this.g.position.y, true));
      this.env.set("partyDir", num(this.g.facing, true));
      this.env.delete("selectedX");
      this.env.delete("selectedY");
      if (fn._ === "function")
        return callFunction(this, fn, args.slice(0, fn.args.length));
      else
        return fn.value(...args);
    }
    onEnter(newPos, oldPos) {
      const tile = this.g.getCell(newPos.x, newPos.y);
      if (!tile)
        return;
      for (const tag of tile.tags) {
        const cb = this.onTagEnter.get(tag);
        if (cb) {
          this.env.set("pcIndex", num(this.g.facing, true));
          this.runCallback(cb, num(oldPos.x), num(oldPos.y));
        }
      }
    }
    onInteract(pcIndex) {
      const tile = this.g.getCell(this.g.position.x, this.g.position.y);
      if (!tile)
        return false;
      let result = false;
      for (const tag of tile.tags) {
        const cb = this.onTagInteract.get(tag);
        if (cb) {
          this.env.set("pcIndex", num(pcIndex, true));
          this.runCallback(cb, str(this.g.party[pcIndex].skill));
          result = true;
        }
      }
      return result;
    }
  };

  // res/hud/base.png
  var base_default = "./base-CLJU2TVL.png";

  // res/hud/buttons.png
  var buttons_default = "./buttons-KWE5CIYP.png";

  // res/hud/map-border.png
  var map_border_default = "./map-border-OU5SS5IH.png";

  // res/hud/marble.png
  var marble_default = "./marble-W57UJINA.png";

  // res/hud/ring.png
  var ring_default = "./ring-H2TENGRF.png";

  // src/StatsRenderer.ts
  var barWidth = 38;
  var coordinates = [
    xy(214, 138),
    xy(274, 180),
    xy(214, 224),
    xy(154, 180)
  ];
  var MarbleAnimator = class {
    constructor(parent, interval = 50, progressTick = 0.2) {
      this.parent = parent;
      this.interval = interval;
      this.progressTick = progressTick;
      this.tick = () => {
        this.parent.g.draw();
        this.progress += this.progressTick;
        if (this.progress >= 1) {
          clearInterval(this.timeout);
          this.timeout = void 0;
        }
        this.parent.positions = this.getPositions();
      };
      this.progress = 0;
      this.swaps = [];
    }
    handle(swaps) {
      if (!this.timeout)
        this.timeout = setInterval(this.tick, this.interval);
      this.swaps = swaps;
      this.progress = 0;
      this.parent.positions = this.getPositions();
    }
    getPositions() {
      const positions = coordinates.slice();
      for (const { from, to } of this.swaps) {
        positions[to] = lerpXY(coordinates[from], coordinates[to], this.progress);
      }
      return positions;
    }
  };
  var StatsRenderer = class {
    constructor(g, text = xy(25, 21), hp = xy(7, 29), sp = xy(7, 35)) {
      this.g = g;
      this.text = text;
      this.hp = hp;
      this.sp = sp;
      this.animator = new MarbleAnimator(this);
      this.spots = [];
      this.positions = coordinates;
      g.eventHandlers.onPartySwap.add((e) => this.animator.handle(e.swaps));
    }
    render(bg) {
      this.spots = [];
      for (let i = 0; i < 4; i++) {
        const xy2 = this.positions[i];
        const pc = this.g.party[i];
        this.renderPC(xy2, pc, bg, i);
      }
    }
    renderPC({ x, y }, pc, bg, index) {
      const { text, hp, sp } = this;
      const { ctx } = this.g;
      this.renderBar(x + hp.x, y + hp.y, pc.hp, pc.maxHP, Colours_default.hp);
      this.renderBar(x + sp.x, y + sp.y, pc.sp, pc.maxSP, Colours_default.sp);
      ctx.globalAlpha = index === this.g.facing ? 1 : 0.7;
      ctx.drawImage(bg, x, y);
      ctx.globalAlpha = 1;
      const { draw } = withTextStyle(ctx, {
        textAlign: "center",
        textBaseline: "middle",
        fillStyle: "white"
      });
      draw(pc.name, x + bg.width / 2, y + text.y, barWidth);
      this.spots.push({
        id: index,
        x,
        y,
        ex: x + bg.width,
        ey: y + bg.height,
        cursor: "pointer"
      });
    }
    spotClicked(spot) {
      this.g.pcClicked(spot.id);
    }
    renderBar(x, y, current, max, colour) {
      const width = Math.floor(
        barWidth * Math.max(0, Math.min(1, current / max))
      );
      this.g.ctx.fillStyle = colour;
      this.g.ctx.fillRect(x, y, width, 3);
    }
  };

  // src/MinimapRenderer.ts
  var facingChars = ["^", ">", "v", "<"];
  var sideColours = {
    "": "white",
    d: "silver",
    s: "grey",
    w: "orange",
    ds: "silver",
    dw: "red",
    sw: "black",
    dsw: "silver"
  };
  function rect(ctx, x, y, ox, oy, w, h, tag) {
    ctx.fillStyle = sideColours[tag];
    ctx.fillRect(x + ox, y + oy, w, h);
  }
  var MinimapRenderer = class {
    constructor(g, tileSize = 16, wallSize = 2, size = xy(2, 2), position = xy(375, 170)) {
      this.g = g;
      this.tileSize = tileSize;
      this.wallSize = wallSize;
      this.size = size;
      this.position = position;
    }
    render() {
      const { tileSize, size, position, wallSize } = this;
      const { ctx, facing, position: partyPos } = this.g;
      const startX = position.x;
      const startY = position.y;
      let dx = 0;
      let dy = startY;
      for (let y = -size.y; y <= size.y; y++) {
        const ty = y + partyPos.y;
        dx = startX - tileSize;
        for (let x = -size.x; x <= size.x; x++) {
          const tx = x + partyPos.x;
          dx += tileSize;
          const { cell, north, east, south, west } = this.g.getMinimapData(
            tx,
            ty
          );
          if (cell) {
            ctx.fillStyle = Colours_default.mapVisited;
            ctx.fillRect(dx, dy, tileSize, tileSize);
          }
          const edge = tileSize - wallSize;
          if (north)
            rect(ctx, dx, dy, 0, 0, tileSize, wallSize, north);
          if (east)
            rect(ctx, dx, dy, edge, 0, wallSize, tileSize, east);
          if (south)
            rect(ctx, dx, dy, 0, edge, tileSize, wallSize, south);
          if (west)
            rect(ctx, dx, dy, 0, 0, wallSize, tileSize, west);
          if (cell == null ? void 0 : cell.object) {
            const { draw: draw2 } = withTextStyle(ctx, {
              textAlign: "center",
              textBaseline: "middle",
              fillStyle: "white",
              fontSize: tileSize
            });
            draw2("\u25CF", dx + tileSize / 2, dy + tileSize / 2);
          }
        }
        dy += tileSize;
      }
      const { draw } = withTextStyle(ctx, {
        textAlign: "center",
        textBaseline: "middle",
        fillStyle: "white"
      });
      draw(
        facingChars[facing],
        startX + tileSize * (size.x + 0.5),
        startY + tileSize * (size.y + 0.5)
      );
    }
  };

  // src/SkillRenderer.ts
  var SkillRenderer = class {
    constructor(g, position = xy(0, 0), offset = xy(20, 42), buttonSize = xy(80, 16), rowHeight = 18) {
      this.g = g;
      this.position = position;
      this.offset = offset;
      this.buttonSize = buttonSize;
      this.rowHeight = rowHeight;
      this.spots = [];
    }
    render() {
      if (this.g.combat.inCombat)
        return;
      const { buttonSize, offset, position, rowHeight } = this;
      const { draw } = withTextStyle(this.g.ctx, {
        textAlign: "left",
        textBaseline: "middle",
        fillStyle: "white"
      });
      const textX = position.x + offset.x;
      let textY = position.y + offset.y;
      for (let id2 = 0; id2 < 4; id2++) {
        const pc = this.g.party[id2];
        if (pc.alive) {
          draw(pc.skill, textX, textY);
          const x = textX - 10;
          const y = textY - 8;
          this.spots.push({
            id: id2,
            x,
            y,
            ex: x + buttonSize.x,
            ey: y + buttonSize.y,
            cursor: "pointer"
          });
        }
        textY += rowHeight;
      }
    }
    spotClicked(spot) {
      this.g.interact(spot.id);
    }
  };

  // src/HUDRenderer.ts
  var empty = document.createElement("img");
  var zero = xyi(0, 0);
  var RollListener = class {
    constructor(g, position = xyi(g.canvas.width / 2, 212), initialDelay = 2e3, fadeDelay = 500) {
      this.g = g;
      this.position = position;
      this.initialDelay = initialDelay;
      this.fadeDelay = fadeDelay;
      this.tick = () => {
        this.opacity = this.opacity > 0.1 ? this.opacity /= 2 : 0;
        this.g.draw();
        this.timer = this.opacity ? setTimeout(this.tick, this.fadeDelay) : void 0;
      };
      this.value = 0;
      this.colour = "white";
      this.opacity = 0;
      this.g.eventHandlers.onRoll.add(
        ({ value, size }) => this.rolled(
          value,
          value === 1 ? "red" : value === size ? "lime" : "white"
        )
      );
    }
    rolled(value, colour) {
      this.value = value;
      this.colour = colour;
      this.opacity = 1;
      if (this.timer)
        clearTimeout(this.timer);
      this.timer = setTimeout(this.tick, this.initialDelay);
      this.g.draw();
    }
    render() {
      if (this.opacity) {
        const { draw } = withTextStyle(this.g.ctx, {
          textAlign: "center",
          textBaseline: "middle",
          fillStyle: this.colour,
          fontSize: 16,
          globalAlpha: this.opacity
        });
        draw(this.value.toString(), this.position.x, this.position.y);
        this.g.ctx.globalAlpha = 1;
      }
    }
  };
  var HUDRenderer = class {
    constructor(g) {
      this.g = g;
      this.images = {
        base: empty,
        buttons: empty,
        mapBorder: empty,
        marble: empty,
        ring: empty
      };
      this.positions = {
        base: zero,
        buttons: zero,
        mapBorder: zero,
        marble: zero,
        ring: zero
      };
      this.stats = new StatsRenderer(g);
      this.minimap = new MinimapRenderer(g);
      this.roll = new RollListener(g);
      this.skills = new SkillRenderer(g);
    }
    acquireImages() {
      return __async(this, null, function* () {
        const [base, buttons, mapBorder, marble, ring] = yield Promise.all([
          this.g.res.loadImage(base_default),
          this.g.res.loadImage(buttons_default),
          this.g.res.loadImage(map_border_default),
          this.g.res.loadImage(marble_default),
          this.g.res.loadImage(ring_default)
        ]);
        const { width, height } = this.g.canvas;
        this.images = { base, buttons, mapBorder, marble, ring };
        this.positions = {
          base: zero,
          buttons: xyi(32, height - buttons.height),
          mapBorder: xyi(width - mapBorder.width, height - mapBorder.height),
          marble: zero,
          // not used
          ring: xyi((width - ring.width) / 2 - 2, height - ring.height)
        };
        this.skills.position = this.positions.buttons;
        return this.images;
      });
    }
    paste(image) {
      const pos = this.positions[image];
      this.g.ctx.drawImage(this.images[image], pos.x, pos.y);
    }
    render() {
      this.paste("base");
      this.paste("ring");
      this.roll.render();
      this.stats.render(this.images.marble);
      this.minimap.render();
      this.paste("mapBorder");
      this.paste("buttons");
      this.skills.render();
    }
  };

  // res/music/komfort-zone.ogg
  var komfort_zone_default = "./komfort-zone-GXVCNDIF.ogg";

  // res/music/mod-dot-vigor.ogg
  var mod_dot_vigor_default = "./mod-dot-vigor-OULMZ74T.ogg";

  // res/music/ringing-steel.ogg
  var ringing_steel_default = "./ringing-steel-7SYI4FL5.ogg";

  // res/music/selume.ogg
  var selume_default = "./selume-SBU4SIT3.ogg";

  // src/Jukebox.ts
  var komfortZone = { name: "komfort zone", url: komfort_zone_default };
  var modDotVigor = {
    name: "mod dot vigor",
    url: mod_dot_vigor_default,
    loop: true
  };
  var ringingSteel = {
    name: "ringing steel",
    url: ringing_steel_default,
    loop: true
  };
  var selume = { name: "selume", url: selume_default };
  var playlists = {
    title: { tracks: [selume] },
    explore: { tracks: [komfortZone], between: { roll: 20, bonus: 10 } },
    combat: { tracks: [modDotVigor] },
    arena: { tracks: [ringingSteel] }
  };
  var Jukebox = class {
    constructor(g) {
      this.g = g;
      this.trackEnded = () => {
        const { playlist } = this;
        if (!playlist)
          return;
        if (playlist.between) {
          const delay = random(playlist.between.roll) + playlist.between.bonus;
          if (delay) {
            this.delayTimer = setTimeout(this.next, delay * 1e3);
            return;
          }
        }
        this.next();
      };
      this.next = () => {
        const { index, playlist } = this;
        if (!playlist)
          return;
        this.cancelDelay();
        this.index = wrap(index + 1, playlist.tracks.length);
        void this.start();
      };
      this.tryPlay = () => {
        if (this.wantToPlay) {
          const name = this.wantToPlay;
          this.wantToPlay = void 0;
          void this.play(name).then((success) => {
            if (success) {
              this.g.eventHandlers.onPartyMove.delete(this.tryPlay);
              this.g.eventHandlers.onPartySwap.delete(this.tryPlay);
              this.g.eventHandlers.onPartyTurn.delete(this.tryPlay);
            }
            return success;
          });
        }
      };
      this.index = 0;
      g.eventHandlers.onPartyMove.add(this.tryPlay);
      g.eventHandlers.onPartySwap.add(this.tryPlay);
      g.eventHandlers.onPartyTurn.add(this.tryPlay);
      g.eventHandlers.onCombatBegin.add(
        ({ type }) => void this.play(type === "normal" ? "combat" : "arena")
      );
      g.eventHandlers.onCombatOver.add(() => void this.play("explore"));
    }
    acquire(track) {
      return __async(this, null, function* () {
        if (!track.audio) {
          const audio = yield this.g.res.loadAudio(track.url);
          audio.addEventListener("ended", this.trackEnded);
          track.audio = audio;
          if (track.loop)
            audio.loop = true;
        }
        return track;
      });
    }
    get status() {
      if (this.delayTimer)
        return "between tracks";
      if (!this.playing)
        return "idle";
      return `playing: ${this.playing.name}`;
    }
    cancelDelay() {
      if (this.delayTimer) {
        clearTimeout(this.delayTimer);
        this.delayTimer = void 0;
      }
    }
    play(p) {
      return __async(this, null, function* () {
        var _a, _b;
        this.cancelDelay();
        this.wantToPlay = p;
        (_b = (_a = this.playing) == null ? void 0 : _a.audio) == null ? void 0 : _b.pause();
        const playlist = playlists[p];
        this.playlist = playlist;
        this.index = random(playlist.tracks.length);
        return this.start();
      });
    }
    start() {
      return __async(this, null, function* () {
        if (!this.playlist)
          return false;
        this.cancelDelay();
        const track = this.playlist.tracks[this.index];
        this.playing = yield this.acquire(track);
        if (!this.playing.audio)
          throw Error(`Acquire ${track.name} failed`);
        try {
          this.playing.audio.currentTime = 0;
          yield this.playing.audio.play();
          this.playing = track;
          this.wantToPlay = void 0;
          return true;
        } catch (e) {
          console.warn(e);
          this.playing = void 0;
          return false;
        }
      });
    }
    stop() {
      if (this.playing) {
        this.playing.audio.pause();
        this.playing = void 0;
      }
    }
  };

  // src/LoadingScreen.ts
  var LoadingScreen = class {
    constructor(g) {
      this.g = g;
      g.draw();
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onKey() {
    }
    render() {
      const { canvas, ctx, res } = this.g;
      const { draw } = withTextStyle(ctx, {
        textAlign: "center",
        textBaseline: "middle",
        fillStyle: "white"
      });
      draw(
        `Loading: ${res.loaded}/${res.loading}`,
        canvas.width / 2,
        canvas.height / 2
      );
      this.g.draw();
    }
  };

  // src/tools/textWrap.ts
  function splitWords(s) {
    const words = [];
    let current = "";
    for (const c of s) {
      if (c === " " || c === "\n") {
        words.push(current);
        if (c === "\n")
          words.push("\n");
        current = "";
        continue;
      }
      current += c;
    }
    if (current)
      words.push(current);
    return words;
  }
  function textWrap(source, width, measure) {
    const measurement = measure(source);
    if (measurement.width < width)
      return { lines: source.split("\n"), measurement };
    const words = splitWords(source);
    const lines = [];
    let constructed = "";
    for (const w of words) {
      if (w === "\n") {
        lines.push(constructed);
        constructed = "";
        continue;
      }
      if (!constructed) {
        constructed += w;
        continue;
      }
      const temp = constructed + " " + w;
      const size = measure(temp);
      if (size.width > width) {
        lines.push(constructed);
        constructed = w;
      } else
        constructed += " " + w;
    }
    if (constructed)
      lines.push(constructed);
    return { lines, measurement: measure(source) };
  }

  // src/LogRenderer.ts
  var LogRenderer = class {
    constructor(g, position = xy(276, 0), size = xy(204, 270), padding = xy(2, 2)) {
      this.g = g;
      this.position = position;
      this.size = size;
      this.padding = padding;
    }
    render() {
      const { padding, position, size } = this;
      const { ctx, log } = this.g;
      ctx.fillStyle = Colours_default.logShadow;
      ctx.fillRect(position.x, position.y, size.x, size.y);
      const width = size.x - padding.x * 2;
      const textX = position.x + padding.x;
      let textY = position.y + size.y - padding.y;
      const { lineHeight, measure, draw } = withTextStyle(ctx, {
        textAlign: "left",
        textBaseline: "bottom",
        fillStyle: "white"
      });
      for (let i = log.length - 1; i >= 0; i--) {
        const { lines } = textWrap(log[i], width, measure);
        for (const line of lines.reverse()) {
          draw(line, textX, textY);
          textY = textY - lineHeight;
          if (textY < position.y)
            return;
        }
      }
    }
  };

  // src/ResourceManager.ts
  var ResourceManager = class {
    constructor() {
      this.promises = /* @__PURE__ */ new Map();
      this.loaders = [];
      this.atlases = {};
      this.audio = {};
      this.images = {};
      this.maps = {};
      this.scripts = {};
      this.loaded = 0;
      this.loading = 0;
    }
    start(src, promise) {
      this.loading++;
      this.promises.set(src, promise);
      this.loaders.push(
        promise.then((arg) => {
          this.loaded++;
          return arg;
        })
      );
      return promise;
    }
    loadImage(src) {
      const res = this.promises.get(src);
      if (res)
        return res;
      return this.start(
        src,
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.addEventListener("load", () => {
            this.images[src] = img;
            resolve(img);
          });
        })
      );
    }
    loadAtlas(src) {
      const res = this.promises.get(src);
      if (res)
        return res;
      return this.start(
        src,
        fetch(src).then((r) => r.json()).then((atlas) => {
          this.atlases[src] = atlas;
          return atlas;
        })
      );
    }
    loadGCMap(src) {
      const res = this.promises.get(src);
      if (res)
        return res;
      return this.start(
        src,
        fetch(src).then((r) => r.json()).then((map) => {
          this.maps[src] = map;
          return map;
        })
      );
    }
    loadScript(src) {
      const res = this.promises.get(src);
      if (res)
        return res;
      return this.start(
        src,
        fetch(src).then((r) => r.text()).then((script) => {
          this.scripts[src] = script;
          return script;
        })
      );
    }
    loadAudio(src) {
      const res = this.promises.get(src);
      if (res)
        return res;
      return this.start(
        src,
        new Promise((resolve) => {
          const audio = new Audio();
          audio.src = src;
          audio.addEventListener("canplaythrough", () => {
            this.audio[src] = audio;
            resolve(audio);
          });
        })
      );
    }
  };

  // src/Soon.ts
  var Soon = class {
    constructor(callback) {
      this.callback = callback;
      this.call = () => {
        this.timeout = void 0;
        this.callback();
      };
    }
    schedule() {
      if (!this.timeout)
        this.timeout = requestAnimationFrame(this.call);
    }
  };

  // res/sad-folks.png
  var sad_folks_default = "./sad-folks-WT2RUZAU.png";

  // res/map.json
  var map_default = "./map-5S5AKS6C.json";

  // src/items/cleavesman.ts
  var cleavesman_exports = {};
  __export(cleavesman_exports, {
    ChivalrousMantle: () => ChivalrousMantle,
    Gambesar: () => Gambesar,
    GorgothilSword: () => GorgothilSword,
    Gullark: () => Gullark,
    Haringplate: () => Haringplate,
    Jaegerstock: () => Jaegerstock,
    Varganglia: () => Varganglia
  });
  var GorgothilSword = {
    name: "Gorgothil Sword",
    restrict: ["Cleavesman"],
    slot: "Hand",
    type: "Weapon",
    bonus: {},
    action: {
      name: "Bash",
      tags: ["attack"],
      sp: 1,
      targets: oneOpponent,
      act({ g, me, targets }) {
        const amount = g.roll(me) + 4;
        g.applyDamage(me, targets, amount, "hp", "normal");
      }
    }
  };
  var Haringplate = {
    name: "Haringplate",
    restrict: ["Cleavesman"],
    slot: "Body",
    type: "Armour",
    bonus: { maxHP: 5 },
    action: Brace
  };
  var Gullark = {
    name: "Gullark",
    restrict: ["Cleavesman"],
    slot: "Hand",
    type: "Shield",
    bonus: { maxHP: 3 },
    action: Deflect
  };
  var Jaegerstock = {
    name: "Jaegerstock",
    restrict: ["Cleavesman"],
    slot: "Hand",
    type: "Weapon",
    bonus: {},
    action: DuoStab
  };
  var Varganglia = {
    name: "Varganglia",
    restrict: ["Cleavesman"],
    slot: "Body",
    type: "Armour",
    bonus: {},
    action: Barb
  };
  var Gambesar = {
    name: "Gambesar",
    restrict: ["Cleavesman"],
    slot: "Body",
    type: "Armour",
    bonus: { maxHP: 5 },
    action: {
      name: "Tackle",
      tags: ["attack"],
      sp: 3,
      targets: opponents(1, [1, 3]),
      act({ g, me, targets }) {
        const amount = g.roll(me);
        g.applyDamage(me, targets, amount, "hp", "normal");
      }
    }
  };
  var ChivalrousMantle = {
    name: "Chivalrous Mantle",
    restrict: ["Cleavesman"],
    slot: "Special",
    bonus: {},
    action: {
      name: "Honour",
      tags: [],
      sp: 2,
      targets: allAllies,
      act({ g, targets }) {
        g.addEffect(() => ({
          name: "Honour",
          duration: 2,
          affects: targets,
          buff: true,
          onCalculateDamage(e) {
            if (this.affects.includes(e.target) && e.type === "determination")
              e.multiplier = 0;
          }
        }));
      }
    }
  };
  GorgothilSword.lore = `"""May this steel sing the color of heathen blood.""

This phrase has been uttered ever since Gorgothil was liberated from the thralls of Mullanginan during the Lost War. Gorgothil is now an ever devoted ally, paying their debts by smithing weaponry for all cleavesmen under Cherraphy's wing."`;
  Gullark.lore = `Dredged from the Furnace of Ogkh, gullarks are formerly the shells belonging to an ancient creature called a Crim; egg shaped quadrupeds with the face of someone screaming in torment. Many believe their extinction is owed to the over-production of gullarks during the Lost War.`;
  Jaegerstock.lore = `Able to stab in a forward and back motion, then a back to forward motion, and once again in a forward and back motion. Wielders often put one foot forward to brace themselves, and those with transcendental minds? They also stab in a forward and back motion.`;
  Varganglia.lore = `Armour that's slithered forth from Telnoth's scars after the Long War ended. Varganglia carcasses have become a common attire for cleavesmen, their pelts covered with thick and venomous barbs that erupt from the carcass when struck, making the wearer difficult to strike.`;
  Gambesar.lore = `"Enchanted by Cherraphy's highest order of sages, gambesars are awarded only to cleavesman that return from battle after sustaining tremendous injury. It's said that wearing one allows the user to shift the environment around them, appearing multiple steps from where they first started in just an instant.`;

  // src/items/farScout.ts
  var farScout_exports = {};
  __export(farScout_exports, {
    AdaloaxPelt: () => AdaloaxPelt,
    BoltSlinger: () => BoltSlinger,
    Haversack: () => Haversack,
    PryingPoleaxe: () => PryingPoleaxe
  });
  var BoltSlinger = {
    name: "Bolt Slinger",
    restrict: ["Far Scout"],
    slot: "Hand",
    type: "Weapon",
    bonus: {},
    action: {
      name: "Arrow",
      tags: ["attack"],
      sp: 3,
      targets: opponents(1, [1, 2, 3]),
      act({ g, me, targets }) {
        const amount = g.roll(me) + 2;
        g.applyDamage(me, targets, amount, "hp", "normal");
      }
    }
  };
  var AdaloaxPelt = {
    name: "Adaloax Pelt",
    restrict: ["Far Scout"],
    slot: "Body",
    type: "Armour",
    bonus: {},
    action: {
      name: "Bind",
      tags: ["duff"],
      sp: 4,
      targets: oneOpponent,
      act({ g, targets }) {
        g.addEffect(() => ({
          name: "Bind",
          duration: 2,
          affects: targets,
          onCanAct(e) {
            if (this.affects.includes(e.who))
              e.cancel = true;
          }
        }));
      }
    }
  };
  var Haversack = {
    name: "Haversack",
    restrict: ["Far Scout"],
    slot: "Hand",
    type: "Weapon",
    bonus: {},
    action: Sand
  };
  var PryingPoleaxe = {
    name: "Prying Poleaxe",
    restrict: ["Far Scout"],
    slot: "Hand",
    type: "Weapon",
    bonus: {},
    action: {
      name: "Gouge",
      tags: ["attack", "duff"],
      sp: 5,
      targets: oneOpponent,
      act({ g, me, targets }) {
        const amount = g.roll(me) + 6;
        if (g.applyDamage(me, targets, amount, "hp", "normal") > 0) {
          g.addEffect(() => ({
            name: "Gouge",
            duration: 2,
            affects: targets,
            onCalculateDR(e) {
              if (this.affects.includes(e.who))
                e.multiplier = 0;
            }
          }));
        }
      }
    }
  };
  BoltSlinger.lore = `A string and stick combo coming in many shapes and sizes. All with the express purpose of expelling sharp objects at blinding speeds. Any far scout worth their salt still opts for a retro-styled bolt slinger; clunky mechanisms and needless gadgets serve only to hinder one's own skills.`;
  AdaloaxPelt.lore = `Traditional hunter-gatherer and scouting attire, adaloax pelts are often sold and coupled with a set of bolas for trapping prey. The rest of the adaloax is divided up into portions of meat and sold at market value, often a single adaloax can produce upwards of three pelts and enough meat to keep multiple people fed.`;
  Haversack.lore = `People, creatures, automata and constructs of all kinds find different use for a haversack, but the sand pouch remains the same. Considered a coward's weapon by many, the remainder would disagree as sometimes flight is the only response to a fight. A hasty retreat is far more preferable than a future as carrion.`;

  // src/items/flagSinger.ts
  var flagSinger_exports = {};
  __export(flagSinger_exports, {
    CarvingKnife: () => CarvingKnife,
    CatFacedMasquerade: () => CatFacedMasquerade,
    DivaDress: () => DivaDress,
    Fandagger: () => Fandagger,
    FolkHarp: () => FolkHarp,
    GrowlingCollar: () => GrowlingCollar,
    SignedCasque: () => SignedCasque,
    Storyscroll: () => Storyscroll,
    WindmillRobe: () => WindmillRobe
  });
  var CarvingKnife = {
    name: "Carving Knife",
    restrict: ["Flag Singer"],
    slot: "Hand",
    type: "Weapon",
    bonus: {},
    action: Scar
  };
  var SignedCasque = {
    name: "Signed Casque",
    restrict: ["Flag Singer"],
    slot: "Body",
    type: "Armour",
    bonus: {},
    action: {
      name: "Cheer",
      tags: ["buff"],
      sp: 2,
      targets: ally(1),
      act({ g, targets }) {
        g.addEffect(() => ({
          name: "Cheer",
          duration: 2,
          affects: targets,
          buff: true,
          onCalculateDR(e) {
            if (this.affects.includes(e.who))
              e.value += 3;
          }
        }));
      }
    }
  };
  var Fandagger = {
    name: "Fandagger",
    restrict: ["Flag Singer"],
    slot: "Hand",
    type: "Flag",
    bonus: {},
    action: {
      name: "Conduct",
      tags: ["attack"],
      sp: 3,
      targets: oneOpponent,
      act({ g, me, targets }) {
        const dealt = g.applyDamage(me, targets, 6, "hp", "normal");
        if (dealt > 0) {
          const ally2 = oneOf(g.getAllies(me, false));
          if (ally2) {
            g.addToLog(`${me.name} conducts ${ally2.name}'s next attack.`);
            g.addEffect((destroy) => ({
              name: "Conduct",
              duration: 1,
              affects: [ally2],
              buff: true,
              onCalculateDamage(e) {
                if (this.affects.includes(e.attacker)) {
                  const bonus = g.roll(me);
                  e.amount += bonus;
                  destroy();
                }
              }
            }));
          }
        }
      }
    }
  };
  var Storyscroll = {
    name: "Storyscroll",
    restrict: ["Flag Singer"],
    slot: "Hand",
    type: "Flag",
    bonus: { spirit: 1 },
    action: Bravery
  };
  var DivaDress = {
    name: "Diva's Dress",
    restrict: ["Flag Singer"],
    slot: "Body",
    type: "Armour",
    bonus: { spirit: 1 },
    action: Defy
  };
  var GrowlingCollar = {
    name: "Growling Collar",
    restrict: ["Flag Singer"],
    slot: "Body",
    type: "Armour",
    bonus: {},
    action: {
      name: "Vox Pop",
      tags: ["duff"],
      sp: 4,
      targets: allAllies,
      act({ g, me, targets }) {
        g.addEffect(() => ({
          name: "Vox Pop",
          duration: 2,
          affects: targets,
          buff: true,
          onCalculateDR(e) {
            if (this.affects.includes(e.who))
              e.value += 2;
          }
        }));
        const opponent = g.getOpponent(me);
        if (opponent) {
          const effects = g.getEffectsOn(opponent).filter((e) => e.buff);
          if (effects.length) {
            g.addToLog(`${opponent.name} loses their protections.`);
            g.removeEffectsFrom(effects, opponent);
            g.applyDamage(me, [opponent], g.roll(me), "hp", "normal");
          }
        }
      }
    }
  };
  var FolkHarp = {
    name: "Folk Harp",
    restrict: ["Flag Singer"],
    slot: "Special",
    bonus: {},
    action: {
      name: "Muse",
      tags: ["buff"],
      sp: 2,
      targets: allAllies,
      act({ g, targets }) {
        g.addEffect(() => ({
          name: "Muse",
          duration: 2,
          affects: targets,
          onCalculateDamage(e) {
            if (this.affects.includes(e.attacker))
              e.amount += e.attacker.camaraderie;
          }
        }));
      }
    }
  };
  var CatFacedMasquerade = {
    name: "Cat-faced Masquerade",
    restrict: ["Flag Singer"],
    slot: "Special",
    bonus: {},
    action: {
      name: "Inspire",
      tags: ["buff"],
      sp: 4,
      targets: allAllies,
      act({ g, me, targets }) {
        g.addEffect(() => ({
          name: "Inspire",
          duration: 2,
          affects: targets,
          onCalculateDamage(e) {
            if (this.affects.includes(e.target)) {
              e.multiplier = 0;
              g.addToLog(`${e.attacker.name} faces backlash!`);
              g.applyDamage(me, [e.attacker], g.roll(me), "hp", "magic");
            }
          }
        }));
      }
    }
  };
  var WindmillRobe = {
    name: "Windmill Robe",
    restrict: ["Flag Singer"],
    slot: "Special",
    bonus: { dr: 1 },
    action: {
      name: "Unveil",
      tags: [],
      sp: 1,
      targets: oneOpponent,
      act() {
      }
    }
  };
  CarvingKnife.lore = `Not a martial weapon, but rather a craftsman and artist's tool. Having secretly spurned Cherraphy's foul request, this Singer carries this knife as a confirmation that what they did was right.`;
  SignedCasque.lore = `A vest made of traditional plaster and adorned in writing with the feelings and wishes of each villager the Singer dares to protect.`;
  Fandagger.lore = `Fandaggers are graceful tools of the rogue, to be danced with and to be thrown between acrobats in relay. Held at one end they concertina into painted fans; the other suits the stabbing grip.`;
  Storyscroll.lore = `A furled tapestry illustrated with a brief history of Haringlee myth. When the Flag Singer whirls it about them as though dancing with ribbons, their comrades are enriched by the spirit of the fantasies it depicts.`;
  DivaDress.lore = `Few dare interfere with the performance of a Singer so dressed: these glittering magic garments dazzle any foolish enough to try! All may wear the Diva's Dress so long as it is earned by skill; gender matters not to the craft.`;
  GrowlingCollar.lore = `A mechanical amplifier pressed tightly to the skin of the throat, held in place by a black leather collar. When you speak, it roars.`;
  FolkHarp.lore = `An ancient traditional instrument, strings of animal innards sprung over a tune-measured wooden frame to create a playable musical scale. Can be plucked melodically, or strummed to produce a glistening, harmonic, rain-like sound.`;
  CatFacedMasquerade.lore = `A mask that lends its wearer a mocking air, or one of being deeply unimpressed. Turning this disdainful expression on an enemy reassures your allies of their superiority; a simple means of encouragement in complicated times.`;
  WindmillRobe.lore = `A pale blue robe with ultra-long sleeves, slung with diamond-shaped hanging sheets of fabric. Psychic expertise and practise allows you to manipulate these flags and perform intricate displays without so much as moving your arms; the most complicated dances can have a mesmerizing effect.`;

  // src/items/loamSeer.ts
  var loamSeer_exports = {};
  __export(loamSeer_exports, {
    BeekeeperBrooch: () => BeekeeperBrooch,
    Cornucopia: () => Cornucopia,
    IoliteCross: () => IoliteCross,
    JacketAndRucksack: () => JacketAndRucksack,
    MantleOfClay: () => MantleOfClay,
    Mosscloak: () => Mosscloak,
    RockringSleeve: () => RockringSleeve,
    TortoiseFamiliar: () => TortoiseFamiliar,
    WandOfWorkedFlint: () => WandOfWorkedFlint
  });
  var Cornucopia = {
    name: "Cornucopia",
    restrict: ["Loam Seer"],
    slot: "Hand",
    type: "Catalyst",
    bonus: {},
    action: Bless
  };
  var JacketAndRucksack = {
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
          affects: targets
          // TODO: enemy is more likely to drop items
        }));
      }
    }
  };
  var IoliteCross = {
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
      }
    }
  };
  var BeekeeperBrooch = {
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
      }
    }
  };
  var RockringSleeve = {
    name: "Rockring Sleeve",
    restrict: ["Loam Seer"],
    slot: "Body",
    type: "Armour",
    bonus: { dr: 2 },
    action: Bravery
  };
  var Mosscloak = {
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
          }
        }));
      }
    }
  };
  var WandOfWorkedFlint = {
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
          if (!alive.length)
            return;
          const target = oneOf(alive);
          const amount = g.roll(me) + 2;
          g.applyDamage(me, [target], amount, "hp", "magic");
        }
      }
    }
  };
  var TortoiseFamiliar = {
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
      }
    }
  };
  var MantleOfClay = {
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
          g.getOpponent(me, 3)
        ].filter(isDefined);
        const targets = [opponent, oneOf(others)].filter(isDefined);
        g.applyDamage(me, targets, amount, "hp", "magic");
        g.applyDamage(me, targets, 1, "spirit", "magic");
      }
    }
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

  // src/items/martialist.ts
  var martialist_exports = {};
  __export(martialist_exports, {
    Halberdigan: () => Halberdigan,
    HalflightCowl: () => HalflightCowl,
    HaringleeKasaya: () => HaringleeKasaya,
    KhakkharaOfGhanju: () => KhakkharaOfGhanju,
    LastEyeOfRaong: () => LastEyeOfRaong,
    LoromayHand: () => LoromayHand,
    NundarialVestments: () => NundarialVestments,
    Penduchaimmer: () => Penduchaimmer,
    YamorolMouth: () => YamorolMouth
  });
  var Penduchaimmer = {
    name: "Penduchaimmer",
    restrict: ["Martialist"],
    slot: "Hand",
    type: "Weapon",
    bonus: {},
    action: DuoStab
  };
  var HaringleeKasaya = {
    name: "Haringlee Kasaya",
    restrict: ["Martialist"],
    slot: "Body",
    type: "Armour",
    bonus: {},
    action: Parry
  };
  var KhakkharaOfGhanju = {
    name: "Khakkhara of Ghanju",
    restrict: ["Martialist"],
    slot: "Hand",
    type: "Weapon",
    bonus: {},
    action: {
      name: "Sweep",
      tags: ["attack"],
      sp: 1,
      targets: opponents(3, [0, 1, 3]),
      act({ g, me, targets }) {
        g.applyDamage(me, targets, 4, "hp", "normal");
      }
    }
  };
  var Halberdigan = {
    name: "Halberdigan",
    restrict: ["Martialist"],
    slot: "Hand",
    type: "Weapon",
    bonus: { determination: 1 },
    action: {
      name: "Thrust",
      tags: ["attack"],
      sp: 2,
      targets: opponents(1, [0, 1, 3]),
      act({ g, me, targets }) {
        const amount = g.roll(me) + 3;
        g.applyDamage(me, targets, amount, "hp", "normal");
      }
    }
  };
  var NundarialVestments = {
    name: "Nundarial Vestments",
    restrict: ["Martialist"],
    slot: "Body",
    type: "Armour",
    bonus: { camaraderie: 1 },
    action: Brace
  };
  var HalflightCowl = {
    name: "Halflight Cowl",
    restrict: ["Martialist"],
    slot: "Body",
    bonus: {},
    action: Flight
  };
  var YamorolMouth = {
    name: "Yamorol's Mouth",
    restrict: ["Martialist"],
    slot: "Special",
    bonus: {},
    action: {
      name: "Mantra",
      tags: [],
      sp: 3,
      targets: ally(1),
      act({ g, me, targets }) {
        me.determination--;
        for (const target of targets) {
          target.determination++;
          g.addToLog(`${me.name} gives everything to inspire ${target.name}.`);
        }
      }
    }
  };
  var LoromayHand = {
    name: "Loromay's Hand",
    restrict: ["Martialist"],
    slot: "Special",
    bonus: { spirit: 1 },
    action: {
      name: "Mudra",
      tags: ["buff", "duff"],
      sp: 3,
      targets: onlyMe,
      act({ g, me }) {
        g.addEffect(() => ({
          name: "Mudra",
          duration: 2,
          affects: [me],
          onCalculateDamage(e) {
            if (intersection(this.affects, [e.attacker, e.target]).length)
              e.multiplier *= 2;
          }
        }));
      }
    }
  };
  var LastEyeOfRaong = {
    name: "Last Eye of Raong",
    restrict: ["Martialist"],
    slot: "Special",
    bonus: {},
    action: {
      name: "Chakra",
      tags: ["buff"],
      sp: 3,
      targets: onlyMe,
      act({ g, me }) {
        g.addEffect(() => ({
          name: "Chakra",
          duration: 2,
          affects: [me],
          buff: true,
          onRoll(e) {
            if (this.affects.includes(e.who))
              e.value = e.size;
          }
        }));
      }
    }
  };
  Penduchaimmer.lore = `Comprised of two anchors and bound together by threaded fibre plucked from spidokans, these traditional weapons of a martialist are built to stretch and spin much like the hands of a suspended gravity clock. Penduchaimmers are a reminder to all martialists that time will always find it's way back to the living, only in death does it cease.`;
  HaringleeKasaya.lore = `Traditional garb worn by martialist masters of Haringlee, they are awarded only to those that spend their lives in devotion to the practices of spirituality. The kasaya symbolizes the wholeness and total mastery of one's self, and one who's inner eye sees only their purpose in life.`;
  KhakkharaOfGhanju.lore = `Ghanju is known simply as the first martialist, and the clanging of his khakkhara began and ended many wars. History has stricken his name from most texts, however, as it's said Ghanju practised neither under Cherraphy or Mullanginan's teachings, nor those of any other God.`;
  Halberdigan.lore = `In times of peace, halberdigans were simply a tool for picking the fruits of the Ilbombora trees that littered Haringlee's countryside. A devastating fire set by Nightjar's residents and an ensuing drought was punishing enough that farmers began taking up martialism in the name of Cherraphy, in the hope that she'll restore the Ilbombora fields to their former glory.`;
  NundarialVestments.lore = `On the day of Nundarial's passing, it's said everyone wore these vestments at Cherraphy's order, to "honour a fool's futility". Historians wager this is in reference to Nundarial spending their lifetime weathering attacks behind closed doors, never striking back, forever without purpose, sleeping in the dulcet cradle of war.`;
  HalflightCowl.lore = `Commonly mistaken as a half light cowl. This cowl instead is named after Halfli's Flight, an ancient martialist technique that requires such speed and precision it gives off the appearance that it's user is flying. Though many martialists don this cowl, few are capable of performing Halfli's Flight to it's full potential.`;
  YamorolMouth.lore = `In all essence, a beginning. Words spoken aloud, repeated in infinite chanting verse. All words and meanings find a beginning from Yamorol, the primordial birthplace of all things and where even the spirits of Gods are born.`;
  LoromayHand.lore = `In all essence, an end. Gestures and actions performed, repeated in infinite repeating motion. All motion and form finds an ending from Loromay, the primordial deathbed of all things and where even the actions of Gods become meaningless.`;
  LastEyeOfRaong.lore = `In all essence, sense. Sight to view actions, sound to hear verse. All senses are owed to Raong, whom may only witness the world of Telnoth through this lens so viciously plucked from its being in the primordial age.`;

  // src/items/warCaller.ts
  var warCaller_exports = {};
  __export(warCaller_exports, {
    BrassHeartInsignia: () => BrassHeartInsignia,
    CherClaspeGauntlet: () => CherClaspeGauntlet,
    HairShirt: () => HairShirt,
    IronFullcase: () => IronFullcase,
    OwlSkull: () => OwlSkull,
    PlatesOfWhite: () => PlatesOfWhite,
    PolishedArenaShield: () => PolishedArenaShield,
    SaintGong: () => SaintGong,
    SternMask: () => SternMask
  });
  var OwlSkull = {
    name: "Owl's Skull",
    restrict: ["War Caller"],
    slot: "Hand",
    type: "Catalyst",
    bonus: {},
    action: Defy
  };
  var IronFullcase = {
    name: "Iron Fullcase",
    restrict: ["War Caller"],
    slot: "Body",
    type: "Armour",
    bonus: { dr: 1 },
    action: {
      name: "Endure",
      tags: ["buff"],
      sp: 2,
      targets: onlyMe,
      act({ g, me }) {
        g.addEffect(() => ({
          name: "Endure",
          duration: 2,
          affects: [me],
          buff: true,
          onCalculateDR(e) {
            if (this.affects.includes(e.who))
              e.value += 2;
          }
        }));
        const opposite = g.getOpponent(me);
        if (opposite) {
          g.addToLog(
            `${opposite.name} withers in the face of ${me.name}'s endurance!`
          );
          g.addEffect(() => ({
            name: "Endured",
            duration: 2,
            affects: [opposite],
            onCalculateDetermination(e) {
              if (this.affects.includes(e.who))
                e.value -= 2;
            }
          }));
        }
      }
    }
  };
  var PolishedArenaShield = {
    name: "Polished Arena-Shield",
    restrict: ["War Caller"],
    slot: "Hand",
    type: "Shield",
    bonus: { dr: 1 },
    action: {
      name: "Pose",
      tags: ["movement"],
      sp: 2,
      targets: opponents(),
      act({ g, me }) {
        const front = g.getPosition(me).dir;
        const right = rotate(front, 1);
        const back = rotate(front, 2);
        const left = rotate(front, 3);
        const frontIsEmpty = () => !g.getOpponent(me);
        const rightIsEmpty = () => !g.getOpponent(me, 1);
        const backIsEmpty = () => !g.getOpponent(me, 2);
        const leftIsEmpty = () => !g.getOpponent(me, 3);
        if (frontIsEmpty()) {
          if (!leftIsEmpty()) {
            g.moveEnemy(left, front);
          } else if (!rightIsEmpty()) {
            g.moveEnemy(right, front);
          }
        }
        if (!backIsEmpty) {
          if (leftIsEmpty()) {
            g.moveEnemy(back, left);
          } else if (rightIsEmpty()) {
            g.moveEnemy(back, right);
          }
        }
      }
    }
  };
  var BrassHeartInsignia = {
    name: "Brass Heart Insignia",
    restrict: ["War Caller"],
    slot: "Hand",
    type: "Catalyst",
    bonus: { dr: 1 },
    action: Bless
  };
  var HairShirt = {
    name: "Hair Shirt",
    restrict: ["War Caller"],
    slot: "Body",
    type: "Armour",
    bonus: { determination: 1 },
    action: {
      name: "Kneel",
      tags: ["duff"],
      sp: 0,
      targets: onlyMe,
      act({ g, me }) {
        g.addEffect(() => ({
          name: "Kneel",
          duration: 2,
          affects: [me],
          onCalculateDR(e) {
            if (this.affects.includes(e.who))
              e.value = 0;
          }
        }));
      }
    }
  };
  var PlatesOfWhite = {
    name: "Plates of White, Brass and Gold",
    restrict: ["War Caller"],
    slot: "Body",
    type: "Armour",
    bonus: { dr: 3 },
    action: {
      name: "Gleam",
      tags: ["buff"],
      sp: 3,
      targets: onlyMe,
      act({ g, me }) {
        g.addEffect((destroy) => ({
          name: "Gleam",
          duration: 2,
          affects: [me],
          onBeforeAction(e) {
            if (intersection(this.affects, e.targets).length && e.action.tags.includes("spell")) {
              e.cancel = true;
              g.addToLog(`The gleam disrupts the spell.`);
              destroy();
              return;
            }
          }
        }));
      }
    }
  };
  var SternMask = {
    name: "The Stern Mask",
    restrict: ["War Caller"],
    slot: "Special",
    bonus: { determination: 1 },
    action: {
      name: "Ram",
      tags: ["attack"],
      sp: 4,
      targets: oneOpponent,
      act({ g, me, targets }) {
        g.applyDamage(me, targets, 6, "hp", "normal");
        g.applyDamage(me, targets, 1, "camaraderie", "normal");
        g.applyDamage(me, targets, 6, "hp", "normal");
        g.applyDamage(me, targets, 1, "camaraderie", "normal");
        for (const target of targets) {
          if (target.camaraderie <= 0)
            g.applyDamage(me, [target], g.roll(me), "hp", "normal");
        }
      }
    }
  };
  var CherClaspeGauntlet = {
    name: "Cher-claspe Gauntlet",
    restrict: ["War Caller"],
    slot: "Special",
    bonus: {},
    action: {
      name: "Smash",
      tags: ["attack"],
      sp: 3,
      x: true,
      targets: oneOpponent,
      act({ g, me, targets, x }) {
        const magnitude = x + Math.floor(me.hp / me.maxHP * 8);
        g.applyDamage(me, targets, magnitude * 4, "hp", "normal");
      }
    }
  };
  var SaintGong = {
    name: "Saint's Gong",
    restrict: ["War Caller"],
    slot: "Special",
    bonus: { maxSP: 1 },
    action: {
      name: "Truce",
      tags: ["counter"],
      sp: 6,
      targets: { type: "enemy" },
      act({ g, targets }) {
        g.addEffect(() => ({
          name: "Truce",
          duration: 2,
          affects: targets,
          onCanAct(e) {
            if (this.affects.includes(e.who) && e.action.tags.includes("attack"))
              e.cancel = true;
          }
        }));
      }
    }
  };
  OwlSkull.lore = `All experienced knights know that menace lies mainly in the eyes, whether it be communicated via a glare through the slits of a full helmet or by a wild, haunting stare. War Callers find common ground with the owls that hunt their forests and sometimes try to tame them as familiars, as others do falcons in different realms.`;
  IronFullcase.lore = `A stiff layer of iron to protect the innards, sleeveless to allow flexibility in one's arms. Arena veterans favour such gear, goading their opponents with weapons brandished wildly, their chest remaining an impossible target to hit.`;
  PolishedArenaShield.lore = `As well as being a serviceable shield, this example has a percussive quality; when beaten with a club it resounds as a bell.`;
  BrassHeartInsignia.lore = `War Caller iconography is not to be shown to anyone who has studied medicine; the Brass Heart signifies that the will to heal one's self comes from the chest, always thrust proudly forwards to receive terrible blows. (Two weeks in bed and a poultice applied thrice daily notwithstanding.)`;
  HairShirt.lore = `A garment for penitents: the unwelcome itching generated by its wiry goat-hair lining must be surpassed through strength of will.`;
  PlatesOfWhite.lore = `An impressive suit of armour, decorated in the colours that the Crusaders of Cherraphy favour. Despite the lavish attention to presentation, it is no ceremonial costume: beneath the inlaid discs of fine metal, steel awaits to contest any oncoming blade.`;
  SternMask.lore = `A full helm, decorated in paint and fine metalwork to resemble the disdainful face of a saint. Each headbutt it delivers communicates severe chastisement.`;
  CherClaspeGauntlet.lore = `A pair of iron gauntlets ensorcelled with a modest enchantment; upon the command of a priest, these matching metal gloves each lock into the shape of a fist and cannot be undone by the bearer; a stricture that War Callers willingly bear, that it may sustain their resolve and dismiss their idle habits.`;
  SaintGong.lore = `A brass percussive disc mounted on a seven foot banner-pole and hung from hinge-chains, letting it swing freely enough that its shuddering surface rings clean. Most effective when tuned to the frequency of a chosen knight's bellows, allowing it to crash loudly in accompaniment with each war cry.`;

  // src/classes.ts
  var classes = {
    Martialist: {
      name: "Kirkwin",
      lore: `From birth, Kirkwin trained his body as a weapon, studying under the most brutal martialist sects that were allowed in Haringlee, and some that weren't. So it was to great surprise when Cherraphy appointed Kirkwin as the leader of Haringlee's guard; protector of the weak, defender of the pathetic as he saw it. Zealotry never suited Kirkwin, and rather than play his role as a coward soldier sitting idle, he abandons his post to join the assault on Nightjar, and in doing so vows to Cherraphy and Mullanginan both that they too will someday bleed and bow low.`,
      deathQuote: `Kirkwin's body sagged in the face of extreme odds, and he knew that his discipline had finally failed. His greatest fear was that his lifelong practises had served only to transform his youth into a carved body, a merciless expression and little else besides. Robbed of his strength, he found it easy to part with the remainder of his spirit.`,
      hp: 21,
      sp: 7,
      determination: 6,
      camaraderie: 2,
      spirit: 3,
      items: [Penduchaimmer, HaringleeKasaya],
      skill: "Smash"
    },
    Cleavesman: {
      name: "Mogrigg",
      lore: `The village's headsman, a role instigated by Cherraphy and chosen at random. Considered a luckless man, not blamed for the three lives he's taken at his god's behest. Was previously a loyal soldier and pikeman at a time when his lord was just and interested in protecting the border villages, before the man's personality crumbled into rote righteousness. Mogrigg still has the scars, but none of the respect he earned. Of course he volunteered to brave the Nightjar! His hand was the first to rise!`,
      deathQuote: `Somewhere behind the whirlwind of resentment and a deafening rush of blood hid Mogrigg's thoughts. Ever had they been on the topic of death, even when his party mates had made him cackle with laughter or introduced to him new ways of thinking. The death wish was just too much. He rushed gleefully towards his doom, as he had in every previous battle. This time, he met it.`,
      hp: 25,
      sp: 6,
      determination: 4,
      camaraderie: 4,
      spirit: 3,
      items: [GorgothilSword, Haringplate],
      skill: "Cut"
    },
    "Far Scout": {
      name: "Tam",
      lore: `The surest bow in Haringlee. Favouring high cliffs above the treetops, she is a very fine huntress who's found that her place in the village of her birth has become slowly less secure. Tam worships only as far as socially necessary, excusing herself more and more from the mania overtaking the populace. Still, that does leave more time to practise her woodscraft, her acrobacy and her deadly aim. Sensing the opportunity for change in the expedition to the Nightjar, she signs up, explaining that she already knows the best route over the river.`,
      deathQuote: `Tam knew she'd made a terrible error as she watched her comrades be dashed to the ground, fearing that her body was soon to join theirs. Yet it hadn't been a tactical mistake; she hadn't simply been tricked by Mullanginan's men. Instead, it had been an elementary failure from the onset: leaving the high ground? Voluntarily straying into the beast's lair? A huntress who ignored her instincts was a doomed one indeed.`,
      hp: 18,
      sp: 7,
      determination: 3,
      camaraderie: 3,
      spirit: 5,
      items: [BoltSlinger, AdaloaxPelt],
      skill: "Tamper"
    },
    "War Caller": {
      name: "Silas",
      lore: `Silas considers himself duty-bound to the goddess Cherraphy and exults her name without second thoughts. Blessed with unique conviction, his charmed surety in combat has increased even since his pit-fighting days; he now sees fit to call himself Knight-Enforcer and claim the ancient War Calling title from the old times... from before the wars made sense! Suspecting mischief and irreverence in the party that ventures to the Nightjar, he stubbornly joins, vowing to hold high the goddess's name. Yes, he's a nasty piece of work, but his arrogance serves to draw your enemy's ire away from your friends.`,
      deathQuote: `Silas stared at his hands, both of them stained with his life's blood, and found it all too much to believe. He had dedicated himself to the service of Cherraphy and had ultimately been spurned, receiving no divine intervention that might justify his devotion. No god appeared to witness Silas's final moments. The only reward granted to the man was a fool's death.`,
      hp: 30,
      sp: 5,
      determination: 5,
      camaraderie: 2,
      spirit: 4,
      items: [OwlSkull, IronFullcase],
      skill: "Prayer"
    },
    "Flag Singer": {
      name: "Belsome",
      lore: `A travelling auteur, stranded in Haringlee, their stagecoach impounded under the most arbitrary of Cherraphic laws. Before that, a bard, and before that, a wanted street thief. Now reformed as an entertainer, their reflexes remain true. Belsome has the instinct and the presence of mind needed to size up a dangerous situation, the savvy required to navigate it without incident and the compassion that also steers those around them to safety. Belsome doesn't know how vital their skills of performance, of misdirection and of psychic intuition will be inside the Fortress Nightjar, but this isn't exactly the first time they've performed without rehearsal.`,
      deathQuote: `Belsome dropped to their knees, knowing they'd been dealt a killing blow. Fitting enough; such a commanding performance should always end with a convincing death. Projecting all their passion and spite into one last speech, Belsome howled: "Curse the gods!" and keeled over into oblivion, their epitaph still resounding in the air.`,
      hp: 21,
      sp: 6,
      determination: 2,
      camaraderie: 6,
      spirit: 3,
      items: [CarvingKnife, SignedCasque],
      skill: "???"
    },
    "Loam Seer": {
      name: "Chiteri",
      lore: `Chiteri is a beetle-like humanoid who observes human activity from safety, where the river meets the wood. Sad at the many recent upheavals in Haringlee culture, Chiteri reveals her existence to the dumbfounded villagers and, furthermore, offers her magical assistance in their trip to the Nightjar, secretly planning to defame the goddess Cherraphy, thereby salvaging the lives of the people. Able to call on the magic dwelling deep within the earth, Chiteri is a canny healer and is also able to bestow curious magickal toughness to her quick new friends, even if she doesn't share their cause.`,
      deathQuote: `Her carapace smashed to pieces, Chiteri found herself slipping into a place of inward calm. It had been an ordeal to maintain her friendships with her human companions; now, she was glad for it to be over. Chiteri dispassionately transmitted her final verdicts to her many hive sisters, gladdened by glimpses of the Nightjar's primitive insects that quickly surrounded her body as she expired.`,
      hp: 18,
      sp: 5,
      determination: 2,
      camaraderie: 5,
      spirit: 4,
      items: [Cornucopia, JacketAndRucksack],
      skill: "Shift"
    }
  };
  var classes_default = classes;

  // src/Player.ts
  function getBaseStat(className, stat, bonusStat, bonusIfTrue = 1) {
    return classes_default[className][stat] + (bonusStat === stat ? bonusIfTrue : 0);
  }
  var Player = class {
    constructor(g, className, bonus, items = classes_default[className].items) {
      this.g = g;
      this.className = className;
      this.name = classes_default[className].name;
      this.isPC = true;
      this.attacksInARow = 0;
      this.usedThisTurn = /* @__PURE__ */ new Set();
      this.skill = classes_default[className].skill;
      for (const item of items) {
        if (item.slot)
          this.equip(item);
        else
          g.inventory.push(item);
      }
      this.baseMaxHP = getBaseStat(className, "hp", bonus, 5);
      this.baseMaxSP = getBaseStat(className, "sp", bonus);
      this.baseCamaraderie = getBaseStat(className, "camaraderie", bonus);
      this.baseDetermination = getBaseStat(className, "determination", bonus);
      this.baseSpirit = getBaseStat(className, "spirit", bonus);
      this.hp = this.maxHP;
      this.sp = Math.min(this.baseMaxSP, this.spirit);
    }
    get alive() {
      return this.hp > 0;
    }
    get equipment() {
      return [this.LeftHand, this.RightHand, this.Body, this.Special].filter(
        isDefined
      );
    }
    getStat(stat, base = 0) {
      var _a;
      let value = base;
      for (const item of this.equipment) {
        value += (_a = item == null ? void 0 : item.bonus[stat]) != null ? _a : 0;
      }
      return this.g.applyStatModifiers(this, stat, value);
    }
    get maxHP() {
      return this.getStat("maxHP", this.baseMaxHP);
    }
    get maxSP() {
      return this.getStat("maxHP", this.baseMaxSP);
    }
    get dr() {
      return this.getStat("dr", 0);
    }
    get camaraderie() {
      return this.getStat("camaraderie", this.baseCamaraderie);
    }
    get determination() {
      return this.getStat("determination", this.baseDetermination);
    }
    get spirit() {
      return this.getStat("spirit", this.baseSpirit);
    }
    get actions() {
      return Array.from(this.equipment.values()).map((i) => i.action).concat(generateAttack(), endTurnAction);
    }
    get canMove() {
      return !this.alive || this.sp > 0;
    }
    move() {
      if (this.alive)
        this.sp--;
    }
    equip(item) {
      if (!item.slot)
        return;
      if (item.slot === "Hand") {
        if (this.LeftHand && this.RightHand) {
          this.g.inventory.push(this.LeftHand);
          this.LeftHand = this.RightHand;
          this.RightHand = item;
          return;
        }
        if (this.LeftHand)
          this.RightHand = item;
        else
          this.LeftHand = item;
      } else {
        const old = this[item.slot];
        if (old)
          this.g.inventory.push(old);
        this[item.slot] = item;
      }
    }
  };

  // src/types/ClassName.ts
  var ClassNames = [
    "Martialist",
    "Cleavesman",
    "Far Scout",
    "War Caller",
    "Flag Singer",
    "Loam Seer"
  ];

  // src/TitleScreen.ts
  var TitleScreen = class {
    constructor(g) {
      this.g = g;
      g.draw();
      void g.jukebox.play("title");
      g.log = [];
      g.pendingArenaEnemies = [];
      g.pendingNormalEnemies = [];
      g.scripting = new EngineScripting(g);
      g.showLog = false;
      g.visited.clear();
      g.walls.clear();
      this.index = 0;
      this.selected = /* @__PURE__ */ new Set();
    }
    onKey(e) {
      this.g.jukebox.tryPlay();
      switch (e.code) {
        case "ArrowUp":
          this.g.draw();
          this.index = wrap(this.index - 1, ClassNames.length);
          break;
        case "ArrowDown":
          this.g.draw();
          this.index = wrap(this.index + 1, ClassNames.length);
          break;
        case "Enter":
        case "Return": {
          this.g.draw();
          const cn = ClassNames[this.index];
          if (this.selected.has(cn))
            this.selected.delete(cn);
          else if (this.selected.size < 4)
            this.selected.add(cn);
          break;
        }
        case "Space":
          if (this.selected.size === 4) {
            this.g.inventory = [];
            this.g.party = [];
            for (const cn of this.selected)
              this.g.party.push(new Player(this.g, cn));
            void this.g.loadGCMap(map_default, 0, -1);
          }
          break;
      }
    }
    render() {
      const { index, selected } = this;
      const { canvas, ctx } = this.g;
      {
        const { draw } = withTextStyle(ctx, {
          textAlign: "center",
          textBaseline: "middle",
          fillStyle: "white",
          fontSize: 20
        });
        draw("Poisoned Daggers", canvas.width / 2, 20);
        if (selected.size === 4)
          draw("Press Space to begin", canvas.width / 2, canvas.height - 20);
      }
      {
        const { draw, lineHeight, measure } = withTextStyle(ctx, {
          textAlign: "left",
          textBaseline: "middle",
          fillStyle: "white"
        });
        let y = 60;
        for (let i = 0; i < ClassNames.length; i++) {
          const cn2 = ClassNames[i];
          ctx.fillStyle = i === index ? selected.has(cn2) ? Colours_default.currentChosenClass : Colours_default.currentClass : selected.has(cn2) ? Colours_default.chosenClass : Colours_default.otherClass;
          draw(cn2, 20, y);
          y += lineHeight * 2;
        }
        const cn = ClassNames[this.index];
        const cl = classes_default[cn];
        ctx.fillStyle = "white";
        draw(cl.name, 100, 60);
        y = 60 + lineHeight * 2;
        for (const line of textWrap(cl.lore, canvas.width - 120, measure).lines) {
          draw(line, 100, y);
          y += lineHeight;
        }
      }
    }
  };

  // src/SplashScreen.ts
  var SplashScreen = class {
    constructor(g) {
      this.g = g;
      this.next = () => {
        clearTimeout(this.timeout);
        this.g.screen = new TitleScreen(this.g);
      };
      g.draw();
      this.position = xyi(g.canvas.width / 2, g.canvas.height / 2);
      this.timeout = setTimeout(this.next, 4e3);
      void g.res.loadImage(sad_folks_default).then((img) => {
        this.image = img;
        this.position = xyi(
          g.canvas.width / 2 - img.width / 2,
          g.canvas.height / 2 - img.height / 2
        );
        g.draw();
        return img;
      });
    }
    onKey() {
      this.next();
    }
    render() {
      if (!this.image) {
        const { draw } = withTextStyle(this.g.ctx, {
          textAlign: "center",
          textBaseline: "middle",
          fontSize: 24,
          fillStyle: "white"
        });
        draw("Loading...", this.position.x, this.position.y);
        return;
      }
      this.g.ctx.drawImage(this.image, this.position.x, this.position.y);
    }
  };

  // src/Grid.ts
  var Grid = class {
    constructor(defaultValue, toTag = xyToTag) {
      this.defaultValue = defaultValue;
      this.toTag = toTag;
      this.entries = /* @__PURE__ */ new Map();
      this.width = 0;
      this.height = 0;
    }
    set(xy2, item) {
      const tag = this.toTag(xy2);
      this.entries.set(tag, item);
      this.width = Math.max(this.width, xy2.x + 1);
      this.height = Math.max(this.height, xy2.y + 1);
    }
    get(xy2) {
      return this.entries.get(this.toTag(xy2));
    }
    getOrDefault(xy2) {
      const existing = this.get(xy2);
      if (existing)
        return existing;
      const value = this.defaultValue(xy2);
      this.set(xy2, value);
      return value;
    }
    asArray() {
      const rows = [];
      for (let y = 0; y < this.height; y++) {
        const row = [];
        for (let x = 0; x < this.width; x++)
          row.push(this.getOrDefault({ x, y }));
        rows.push(row);
      }
      return rows;
    }
  };

  // res/map.dscript
  var map_default2 = "./map-V35IMN23.dscript";

  // res/atlas/flats.png
  var flats_default = "./flats-HZYMJUF6.png";

  // res/atlas/flats.json
  var flats_default2 = "./flats-T5YNSK6F.json";

  // res/atlas/eveScout.png
  var eveScout_default = "./eveScout-GB6RQXWR.png";

  // res/atlas/eveScout.json
  var eveScout_default2 = "./eveScout-CUUCANDE.json";

  // res/atlas/martialist.png
  var martialist_default = "./martialist-KFK3S4GT.png";

  // res/atlas/martialist.json
  var martialist_default2 = "./martialist-E5J5GXPU.json";

  // res/atlas/nettleSage.png
  var nettleSage_default = "./nettleSage-DUNOBTXQ.png";

  // res/atlas/nettleSage.json
  var nettleSage_default2 = "./nettleSage-UBAECBNA.json";

  // res/atlas/sneedCrawler.png
  var sneedCrawler_default = "./sneedCrawler-B5CE42IQ.png";

  // res/atlas/sneedCrawler.json
  var sneedCrawler_default2 = "./sneedCrawler-6NQFCLQH.json";

  // src/resources.ts
  var Resources = {
    "map.dscript": map_default2,
    "flats.png": flats_default,
    "flats.json": flats_default2,
    "eveScout.png": eveScout_default,
    "eveScout.json": eveScout_default2,
    "martialist.png": martialist_default,
    "martialist.json": martialist_default2,
    "nettleSage.png": nettleSage_default,
    "nettleSage.json": nettleSage_default2,
    "sneedCrawler.png": sneedCrawler_default,
    "sneedCrawler.json": sneedCrawler_default2
  };
  function getResourceURL(id2) {
    const value = Resources[id2];
    if (!value)
      throw new Error(`Invalid resource ID: ${id2}`);
    return value;
  }

  // src/tools/sides.ts
  function openGate(side) {
    if (side.decalType === "Gate" && typeof side.decal === "number") {
      side.decalType = "OpenGate";
      side.decal++;
      side.solid = false;
    }
  }

  // src/convertGridCartographerMap.ts
  var wall = { wall: true, solid: true };
  var door = { decal: "Door", wall: true };
  var locked = { decal: "Door", wall: true, solid: true };
  var invisible = { solid: true };
  var fake = { wall: true };
  var sign = { decal: "Sign", wall: true, solid: true };
  var gate = { decal: "Gate", wall: false, solid: true };
  var lever = { decal: "Lever", wall: true, solid: true };
  var defaultEdge = { main: wall, opposite: wall };
  var EdgeDetails = {
    [2 /* Door */]: { main: door, opposite: door },
    [33 /* Door_Box */]: { main: door, opposite: door },
    [3 /* Door_Locked */]: { main: locked, opposite: locked },
    [8 /* Door_OneWayRD */]: { main: door, opposite: wall },
    [5 /* Door_OneWayLU */]: { main: wall, opposite: door },
    [13 /* Wall_Secret */]: { main: invisible, opposite: invisible },
    [10 /* Wall_OneWayRD */]: { main: fake, opposite: wall },
    [7 /* Wall_OneWayLU */]: { main: wall, opposite: fake },
    [28 /* Message */]: { main: sign, opposite: sign },
    [27 /* Gate */]: { main: gate, opposite: gate },
    // this isn't a mistake...
    [23 /* LeverLU */]: { main: lever, opposite: wall },
    [24 /* LeverRD */]: { main: wall, opposite: lever }
  };
  function compareNotes(a, b) {
    if (a.x !== b.x)
      return a.x - b.x;
    if (a.y !== b.y)
      return a.y - b.y;
    return 0;
  }
  var GCMapConverter = class {
    constructor(env = {}) {
      this.atlases = [];
      this.decals = /* @__PURE__ */ new Map();
      this.definitions = new Map(Object.entries(env));
      this.facing = Dir_default.N;
      this.grid = new Grid(() => ({
        sides: {},
        tags: [],
        strings: {},
        numbers: {}
      }));
      this.scripts = [];
      this.start = xy(0, 0);
      this.startsOpen = /* @__PURE__ */ new Set();
      this.textures = /* @__PURE__ */ new Map();
      this.definitions.set("NORTH", Dir_default.N);
      this.definitions.set("EAST", Dir_default.E);
      this.definitions.set("SOUTH", Dir_default.S);
      this.definitions.set("WEST", Dir_default.W);
    }
    tile(x, y) {
      return this.grid.getOrDefault({ x, y });
    }
    convert(j, region = 0, floor = 0) {
      var _a, _b;
      if (!(region in j.regions))
        throw new Error(`No such region: ${region}`);
      const r = j.regions[region];
      const f = r.floors.find((f2) => f2.index === floor);
      if (!f)
        throw new Error(`No such floor: ${floor}`);
      for (const note of f.notes.sort(compareNotes)) {
        const { __data, x, y } = note;
        for (const line of (_a = __data == null ? void 0 : __data.split("\n")) != null ? _a : []) {
          if (!line.startsWith("#"))
            continue;
          const [cmd, ...args] = line.split(" ");
          this.applyCommand(cmd, args.join(" "), x, y);
        }
      }
      for (const row of (_b = f.tiles.rows) != null ? _b : []) {
        let x = f.tiles.bounds.x0 + row.start;
        const y = r.setup.origin === "tl" ? row.y : f.tiles.bounds.height - (row.y - f.tiles.bounds.y0) - 1;
        for (const tile of row.tdata) {
          const mt = this.tile(x, y);
          const tag = xyToTag({ x, y });
          if (tile.t)
            mt.floor = this.getTexture(tile.tc);
          if (tile.c)
            mt.ceiling = this.getTexture(0);
          if (tile.b)
            this.setEdge(
              tile.b,
              tile.bc,
              mt,
              Dir_default.S,
              this.tile(x, y + 1),
              Dir_default.N,
              this.startsOpen.has(tag)
            );
          if (tile.r)
            this.setEdge(
              tile.r,
              tile.rc,
              mt,
              Dir_default.E,
              this.tile(x + 1, y),
              Dir_default.W,
              this.startsOpen.has(tag)
            );
          x++;
        }
      }
      const { atlases, definitions, scripts, start, facing } = this;
      const name = `${r.name}:${f.index}`;
      const cells = this.grid.asArray();
      return { name, atlases, cells, definitions, scripts, start, facing };
    }
    getTexture(index = 0) {
      const texture = this.textures.get(index);
      if (typeof texture === "undefined")
        throw new Error(`Unknown texture for palette index ${index}`);
      return texture;
    }
    eval(s) {
      const def = this.definitions.get(s);
      if (typeof def !== "undefined")
        return def;
      const num2 = Number(s);
      if (!isNaN(num2))
        return num2;
      throw new Error(`Could not evaluate: ${s}`);
    }
    applyCommand(cmd, arg, x, y) {
      switch (cmd) {
        case "#ATLAS":
          this.atlases.push(
            ...arg.split(",").map((name) => ({
              image: getResourceURL(name + ".png"),
              json: getResourceURL(name + ".json")
            }))
          );
          return;
        case "#DEFINE": {
          const [key, value] = arg.split(",");
          if (this.definitions.has(key))
            throw new Error(`Already defined: ${key}`);
          this.definitions.set(key, this.eval(value));
          return;
        }
        case "#STYLE": {
          const [index, value] = arg.split(",");
          this.textures.set(this.eval(index), this.eval(value));
          return;
        }
        case "#DECAL": {
          const [name, texture, decal] = arg.split(",");
          this.decals.set(`${name},${this.eval(texture)}`, this.eval(decal));
          return;
        }
        case "#START":
          this.start = { x, y };
          this.facing = dirFromInitial(arg);
          return;
        case "#TAG": {
          const t = this.tile(x, y);
          for (const tag of arg.split(","))
            t.tags.push(tag);
          break;
        }
        case "#SCRIPT":
          for (const id2 of arg.split(","))
            this.scripts.push(getResourceURL(id2));
          break;
        case "#OBJECT":
          this.tile(x, y).object = this.eval(arg);
          break;
        case "#STRING": {
          const [name, ...args] = arg.split(",");
          this.tile(x, y).strings[name] = args.join(",").replace(/\\n/g, "\n");
          break;
        }
        case "#NUMBER": {
          const [name, value] = arg.split(",");
          this.tile(x, y).numbers[name] = this.eval(value);
          break;
        }
        case "#OPEN":
          this.startsOpen.add(xyToTag({ x, y }));
          break;
        default:
          throw new Error(`Unknown command: ${cmd} ${arg} at (${x},${y})`);
      }
    }
    setEdge(edge, index, lt, ld, rt, rd, opened) {
      var _a, _b, _c;
      const { main, opposite } = (_a = EdgeDetails[edge]) != null ? _a : defaultEdge;
      const texture = this.getTexture(index);
      const leftSide = {
        wall: main.wall ? texture : void 0,
        decalType: main.decal,
        decal: this.decals.get(`${(_b = main.decal) != null ? _b : ""},${texture}`),
        solid: main.solid
      };
      lt.sides[ld] = leftSide;
      const rightSide = {
        wall: opposite.wall ? texture : void 0,
        decalType: opposite.decal,
        decal: this.decals.get(`${(_c = opposite.decal) != null ? _c : ""},${texture}`),
        solid: opposite.solid
      };
      rt.sides[rd] = rightSide;
      if (opened) {
        openGate(leftSide);
        openGate(rightSide);
      }
    }
  };
  function convertGridCartographerMap(j, region = 0, floor = 0, env = {}) {
    const converter = new GCMapConverter(env);
    return converter.convert(j, region, floor);
  }

  // src/items/index.ts
  var allItems = Object.fromEntries(
    [cleavesman_exports, farScout_exports, flagSinger_exports, loamSeer_exports, martialist_exports, warCaller_exports].flatMap(
      (repository) => Object.values(repository).map((item) => [item.name, item])
    )
  );
  function getItem(s) {
    return allItems[s];
  }

  // src/tools/aabb.ts
  function contains(spot, pos) {
    return pos.x >= spot.x && pos.y >= spot.y && pos.x < spot.ex && pos.y < spot.ey;
  }

  // src/tools/wallTags.ts
  function wallToTag(pos, dir) {
    return `${pos.x},${pos.y},${dir}`;
  }

  // src/types/events.ts
  var GameEventNames = [
    "onAfterAction",
    "onAfterDamage",
    "onBeforeAction",
    "onCalculateDamage",
    "onCalculateDR",
    "onCalculateCamaraderie",
    "onCalculateDetermination",
    "onCalculateSpirit",
    "onCalculateMaxHP",
    "onCalculateMaxSP",
    "onCanAct",
    "onCombatBegin",
    "onCombatOver",
    "onKilled",
    "onPartyMove",
    "onPartySwap",
    "onPartyTurn",
    "onRoll"
  ];

  // src/types/logic.ts
  var matchAll = (predicates) => (item) => {
    for (const p of predicates) {
      if (!p(item))
        return false;
    }
    return true;
  };

  // src/DeathScreen.ts
  var DeathScreen = class {
    constructor(g, lastToDie) {
      this.g = g;
      this.lastToDie = lastToDie;
      this.render = () => {
        const { width, height } = this.g.canvas;
        const { ctx } = this.g;
        if (this.alpha < 1) {
          this.oldScreen.render();
          ctx.globalAlpha = this.alpha;
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, width, height);
          this.alpha += 0.1;
          if (this.alpha >= 1) {
            clearInterval(this.interval);
            this.doNotClear = false;
          }
        }
        const { draw, lineHeight, measure } = withTextStyle(ctx, {
          textAlign: "center",
          textBaseline: "middle",
          fillStyle: "white"
        });
        const { lines } = textWrap(
          classes_default[this.lastToDie.className].deathQuote,
          width - 200,
          measure
        );
        const textHeight = lines.length * lineHeight;
        let y = height / 2 - textHeight / 2;
        for (const line of lines) {
          draw(line, width / 2, y);
          y += lineHeight;
        }
        ctx.globalAlpha = 1;
      };
      g.draw();
      g.jukebox.stop();
      g.spotElements = [];
      this.alpha = 0.1;
      this.doNotClear = true;
      this.interval = setInterval(this.render, 400);
      this.oldScreen = g.screen;
    }
    onKey(e) {
      if (e.code === "Escape" || this.alpha >= 1) {
        this.g.screen = new TitleScreen(this.g);
        if (this.interval)
          clearInterval(this.interval);
      }
    }
  };

  // src/Engine.ts
  var calculateEventName = {
    dr: "onCalculateDR",
    maxHP: "onCalculateMaxHP",
    maxSP: "onCalculateMaxSP",
    camaraderie: "onCalculateCamaraderie",
    determination: "onCalculateDetermination",
    spirit: "onCalculateSpirit"
  };
  var swap = (from, to) => ({ from, to });
  var Engine = class {
    constructor(canvas) {
      this.canvas = canvas;
      this.render = () => {
        const { ctx, screen } = this;
        const { width, height } = this.canvas;
        if (!screen.doNotClear) {
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, width, height);
        }
        screen.render();
      };
      this.ctx = getCanvasContext(canvas, "2d");
      this.eventHandlers = Object.fromEntries(
        GameEventNames.map((name) => [name, /* @__PURE__ */ new Set()])
      );
      this.zoomRatio = 1;
      this.controls = new Map(DefaultControls_default);
      this.facing = Dir_default.N;
      this.position = xyi(0, 0);
      this.worldSize = xyi(0, 0);
      this.res = new ResourceManager();
      this.drawSoon = new Soon(this.render);
      this.scripting = new EngineScripting(this);
      this.log = [];
      this.showLog = false;
      this.combat = new CombatManager(this);
      this.visited = /* @__PURE__ */ new Map();
      this.walls = /* @__PURE__ */ new Map();
      this.worldVisited = /* @__PURE__ */ new Set();
      this.worldWalls = /* @__PURE__ */ new Map();
      this.inventory = [];
      this.pendingArenaEnemies = [];
      this.pendingNormalEnemies = [];
      this.spotElements = [];
      this.party = [];
      this.jukebox = new Jukebox(this);
      this.screen = new SplashScreen(this);
      canvas.addEventListener("keyup", (e) => this.screen.onKey(e));
      const transform = (e) => xyi(e.offsetX / this.zoomRatio, e.offsetY / this.zoomRatio);
      canvas.addEventListener("mousemove", (e) => this.onMouseMove(transform(e)));
      canvas.addEventListener("click", (e) => this.onClick(transform(e)));
    }
    getSpot(pos) {
      for (const element of this.spotElements) {
        const spot = element.spots.find((s) => contains(s, pos));
        if (spot)
          return { element, spot };
      }
    }
    onMouseMove(pos) {
      var _a;
      const result = this.getSpot(pos);
      this.canvas.style.cursor = (_a = result == null ? void 0 : result.spot.cursor) != null ? _a : "";
    }
    onClick(pos) {
      const result = this.getSpot(pos);
      if (result)
        result.element.spotClicked(result.spot);
    }
    processInput(i) {
      switch (i) {
        case "Forward":
          return this.move(this.facing);
        case "SlideRight":
          return this.move(rotate(this.facing, 1));
        case "Back":
          return this.move(rotate(this.facing, 2));
        case "SlideLeft":
          return this.move(rotate(this.facing, 3));
        case "TurnLeft":
          return this.turn(-1);
        case "TurnRight":
          return this.turn(1);
        case "ToggleLog":
          return this.toggleLog();
        case "Interact":
          return this.interact(this.facing);
        case "MenuDown":
          return this.menuMove(1);
        case "MenuUp":
          return this.menuMove(-1);
        case "MenuChoose":
          return this.menuChoose();
        case "RotateLeft":
          return this.partyRotate(-1);
        case "RotateRight":
          return this.partyRotate(1);
        case "SwapLeft":
          return this.partySwap(-1);
        case "SwapRight":
          return this.partySwap(1);
        case "SwapBehind":
          return this.partySwap(2);
        case "Cancel":
          return this.cancel();
      }
    }
    loadWorld(w, position) {
      return __async(this, null, function* () {
        this.screen = new LoadingScreen(this);
        this.world = src_default(w);
        this.worldSize = xyi(this.world.cells[0].length, this.world.cells.length);
        this.position = position != null ? position : w.start;
        this.facing = w.facing;
        const combat = new CombatRenderer(this);
        const hud = new HUDRenderer(this);
        const log = new LogRenderer(this);
        const atlasPromises = w.atlases.map((a) => this.res.loadAtlas(a.json));
        const imagePromises = w.atlases.map((a) => this.res.loadImage(a.image));
        const atlases = yield Promise.all(atlasPromises);
        const images = yield Promise.all(imagePromises);
        yield hud.acquireImages();
        const dungeon = new DungeonRenderer(this, atlases[0], images[0]);
        for (let i = 0; i < atlases.length; i++) {
          yield dungeon.addAtlas(atlases[i].layers, images[i]);
          if (i > 1)
            dungeon.dungeon.layers.push(...atlases[i].layers);
        }
        const visited = this.visited.get(w.name);
        if (visited)
          this.worldVisited = visited;
        else {
          this.worldVisited = /* @__PURE__ */ new Set();
          this.visited.set(w.name, this.worldVisited);
        }
        const walls = this.walls.get(w.name);
        if (walls)
          this.worldWalls = walls;
        else {
          this.worldWalls = /* @__PURE__ */ new Map();
          this.walls.set(w.name, this.worldWalls);
        }
        this.markVisited();
        this.spotElements = [hud.skills, hud.stats];
        this.screen = new DungeonScreen(this, { combat, dungeon, hud, log });
        return this.draw();
      });
    }
    loadGCMap(jsonUrl, region, floor) {
      return __async(this, null, function* () {
        this.screen = new LoadingScreen(this);
        const map = yield this.res.loadGCMap(jsonUrl);
        const { atlases, cells, definitions, scripts, start, facing, name } = convertGridCartographerMap(map, region, floor, EnemyObjects);
        if (!atlases.length)
          throw new Error(`${jsonUrl} did not contain #ATLAS`);
        for (const [key, value] of definitions.entries()) {
          this.scripting.env.set(key, num(value, true));
        }
        const codeFiles = yield Promise.all(
          scripts.map((url) => this.res.loadScript(url))
        );
        for (const code of codeFiles) {
          const program = parse(code);
          this.scripting.run(program);
        }
        return this.loadWorld({ name, atlases, cells, start, facing });
      });
    }
    isVisited(x, y) {
      const tag = xyToTag({ x, y });
      return this.worldVisited.has(tag);
    }
    getCell(x, y) {
      var _a;
      if (x < 0 || x >= this.worldSize.x || y < 0 || y >= this.worldSize.y)
        return;
      const cell = (_a = this.world) == null ? void 0 : _a.cells[y][x];
      if (cell && this.combat.inCombat) {
        const result = getCardinalOffset(this.position, { x, y });
        if (result) {
          const enemy = this.combat.getFromOffset(result.dir, result.offset);
          if (enemy) {
            const replaced = src_default(cell);
            replaced.object = enemy.object;
            return replaced;
          }
        }
      }
      return cell;
    }
    get currentCell() {
      return this.getCell(this.position.x, this.position.y);
    }
    findCellWithTag(tag) {
      if (!this.world)
        return;
      for (let y = 0; y < this.worldSize.y; y++) {
        for (let x = 0; x < this.worldSize.x; x++) {
          if (this.world.cells[y][x].tags.includes(tag))
            return { x, y };
        }
      }
    }
    draw() {
      this.drawSoon.schedule();
    }
    canMove(dir) {
      const at = this.getCell(this.position.x, this.position.y);
      if (!at)
        return false;
      const wall2 = at.sides[dir];
      if (wall2 == null ? void 0 : wall2.solid)
        return false;
      const destination = move(this.position, dir);
      const cell = this.getCell(destination.x, destination.y);
      if (!cell)
        return false;
      return true;
    }
    move(dir) {
      if (this.combat.inCombat)
        return false;
      if (this.obstacle && dir !== this.obstacle)
        return false;
      if (this.canMove(dir)) {
        const old = this.position;
        this.position = move(this.position, dir);
        this.markVisited();
        this.markNavigable(old, dir);
        this.draw();
        this.setObstacle(false);
        this.fire("onPartyMove", { from: old, to: this.position });
        this.scripting.onEnter(this.position, old);
        return true;
      }
      this.markUnnavigable(this.position, dir);
      return false;
    }
    toggleLog() {
      this.showLog = !this.showLog;
      this.draw();
      return true;
    }
    interact(index) {
      if (!this.party[index].alive)
        return false;
      if (this.combat.inCombat)
        return false;
      return this.scripting.onInteract(index);
    }
    markVisited() {
      const pos = this.position;
      const tag = xyToTag(pos);
      const cell = this.getCell(pos.x, pos.y);
      if (!this.worldVisited.has(tag) && cell) {
        this.worldVisited.add(tag);
        for (let dir = 0; dir <= 3; dir++) {
          const wall2 = cell.sides[dir];
          const canSeeDoor = (wall2 == null ? void 0 : wall2.decalType) === "Door";
          const hasTexture = typeof (wall2 == null ? void 0 : wall2.wall) === "number";
          const looksSolid = hasTexture;
          const data = {
            canSeeDoor,
            isSolid: looksSolid && !canSeeDoor,
            canSeeWall: hasTexture
          };
          this.worldWalls.set(wallToTag(pos, dir), data);
        }
      }
    }
    markNavigable(pos, dir) {
      var _a;
      const tag = wallToTag(pos, dir);
      const data = (_a = this.worldWalls.get(tag)) != null ? _a : {
        canSeeDoor: false,
        isSolid: false,
        canSeeWall: false
      };
      if (data.isSolid) {
        data.isSolid = false;
        this.worldWalls.set(tag, data);
      }
    }
    markUnnavigable(pos, dir) {
      var _a;
      const tag = wallToTag(pos, dir);
      const data = (_a = this.worldWalls.get(tag)) != null ? _a : {
        canSeeDoor: false,
        isSolid: false,
        canSeeWall: false
      };
      if (!data.isSolid) {
        data.isSolid = true;
        this.worldWalls.set(tag, data);
        this.draw();
      }
    }
    getMinimapData(x, y) {
      if (!this.isVisited(x, y))
        return {};
      const cell = this.getCell(x, y);
      const north = this.getWallData(x, y, Dir_default.N);
      const east = this.getWallData(x, y, Dir_default.E);
      const south = this.getWallData(x, y, Dir_default.S);
      const west = this.getWallData(x, y, Dir_default.W);
      return { cell, north, east, south, west };
    }
    getWallData(x, y, dir) {
      const wallData = this.worldWalls.get(wallToTag({ x, y }, dir));
      const dTag = (wallData == null ? void 0 : wallData.canSeeDoor) ? "d" : "";
      const sTag = (wallData == null ? void 0 : wallData.isSolid) ? "s" : "";
      const wTag = (wallData == null ? void 0 : wallData.canSeeWall) ? "w" : "";
      return `${dTag}${sTag}${wTag}`;
    }
    turn(clockwise) {
      if (this.pickingTargets)
        return false;
      this.combat.index = 0;
      const old = this.facing;
      this.facing = rotate(old, clockwise);
      this.fire("onPartyTurn", { from: old, to: this.facing });
      this.draw();
      return true;
    }
    menuMove(mod) {
      if (this.pickingTargets)
        return false;
      if (!this.combat.inCombat)
        return false;
      if (this.combat.side === "enemy")
        return false;
      const actions = this.party[this.facing].actions;
      const index = wrap(this.combat.index + mod, actions.length);
      this.combat.index = index;
      this.draw();
      return true;
    }
    canAct(who, action) {
      if (action === endTurnAction)
        return true;
      if (!who.alive)
        return false;
      if (who.usedThisTurn.has(action.name))
        return false;
      const e = this.fire("onCanAct", { who, action, cancel: false });
      if (e.cancel)
        return false;
      if (action.sp > who.sp)
        return false;
      return true;
    }
    menuChoose() {
      if (this.pickingTargets)
        return false;
      if (!this.combat.inCombat)
        return false;
      if (this.combat.side === "enemy")
        return false;
      const pc = this.party[this.facing];
      const action = pc.actions[this.combat.index];
      if (!action)
        return false;
      if (!this.canAct(pc, action))
        return false;
      const { possibilities, amount } = this.getTargetPossibilities(pc, action);
      if (!possibilities.length) {
        this.addToLog("No valid targets.");
        return false;
      }
      if (possibilities.length > amount) {
        if (amount !== 1)
          throw new Error(`Don't know how to pick ${amount} targets`);
        this.pickingTargets = { pc, action, possibilities };
        this.addToLog("Choose target.");
        return true;
      }
      const targets = pickN(possibilities, amount);
      this.act(pc, action, targets);
      return true;
    }
    getPosition(who) {
      return this.combat.getPosition(who);
    }
    getOpponent(me, turn = 0) {
      const { dir: myDir, distance } = this.getPosition(me);
      const dir = rotate(myDir, turn);
      return me.isPC ? this.combat.enemies[dir][0] : distance === 0 ? this.party[dir] : void 0;
    }
    getAllies(me, includeMe) {
      const allies = me.isPC ? this.party : this.combat.allEnemies;
      return includeMe ? allies : allies.filter((c) => c !== me);
    }
    getTargetPossibilities(c, a) {
      var _a;
      if (a.targets.type === "self")
        return { amount: 1, possibilities: [c] };
      const amount = (_a = a.targets.count) != null ? _a : Infinity;
      const filters = [
        a.targets.type === "ally" ? (o) => o.isPC === c.isPC : (o) => o.isPC !== c.isPC
      ];
      if (a.targetFilter)
        filters.push(a.targetFilter);
      const { distance, offsets } = a.targets;
      const me = this.getPosition(c);
      if (offsets)
        filters.push((o) => {
          const them = this.getPosition(o);
          return offsets.includes(getDirOffset(me.dir, them.dir));
        });
      if (typeof distance === "number")
        filters.push((o) => {
          const them = this.getPosition(o);
          const diff = Math.abs(them.distance - me.distance);
          return diff <= distance;
        });
      return {
        amount,
        possibilities: this.combat.aliveCombatants.filter(matchAll(filters))
      };
    }
    addToLog(message) {
      this.log.push(message);
      this.showLog = true;
      this.draw();
    }
    fire(name, e) {
      const handlers = this.eventHandlers[name];
      for (const handler of handlers)
        handler(e);
      return e;
    }
    act(me, action, targets) {
      var _a;
      const x = action.x ? me.sp : action.sp;
      me.sp -= x;
      me.usedThisTurn.add(action.name);
      const msg = ((_a = action.useMessage) != null ? _a : `[NAME] uses ${action.name}!`).replace(
        "[NAME]",
        me.name
      );
      if (msg)
        this.addToLog(msg);
      else
        this.draw();
      const e = this.fire("onBeforeAction", {
        attacker: me,
        action,
        targets,
        cancel: false
      });
      if (!e.cancel) {
        action.act({ g: this, targets, me, x });
        me.lastAction = action.name;
        if (action.name === "Attack") {
          me.attacksInARow++;
        } else
          me.attacksInARow = 0;
      }
      this.fire("onAfterAction", {
        attacker: me,
        action,
        targets,
        cancelled: e.cancel
      });
      this.combat.checkOver();
    }
    endTurn() {
      this.combat.endTurn();
    }
    addEffect(makeEffect) {
      const effect = makeEffect(() => this.removeEffect(effect));
      this.combat.effects.push(effect);
      for (const name of GameEventNames) {
        const handler = effect[name];
        if (handler) {
          const bound = handler.bind(effect);
          effect[name] = bound;
          this.eventHandlers[name].add(bound);
        }
      }
    }
    removeEffect(effect) {
      const index = this.combat.effects.indexOf(effect);
      if (index >= 0)
        this.combat.effects.splice(index, 1);
      for (const name of GameEventNames) {
        const handler = effect[name];
        if (handler)
          this.eventHandlers[name].delete(handler);
      }
    }
    getEffectsOn(who) {
      return this.combat.effects.filter((e) => e.affects.includes(who));
    }
    removeEffectsFrom(effects, who) {
      for (const e of effects) {
        const index = e.affects.indexOf(who);
        if (index > 0)
          e.affects.splice(index, 1);
        if (!e.affects.length)
          this.removeEffect(e);
      }
    }
    roll(who, size = 10) {
      const value = random(size) + 1;
      return this.fire("onRoll", { who, size, value }).value;
    }
    applyStatModifiers(who, stat, value) {
      const event = calculateEventName[stat];
      const e = this.fire(event, { who, value, multiplier: 1 });
      return Math.max(0, Math.floor(e.value * e.multiplier));
    }
    applyDamage(attacker, targets, amount, type, origin) {
      let total = 0;
      for (const target of targets) {
        const damage = this.fire("onCalculateDamage", {
          attacker,
          target,
          amount,
          multiplier: 1,
          type,
          origin
        });
        const calculated = damage.amount * damage.multiplier;
        const resist = type === "hp" && origin === "normal" ? target.dr : 0;
        const deal = Math.floor(calculated - resist);
        if (deal > 0) {
          total += deal;
          target[type] -= deal;
          this.draw();
          const message = type === "hp" ? `${target.name} takes ${deal} damage.` : `${target.name} loses ${deal} ${type}.`;
          this.addToLog(message);
          if (target.hp < 1)
            this.kill(target, attacker);
          this.fire("onAfterDamage", { attacker, target, amount, type, origin });
        } else {
          const message = type === "hp" ? `${target.name} ignores the blow.` : `${target.name} ignores the effect.`;
          this.addToLog(message);
        }
      }
      return total;
    }
    heal(healer, targets, amount) {
      for (const target of targets) {
        const newHP = Math.min(target.hp + amount, target.maxHP);
        const gain = newHP - target.hp;
        if (gain) {
          target.hp = newHP;
          this.draw();
          const message = `${target.name} heals for ${gain}.`;
          this.addToLog(message);
        }
      }
    }
    kill(who, attacker) {
      who.hp = 0;
      this.addToLog(`${who.name} dies!`);
      this.fire("onKilled", { who, attacker });
    }
    partyRotate(dir) {
      if (this.pickingTargets)
        return false;
      if (this.combat.inCombat) {
        const immobile = this.party.find((pc) => !pc.canMove);
        if (immobile)
          return false;
        for (const pc of this.party)
          pc.move();
      }
      if (dir === -1) {
        const north = this.party.shift();
        this.party.push(north);
        this.fire("onPartySwap", {
          swaps: [
            swap(Dir_default.N, Dir_default.W),
            swap(Dir_default.E, Dir_default.N),
            swap(Dir_default.S, Dir_default.E),
            swap(Dir_default.W, Dir_default.S)
          ]
        });
      } else {
        const west = this.party.pop();
        this.party.unshift(west);
        this.fire("onPartySwap", {
          swaps: [
            swap(Dir_default.N, Dir_default.E),
            swap(Dir_default.E, Dir_default.S),
            swap(Dir_default.S, Dir_default.W),
            swap(Dir_default.W, Dir_default.N)
          ]
        });
      }
      this.draw();
      return true;
    }
    partySwap(side) {
      if (this.pickingTargets)
        return false;
      const dir = rotate(this.facing, side);
      const me = this.party[this.facing];
      const them = this.party[dir];
      if (this.combat.inCombat) {
        if (!me.canMove || !them.canMove)
          return false;
        me.move();
        them.move();
      }
      this.party[this.facing] = them;
      this.party[dir] = me;
      this.fire("onPartySwap", {
        swaps: [swap(this.facing, dir), swap(dir, this.facing)]
      });
      this.draw();
      return true;
    }
    moveEnemy(from, to) {
      const fromArray = this.combat.enemies[from];
      const toArray = this.combat.enemies[to];
      const enemy = fromArray.shift();
      if (enemy) {
        toArray.unshift(enemy);
        this.draw();
      }
    }
    pcClicked(dir) {
      if (this.pickingTargets) {
        const { pc, action, possibilities } = this.pickingTargets;
        const target = this.party[dir];
        if (possibilities.includes(target)) {
          this.pickingTargets = void 0;
          this.act(pc, action, [target]);
          return;
        }
        this.addToLog("Invalid target.");
        return;
      }
      if (this.facing !== dir)
        this.partySwap(dir - this.facing);
    }
    cancel() {
      if (this.pickingTargets) {
        this.pickingTargets = void 0;
        this.addToLog("Cancelled.");
        return true;
      }
      return false;
    }
    addToInventory(name) {
      const item = getItem(name);
      if (item) {
        this.inventory.push(item);
        return true;
      }
      return false;
    }
    partyIsDead(lastToDie) {
      this.screen = new DeathScreen(this, this.party[lastToDie]);
    }
    setObstacle(obstacle) {
      this.obstacle = obstacle ? rotate(this.facing, 2) : void 0;
    }
  };

  // src/index.ts
  function loadEngine(parent) {
    const container = document.createElement("div");
    parent.appendChild(container);
    const canvas = document.createElement("canvas");
    canvas.tabIndex = 1;
    container.appendChild(canvas);
    const g = new Engine(canvas);
    requestAnimationFrame(() => canvas.focus());
    window.g = g;
    const onResize = () => {
      const wantWidth = 480;
      const wantHeight = 270;
      const ratioWidth = Math.floor(window.innerWidth / wantWidth);
      const ratioHeight = Math.floor(window.innerHeight / wantHeight);
      const ratio = Math.max(1, Math.min(ratioWidth, ratioHeight));
      const width = wantWidth * ratio;
      const height = wantHeight * ratio;
      container.style.width = `${width}px`;
      container.style.height = `${height}px`;
      canvas.width = wantWidth;
      canvas.height = wantHeight;
      g.zoomRatio = ratio;
      g.draw();
    };
    window.addEventListener("resize", onResize);
    onResize();
  }
  window.addEventListener("load", () => loadEngine(document.body));
})();
//# sourceMappingURL=bundle.js.map
