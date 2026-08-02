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
  phone: '', // not on file yet
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
    a: 'Yes, and you should take it. Buses load in front of The Draftsman on West Main and all of them leave at 4:15pm on Sunday. Coming home there are two, at 9:30pm and 11:00pm, both back to The Draftsman.',
  },
  {
    topic: 'Getting around',
    q: 'I am not staying at The Draftsman. Can I still get on?',
    a: 'Please do. Everything on West Main is a few minutes apart. Just be standing in front of The Draftsman before 4:15.',
  },
  {
    topic: 'Getting around',
    q: 'Can I drive myself instead?',
    a: 'You can, and there is parking at the venue. Just decide that before the wine rather than after it. It is a 35-minute drive back over the mountain.',
  },
  {
    topic: 'Getting around',
    q: 'Can I get an Uber back from the vineyard?',
    a: 'Realistically, no. In town rideshare is fine. Out in Afton it thins out to nothing, and standing in a field at 11pm watching an app spin is a bad end to a good night. Take the bus, or drive yourself and plan for it.',
  },
  {
    topic: 'The day itself',
    q: 'What time should I actually arrive?',
    a: 'The ceremony starts at 5:00pm. On the bus you are automatically fine. Driving yourself, aim to be parked by 4:40 so you can walk up and find a seat without rushing.',
  },
  {
    topic: 'The day itself',
    q: 'Is the ceremony outside?',
    a: 'Yes, outdoors at a working vineyard in the Blue Ridge foothills. Early September in Virginia is warm and humid, and the sun goes over the ridge around 7:37pm. Grass beats stilettos, so block heels or heel stoppers are a good idea. Mary will be in stilettos.',
  },
  {
    topic: 'The day itself',
    q: 'What happens after the reception?',
    a: 'The after party runs 11:30pm to 1:00am back on the Corner, a short walk from where the late bus drops. Then bagels on the Lawn at 10am Monday, in whatever you slept in.',
  },
  {
    topic: 'What to wear',
    q: 'What is the dress code?',
    a: 'Saturday’s welcome party is elevated casual: relaxed, polished, festive. Sunday is summer formal, which in practice means long dresses and dark suits. Monday is groutfits, sweats and jammies.',
  },
  {
    topic: 'What to wear',
    q: 'What is the weather going to do?',
    a: 'Early September in central Virginia is warm days, mild evenings, real humidity. It cools off once the sun drops behind the ridge, so bring a light layer even if the afternoon is hot.',
  },
  {
    topic: 'Food & drink',
    q: 'Do I need to eat beforehand?',
    a: 'No. Every event is a full meal. Buffet dinner at the welcome party from around 6, a plated dinner at the wedding, and bagels on Monday. Come hungry to all three.',
  },
  {
    topic: 'Food & drink',
    q: 'I have a dietary restriction. Am I okay?',
    a: 'Yes. There is a vegetarian main, one of the other mains is gluten-free, and the salad is vegan and gluten-free as served. If you have an allergy we should know about, message us in the group chat and we will get it to the kitchen.',
  },
  {
    topic: 'Everything else',
    q: 'Where do I put the photos I take?',
    a: 'On the Photos page of this site. It takes photos and video, there is no app and no login, and it drops straight into our album. Please use it. One photographer cannot be at every table at once.',
    },
  {
    topic: 'Everything else',
    q: 'Is there a registry?',
    a: 'There is, over on our Zola page. You being there is the actual thing, but the link is in the footer if you want it.',
  },
  {
    topic: 'Everything else',
    q: 'Something has gone wrong. Who do I find?',
    a: 'Not us, we will be busy. Paige coordinates the day from the Hazy Mountain side and her team is on site all Sunday. For anything before then, the group chat is the fastest way to reach a human.',
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
    'Some of you have known one of us since before we knew each other. Some of you met us at nineteen on a Lawn we have not stopped talking about since. Some of you found us in Boston, or at Stanford, or on a dirt road in Rwanda with a few hundred kids running around. You are, collectively, the entire proof that the last decade happened.',
    'We are not going to get enough time with each of you. That is the one guaranteed failure of a wedding and we have made our peace with it. So if we only get ninety seconds with you at the bar, know that we clocked that you came, we know what it took, and we are keeping it.',
    'Take pictures. Put them on this site. Eat a Bodo’s bagel. Stay for the late bus.',
  ],
  signoff: 'All our love,',
  names: 'Mary & Josh',
}
