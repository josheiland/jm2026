// Static content: travel, hotels, FAQs, menu, Charlottesville recommendations, the story.
// Sourced from zola.com/wedding/eilands2026 and the confirmed Hazy Mountain menu
// (tasting 2026-04-12). Nothing here is invented — where a detail is genuinely not
// settled yet it says so out loud rather than guessing.

export const COUPLE = { one: 'Mary', two: 'Josh', full: 'Mary Blankemeier & Josh Eiland' }

export const ZOLA_URL = 'https://www.zola.com/wedding/eilands2026'
export const REGISTRY_URL = 'https://www.zola.com/wedding/eilands2026/registry'

// ---------------------------------------------------------------- travel

export interface Airport {
  code: string
  name: string
  drive: string
  note: string
  best?: string
}

export const AIRPORTS: Airport[] = [
  {
    code: 'CHO',
    name: 'Charlottesville Albemarle',
    drive: '35 min to the venue',
    note: 'The closest airport by a wide margin. Small, easy, and you can be at your hotel twenty minutes after you land. Usually the most expensive fare.',
    best: 'Easiest',
  },
  {
    code: 'IAD',
    name: 'Washington Dulles',
    drive: '~2 hr to Charlottesville',
    note: 'Two hours up Route 29, and usually the cheapest way in. Plenty of guests are flying here — say so in the WhatsApp group and split a rental car.',
    best: 'Cheapest',
  },
  {
    code: 'DCA',
    name: 'Reagan National',
    drive: '~2 hr to Charlottesville',
    note: 'Same drive as Dulles, closer to DC itself. Amtrak from Union Station down to Charlottesville is a genuinely lovely alternative to driving.',
  },
  {
    code: 'RIC',
    name: 'Richmond',
    drive: '~1.5 hr to the venue',
    note: 'The middle option. Rental car, Amtrak, or bus will all get you the rest of the way.',
  },
]

export interface Hotel {
  name: string
  address: string
  rates?: string
  blockDeadline?: string
  status: 'full' | 'block' | 'no-block'
  note: string
  isShuttleStop?: boolean
}

export const HOTELS: Hotel[] = [
  {
    name: 'The Draftsman',
    address: '1106 West Main Street, Charlottesville, VA 22903',
    status: 'full',
    note: 'Our room block here is full. It is still where every shuttle picks up and drops off, so this is the centre of gravity for the whole weekend.',
    isShuttleStop: true,
  },
  {
    name: 'Hampton Inn & Suites Charlottesville — At The University',
    address: '900 West Main Street, Charlottesville, VA 22903',
    rates: '$284/night Fri–Sat · $159/night Sunday',
    blockDeadline: '2026-08-01',
    status: 'block',
    note: 'Two blocks down West Main from The Draftsman — about a four-minute walk to the shuttle.',
  },
  {
    name: 'Courtyard by Marriott — University Medical Center',
    address: '1201 West Main Street, Charlottesville, VA 22903',
    rates: '$205/night Fri–Sat · $132/night Sunday',
    status: 'no-block',
    note: 'No room block, but rooms are usually available and it is the closest of the three to The Draftsman — barely a two-minute walk.',
  },
]

// ---------------------------------------------------------------- the menu

export const MENU = {
  note: 'Confirmed at the April tasting. Every course has a vegetarian option, and the salad is vegan and gluten-free as served.',
  courses: [
    {
      course: 'To start',
      items: [
        { name: 'Rosé strawberry crostini', desc: 'Whipped goat cheese, tabasco honey butter, mint', tags: [] as string[] },
        { name: 'Sweet potato bites', desc: 'Avocado purée, garlic shallot, bacon', tags: [] },
        { name: 'Fire-roasted tomato bruschetta', desc: 'Basil, mozzarella, balsamic', tags: ['veg'] },
      ],
    },
    {
      course: 'Salad',
      items: [
        {
          name: 'Mango and avocado salad',
          desc: 'Red cabbage, arugula, cilantro, grape tomato, lemon ginger dressing',
          tags: ['vegan', 'gf', 'df'],
        },
      ],
    },
    {
      course: 'Mains',
      items: [
        {
          name: 'Sesame crusted salmon',
          desc: 'Beurre blanc, spinach orzo, red pepper and garlic broccolini',
          tags: [],
        },
        {
          name: 'Tequila marinated chicken',
          desc: 'Brown sugar, lime and cilantro, pineapple mango salsa, whipped parmesan potatoes',
          tags: ['gf'],
        },
        {
          name: 'Three cheese ravioli',
          desc: 'Caramelized onions, balsamic portobello, fire roasted tomato confit, garlic butter cream',
          tags: ['veg'],
        },
      ],
    },
    {
      course: 'Then cake',
      items: [{ name: 'Wedding cake', desc: 'Flavour is a closely guarded secret, mostly because we have not picked it yet', tags: [] }],
    },
  ],
  wine: 'Hazy Mountain pours their own — a rosé, a red, a Grüner Veltliner, and sparkling for the toast.',
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
    desc: 'The single most important institution in Charlottesville. Josh gets pastrami, egg, muenster, pesto, sprouts and tomato on an everything bagel. Mary gets turkey, egg and vegetables on wheat. Cash-fast lines, no substitutions on the attitude.',
  },
  {
    name: 'The Lawn',
    category: 'See',
    address: '400 Emmet Street South',
    desc: 'Grab some food and post up for a picnic, or just walk through and check out rooms 45 and 47 — where we lived next door to each other fourth year and fostered a great many puppies during COVID.',
  },
  {
    name: 'Engineer’s Way',
    category: 'See',
    address: 'Engineer’s Way',
    desc: 'The stretch where we took most of our classes as undergrads. Not on any tourist map. On ours, though.',
  },
  {
    name: 'Grit Coffee, UVA Corner',
    category: 'Coffee',
    address: '19 Elliewood Avenue',
    desc: 'Mary’s go-to spot for coffee and some light studies.',
  },
  {
    name: 'Corner Juice',
    category: 'Coffee',
    address: '1509 University Avenue',
    desc: 'Our go-to post-run spot for a smoothie or an overpriced juice.',
  },
  {
    name: 'Rivanna Trail',
    category: 'Move',
    address: '1835 Broadway Street',
    desc: 'Great spot for a walk or a run by the river. If you are here for the running, this is the one.',
  },
  {
    name: 'Ragged Mountain Nature Area',
    category: 'Move',
    address: '1730 Reservoir Road',
    desc: 'A six-mile loop around a reservoir. The best way to spend a Saturday morning before the welcome party.',
  },
]

// ---------------------------------------------------------------- FAQs

export interface Faq {
  q: string
  a: string
  /** Groups the accordion. */
  topic: 'Getting here' | 'The day itself' | 'What to wear' | 'Food & drink' | 'Everything else'
}

export const FAQS: Faq[] = [
  {
    topic: 'Getting here',
    q: 'Is there transportation to the wedding?',
    a: 'Yes. Buses run between the West Main Street hotels and the vineyard. They load in front of The Draftsman starting at 4:15pm on Sunday and the last one leaves at 4:45pm. Coming home there are two: 9:30pm and 11:00pm, both returning to The Draftsman. The 11pm bus makes an optional bar stop on the way.',
  },
  {
    topic: 'Getting here',
    q: 'I am not staying at The Draftsman. Can I still take the bus?',
    a: 'Absolutely — please do. The Hampton Inn and the Courtyard are both a few minutes’ walk down West Main. Just make your way to the front of The Draftsman by 4:45pm.',
  },
  {
    topic: 'Getting here',
    q: 'Can I drive myself instead?',
    a: 'You can. There is parking at the venue. Just remember that it is a 35-minute drive back over the mountain at the end of a long night at a vineyard — the bus exists for a reason.',
  },
  {
    topic: 'Getting here',
    q: 'Which airport should I fly into?',
    a: 'Charlottesville (CHO) is closest at about 35 minutes from the venue, and by far the least hassle. Dulles (IAD) and Reagan (DCA) are both around two hours away and usually much cheaper. Richmond (RIC) is about an hour and a half. If you are landing at IAD or DCA, say so in the WhatsApp group — someone is almost certainly driving the same road at the same time.',
  },
  {
    topic: 'Getting here',
    q: 'Is Uber or Lyft reliable in Charlottesville?',
    a: 'In town, generally yes. Out at the vineyard in Afton, much less so — it is rural and coverage thins out. Do not plan on summoning a ride home from Hazy Mountain at 11pm. Take the bus.',
  },
  {
    topic: 'The day itself',
    q: 'What time should I arrive at the ceremony?',
    a: 'The wedding starts at 5:00pm. If you are on the shuttle you are automatically fine. If you are driving, aim to be parked by 4:40pm so you have time to walk up and find a seat.',
  },
  {
    topic: 'The day itself',
    q: 'Is the ceremony outside?',
    a: 'Yes — outdoors at a working vineyard in the Blue Ridge foothills. Early September in Virginia is warm and often humid, and the sun sets around 7:37pm. Grass and thin heels do not get along, so block heels or heel stoppers are a genuinely good idea.',
  },
  {
    topic: 'The day itself',
    q: 'What happens after the reception ends?',
    a: 'The after party runs from 11:30pm to 1:00am back on the Corner. The 11pm shuttle drops nearby. And then bagels on the Lawn at 10am Monday, in whatever you slept in.',
  },
  {
    topic: 'What to wear',
    q: 'Is there a dress code?',
    a: 'Each event has its own on the schedule. The welcome party is elevated casual — relaxed, polished, festive. The wedding is summer formal, which in practice means long dresses and dark suits for most people. Monday bagels are groutfits, sweats and jammies. But honestly: wear whatever makes your heart happy. It can’t be that deep, we’re just excited to celebrate with you.',
  },
  {
    topic: 'What to wear',
    q: 'What is the weather actually like?',
    a: 'Early September in central Virginia usually means warm days and mild evenings, with real humidity. It cools down once the sun goes over the ridge, so a light layer for the evening is smart even if the afternoon is hot.',
  },
  {
    topic: 'Food & drink',
    q: 'What is being served?',
    a: 'A full plated dinner — passed appetizers, a mango and avocado salad, then your choice of sesame crusted salmon, tequila marinated chicken, or three cheese ravioli. Hazy Mountain pours their own wine. The full menu is on this site.',
  },
  {
    topic: 'Food & drink',
    q: 'I have a dietary restriction. Am I going to be okay?',
    a: 'Yes. There is a vegetarian main, the chicken is gluten-free, and the salad is vegan, gluten-free and dairy-free as served. If you have an allergy we should know about, message us in the WhatsApp group and we will get it to the kitchen.',
  },
  {
    topic: 'Food & drink',
    q: 'Will there be food at the welcome party?',
    a: 'Appetizers and drinks from 4pm, and a full buffet dinner from around 6pm. Come hungry, come whenever.',
  },
  {
    topic: 'Everything else',
    q: 'Can I bring a date or a plus one?',
    a: 'We are pushing the limits of our venue’s capacity, so please let us know if you would like to bring a date and do not already have one included in your invitation. If space opens up we will tell you.',
  },
  {
    topic: 'Everything else',
    q: 'Are kids welcome?',
    a: 'We are limiting the number of littles running around, again because of venue capacity. If your children are named on your invitation they are very much invited.',
  },
  {
    topic: 'Everything else',
    q: 'Where do I put the photos I take?',
    a: 'Right here on this site — there is an upload page, it takes photos and video, and it drops straight into our Drive folder. No app, no account, no login. Please use it. The photographer cannot be at every table at once and you will see things she won’t.',
  },
  {
    topic: 'Everything else',
    q: 'Is there a registry?',
    a: 'There is, over on our Zola page. Your being there is genuinely the thing, but the link is on this site if you want it.',
  },
  {
    topic: 'Everything else',
    q: 'Who do I ask if something goes wrong on the day?',
    a: 'Not us — we will be somewhat occupied. Our planner Paige DuMond is running the weekend and her team will be on site all day Sunday. For anything before then, the WhatsApp group is the fastest way to reach a human.',
  },
]

// ---------------------------------------------------------------- the story

export const STORY_PARAGRAPHS = [
  'Mary and Josh met at our college orientation at UVA, in a small group of 15 or so folks who were together for all the sessions over the course of the few-day event. When our first semester started a few weeks later, we ended up in a class together. We were getting into groups for a semester-long project and Mary came in late to class (on the first day… classic). Josh told her we had a spot in our group and Mary replied, “Thanks so much, so nice to meet you!” Josh, having had multiple one-on-one conversations with her, politely played along.',
  'Soon after, we went for our first run together. Halfway through, Mary twisted her ankle hard — truly terrible timing, since the cross country season started the following day. Josh was immediately convinced he’d derailed her whole season on day one, but she bounced back quickly (…no surprise there). Those first two years at UVA, we became each other’s people — many more class projects together, library “study sessions,” football games (Mary never lasted until halftime), and long phone calls whenever we were apart.',
  'The summer after second year, Josh stopped in Chicago so we could go skydiving together, and he stayed with Mary’s family. We were still just friends (despite Josh’s best efforts), but Mary’s family picked up on something right away. Word traveled quickly through both the immediate and extended family, and by Thanksgiving a cousin had started a full “Josh! Josh! Josh!” chant after hearing about his visit.',
  'Their manifesting must have helped, because very soon after that we (finally) started dating. When Mary was medically retired from the team and decided to take a trip to Switzerland over winter break, Josh offered to join her — and they’ve been by each other’s side ever since.',
  'Soon after returning to Charlottesville, COVID hit. That summer, we hunkered down together in Josh’s fraternity house (a fifteen-person home all to ourselves), working opposite halves of the day (Mary on Bangladeshi time) but still finding plenty of space for cooking, at-home workouts, picnics, and quality time. During our fourth year at UVA, we lived next door to each other on the Lawn, repeatedly (and not so discreetly) fostering puppies and testing the patience of housing more than a few times.',
  'After graduation, we moved to Boston and started our professional lives, surrounded by friends who made that chapter feel full and fun. Through annual trips to rural Rwanda to host a kids’ running camp, meetups during a five-month stretch of long distance from Redwood City to Kigali, and five weeks traveling through Southeast Asia with friends, we realized that every place felt a little more like home when we were together. Before heading out to business school for the next adventure, Josh popped the question down in Georgia this past summer, and this time it didn’t take Mary quite as long to say “yes.”',
]

export const STORY_CLOSER =
  'We’re excited to gather all of our favorite people and celebrate together back in the place where we first met and fell in love. Thank you for being part of our story.'

// ---------------------------------------------------------------- thank you

export const THANK_YOU = {
  heading: 'Thank you',
  body: [
    'A wedding is a strange and wonderful thing to ask of people. We asked you to look at a date eighteen months out, and then take days off work, and book flights, and drive over a mountain, and stand in a field in Virginia in the September humidity — all so you could watch us say a few sentences to each other.',
    // {count} is filled from data/guests.json so the number can never drift from the chart.
    'And you said yes. All {count} of you said yes.',
    'Some of you have known one of us since before we knew each other. Some of you met us at nineteen on a Lawn we have not stopped talking about since. Some of you found us in Boston, or at Stanford, or somewhere along a dirt road in Rwanda with a few hundred kids running around. You are, collectively, the entire proof that the last decade happened.',
    'We are not going to get enough time with each of you this weekend. That is the one guaranteed failure of a wedding, and we have made our peace with it. So if we only get ninety seconds with you at the bar — know that we noticed you came, we know what it took, and we are keeping it.',
    'Take pictures. Put them on this site. Eat a Bodo’s bagel. Stay for the late bus.',
  ],
  signoff: 'All our love,',
  names: 'Mary & Josh',
}
