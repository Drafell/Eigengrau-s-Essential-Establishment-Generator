/* global setup */
setup.createGeneralStore = function (town, opts) {
  opts = opts || {}
  let GeneralStore = (opts['newBuilding'] || setup.createBuilding)(town, 'GeneralStore')
  console.groupCollapsed('General Store loading...')
  GeneralStore.shopkeep = (opts['newShopkeep'] || setup.createNPC)({
    profession: 'merchant',
    mundane: ['pliers', 'tins', 'twine', 'cups', 'spoons', 'pans', 'chairs', 'cushions'],
    greeting: ['nods at you', 'welcomes you warmly', 'smiles and greets you', 'raises a hand with a wave', 'checks you out for just a moment before smiling at you'],
    owner: ['owner', 'caretaker', 'proud owner', 'proprietor', 'current owner', 'manager', 'assistant manager', 'acting manager'].random()
  })
  Object.assign(GeneralStore, {
    note: setup.getGeneralStoreNote(GeneralStore),
    wordNoun: ['general store', 'shop'].random(),
    crud: setup.GeneralStoreData.crud,
    notableFeature: 'wide range of goods on sale',
    passageName: 'GeneralStoreOutput',
    initPassage: 'InitGeneralStore',
    BuildingType: 'GeneralStore'
  })

  var rollDataVariables = ['wealth', 'size', 'cleanliness', 'expertise']
  rollDataVariables.forEach(function (propName) {
    setup.defineRollDataGetter(GeneralStore, setup.GeneralStoreData.rollData, propName)
  })

  GeneralStore.wealth = ''
  GeneralStore.size = ''
  GeneralStore.cleanliness = ''
  GeneralStore.expertise = ''

  GeneralStore.name = setup.createGeneralStoreName(GeneralStore.shopkeep)
  setup.GeneralStoreModifiers(town, GeneralStore)
  // setup.GeneralStoreRenders(GeneralStore)
  console.log(GeneralStore)
  // setup.townBinder(town, GeneralStore, 'GeneralStore')
  console.groupEnd()
  return GeneralStore
}
