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

/** Anything in the run-up. Josh's mother, and the person who actually knows. */
export const BEFORE_THE_DAY_CONTACT = {
  name: 'Virginia',
  role: 'Mother of the groom',
  phone: '404-915-9085',
}

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
    category: 'Eat',
    address: '1609 University Avenue',
    desc: 'The most important institution in Charlottesville. Josh gets pastrami, egg, muenster, pesto, sprouts and tomato on an everything. Mary gets turkey, egg and vegetables on wheat. The line moves faster than it looks.',
  },
  {
    name: 'The Lawn',
    category: 'See',
    address: '400 Emmet Street South',
    desc: 'Grab some food and post up for a picnic, or walk through and look at rooms 45 and 47, where we lived next door to each other fourth year and fostered an irresponsible number of puppies.',
  },
  {
    name: 'Engineer’s Way',
    category: 'See',
    address: 'Engineer’s Way',
    desc: 'The stretch where we took most of our classes. Not on any tourist map. On ours, though.',
  },
  {
    name: 'Grit Coffee, UVA Corner',
    category: 'Coffee',
    address: '19 Elliewood Avenue',
    desc: 'Mary’s spot for coffee and what she generously calls studying.',
  },
  {
    name: 'Corner Juice',
    category: 'Coffee',
    address: '1509 University Avenue',
    desc: 'Our post-run smoothie and overpriced juice place.',
  },
  {
    name: 'Rivanna Trail',
    category: 'Move',
    address: '1835 Broadway Street',
    desc: 'A walk or a run by the river. If you came here for the running, this is the one.',
  },
  {
    name: 'Ragged Mountain Nature Area',
    category: 'Move',
    address: '1730 Reservoir Road',
    desc: 'Six miles around a reservoir. The best possible way to spend Saturday morning before the welcome party.',
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
    a: 'Yes, and we would love you to take it. Buses load at Stacey Hall on West Main, directly across the street from The Draftsman, and all of them leave at 4:15pm on Sunday. Coming home there are two times, 9:30pm and 11:00pm. At 11pm, two of the three buses go straight to the after party at Mejicali and one returns to Stacey Hall, so check which one you are boarding.',
  },
  {
    topic: 'Getting around',
    q: 'I am not staying at The Draftsman. Can I still get on?',
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
    a: 'Probably not. In town rideshare is fine, but out in Afton it thins out to almost nothing, and standing in a field at 11pm watching an app spin is a sad end to a good night. The bus is the safer bet, or drive yourself and plan for it.',
  },
  {
    topic: 'The day itself',
    q: 'What time should I actually arrive?',
    a: 'The ceremony starts at 5:00pm. On the bus you are automatically fine. Driving yourself, it is about 25 to 30 minutes from town, so aim to be parked by 4:40 and you will have time to walk up and find a seat.',
  },
  {
    topic: 'The day itself',
    q: 'Is the ceremony outside?',
    a: 'Yes, outdoors at a working vineyard in the Blue Ridge foothills. The ceremony itself is on gravel rather than grass. Early September in Virginia is warm and humid, and the sun goes over the ridge around 7:37pm, so a light layer for the evening is worth having.',
  },
  {
    topic: 'The day itself',
    q: 'What happens after the reception?',
    a: 'The after party runs 11:30pm to 1:00am at Mejicali on West Main, five minutes on foot from The Draftsman. Two of the three 11pm buses go straight there from the vineyard. Then bagels at 10am Monday in Garden VIII on the Lawn, in whatever you slept in. Times are on [the schedule](/schedule).',
  },
  {
    topic: 'What to wear',
    q: 'What is the dress code?',
    a: 'Saturday’s welcome party is elevated casual: relaxed, polished, festive. Sunday is summer formal, which in practice means long dresses and dark suits. Monday is groutfits, sweats and jammies. It is all on [the schedule](/schedule) too.',
  },
  {
    topic: 'What to wear',
    q: 'What is the weather going to do?',
    a: 'Early September in central Virginia is warm days, mild evenings, real humidity. It cools off once the sun drops behind the ridge, so bring a light layer even if the afternoon is hot.',
  },
  {
    topic: 'Food & drink',
    q: 'Do I need to eat beforehand?',
    a: 'No need. Every event is a full meal: buffet dinner at the welcome party from around 6, a plated dinner at the wedding, and bagels in Garden VIII on Monday. Come hungry to all three.',
  },
  {
    topic: 'Food & drink',
    q: 'I have a dietary restriction. Am I okay?',
    a: 'Yes. There is a vegetarian main, one of the other mains is gluten-free, and the salad is vegan and gluten-free as served. If you have an allergy or restriction you did not note on your RSVP form, please let us know over text and we will get it to the kitchen.',
  },
  {
    topic: 'Everything else',
    q: 'Where do I put the photos I take?',
    a: 'On [the photos page](/photos). It takes photos and video, and everything lands straight in our album. We would love as many as you are willing to share.',
    },
  {
    topic: 'Everything else',
    q: 'Is there a registry?',
    a: 'There is, [over on Zola](https://www.zola.com/wedding/eilands2026/registry). You joining us for our wedding is the greatest gift, but the link is there if you would like it.',
  },
  {
    topic: 'Everything else',
    q: 'Something has gone wrong. Who do I find?',
    a: 'Before the weekend, Virginia, Josh’s mum, is the best person to reach: [404-915-9085](tel:+14049159085). On the day itself Paige coordinates everything from the Hazy Mountain side and her team is on site all Sunday: [850-212-3055](tel:+18502123055). [The WhatsApp](whatsapp) works for anything in between.'
  },
]

// ---------------------------------------------------------------- closing line

/** Their own words, from the Zola homepage. */
export const STORY_CLOSER =
  'We’re excited to gather all of our favorite people and celebrate together back in the place where we first met and fell in love.'

// ---------------------------------------------------------------- thank you

export const THANK_YOU = {
  heading: 'Thank you',
  body: [
    'A wedding is a strange thing to ask of people. We asked you to look at a date eighteen months out, then take days off work, book flights, drive over a mountain, and stand in a field in Virginia in September humidity, all so you could watch us say a few sentences to each other.',
    'And you said yes. All {count} of you said yes.',
    'Some of you have known one of us since before we knew each other. Some of you met us at nineteen on a Lawn we have not stopped talking about since. Some of you found us in Boston, or at Stanford, or somewhere in between. Between you, you were there for pretty much all of it.',
    'We are not going to get enough time with each of you. That is the one guaranteed failure of a wedding and we have made our peace with it. So if we only get ninety seconds with you at the bar, know that we saw you come, and we know what it took to get here.',
    'Take pictures. Put them on this site. Eat a Bodo’s bagel. Stay for the late bus.',
  ],
  signoff: 'All our love,',
  names: 'Mary & Josh',
}
