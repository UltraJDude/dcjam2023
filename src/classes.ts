import { GorgothilSword, Haringplate } from "./items/cleavesman";
import { AdaloaxPelt, BoltSlinger } from "./items/farScout";
import { CarvingKnife, SignedCasque } from "./items/flagSinger";
import { Cornucopia, JacketAndRucksack } from "./items/loamSeer";
import { Penduchaimmer, HaringleeKasaya } from "./items/martialist";
import { OwlSkull, IronFullcase } from "./items/warCaller";
import { ClassName } from "./types/ClassName";
import Combatant, { AttackableStat } from "./types/Combatant";
import Item from "./types/Item";

type ClassData = Pick<Combatant, AttackableStat> & {
  name: string;
  lore: string;
  deathQuote: string;
  items: Item[];
  skill: string;
};

const classes: Record<ClassName, ClassData> = {
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
    skill: "Smash",
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
    skill: "Cut",
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
    skill: "Tamper",
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
    skill: "Prayer",
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
    skill: "???",
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
    skill: "Shift",
  },
};
export default classes;
