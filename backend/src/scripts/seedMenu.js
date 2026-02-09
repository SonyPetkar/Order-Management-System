const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
require('dotenv').config();

const menuData = [
  {
    name: "Truffle Mushroom Burger",
    description: "Wagyu beef, swiss cheese, and wild truffle aioli.",
    price: 16.50,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    category: "Burgers"
  },
  {
    name: "Artisan Margherita Pizza",
    description: "San Marzano tomatoes, fresh buffalo mozzarella, and basil.",
    price: 14.00,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
    category: "Pizza"
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await MenuItem.deleteMany();
    await MenuItem.insertMany(menuData);
    console.log("Menu Seeded Successfully");
    process.exit();
  });