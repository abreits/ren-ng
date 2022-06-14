/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Section } from '@ngx-vn';

// TODO: think of an easy text substitution system

const story = new Story<Actions>();

const start = new Section(story, a => {
  a.background({ color: 'black' });
  a.text('Hallo, dit is een test', 'Tester');
  a.text('nog een tekst', 'Narrator');
  a.background({ color: 'yellow', animation: 'fadeIn', duration: 2000 });
  a.text('nu met een andere achtergrond', 'Verteller');
  a.select([
    ['option1', increaseStrength],
    ['option2', s => { s.stats.stamina += 1; s.goto(increaseStamina); }],
    ['option3', s => s.intelligence += 1],
  ]);
  a.select([
    ['option1', increaseStrength],
    ['option2', s => {
      s.stats.stamina += 1;
      s.goto(increaseStamina);
    }],
    ['option3', s => s.intelligence += 1],
    ['option4', () => skipint],
    ['option5', s => s.goto(skipint)],
  ]);
  a.modify(s => {
    if (s.stats.strength > 10) {
      s.goto(skipint);
    }
  });
  a.goto([
    [s => s.stats.intelligence > 10, finish],
    [s => s.stats.strength > 10, finish],
    [s => meetsRequirements(s), increaseStrength],
    [increaseIntelligence]
  ]);
  const skipint = a.call([
    [s => s.stats.intelligence > 10, finish],
    [s => s.stats.strength > 10, finish],
    [s => meetsRequirements(s), increaseStrength],
    [increaseIntelligence]
  ]);
  a.callFirst([
    [s => s.stats.intelligence > 10, finish],
    [s => s.stats.strength > 10, finish],
    [s => meetsRequirements(s), increaseStrength],
    [meetsrequirements, increaseStamina],
    [increaseIntelligence]
  ])
  a.input('enter your name', (s, name) => s.stats.name = name);
  a.text(s => `Hello ${s.stats.name}`);
  a.text('Hello %mc%');
});

const meetsRequirements = (s: any): boolean => {
  return true;
}

// extra Section actions:
//  after:
//    action: pop return adress from call stack
// 
// call action: 
//   - push from adres + 1 to return stack
//   - goto call adress
//
// goto action: 
//   - goto call adress

const increaseStrength = new Section(a => {
  a.modify(s => {
    s.stats.strength += 1;
  });
});

const increaseStamina = new Section(a => {
  a.modify(s => {
    s.stats.stamina += 1;
  });
});

const increaseIntelligence = new Section(a => {
  a.modify(s => {
    s.stats.intelligence += 1;
  });
});

const finish = new Section(a => {
  a.background({ color: 'yellow', animation: 'fadeOut', duration: 2000 });
  a.text('that\'s all folks!!', 'Verteller');
  a.exit();
});
