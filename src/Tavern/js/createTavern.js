
setup.createTavern = (town, opts = {}) => {
  const tavern = (opts.newBuilding || lib.createBuilding)(town, 'tavern')

  tavern.name = lib.createTavernName()
  console.groupCollapsed(tavern.name)
  tavern.associatedNPC = (opts.newBartender || setup.createBartender)(town, tavern, opts.associatedNPC)
  tavern.bartender = tavern.associatedNPC
  tavern.barmaid = setup.createNPC(town, {
    isShallow: true,
    gender: 'woman',
    background: 'commoner',
    hasClass: false,
    profession: 'barmaid'
  })
  setup.createRelationship(town, tavern.associatedNPC, tavern.barmaid, 'employee', 'employer')

  lib.createBuildingRelationship(town, tavern, tavern.barmaid, { relationship: 'employee', reciprocalRelationship: 'place of employment' })

  Object.assign(tavern, {
    passageName: 'TavernOutput',
    initPassage: 'InitTavern',
    buildingType: 'tavern',
    stageDescriptor: setup.tavern.stageDescriptor.random(),
    wordNoun: ['tavern', 'tavern', 'tavern', 'tavern', 'pub', 'pub', 'pub', 'inn', 'inn', 'bar', 'bar', 'bar', 'watering hole', 'drinkery'].random(),
    shortages: ['wine', 'booze', 'grog', 'whiskey', 'mutton', 'lamb', 'carrots', 'mugs', 'forks', 'frogs', 'bread', 'mushrooms', 'salt', 'silver pieces', 'chairs', 'eggs', 'potatoes'],
    fun: setup.tavern.fun.random(),
    type: [
      'quiet and low-key bar',
      'regular',
      'regular',
      'regular',
      'regular',
      'raucous dive',
      'raucous dive',
      'raucous dive',
      'raucous dive',
      "thieves' guild hangout",
      'gathering place for a secret society',
      'high-end dining club',
      'high-end dining club',
      'gambling den',
      'gambling den',
      `${tavern.associatedNPC.race} only club`,
      "guild-member's only club",
      "guild-member's only club",
      'members-only club',
      'brothel',
      'brothel'
    ].random(),
    // patrons: setup.tavern.patrons.random(),
    game: setup.tavern.games.random()
  })
  tavern.roll.bedCleanliness = random(1, 100)

  Object.assign(tavern, setup.tavern.get.draws(town, tavern))

  if (tavern.draw === 'proximity to the church') {
    if (tavern.type.indexOf(['gambling den', 'proximity to the brothel', 'raucous dive']) !== -1) {
      tavern.draw = 'proximity to the brothel'
    } else if (tavern.type === 'brothel') {
      tavern.draw = 'cheap prices for customers'
      tavern.hasBrothel = true
    }
  }
  switch (tavern.draw) {
    case "tavern.reputation + ' atmosphere'":
      tavern.notableFeature = `its ${tavern.reputation} atmosphere`
      break
    default:
      tavern.notableFeature = `its ${tavern.draw}`
  }
  lib.tavernModifiers(town, tavern)
  tavern.lodging = 0
  tavern.colour1 = getRandomTavernColour()
  tavern.colour2 = getRandomTavernColour()

  // Define entertainment if large enough
  if (tavern.roll.size >= 30) {
    tavern.entertainment = setup.tavern.get.entertainment(tavern)
  } else tavern.entertainment = ''
  // Define tavern feature based on wealth
  if (tavern.roll.wealth <= 35) {
    tavern.feature = setup.tavern.get.cheapFeature(tavern)
  } else if (tavern.roll.wealth <= 65) {
    tavern.feature = setup.tavern.get.averageFeature(tavern)
  } else if (tavern.roll.wealth > 65) {
    tavern.feature = setup.tavern.get.wealthyFeature(tavern)
  }
  // Sets up building structure and creates building description
  lib.createStructure(town, tavern)
  tavern.structure.tavernDescriptor = `${tavern.structure.material.wealth} ${tavern.structure.material.noun} ${tavern.wordNoun} with ${lib.articles.output(tavern.structure.roof.verb)} roof`

  const rollDataVariables = ['wealth', 'size', 'cleanliness', 'roughness', 'reputation']
  for (const propName of rollDataVariables) {
    lib.defineRollDataGetter(tavern, setup.tavern.rollData[propName].rolls, propName)
  }
  // lib.tavernRender(tavern)
  tavern.tippyDescription = `${lib.articles.output(tavern.size).toUpperFirst()} ${tavern.wordNoun} that's ${tavern.cleanliness}, and is known for ${tavern.notableFeature}.`
  console.log(tavern)
  console.groupEnd()
  return tavern
}

setup.getTavernLodging = tavern => {
  console.log(`Fetching ${tavern.name} lodging.`)
  const { wealth } = setup.tavern.rollData

  const [,, lodging] = wealth.rolls.find(([threshold]) => {
    return threshold <= tavern.roll.wealth
  }) || lib.last(wealth.rolls)

  return lodging
}

setup.getTavernBedCleanliness = (tavern) => {
  console.log(`Fetching ${tavern.name} bed cleanliness.`)
  const { cleanliness } = setup.tavern.rollData

  const [, bedCleanliness] = cleanliness.rolls.find(([threshold]) => {
    return threshold <= tavern.roll.bedCleanliness
  }) || lib.last(cleanliness.rolls)

  return bedCleanliness
}

function getRandomTavernColour () {
  const { colours, random } = lib
  const available = [colours.yellow, colours.orange, colours.red, colours.purple, colours.blue, colours.green, colours.brown, colours.black, colours.white]
  const selected = random(available)
  return random(selected.colour)
}
