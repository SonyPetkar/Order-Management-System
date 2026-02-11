import MenuItem from '../models/MenuItem.js';

const INITIAL_MENU = [
  { 
    name: 'Truffle Burger', price: 15.99, category: 'Burgers', 
    description: 'Wagyu beef with truffle oil.', 
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 
    isAvailable: true,
    moodTags: ['Celebrating', 'Hungover'],
    ingredients: [{ name: 'Wagyu Beef', origin: 'Hyogo, Japan' }, { name: 'Truffle Oil', origin: 'Alba, Italy' }]
  },
  { 
    name: 'Margherita Pizza', price: 12.50, category: 'Pizza', 
    description: 'Fresh basil and buffalo mozzarella.', 
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3', 
    isAvailable: true,
    moodTags: ['Lazy', 'Celebrating'],
    ingredients: [{ name: 'Mozzarella', origin: 'Campania, Italy' }]
  },
  { 
    name: 'Pasta Carbonara', price: 14.00, category: 'Pasta', 
    description: 'Creamy sauce with crispy pancetta.', 
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3', 
    isAvailable: true,
    moodTags: ['Hungover', 'Lazy'],
    ingredients: [{ name: 'Pancetta', origin: 'Emilia-Romagna' }]
  },
  { 
    name: 'Caesar Salad', price: 9.99, category: 'Salads', 
    description: 'Romaine lettuce with parmesan.', 
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9', 
    isAvailable: true,
    moodTags: ['Healthy'],
    ingredients: [{ name: 'Romaine', origin: 'California Central Valley' }]
  },
  { 
    name: 'Sushi Platter', price: 22.00, category: 'Japanese', 
    description: 'Chef selection of fresh rolls.', 
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 
    isAvailable: true,
    moodTags: ['Celebrating', 'Healthy'],
    ingredients: [{ name: 'Bluefin Tuna', origin: 'Toyosu Market, Tokyo' }]
  },
  { 
    name: 'Chicken Wings', price: 11.00, category: 'Appetizers', 
    description: 'Spicy buffalo sauce with dip.', 
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f', 
    isAvailable: true,
    moodTags: ['Celebrating', 'Hungover']
  },
  { 
    name: 'Chocolate Lava Cake', price: 7.50, category: 'Dessert', 
    description: 'Warm chocolate center.', 
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', 
    isAvailable: true,
    moodTags: ['Celebrating', 'Lazy']
  },
  { 
    name: 'Garlic Bread', price: 4.99, category: 'Appetizers', 
    description: 'Toasted with herb butter.', 
    image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c', 
    isAvailable: true,
    moodTags: ['Lazy']
  },
  { 
    name: 'Mango Smoothie', price: 5.50, category: 'Drinks', 
    description: 'Fresh mango and yogurt.', 
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4', 
    isAvailable: true,
    moodTags: ['Healthy', 'Tired']
  },
  { 
    name: 'BBQ Ribs', price: 19.99, category: 'Mains', 
    description: 'Slow cooked pork ribs.', 
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947', 
    isAvailable: true,
    moodTags: ['Celebrating', 'Lazy']
  },
  { 
    name: 'Avocado Toast', price: 10.50, category: 'Breakfast', 
    description: 'Sourdough with poached egg.', 
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8', 
    isAvailable: true,
    moodTags: ['Healthy', 'Tired'],
    ingredients: [{ name: 'Hass Avocado', origin: 'Michoacán, Mexico' }]
  },
  { 
    name: 'Pepperoni Pizza', price: 13.99, category: 'Pizza', 
    description: 'Classic spicy pepperoni.', 
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e', 
    isAvailable: true,
    moodTags: ['Hungover', 'Celebrating']
  },
  { 
    name: 'Ribeye Steak', price: 28.00, category: 'Mains', 
    description: 'Grilled with rosemary butter.', 
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e', 
    isAvailable: true,
    moodTags: ['Celebrating']
  },
  { 
    name: 'Greek Salad', price: 10.00, category: 'Salads', 
    description: 'Feta, olives, and cucumber.', 
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe', 
    isAvailable: true,
    moodTags: ['Healthy']
  },
  { 
    name: 'Iced Caramel Latte', price: 4.50, category: 'Drinks', 
    description: 'Espresso with caramel drizzle.', 
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 
    isAvailable: true,
    moodTags: ['Tired'],
    ingredients: [{ name: 'Coffee Beans', origin: 'Ethiopian Highlands' }]
  },
  { 
    name: 'Fish and Chips', price: 16.50, category: 'Mains', 
    description: 'Crispy cod with tartar sauce.', 
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2', 
    isAvailable: true,
    moodTags: ['Hungover', 'Lazy']
  },
  { 
    name: 'Shrimp Tacos', price: 14.50, category: 'Mexican', 
    description: 'Zesty shrimp with lime slaw.', 
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', 
    isAvailable: true,
    moodTags: ['Healthy', 'Celebrating']
  },
  { 
    name: 'Red Velvet Cupcake', price: 3.99, category: 'Dessert', 
    description: 'Cream cheese frosting.', 
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814', 
    isAvailable: true,
    moodTags: ['Celebrating']
  },
  { 
    name: 'Paneer Tikka', price: 12.00, category: 'Indian', 
    description: 'Grilled cottage cheese cubes.', 
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0', 
    isAvailable: true,
    moodTags: ['Healthy', 'Lazy']
  },
  { 
    name: 'Dim Sum Box', price: 18.00, category: 'Chinese', 
    description: 'Variety of steamed dumplings.', 
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c', 
    isAvailable: true,
    moodTags: ['Healthy', 'Lazy']
  }
];

export const getMenu = async (req, res) => {
  try {
    let items = await MenuItem.find({ isAvailable: true });
    
    if (!items || items.length === 0) {
      console.log("Database menu empty. Seeding INITIAL_MENU...");
      items = await MenuItem.insertMany(INITIAL_MENU);
    }

    return res.status(200).json(items);

  } catch (err) {
    console.error("Database error, using In-Memory fallback:", err.message);
    
    const fallbackWithIds = INITIAL_MENU.map((item, index) => ({
      ...item,
      _id: `fallback_${index}` 
    }));

    res.status(200).json(fallbackWithIds);
  }
};