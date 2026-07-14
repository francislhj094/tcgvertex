const fetch = require('node-fetch');

async function test() {
  const start1 = Date.now();
  await fetch('https://api.pokemontcg.io/v2/cards?q=name:"charizard ex"&orderBy=-tcgplayer.prices.holofoil.market&pageSize=12');
  console.log('Exact phrase with quotes took', Date.now() - start1);

  const start2 = Date.now();
  await fetch('https://api.pokemontcg.io/v2/cards?q=name:"charizard ex*"&orderBy=-tcgplayer.prices.holofoil.market&pageSize=12');
  console.log('Phrase with quotes and wildcard took', Date.now() - start2);
}

test();
