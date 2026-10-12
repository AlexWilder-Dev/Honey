/*
 * The Hive & Honey menu, transcribed from their own /eat and /drink pages
 * (source text kept in intake/menu-source.md). Dish names, ingredients and
 * prices are as published; only capitalisation of names has been tidied.
 * Their "(V)" marks are kept as diet tags. Allergen marks are not shown.
 */

export type Price = { amount: number; label?: string }
export type Diet = 'V'
export type MenuItem = {
  id: string
  name: string
  with: string[]
  prices: Price[]
  units?: number
  diet?: Diet
  note?: string
}
export type MenuSection = { id: string; title: string; items: MenuItem[] }
export type Kind = 'plate' | 'glass'
export type MenuTab = { id: string; label: string; kind: Kind; sections: MenuSection[] }

type Draft = Omit<MenuItem, 'id'>
const used = new Map<string, number>()
const slug = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function item(name: string, withList: string[], prices: number | Price[], extra: Partial<Draft> = {}): MenuItem {
  const base = slug(name)
  const n = (used.get(base) ?? 0) + 1
  used.set(base, n)
  return {
    id: n > 1 ? `${base}-${n}` : base,
    name,
    with: withList,
    prices: typeof prices === 'number' ? [{ amount: prices }] : prices,
    ...extra,
  }
}
const gb = (glass: number, bottle: number): Price[] => [
  { amount: glass, label: 'Glass' },
  { amount: bottle, label: 'Bottle' },
]
const bottle = (amount: number): Price[] => [{ amount, label: 'Bottle' }]
const hp = (half: number, pint: number): Price[] => [
  { amount: half, label: 'Half' },
  { amount: pint, label: 'Pint' },
]
const section = (title: string, items: MenuItem[]): MenuSection => ({ id: slug(title), title, items })

// ---------------------------------------------------------------- plates

const meat = section('Meat', [
  item('Bao Bun', ['Mexican style pulled pork', 'Green Tomatillo', 'Coriander'], 6.75),
  item('Mojo Verde Pork Belly', ['Crispy pork belly', 'pickled shallots', 'Plantain chips'], 9.95),
  item('Thai Lamb Skewers', ['Nam Jim Jaew Sauce'], 14.5, { units: 4 }),
  item('Thai Lettuce Taco', ['Mince Pork', 'Crispy rice', 'Coriander', 'chilli', 'mint'], 13, { units: 4 }),
  item('Korean Dom Slider', ['Spicy Korean Chicken', 'Kimchi', 'Gochujang Mayp', 'Fresh Coriander'], 13.5, { units: 2 }),
  item('Wagyu Anticucho Bite', ['Baby Corn', 'Pickled Shallots', 'Coriander', 'Warm pitta bread'], 17.95),
  item('Mangalitza Black Pudding', ['Sweet & Sour red peppers', 'Peashoots'], 12),
  item('Short Rib Moussaka', ['Aubergine', 'Gruyere Bechamel', 'Crispy Potato'], 18.5),
  item('Duck Leg Salad', ['Pear', 'Cashews', 'Crispy Rice', 'Celery', 'Mint', 'Coriander'], 19.95),
])

const barSnacks = section('Bar snacks', [
  item('Crab Croquettes', ['Seaweed mayo'], 8, { units: 4 }),
  item('Braised Meat Croquettes', ['BBQ sauce'], 8, { units: 4 }),
  item('Chorizo', ['Honey and red wine chives', 'Dipping bread'], 7, { units: 4 }),
  item('Garlic Bread', ['Flat pizza dough', 'Garlic', 'Mozzarella cheese'], 7.5),
  item('Frickles', ['Crispy fried Pickles', 'Jalapeno dip'], 6.5),
])

const vegetarian = section('Vegetarian', [
  item('Tzatziki Foam', ['Pickled Cucumber', 'Dill Oil', 'Warm Pitta Bread'], 8.5),
  item('Carrot Bhaji', ['Mint & Coriander Chutney'], 7),
  item('Burrata', ['Heirloom tomatoes', 'Focaccia'], 13.5),
  item('Leek, Potato & Lemon Spring Rolls', ['White balsamic & Honey dip'], 11.25, { units: 2 }),
  item('Arancini', ['Brie arancini', 'Caramelised onions', 'Parmesan and Garlic sauce'], 9.75, { units: 4 }),
  item('Padron Peppers', ['Garlic', 'Lemon'], 6.75),
  item('Asparagus & Mascarpone Ravioli', ['Pea & Mint sauce', 'Parmesan shavings'], 18),
  item('Red Leicester Terrine', ['Sourdough', 'Honey', 'Muscatel Grapes'], 10.25),
])

const sides = section('Side orders', [
  item('Samphire', ['Lemon', 'Almond', 'Smoky extra virgin olive oil'], 4.5, { diet: 'V' }),
  item('Hand Cut Chips', ['Truffle mayo'], 4.75),
  item('French Beans', ['Lemon Vinaigrette'], 4.5),
  item('Extra Pitta Bread', [], 2),
])

const fish = section('Fish', [
  item('Salted Cod Pakora', ['Tamarind & Date chutney'], 7),
  item('Tuna Sushi', ['Crispy sushi rice', 'Fresh tuna', 'Wasabi mayo'], 8.5, { units: 2 }),
  item('Crispy Squid', ['Caramel gochujang', 'Sesame', 'Pickled daikon', 'Nori'], 9.5),
  item('Esqueixada of Cod Cheeks', ['Cherry Tomatoes', 'Red Peppers', 'Shallots', 'Dill', 'Spring Onion'], 11),
  item('Scallops Causa', ['Aji Amarillo Potato', 'Pickled Onion', 'Creme Fraiche', 'Chives', 'Coriander'], 13.95),
  item('Scallop & Prawn Ravioli', ['Champagne Beurre Blanc', 'Semi-Dried Tomatoes', 'Chives'], 20),
  item('Swordfish Alino de Alcaparras', ['Alino de Alcaparras', 'Caper', 'Shallots', 'Lemon Dressing'], 20),
])

const pizza = section('Pizza', [
  item('Margherita', ['Tomato sauce', 'mozzarella', 'basil'], 12.95, { diet: 'V' }),
  item('Aubergine', ['Aubergine', 'Smoked provola', 'Mozzarella', 'Cherry Tomatoes', 'Basil'], 14.95, { diet: 'V' }),
  item('Spicy', ['Tomato sauce', 'nduja', 'mozzarella', 'feta', 'Hot honey'], 14.95),
  item('Tuna', ['Tuna', 'Red Onion', 'Mozzarella', 'Chilli', 'Black Olives'], 15.5),
])

const dessert = section('Dessert', [
  item('Croccante', ['Amarena Gelato', 'Hazlenut Brittle', 'Crispy Raspberry'], 5),
  item('Orange Pavlova', ['Tonka Bean Clotted Cream', 'Blood Orange curd'], 5),
  item('Rhubarb Financier', ['whiskey sauce'], 5),
])

// ---------------------------------------------------------------- glasses

const hiveList = section('The Hive List', [
  item('Blood Orange Daiquiri', ['Angostura 3 Rum', 'Blood Orange Mix', 'Sugar Syrup'], 9.75),
  item('Rhubarb Triangle', ["Chairman's Spiced Rum", 'Rhubarb Puree', 'Giffard Ginger of the Indies Liqueur', 'Milk Punch'], 10),
  item('Basil Gin Smash', ['58 & Co. Gin', 'Basil Syrup', 'Pineapple Juice', 'Citrus'], 10),
  item('Strawberry Balsamic Sgroppino', ['Strawberry & White Balsamic Vinegar Sorbet', 'Rose Prosecco'], 10),
  item("Let's Get Figgy With It", ['Angostura 7 Rum', 'Fig Shrub', "Re'al Fig Puree", 'Lime Juice', 'Cider', 'Pepper'], 10),
  item('Blueberry Muffin', ['Zubrowka Vanilla Vodka', 'Limoncello Dicapri', 'Blueberry Puree', 'Lemon Juice', 'Egg White'], 9.75),
  item('Spicy Mango Pina Colada', ['Koko Kanu Coconut Rum', 'Angostura 3 Rum', "Re'al Coconut Puree", 'Spiced Mango Juice', 'Mango Puree', 'Lime juice'], 10),
])

const martinis = section('Martinis', [
  item('Espresso', ['Fair Cafe', 'Zubrowka Vodka', 'Espresso', 'Vanilla syrup'], 10),
  item('Bacon & Egg', ['Fat Washed Yellowstone Bourbon', 'Lemon Juice', 'Maple Syrup', 'Egg White', 'Bitters'], 11),
  item('Classic (Dry or Dirty)', ['Gin or Vodka?', 'Wet,Dry,Dirty,Filthy'], 12, { note: 'Have it your way' }),
  item('French', ['Zubrowka Vanilla Vodka', 'Giffard Mure', 'Pineapple Juice', 'Citrus'], 10),
  item('Pornstar', ['Zubrowka Vanilla Vodka', 'Fair passion', 'Passion fruit Puree', 'Giffard Vanilla Syrup', 'Pineapple Juice'], 10),
  item('Pickled Tink', ['Fair Quinoa Vodka', '58 & Co. Gin', 'Dolin Blanc Vermouth', 'Pickled Red Onion Brine'], 12.5),
])

const mocktails = section('Mocktails', [
  item('Virgin Mary', ['Big Tom Tomatoe juice', 'Firecracker', 'Tabasco', "Henderson's Relish", 'Salt & Pepper'], 7),
  item('Blood Orange Spritz', ['Blood Orange Mix', 'Crodino', 'Sugar Syrup'], 7),
  item('Hugo (00)', ['Giffard Elderflower', 'Scavi & Ray 0% Prosecco', 'Mint', 'Citrus', 'Soda'], 7),
  item('Passion Fruit Mojito', ['Passion Fruit puree', 'Sugar Syrup', 'Citrus', 'Apple Juice', 'Mint'], 7),
  item('Nada-Rita', ['Heineken 0%', 'Spicy Mango Puree', 'Lime', 'Salt'], 7),
])

const spritzes = section('Spritzes', [
  item('Aperol', ['Aperol', 'Prosecco', 'Soda'], 9.75),
  item('Sarti', ['Sarti', 'Prosecco', 'Soda'], 9.75),
  item('Limoncello', ['Limoncello Dicapri', 'Prosecco', 'Soda'], 10),
  item('Hugo', ['Fair Elderflower', 'Prosecco', 'Mint', 'Citrus', 'Soda'], 10),
  item('Sangria Jug (2ppl)', ['Wine syrup', 'Naud VS Brandy', 'Apricot Brandy', 'Orange Juice', 'Soda'], 25),
])

const aperitifs = section('Aperitifs', [
  item('Hibiscus Naked & Famous', ['Ojo de Dios Hibiscus Mezcal', 'Pampelle', 'Strega', 'Lime Juice', 'Agave'], 11),
  item('Eton Mess', ['58 & Co. Gin', 'Dolin Strawberry Vermouth', 'Giffard Creme de Cacao', 'Strawberry Bitters'], 11),
  item('Negroni', ['58 & Co. Gin', 'Dolin Rouge Vermouth', 'Campari'], 11),
  item('Aperol Noir', ['Bassoli Lambrusco Sparking Red', 'Aperol', 'Pepsi Max'], 11),
])

const digestifs = section('Digestifs', [
  item('Rob Roy', ['Clubhouse Whisky', 'Dolin Rouge Vermouth', 'Maraschino Cherry Juice', 'Bitters'], 10),
  item('Old Fashioned', ['Yellowstone Bourbon', 'Demerara Sugar', 'Bitters'], 12),
  item('Grasshopper', ['Giffard Creme de Cacao', 'Giffard Creme de Menthe', 'milk Mix'], 9.75),
  item('Lemon Curd Martini', ['Zubrowka Biala Vodka', 'Limoncello Dicapri', 'Lemon Curd', 'Lazzaroni Amaretto', 'Sugar Syrup', 'Lemon'], 10),
])

const white = section('White wine', [
  item('Pinot Grigio', ['Berico, Italy'], gb(6.5, 26)),
  item('Pinot Grigio', ['Quercus, Slovenia'], gb(7.3, 29)),
  item('Vinho Verde', ['Este, Portugal'], gb(8.2, 32)),
  item('White Rioja', ['Conde Valdemar, Spain'], gb(7.9, 31)),
  item('Sauvignon Blanc', ['Babich Family Reserve, New Zealand'], gb(8.6, 34)),
  item('Chardonnay', ['Morande Pionero, Chile'], gb(7.3, 29)),
  item('Chenin Blanc', ['Lievlander, South Africa'], gb(7.2, 28)),
  item('Albarino', ['Serra da Estrela, Spain'], bottle(44)),
  item('Picpoul', ['Luvignac, France'], bottle(34)),
  item('Verdejo', ['Finca Montepedroso, Spain'], gb(9, 36)),
  item('Viognier', ['Domaine Coste, France'], gb(9, 35)),
])

const rose = section('Rosé wine', [
  item('Pinot Grigio Blush', ['Terre del Noce, Italy'], gb(6.6, 26)),
  item('Zinfandel', ['Founders, USA'], gb(6.5, 25)),
  item('Provence', ['Saint-Roch les Vignes, France'], bottle(36)),
])

const orange = section('Orange wine', [
  item('Soto Manrique', ['La Transicion, Spain'], gb(8, 32)),
  item('Naranjo', ['Pulenta Estate, Argentina'], gb(8.8, 35)),
  item('Unico Zelo', ['Esoterico, Australia'], bottle(38)),
])

const red = section('Red wine', [
  item('Merlot', ['Morande Pionero, Chile'], gb(6.8, 27)),
  item('Syrah', ['Sevilen Majestik, Turkey'], gb(7.3, 29)),
  item('Malbec', ['La Flor, Argentina'], gb(9.8, 39)),
  item('Tinto', ['Flic, Portugal'], gb(8.1, 32)),
  item('Shiraz', ['Deakin Estate, Australia'], gb(7.8, 31)),
  item('Montepulciano', ['Podere, Italy'], gb(7.8, 32)),
  item('Cotes-du-Rhone', ['Ferraton, France'], bottle(36)),
  item('Primitivo', ['Tormaresca, Italy'], gb(9.5, 38)),
  item('Saperavi', ['Tbilvino, Georgia'], gb(10, 40)),
  item('Barolo', ['Principiano, Italy'], bottle(65)),
  item('Barbera', ['Suri, Italy'], gb(9, 36)),
  item('Frappato', ['Baglio di Pianetto, Italy'], gb(8.4, 34)),
])

const sparkling = section('Sparkling', [
  item('Cava', ['Bodegas Sumarocca, Spain'], gb(7, 38)),
  item('Prosecco Rose', ['Serena 1881, Italy'], gb(6.5, 28)),
  item('Prosecco', ['Serena, Italy'], gb(6, 27)),
  item('Sparkling Red', ['Bassoli, Italy'], gb(7, 35)),
  item('Champagne', ["Drappier Carte d'or Brut, France"], gb(12.5, 70)),
  item('Sparkling', ['Hundred Hills Preamble No2, English'], bottle(80)),
  item('Champagne', ['Jacquesson Cuvee 747, France'], bottle(130)),
])

const dessertWine = section('Dessert wine', [
  item('Naturalmente Dulce', ['Finca Antigua, Spain'], 5),
  item('Sauternes', ['La Fleur, France'], 6),
  item('Valpolicella', ['Recioto Della, Italy'], 9),
])

const beer = section('Beer', [
  item('Murphys', ['Stout, Ireland'], hp(3, 5.7)),
  item('Cruzcampo', ['Lager, Spain'], hp(3.1, 6)),
  item('Bierre Mareti Sal di Mare', ['Lager, Italy'], hp(3.4, 6.6)),
  item('Jubel', ['Peach lager, Uk'], hp(3.4, 6.4)),
  item('Brixton', ['APA, Uk'], hp(3.4, 6.6)),
  item('Vocation', ['session IPA, Uk'], hp(3.3, 6.3)),
  item('Orchard Thieves', ['Cider, Uk'], hp(2.9, 5.7)),
  item('Moretti', ['Bottle. lager, Uk'], 4.1),
  item('Heineken 00', ['0% lager, Uk'], 3.6),
  item('Bero Hazy IPA', ['0% hazy IPA , USA'], 4.9),
  item('Bero Wheat', ['0% Wheat, USA'], 4.9),
  item('Old Mout', ['Kiwi & Lime Bottle. cider, Uk'], 6),
  item('Old Mout', ['Berries & Cherries Bottle. cider, Uk'], 6),
  item('Old Mout', ['Pineapple & Raspberry Bottle. Cider, Uk'], 6),
  item('Old Mout', ['Mango & Passionfruit Bottle. cider, Uk'], 6),
])

export const menu: MenuTab[] = [
  { id: 'plates', label: 'Plates', kind: 'plate', sections: [meat, fish, vegetarian, barSnacks, sides] },
  { id: 'pizza', label: 'Pizza', kind: 'plate', sections: [pizza] },
  { id: 'dessert', label: 'Dessert', kind: 'plate', sections: [dessert] },
  { id: 'cocktails', label: 'Cocktails', kind: 'glass', sections: [hiveList, martinis, spritzes, aperitifs, digestifs, mocktails] },
  { id: 'wine', label: 'Wine', kind: 'glass', sections: [white, rose, orange, red, sparkling, dessertWine] },
  { id: 'beer', label: 'Beer & cider', kind: 'glass', sections: [beer] },
]

export const menuTagline = 'Modern dishes that capture the flavors of the season'

// ---------------------------------------------------------------- lookups

type Entry = { item: MenuItem; kind: Kind; section: string; tab: string }
export const byId = new Map<string, Entry>()
for (const tab of menu)
  for (const s of tab.sections)
    for (const it of s.items) byId.set(it.id, { item: it, kind: tab.kind, section: s.title, tab: tab.id })

export const pick = (...ids: string[]) =>
  ids.map((id) => {
    const e = byId.get(id)
    if (!e) throw new Error(`Unknown menu item: ${id}`)
    return e.item
  })

export const countItems = (kind: Kind) =>
  menu.filter((t) => t.kind === kind).reduce((n, t) => n + t.sections.reduce((m, s) => m + s.items.length, 0), 0)
