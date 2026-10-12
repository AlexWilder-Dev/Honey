export const venue = {
  name: 'Hive & Honey',
  strapline: 'Creating a Buzz',
  street: '42 Silver Street',
  city: 'Leicester',
  postcode: 'LE1 5ET',
  area: "Leicester's Old Town",
  opened: 2025,
  phone: '07376 600541',
  phoneHref: 'tel:+447376600541',
  email: 'info@hiveandhoneybar.co.uk',
  instagram: 'https://instagram.com/hive_and_honey_bar',
  instagramHandle: '@hive_and_honey_bar',
  directions:
    'https://www.google.com/maps/search/?api=1&query=Hive+%26+Honey+Leicester&query_place_id=ChIJfXyzbmVhd0gRPaPWeKgzOF0',
  google: { rating: 4.8, count: 129 },
}

/** Good to know, as the questions people actually ask. */
export const goodToKnow = [
  { q: 'Dogs?', a: 'Welcome.' },
  { q: 'Step-free?', a: 'Level access to the main entrance, partial wheelchair access.' },
  { q: 'Food hygiene rating?', a: '5.' },
]

export const reviews = [
  { quote: 'Every time I go, I find a new favourite dish and cocktail.', source: 'Google review' },
  { quote: 'Cocktails were really well made, no cutting corners', source: 'Google review' },
  { quote: 'Lovely outside seating area right in the centre of town.', source: 'Google review' },
]

/*
 * Hours, in minutes after midnight of the day the service starts.
 * Times past 24:00 belong to the night before (Fri 1:30am = Fri 25:30).
 * Day index follows Date#getDay: 0 = Sunday … 6 = Saturday.
 */
type Span = readonly [open: number, close: number]
const h = (hours: number, minutes = 0) => hours * 60 + minutes

export const barHours: Record<number, Span | null> = {
  0: null,
  1: [h(17), h(24)],
  2: [h(12), h(24)],
  3: [h(12), h(24)],
  4: [h(12), h(24)],
  5: [h(12), h(25, 30)],
  6: [h(12), h(25, 30)],
}

const lunch: Span = [h(12), h(15)]
const dinner: Span = [h(17), h(23)]

export const kitchenHours: Record<number, readonly Span[]> = {
  0: [],
  1: [dinner],
  2: [lunch, dinner],
  3: [lunch, dinner],
  4: [lunch, dinner],
  5: [lunch, dinner],
  6: [lunch, dinner],
}

export const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const dayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
