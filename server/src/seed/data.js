/* Demo seed data for The Byte Club API. Mirrors the storefront's mock catalog. */

export const categories = [
  { name: 'Burgers', slug: 'burgers', tagline: 'Stacked, sauced, structurally sound.', order: 1, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=640&q=70&auto=format&fit=crop' },
  { name: 'Pizza', slug: 'pizza', tagline: 'Thin base, loud toppings.', order: 2, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=640&q=70&auto=format&fit=crop' },
  { name: 'Fries & Sides', slug: 'fries', tagline: 'The supporting cast that steals the scene.', order: 3, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=640&q=70&auto=format&fit=crop' },
  { name: 'Wraps', slug: 'wraps', tagline: 'Everything good, rolled tight.', order: 4, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=640&q=70&auto=format&fit=crop' },
  { name: 'Sandwiches', slug: 'sandwiches', tagline: 'Toasted, pressed, non-negotiable.', order: 5, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=640&q=70&auto=format&fit=crop' },
  { name: 'Shakes & Drinks', slug: 'beverages', tagline: 'Cold, thick, slightly show-off.', order: 6, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=640&q=70&auto=format&fit=crop' },
  { name: 'Desserts', slug: 'desserts', tagline: 'The reward at the end of the queue.', order: 7, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=640&q=70&auto=format&fit=crop' },
  { name: 'Combos', slug: 'combos', tagline: 'Full meal, one tap, less maths.', order: 8, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=640&q=70&auto=format&fit=crop' },
];

const size = (deltas = [0, 60, 120]) => ({
  id: 'grp_size',
  name: 'Size',
  required: true,
  multiple: false,
  choices: [
    { id: 'size_reg', label: 'Regular', priceDelta: deltas[0], isDefault: true },
    { id: 'size_large', label: 'Large', priceDelta: deltas[1] },
    { id: 'size_mega', label: 'Mega Byte', priceDelta: deltas[2] },
  ],
});

const sauce = {
  id: 'grp_sauce',
  name: 'Sauce',
  required: true,
  multiple: false,
  choices: [
    { id: 'sauce_house', label: 'Byte house sauce', priceDelta: 0, isDefault: true },
    { id: 'sauce_smoky', label: 'Smoky chipotle', priceDelta: 15 },
    { id: 'sauce_garlic', label: 'Burnt garlic aioli', priceDelta: 15 },
  ],
};

const burgerAddOns = [
  { id: 'add_patty', label: 'Extra patty', price: 80 },
  { id: 'add_cheese', label: 'Extra cheese slice', price: 30 },
  { id: 'add_bacon', label: 'Smoked bacon', price: 60 },
  { id: 'add_jalapeno', label: 'Jalapeños', price: 20 },
  { id: 'add_fries', label: 'Side of fries', price: 90 },
];

export const products = [
  { name: 'Double Trouble', slug: 'double-trouble', category: 'burgers', price: 319, isVeg: false, isBestseller: false, isFeatured: true, spiceLevel: 2, kcal: 860, prepTimeMins: 10, rating: 4.8, ratingCount: 0, description: 'Two crispy chicken patties, one classic and one glazed sweet & spicy, with melted cheese, lettuce and house sauce.', longDescription: 'Two crispy chicken patties, one classic and one coated in our signature sweet & spicy glaze, stacked with melted cheese, fresh lettuce and creamy house sauce. Double the crunch, double the trouble.', image: '/products/double-trouble.jpg', ingredients: ['Crispy chicken patty', 'Sweet & spicy glazed chicken patty', 'Melted cheese', 'Fresh lettuce', 'House sauce'], tags: ['chicken', 'double', 'spicy', 'crispy'], optionGroups: [size([0, 70, 140]), sauce], addOns: burgerAddOns },
  { name: 'Hot Honey Hush', slug: 'hot-honey-hush', category: 'burgers', price: 289, isVeg: false, isBestseller: false, isFeatured: true, spiceLevel: 2, kcal: 720, prepTimeMins: 10, rating: 4.8, ratingCount: 0, description: 'Crispy chicken tossed in a sweet & spicy Korean-inspired BBQ glaze, finished with cheese, lettuce, onions and creamy sauce.', longDescription: 'Crispy chicken tossed in a sweet & spicy Korean-inspired BBQ glaze, finished with melted cheese, fresh lettuce, onions and our creamy house sauce. Sticky, smoky and a little bit loud.', image: '/products/hot-honey-hush.jpg', ingredients: ['Crispy chicken', 'Korean-inspired BBQ glaze', 'Cheese', 'Lettuce', 'Onions', 'Creamy sauce'], tags: ['chicken', 'spicy', 'sweet', 'crispy'], optionGroups: [size([0, 60, 120]), sauce], addOns: burgerAddOns },
  { name: 'The OG Smash', slug: 'og-smash', category: 'burgers', price: 299, isVeg: false, isBestseller: false, isFeatured: true, spiceLevel: 0, kcal: 780, prepTimeMins: 9, rating: 4.8, ratingCount: 0, description: 'Juicy smashed chicken patties with melted cheese, slow-caramelized onions, fresh onions and house sauce.', longDescription: 'Juicy smashed chicken patties layered with melted cheese, slow-caramelized onions, fresh onions and our creamy house sauce, stacked inside a toasted sesame bun.', image: '/products/og-smash.jpg', ingredients: ['Smashed chicken patties', 'Melted cheese', 'Caramelized onions', 'Fresh onion', 'House sauce', 'Sesame bun'], tags: ['chicken', 'smash', 'cheese'], optionGroups: [size([0, 70, 140]), sauce], addOns: burgerAddOns },
  { name: 'The OG Crunch', slug: 'og-crunch', category: 'burgers', price: 269, isVeg: false, isBestseller: false, isFeatured: false, spiceLevel: 0, kcal: 690, prepTimeMins: 8, rating: 4.7, ratingCount: 0, description: 'Golden crispy chicken with melted cheese, fresh lettuce and creamy house slaw in a toasted brioche bun.', longDescription: 'Golden crispy chicken layered with melted cheese, fresh lettuce and creamy house slaw, stacked inside a soft toasted brioche bun. Simple, saucy and seriously crunchy.', image: '/products/og-crunch.jpg', ingredients: ['Golden crispy chicken', 'Melted cheese', 'Fresh lettuce', 'House slaw', 'Brioche bun'], tags: ['chicken', 'crispy', 'slaw'], optionGroups: [size([0, 60, 120]), sauce], addOns: burgerAddOns },
  { name: 'The Tender Tub', slug: 'tender-tub', category: 'fries', price: 249, isVeg: false, isBestseller: false, isFeatured: false, spiceLevel: 1, kcal: 820, prepTimeMins: 9, rating: 4.8, ratingCount: 0, description: 'Crispy, juicy chicken tenders seasoned to perfection with our signature creamy dipping sauce. Crunch, dip, repeat.', longDescription: 'Crispy, juicy chicken tenders seasoned to perfection and served in a tub with our signature creamy dipping sauce. Crunch, dip, repeat.', image: '/products/tender-tub.jpg', ingredients: ['Chicken tenders', 'Seasoned crumb', 'Signature creamy dip'], tags: ['chicken', 'tenders', 'shareable', 'crispy'], optionGroups: [], addOns: [{ id: 'add_extra_dip', label: 'Extra signature dip', price: 25 }] },
  { name: 'Chipotle Cluck', slug: 'chipotle-cluck', category: 'burgers', price: 259, isVeg: false, isBestseller: false, isFeatured: false, spiceLevel: 2, kcal: 650, prepTimeMins: 8, rating: 4.7, ratingCount: 0, description: 'Crispy chicken with lettuce and onions, finished with creamy smoky chipotle sauce in a toasted bun.', longDescription: 'Crispy chicken loaded with fresh lettuce and onions, finished with our creamy, smoky chipotle sauce inside a toasted bun. Smoky, saucy with just the right kick.', image: '/products/chipotle-cluck.jpg', ingredients: ['Crispy chicken', 'Fresh lettuce', 'Onions', 'Smoky chipotle sauce', 'Toasted bun'], tags: ['chicken', 'spicy', 'smoky'], optionGroups: [size([0, 60, 120]), sauce], addOns: burgerAddOns },
];

export const offers = [
  { title: 'Buy 1 Get 1 — Classic Byte', description: 'Every Tuesday & Wednesday. Add two Classic Bytes, pay for one.', code: 'DOUBLECLICK', type: 'bogo', value: 100, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=70&auto=format&fit=crop', accent: 'primary', badge: 'BOGO', isActive: true },
  { title: 'Student Rate — 20% off', description: 'Valid .edu email or a student ID at pickup.', code: 'CAMPUS20', type: 'percent', value: 20, minOrder: 199, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=70&auto=format&fit=crop', accent: 'secondary', badge: 'STUDENT', isActive: true },
  { title: 'Weekend Combo Drop — ₹99 off', description: 'Flat ₹99 off any Combo, Sat & Sun.', code: 'WEEKEND99', type: 'flat', value: 99, minOrder: 349, image: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?w=800&q=70&auto=format&fit=crop', accent: 'accent', badge: 'WEEKEND', isActive: true },
  { title: 'First Byte — ₹75 off your first order', description: '₹75 off when you spend ₹249+ on your first run.', code: 'FIRSTBYTE', type: 'flat', value: 75, minOrder: 249, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=70&auto=format&fit=crop', accent: 'primary', badge: 'NEW', isActive: true },
  { title: 'Free shake over ₹699', description: 'Spend ₹699 and a Dark Mode Shake lands in your bag on the house.', type: 'freebie', value: 179, minOrder: 699, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=70&auto=format&fit=crop', accent: 'secondary', badge: 'FREEBIE', isActive: true },
];

export const reviews = [
];
