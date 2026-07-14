const fetch = require('node-fetch');

async function test() {
  const start1 = Date.now();
  await fetch('https://api.pokemontcg.io/v2/cards?q=name:squirtle*&orderBy=-tcgplayer.prices.holofoil.market&pageSize=12');
  console.log('With orderBy took', Date.now() - start1);

  const start2 = Date.now();
  await fetch('https://api.pokemontcg.io/v2/cards?q=name:squirtle*&pageSize=12&select=id,name,images,set,rarity,tcgplayer');
  console.log('With select without orderBy took', Date.now() - start2);

  const start3 = Date.now();
  await fetch('https://api.pokemontcg.io/v2/cards?q=name:squirtle*&orderBy=-tcgplayer.prices.holofoil.market&pageSize=12&select=id,name,images,set,rarity,tcgplayer');
  console.log('With select AND orderBy took', Date.now() - start3);
}

test();
