// Copy for the site. Sourced from zola.com/wedding/eilands2026 and confirmed vendor
// notes, then edited down on the Aug 1 review call.
//
// House style, per that call: no em dashes, no periods on sentence fragments, no
// "genuinely"/"truly"/"absolutely" filler, and a joke wherever one fits.

export const COUPLE = { one: 'Mary', two: 'Josh', full: 'Mary Blankemeier & Josh Eiland' }

export const ZOLA_URL = 'https://www.zola.com/wedding/eilands2026'
export const REGISTRY_URL = 'https://www.zola.com/wedding/eilands2026/registry'

/** Day-of contact. Paige runs the day from the Hazy Mountain side. */
export const DAY_OF_CONTACT = {
  name: 'Paige',
  role: 'Coordinator, Hazy Mountain',
  phone: '850-212-3055',
}

/** Anything in the run-up. Both mothers, and the people who actually know. */
export const BEFORE_THE_DAY_CONTACTS = [
  {
    name: 'Virginia',
    role: 'Mother of the groom',
    phone: '404-915-9085',
  },
  {
    name: 'Julie',
    role: 'Mother of the bride',
    phone: '708-280-2468',
  },
]

// ---------------------------------------------------------------- Charlottesville

export interface Poi {
  name: string
  category: string
  address: string
  desc: string
}

export const POIS: Poi[] = [
  {
    name: 'Bodo’s Bagels',
    category: 'Eat & Drink',
    address: '1609 University Avenue',
    desc: 'Non-negotiable. Between our two orders, we cover the whole menu',
  },
  {
    name: 'Take It Away',
    category: 'Eat & Drink',
    address: '115 Elliewood Avenue',
    desc: 'Get the special sauce. The sandwich is really just the delivery mechanism',
  },
  {
    name: 'The Local',
    category: 'Eat & Drink',
    address: '824 Hinton Avenue',
    desc: 'Our first real date. We were on our best behavior',
  },
  {
    name: 'Luce',
    category: 'Eat & Drink',
    address: '110 2nd Street NW',
    desc: 'Hole-in-the-wall pasta that carried us through 2020',
  },
  {
    name: 'Roots',
    category: 'Eat & Drink',
    address: '1329 West Main Street',
    desc: 'May we recommend the El Jefe bowl with the works?',
  },
  {
    name: 'Al Carbon',
    category: 'Eat & Drink',
    address: '365 Merchant Walk Square',
    desc: 'Rotisserie chicken worth getting in a car for',
  },
  {
    name: 'Grit Coffee, UVA Corner',
    category: 'Eat & Drink',
    address: '19 Elliewood Avenue',
    desc: 'Where Mary claims she studied',
  },
  {
    name: 'Corner Juice',
    category: 'Eat & Drink',
    address: '1509 University Avenue',
    desc: 'Overpriced juice we bought anyway, every single time',
  },
  {
    name: 'The Lawn',
    category: 'See',
    address: '400 Emmet Street South',
    desc: 'A UNESCO World Heritage Site. Also a very good place to sit down',
  },
  {
    name: 'Engineer’s Way',
    category: 'See',
    address: 'Engineer’s Way',
    desc: 'Less scenic than it sounds. Systems Engineering is the ugliest building on it. Naturally, it was ours',
  },
  {
    name: 'High Energy Physics Building',
    category: 'See',
    address: 'McCormick Road, University of Virginia',
    desc: 'There is a way onto the roof. That is all we are saying',
  },
  {
    name: 'Ragged Mountain Running Shop',
    category: 'Move',
    address: '3 Elliewood Avenue',
    desc: 'Tell the Lorenzonis we sent you. Run Your City owes them',
  },
  {
    name: 'Lannigan Field',
    category: 'Move',
    address: 'Copeley Road, University of Virginia',
    desc: 'Where Mary put in an unreasonable number of laps',
  },
  {
    name: 'Rivanna Trail',
    category: 'Move',
    address: '1835 Broadway Street',
    desc: 'Run by the river, if you brought the shoes',
  },
  {
    name: 'Ragged Mountain Nature Area',
    category: 'Move',
    address: '1730 Reservoir Road',
    desc: 'Six miles around a reservoir. Ambitious behavior for the day before a wedding',
  },
]

// ---------------------------------------------------------------- FAQs

export interface Faq {
  q: string
  a: string
  topic: 'Getting around' | 'The day itself' | 'What to wear' | 'Food & drink' | 'Everything else'
}

export const FAQS: Faq[] = [
  {
    topic: 'Getting around',
    q: 'Is there a bus to the wedding?',
    a: 'Yes, and we would love you to take it. Buses load at Stacey Hall on West Main, directly across the street from The Draftsman, and all of them leave at 4:15pm on Sunday. Coming home there are two times, 9:30pm and 11:00pm. At 11pm all three buses go straight to the after party at Mejicali, and it is a short walk to the hotel from there for those who can’t hang.',
  },
  {
    topic: 'Getting around',
    q: 'I am not staying at The Draftsman. Can I still get on the bus?',
    a: 'Please do. Everything on West Main is a few minutes apart. Just be at Stacey Hall, across the street from The Draftsman, before 4:15.',
  },
  {
    topic: 'Getting around',
    q: 'Can I drive myself instead?',
    a: 'Of course, and there is parking at the venue. It is a 25 to 30 minute drive back over the mountain, so it is worth deciding before the wine rather than after it.',
  },
  {
    topic: 'Getting around',
    q: 'Can I get an Uber back from the vineyard?',
    a: 'No promises. In town rideshare is fine, but out in Afton it thins out a good bit, and standing in a field at 11pm watching an app spin is a sad end to a good night. The bus is the safer bet, or drive yourself and plan for it.',
  },
  {
    topic: 'The day itself',
    q: 'What time should I actually arrive?',
    a: 'The ceremony starts at 5:00pm. On the bus you are automatically fine. Driving yourself, it is about 25 to 30 minutes from town, so aim to be parked by 4:40 and you will have time to walk up and find a seat. Early enough to relax, late enough that you aren’t helping set up.',
  },
  {
    topic: 'The day itself',
    q: 'Is the ceremony outside?',
    a: 'Yes, outdoors at a working vineyard in the Blue Ridge foothills. The ceremony itself is on gravel rather than grass. Early September in Virginia is warm and humid, and the sun goes over the ridge around 7:37pm, so a light layer for the evening is worth having.',
  },
  {
    topic: 'The day itself',
    q: 'What happens after the reception?',
    a: 'The after party runs 11:30pm to 2:00am at Mejicali on West Main, five minutes on foot from The Draftsman. All three 11pm buses go straight there from the vineyard. Then bagels at 10am Monday in Garden VIII on the Lawn, in whatever you slept in. Times are on [the schedule](/schedule).',
  },
  {
    topic: 'What to wear',
    q: 'What is the dress code?',
    a: 'Saturday’s welcome party is elevated casual. Sunday is summer formal, which in practice means long dresses and dark suits. Monday is groutfits, sweats and jammies. It is all on [the schedule](/schedule) too. We believe in you.',
  },
  {
    topic: 'What to wear',
    q: 'What is the weather going to do?',
    a: 'Early September in central Virginia is warm days, mild evenings, real humidity. It cools off once the sun drops behind the ridge, so bring a light layer even if the afternoon is hot.',
  },
  {
    topic: 'Food & drink',
    q: 'Do I need to eat beforehand?',
    a: 'No need. Every event is a full meal: buffet dinner at the welcome party from around 6, a plated dinner at the wedding, and bagels in Garden VIII on Monday. Come hungry. We have taken this responsibility very seriously.',
  },
  {
    topic: 'Food & drink',
    q: 'I have a dietary restriction. Will there be food I can eat?',
    a: 'Yes. There is a vegetarian main, one of the other mains is gluten-free, and the salad is vegan and gluten-free as served. If you have an allergy or restriction you did not note on your RSVP form, please let us know over text and we will get it to the kitchen.',
  },
  {
    topic: 'Everything else',
    q: 'Where do I put the photos I take?',
    a: 'On [the photos page](/photos). It takes photos and video, and everything lands straight in our album. Editorial judgment is neither required nor encouraged.',
    },
  {
    topic: 'Everything else',
    q: 'Is there a registry?',
    a: 'There is, [over on Zola](https://www.zola.com/wedding/eilands2026/registry). You joining us for our wedding is the greatest gift, but the link is there if you would like it.',
  },
  {
    topic: 'Everything else',
    q: 'Something has gone wrong. Who do I find?',
    a: 'Ideally, someone more qualified than us (and no shot you’re getting through Mary’s do not disturb anyway). Before the weekend, either of our moms is the best person to reach: Virginia, Josh’s mom, on [404-915-9085](tel:+14049159085), or Julie, Mary’s mom, on [708-280-2468](tel:+17082802468). On the day itself Paige coordinates everything from the Hazy Mountain side and her team is on site all Sunday: [850-212-3055](tel:+18502123055). [The WhatsApp](whatsapp) works for anything in between.'
  },
]

/**
 * Not in the list. Surfaces only when someone searches for it, which is the whole joke.
 * Asked for on the Aug 22 call.
 */
export const HIDDEN_FAQ: Faq = {
  topic: 'Everything else',
  q: 'Mary said what?',
  a: 'Who knows what it was this time. Always something.',
}

/** Lowercased substring that reveals HIDDEN_FAQ. */
export const HIDDEN_FAQ_TRIGGER = 'mary said'

// ---------------------------------------------------------------- closing line

/** Their own words, from the Zola homepage. */
export const STORY_CLOSER =
  'We’re excited to gather all of our favorite people and celebrate together back in the place where we first met and fell in love.'

// ---------------------------------------------------------------- thank you

export const THANK_YOU = {
  heading: 'Thank you',
  salutation: 'Bugs,',
  body: [
    'Can’t believe this weekend is finally here.',
    'We could not be more excited to celebrate with our favorite humans. Thank you for coming all the way to not-so-easy-to-get-to Charlottesville, from across the country and across the world. It could not mean more to celebrate our love with the people who have shaped and supported us, in the place where our story started.',
    'From our hometowns, to Cville, Boston, Palo Alto, or somewhere along the way, y’all have been there for pretty much all of it.',
    'We are so grateful.',
    'We are not going to get nearly enough time with each of you this weekend, but we can’t wait to soak in the moments we do get.',
    'Give us a hug. Poke around our old stomping grounds. Cry (happy tears, ofc). Try your first Alani. Stay for the late bus. Dance your heart out. Drink the electrolytes at bagel breakfast. Feel appreciated.. because we appreciate you more than you could possibly know.',
  ],
  /** Index of the line that gets the big centred pull-quote treatment. */
  pullQuote: 3,
  signoff: 'Cups overflowing,',
  names: 'Mary & Josh',
}
