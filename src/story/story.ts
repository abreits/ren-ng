/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Section } from '@ngx-vn';


const start = new Section(vn => {
  vn.background({ color: 'black' });
  vn.text('Hallo, dit is een test', 'Tester');
  vn.text('nog een tekst', 'Narrator');
  vn.background({ color: 'yellow', animation: 'fadeIn', duration: 2000 });
  vn.text('nu met een andere achtergrond', 'Verteller');
  vn.select([
    ['option1', increaseStrength],
    ['option2', u => { u.stats.stamina += 1; u.goto(increaseStamina); }],
    ['option3', increaseIntelligence],
  ]);
  vn.modify(u => {
    if (u.stats.strength > 10) {
      u.goto(finish);
    }
  });
});

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

const increaseStrength = new Section(vn => {
  vn.modify(u => {
    u.stats.strength += 1;
  });
});

const increaseStamina = new Section(vn => {
  vn.modify(u => {
    u.stats.stamina += 1;
  });
});

const increaseIntelligence = new Section(vn => {
  vn.modify(u => {
    u.stats.intelligence += 1;
  });
});

const finish = new Section(vn => {
  vn.background({ color: 'yellow', animation: 'fadeOut', duration: 2000 });
  vn.text('that\'s all folks!!', 'Verteller');
  vn.exit();
});
