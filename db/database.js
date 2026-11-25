const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial rich seed data
const initialData = {
  users: [
    {
      id: "usr_demo_customer",
      name: "Alex Rivera",
      email: "demo@foodie.com",
      phone: "+1 (555) 382-9912",
      role: "customer",
      isDemo: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      createdAt: new Date().toISOString(),
      addresses: [
        {
          id: "addr_1",
          label: "Home",
          receiverName: "Alex Rivera",
          phone: "+1 (555) 382-9912",
          street: "742 Evergreen Terrace, Apt 4B",
          city: "Metro City",
          state: "CA",
          zip: "90210",
          isDefault: true
        },
        {
          id: "addr_2",
          label: "Work",
          receiverName: "Alex Rivera",
          phone: "+1 (555) 382-9912",
          street: "800 Cyberway Blvd, Tech Park, Suite 12",
          city: "Metro City",
          state: "CA",
          zip: "90212",
          isDefault: false
        }
      ],
      favorites: ["food_1", "food_4", "food_9", "food_14"]
    },
    {
      id: "usr_demo_admin",
      name: "Chef Marcus Vance",
      email: "admin@foodie.com",
      phone: "+1 (555) 774-8833",
      role: "admin",
      isDemo: true,
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80",
      createdAt: new Date().toISOString(),
      addresses: [],
      favorites: []
    }
  ],
  categories: [
    {
      id: "cat_pizza",
      slug: "pizza",
      name: "Pizza",
      description: "Artisan wood-fired pizzas with artisanal cheese and crispy crusts",
      icon: "🍕",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cat_burgers",
      slug: "burgers",
      name: "Burgers",
      description: "Juicy gourmet smashed patties, brioche buns, and melted cheddar",
      icon: "🍔",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cat_biryani",
      slug: "biryani",
      name: "Biryani",
      description: "Fragrant saffron basmati rice slow-cooked with tender aromatic meats",
      icon: "🍚",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cat_chinese",
      slug: "chinese",
      name: "Chinese",
      description: "Sizzling wok-tossed noodles, dumplings, and spicy Sichuan bowls",
      icon: "🥡",
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cat_south_indian",
      slug: "south-indian",
      name: "South Indian",
      description: "Golden crispy dosas, fluffy idlis, and traditional rich sambar",
      icon: "🥞",
      image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cat_north_indian",
      slug: "north-indian",
      name: "North Indian",
      description: "Creamy butter paneer, smoked tandoori kebabs, and garlic naans",
      icon: "🥘",
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cat_desserts",
      slug: "desserts",
      name: "Desserts",
      description: "Decadent chocolate lava cakes, artisanal pastries, and gulab jamun",
      icon: "🍰",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cat_beverages",
      slug: "beverages",
      name: "Beverages",
      description: "Refreshing cold brews, fruity mocktails, and fresh pressed juices",
      icon: "🍹",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80"
    }
  ],
  restaurants: [
    {
      id: "rest_1",
      name: "Royal Biryani Durbar",
      rating: 4.9,
      deliveryTime: "25-30 min",
      priceRange: "$$",
      cuisine: "Biryani • Mughlai • Kebabs",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
      featured: true,
      tag: "Top Rated"
    },
    {
      id: "rest_2",
      name: "Artisan Woodfired Pizza",
      rating: 4.8,
      deliveryTime: "20-25 min",
      priceRange: "$$$",
      cuisine: "Italian • Pizza • Pastas",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
      featured: true,
      tag: "Chef Curated"
    },
    {
      id: "rest_3",
      name: "The Smashed Burger Co.",
      rating: 4.7,
      deliveryTime: "15-20 min",
      priceRange: "$",
      cuisine: "American • Burgers • Shakes",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80",
      featured: true,
      tag: "Super Fast"
    },
    {
      id: "rest_4",
      name: "Golden Dragon Wok",
      rating: 4.8,
      deliveryTime: "25-35 min",
      priceRange: "$$",
      cuisine: "Chinese • Dim Sum • Noodles",
      image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80",
      featured: true,
      tag: "Trending"
    },
    {
      id: "rest_5",
      name: "Dakshin Delight Tiffin",
      rating: 4.9,
      deliveryTime: "20-30 min",
      priceRange: "$",
      cuisine: "South Indian • Dosas • Filter Coffee",
      image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80",
      featured: true,
      tag: "Authentic"
    }
  ],
  foods: [
    // Pizza
    {
      id: "food_1",
      name: "Truffle Burrata Margherita",
      category: "pizza",
      restaurantId: "rest_2",
      restaurantName: "Artisan Woodfired Pizza",
      price: 18.99,
      rating: 4.9,
      reviewsCount: 320,
      description: "San Marzano tomatoes, fresh Italian burrata, black truffle oil drizzle, fresh basil on charred sourdough crust.",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80",
      isVeg: true,
      prepTime: "18-22 min",
      isAvailable: true,
      isBestseller: true,
      isRecommended: true
    },
    {
      id: "food_2",
      name: "Spicy Diavola Pepperoni Feast",
      category: "pizza",
      restaurantId: "rest_2",
      restaurantName: "Artisan Woodfired Pizza",
      price: 19.50,
      rating: 4.8,
      reviewsCount: 410,
      description: "Crispy beef pepperoni cups, hot Calabrian chili honey, smoked mozzarella, and garlic confit.",
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80",
      isVeg: false,
      prepTime: "15-20 min",
      isAvailable: true,
      isBestseller: true,
      isRecommended: false
    },
    {
      id: "food_3",
      name: "BBQ Smoked Chicken & Corn",
      category: "pizza",
      restaurantId: "rest_2",
      restaurantName: "Artisan Woodfired Pizza",
      price: 17.95,
      rating: 4.7,
      reviewsCount: 190,
      description: "Tender hickory smoked chicken breast, sweet roasted corn, red onions, cilantro, and tangy Texas BBQ sauce.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80",
      isVeg: false,
      prepTime: "20 min",
      isAvailable: true,
      isBestseller: false,
      isRecommended: true
    },

    // Burgers
    {
      id: "food_4",
      name: "Double Wagyu Smoked Bacon Melt",
      category: "burgers",
      restaurantId: "rest_3",
      restaurantName: "The Smashed Burger Co.",
      price: 16.50,
      rating: 4.9,
      reviewsCount: 540,
      description: "Twin 100% Wagyu smash patties, double aged sharp cheddar, crispy bacon rashers, truffle aioli on toasted brioche.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
      isVeg: false,
      prepTime: "12-15 min",
      isAvailable: true,
      isBestseller: true,
      isRecommended: true
    },
    {
      id: "food_5",
      name: "Crispy Korean Fried Chicken Burger",
      category: "burgers",
      restaurantId: "rest_3",
      restaurantName: "The Smashed Burger Co.",
      price: 14.75,
      rating: 4.8,
      reviewsCount: 290,
      description: "Extra crispy chicken thigh glazed with sweet gochujang sauce, kimchi slaw, pickled daikon, and Kewpie mayo.",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80",
      isVeg: false,
      prepTime: "15 min",
      isAvailable: true,
      isBestseller: true,
      isRecommended: false
    },
    {
      id: "food_6",
      name: "Portobello & Truffle Veggie Burger",
      category: "burgers",
      restaurantId: "rest_3",
      restaurantName: "The Smashed Burger Co.",
      price: 13.99,
      rating: 4.6,
      reviewsCount: 160,
      description: "Grilled jumbo portobello mushroom cap, caramelized balsamic onions, goat cheese, baby arugula on multigrain bun.",
      image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=700&q=80",
      isVeg: true,
      prepTime: "15 min",
      isAvailable: true,
      isBestseller: false,
      isRecommended: true
    },

    // Biryani
    {
      id: "food_7",
      name: "Nawabi Shahi Mutton Dum Biryani",
      category: "biryani",
      restaurantId: "rest_1",
      restaurantName: "Royal Biryani Durbar",
      price: 21.00,
      rating: 4.95,
      reviewsCount: 680,
      description: "Prime bone-in mutton slow-cooked in handi seal with saffron-infused aged basmati, fried onions, served with mirchi ka salan and burani raita.",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80",
      isVeg: false,
      prepTime: "25 min",
      isAvailable: true,
      isBestseller: true,
      isRecommended: true
    },
    {
      id: "food_8",
      name: "Hyderabadi Chicken Dum Biryani",
      category: "biryani",
      restaurantId: "rest_1",
      restaurantName: "Royal Biryani Durbar",
      price: 17.50,
      rating: 4.9,
      reviewsCount: 820,
      description: "Authentic royal spices marinated farm chicken pieces layered with fragrant long grain rice, mint, coriander, and desi ghee.",
      image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=700&q=80",
      isVeg: false,
      prepTime: "20 min",
      isAvailable: true,
      isBestseller: true,
      isRecommended: true
    },
    {
      id: "food_9",
      name: "Zafrani Subz Paneer Biryani",
      category: "biryani",
      restaurantId: "rest_1",
      restaurantName: "Royal Biryani Durbar",
      price: 15.50,
      rating: 4.75,
      reviewsCount: 310,
      description: "Fresh malai paneer cubes, baby corn, green peas, carrots dum-cooked in saffron gravy with rose water aroma.",
      image: "https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=700&q=80",
      isVeg: true,
      prepTime: "20 min",
      isAvailable: true,
      isBestseller: false,
      isRecommended: true
    },

    // Chinese
    {
      id: "food_10",
      name: "Sichuan Chili Garlic Hakka Noodles",
      category: "chinese",
      restaurantId: "rest_4",
      restaurantName: "Golden Dragon Wok",
      price: 13.50,
      rating: 4.8,
      reviewsCount: 390,
      description: "High-heat wok-tossed egg noodles with shredded scallions, bell peppers, crunchy beansprouts and fiery Sichuan chili oil.",
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=700&q=80",
      isVeg: true,
      prepTime: "15 min",
      isAvailable: true,
      isBestseller: true,
      isRecommended: false
    },
    {
      id: "food_11",
      name: "Steamed Prawn & Chive Dim Sum",
      category: "chinese",
      restaurantId: "rest_4",
      restaurantName: "Golden Dragon Wok",
      price: 14.99,
      rating: 4.9,
      reviewsCount: 270,
      description: "Translucent crystal dumplings stuffed with juicy tiger prawns and Chinese chives, served with sweet black chili vinegar.",
      image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=700&q=80",
      isVeg: false,
      prepTime: "15 min",
      isAvailable: true,
      isBestseller: true,
      isRecommended: true
    },
    {
      id: "food_12",
      name: "Crispy Kung Pao Chicken",
      category: "chinese",
      restaurantId: "rest_4",
      restaurantName: "Golden Dragon Wok",
      price: 16.20,
      rating: 4.7,
      reviewsCount: 220,
      description: "Golden fried chicken bites tossed with roasted peanuts, lantern chilies, and tangy soy-ginger glaze.",
      image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=700&q=80",
      isVeg: false,
      prepTime: "18 min",
      isAvailable: true,
      isBestseller: false,
      isRecommended: true
    },

    // South Indian
    {
      id: "food_13",
      name: "Mysore Masala Butter Dosa",
      category: "south-indian",
      restaurantId: "rest_5",
      restaurantName: "Dakshin Delight Tiffin",
      price: 10.99,
      rating: 4.9,
      reviewsCount: 450,
      description: "Crispy golden crepe smeared with spicy red garlic chutney, filled with potato bhaji, served with trio chutneys and piping hot drumstick sambar.",
      image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80",
      isVeg: true,
      prepTime: "12 min",
      isAvailable: true,
      isBestseller: true,
      isRecommended: true
    },
    {
      id: "food_14",
      name: "Steamed Button Ghee Idlis & Medu Vada",
      category: "south-indian",
      restaurantId: "rest_5",
      restaurantName: "Dakshin Delight Tiffin",
      price: 9.50,
      rating: 4.85,
      reviewsCount: 380,
      description: "Melt-in-mouth rice cakes drenched in pure desi ghee and podi gun powder, paired with two crispy golden lentil vadas.",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80",
      isVeg: true,
      prepTime: "10 min",
      isAvailable: true,
      isBestseller: true,
      isRecommended: false
    },
    {
      id: "food_15",
      name: "Chettinad Pepper Chicken Fry",
      category: "south-indian",
      restaurantId: "rest_5",
      restaurantName: "Dakshin Delight Tiffin",
      price: 15.80,
      rating: 4.8,
      reviewsCount: 230,
      description: "Tender chicken cooked with stone-ground Tellicherry black pepper, curry leaves, shallots, and fragrant coconut oil.",
      image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=700&q=80",
      isVeg: false,
      prepTime: "18 min",
      isAvailable: true,
      isBestseller: false,
      isRecommended: true
    },

    // North Indian
    {
      id: "food_16",
      name: "Paneer Butter Masala & Garlic Naan",
      category: "north-indian",
      restaurantId: "rest_1",
      restaurantName: "Royal Biryani Durbar",
      price: 16.50,
      rating: 4.9,
      reviewsCount: 520,
      description: "Soft cottage cheese simmered in rich creamy tomato cashew silk gravy, paired with two fluffy tandoori garlic coriander naans.",
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80",
      isVeg: true,
      prepTime: "20 min",
      isAvailable: true,
      isBestseller: true,
      isRecommended: true
    },
    {
      id: "food_17",
      name: "Smoked Butter Chicken Delhi Style",
      category: "north-indian",
      restaurantId: "rest_1",
      restaurantName: "Royal Biryani Durbar",
      price: 18.00,
      rating: 4.95,
      reviewsCount: 710,
      description: "Clay oven roasted chicken tikka cooked in velvety fenugreek-infused butter tomato sauce with a charcoal smoke finish.",
      image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=700&q=80",
      isVeg: false,
      prepTime: "20 min",
      isAvailable: true,
      isBestseller: true,
      isRecommended: true
    },
    {
      id: "food_18",
      name: "Dal Makhani 24-Hour Slow Cooked",
      category: "north-indian",
      restaurantId: "rest_1",
      restaurantName: "Royal Biryani Durbar",
      price: 13.99,
      rating: 4.8,
      reviewsCount: 340,
      description: "Whole black urad lentils simmered overnight on low charcoal embers with butter, cream, and Kashmiri red chili.",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80",
      isVeg: true,
      prepTime: "15 min",
      isAvailable: true,
      isBestseller: false,
      isRecommended: true
    },

    // Desserts
    {
      id: "food_19",
      name: "Belgian Molten Chocolate Lava Cake",
      category: "desserts",
      restaurantId: "rest_2",
      restaurantName: "Artisan Woodfired Pizza",
      price: 9.99,
      rating: 4.9,
      reviewsCount: 460,
      description: "Warm dark Belgian chocolate cake with a luscious gooey flowing center, paired with a scoop of Madagascar vanilla bean gelato.",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80",
      isVeg: true,
      prepTime: "12 min",
      isAvailable: true,
      isBestseller: true,
      isRecommended: true
    },
    {
      id: "food_20",
      name: "Warm Saffron Gulab Jamun with Rabri",
      category: "desserts",
      restaurantId: "rest_1",
      restaurantName: "Royal Biryani Durbar",
      price: 7.50,
      rating: 4.85,
      reviewsCount: 310,
      description: "Golden fried khoya dumplings soaked in fragrant cardamom rose syrup, crowned with chilled thick pistachio rabri.",
      image: "https://images.unsplash.com/photo-1589119908995-c6837fa14d48?auto=format&fit=crop&w=700&q=80",
      isVeg: true,
      prepTime: "8 min",
      isAvailable: true,
      isBestseller: true,
      isRecommended: false
    },
    {
      id: "food_21",
      name: "New York Salted Caramel Cheesecake",
      category: "desserts",
      restaurantId: "rest_3",
      restaurantName: "The Smashed Burger Co.",
      price: 8.95,
      rating: 4.75,
      reviewsCount: 205,
      description: "Dense and creamy classic cheesecake on buttery Graham cracker crust topped with artisanal Maldon sea salted caramel drizzle.",
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80",
      isVeg: true,
      prepTime: "5 min",
      isAvailable: true,
      isBestseller: false,
      isRecommended: true
    },

    // Beverages
    {
      id: "food_22",
      name: "Fresh Mango Passion Fruit Mocktail",
      category: "beverages",
      restaurantId: "rest_5",
      restaurantName: "Dakshin Delight Tiffin",
      price: 6.50,
      rating: 4.8,
      reviewsCount: 260,
      description: "Crushed Alphonso mango pulp, tangy passion fruit puree, fresh mint leaves, sparkling tonic water, and a lime squeeze.",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80",
      isVeg: true,
      prepTime: "5 min",
      isAvailable: true,
      isBestseller: true,
      isRecommended: true
    },
    {
      id: "food_23",
      name: "Artisan Iced Caramel Macchiato",
      category: "beverages",
      restaurantId: "rest_2",
      restaurantName: "Artisan Woodfired Pizza",
      price: 5.95,
      rating: 4.75,
      reviewsCount: 195,
      description: "Double shot of fresh Arabica espresso layered over chilled whole milk, Madagascar vanilla syrup, and buttery caramel crosshatch.",
      image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=700&q=80",
      isVeg: true,
      prepTime: "5 min",
      isAvailable: true,
      isBestseller: true,
      isRecommended: false
    },
    {
      id: "food_24",
      name: "South Indian Degree Filter Coffee",
      category: "beverages",
      restaurantId: "rest_5",
      restaurantName: "Dakshin Delight Tiffin",
      price: 4.25,
      rating: 4.95,
      reviewsCount: 410,
      description: "Traditional chicory blend decoction frothed high with boiling fresh milk, served in classic brass dabarah and tumbler.",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80",
      isVeg: true,
      prepTime: "5 min",
      isAvailable: true,
      isBestseller: false,
      isRecommended: true
    }
  ],
  coupons: [
    {
      code: "WELCOME50",
      discountPercent: 50,
      maxDiscount: 15,
      minOrder: 20,
      description: "50% OFF up to $15 on your first feast!"
    },
    {
      code: "FOODIE30",
      discountPercent: 30,
      maxDiscount: 12,
      minOrder: 25,
      description: "30% OFF up to $12 for true foodies"
    },
    {
      code: "FEAST20",
      discountPercent: 20,
      maxDiscount: 20,
      minOrder: 30,
      description: "20% OFF on all gourmet family meals"
    },
    {
      code: "FREEDEL",
      discountPercent: 0,
      freeDelivery: true,
      minOrder: 15,
      description: "Free Delivery on orders above $15"
    }
  ],
  orders: [
    {
      id: "ORD-94821",
      userId: "usr_demo_customer",
      customerName: "Alex Rivera",
      customerEmail: "demo@foodie.com",
      customerPhone: "+1 (555) 382-9912",
      items: [
        {
          id: "food_7",
          name: "Nawabi Shahi Mutton Dum Biryani",
          price: 21.00,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80"
        },
        {
          id: "food_22",
          name: "Fresh Mango Passion Fruit Mocktail",
          price: 6.50,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80"
        }
      ],
      subtotal: 55.00,
      discountAmount: 15.00,
      couponCode: "WELCOME50",
      deliveryFee: 0.00,
      taxAmount: 2.00,
      totalAmount: 42.00,
      deliveryAddress: {
        receiverName: "Alex Rivera",
        phone: "+1 (555) 382-9912",
        street: "742 Evergreen Terrace, Apt 4B",
        city: "Metro City",
        state: "CA",
        zip: "90210"
      },
      paymentMethod: "Demo Card Payment (Visa •••• 4242)",
      paymentStatus: "Paid (Demo)",
      // Tracking status: 'placed', 'accepted', 'preparing', 'out_for_delivery', 'delivered'
      status: "out_for_delivery",
      statusStage: 4,
      statusLabel: "Out for Delivery",
      driverName: "Carlos Mendez",
      driverPhone: "+1 (555) 891-2300",
      estimatedDeliveryTime: "12-15 mins",
      createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      history: [
        { stage: 1, title: "Order Placed", time: new Date(Date.now() - 25 * 60 * 1000).toISOString(), note: "Your order was received and confirmed" },
        { stage: 2, title: "Restaurant Accepted", time: new Date(Date.now() - 21 * 60 * 1000).toISOString(), note: "Royal Biryani Durbar accepted your order" },
        { stage: 3, title: "Food Preparing", time: new Date(Date.now() - 15 * 60 * 1000).toISOString(), note: "Chef is packing hot saffron dum biryani" },
        { stage: 4, title: "Out for Delivery", time: new Date(Date.now() - 5 * 60 * 1000).toISOString(), note: "Driver Carlos is speeding towards your door" }
      ]
    },
    {
      id: "ORD-87140",
      userId: "usr_demo_customer",
      customerName: "Alex Rivera",
      customerEmail: "demo@foodie.com",
      customerPhone: "+1 (555) 382-9912",
      items: [
        {
          id: "food_1",
          name: "Truffle Burrata Margherita",
          price: 18.99,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80"
        },
        {
          id: "food_19",
          name: "Belgian Molten Chocolate Lava Cake",
          price: 9.99,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80"
        }
      ],
      subtotal: 28.98,
      discountAmount: 5.80,
      couponCode: "FEAST20",
      deliveryFee: 2.99,
      taxAmount: 1.30,
      totalAmount: 27.47,
      deliveryAddress: {
        receiverName: "Alex Rivera",
        phone: "+1 (555) 382-9912",
        street: "742 Evergreen Terrace, Apt 4B",
        city: "Metro City",
        state: "CA",
        zip: "90210"
      },
      paymentMethod: "Demo UPI (alex@okaxis)",
      paymentStatus: "Paid (Demo)",
      status: "delivered",
      statusStage: 5,
      statusLabel: "Delivered",
      driverName: "Maya Lin",
      driverPhone: "+1 (555) 431-7722",
      estimatedDeliveryTime: "Delivered",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      history: [
        { stage: 1, title: "Order Placed", time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), note: "Order placed successfully" },
        { stage: 2, title: "Restaurant Accepted", time: new Date(Date.now() - 23.8 * 60 * 60 * 1000).toISOString(), note: "Artisan Pizza accepted the order" },
        { stage: 3, title: "Food Preparing", time: new Date(Date.now() - 23.6 * 60 * 60 * 1000).toISOString(), note: "Woodfired oven baking completed" },
        { stage: 4, title: "Out for Delivery", time: new Date(Date.now() - 23.3 * 60 * 60 * 1000).toISOString(), note: "Driver picked up food" },
        { stage: 5, title: "Delivered", time: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(), note: "Delivered with warm smiles" }
      ]
    }
  ]
};

// In-memory cache for fast read/write
let memoryDb = null;

function loadDb() {
  if (memoryDb) return memoryDb;
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDb = JSON.parse(content);
      // Ensure all collections exist
      if (!memoryDb.users) memoryDb.users = initialData.users;
      if (!memoryDb.foods) memoryDb.foods = initialData.foods;
      if (!memoryDb.categories) memoryDb.categories = initialData.categories;
      if (!memoryDb.restaurants) memoryDb.restaurants = initialData.restaurants;
      if (!memoryDb.orders) memoryDb.orders = initialData.orders;
      if (!memoryDb.coupons) memoryDb.coupons = initialData.coupons;
    } else {
      memoryDb = JSON.parse(JSON.stringify(initialData));
      saveDbSync();
    }
  } catch (err) {
    console.error("Error loading DB file, fallback to initial data:", err);
    memoryDb = JSON.parse(JSON.stringify(initialData));
  }
  return memoryDb;
}

function saveDbSync() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), 'utf-8');
  } catch (err) {
    console.error("Failed to save DB file:", err);
  }
}

// User methods
const users = {
  findAll: () => loadDb().users,
  findById: (id) => loadDb().users.find(u => u.id === id),
  findByEmail: (email) => loadDb().users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  create: (userData) => {
    const db = loadDb();
    const newUser = {
      id: userData.id || `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: userData.name || "Foodie Explorer",
      email: userData.email,
      phone: userData.phone || "",
      avatar: userData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      role: userData.role || "customer",
      isDemo: Boolean(userData.isDemo),
      createdAt: new Date().toISOString(),
      addresses: userData.addresses || [],
      favorites: userData.favorites || []
    };
    db.users.push(newUser);
    saveDbSync();
    return newUser;
  },
  update: (id, updates) => {
    const db = loadDb();
    const index = db.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    db.users[index] = { ...db.users[index], ...updates };
    saveDbSync();
    return db.users[index];
  }
};

// Food methods
const foods = {
  findAll: (filter = {}) => {
    let list = [...loadDb().foods];
    if (filter.category && filter.category !== 'all') {
      list = list.filter(f => f.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(f => 
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        (f.restaurantName && f.restaurantName.toLowerCase().includes(q))
      );
    }
    if (filter.vegOnly === 'true' || filter.vegOnly === true) {
      list = list.filter(f => f.isVeg);
    }
    if (filter.maxPrice) {
      list = list.filter(f => f.price <= Number(filter.maxPrice));
    }
    if (filter.sort) {
      if (filter.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
      else if (filter.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
      else if (filter.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
      else if (filter.sort === 'popular') list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }
    return list;
  },
  findById: (id) => loadDb().foods.find(f => f.id === id),
  create: (foodData) => {
    const db = loadDb();
    const newFood = {
      id: `food_${Date.now()}`,
      name: foodData.name,
      category: foodData.category || "pizza",
      restaurantId: foodData.restaurantId || "rest_1",
      restaurantName: foodData.restaurantName || "Royal Gourmet Kitchen",
      price: Number(foodData.price) || 9.99,
      rating: Number(foodData.rating) || 4.8,
      reviewsCount: Number(foodData.reviewsCount) || 10,
      description: foodData.description || "",
      image: foodData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80",
      isVeg: Boolean(foodData.isVeg),
      prepTime: foodData.prepTime || "15-20 min",
      isAvailable: foodData.isAvailable !== undefined ? Boolean(foodData.isAvailable) : true,
      isBestseller: Boolean(foodData.isBestseller),
      isRecommended: Boolean(foodData.isRecommended)
    };
    db.foods.push(newFood);
    saveDbSync();
    return newFood;
  },
  update: (id, updates) => {
    const db = loadDb();
    const idx = db.foods.findIndex(f => f.id === id);
    if (idx === -1) return null;
    db.foods[idx] = { ...db.foods[idx], ...updates };
    saveDbSync();
    return db.foods[idx];
  },
  delete: (id) => {
    const db = loadDb();
    const idx = db.foods.findIndex(f => f.id === id);
    if (idx === -1) return false;
    db.foods.splice(idx, 1);
    saveDbSync();
    return true;
  }
};

// Categories & Restaurants
const categories = {
  findAll: () => loadDb().categories
};

const restaurants = {
  findAll: () => loadDb().restaurants
};

// Coupons
const coupons = {
  findAll: () => loadDb().coupons,
  findByCode: (code) => {
    if (!code) return null;
    return loadDb().coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
  }
};

// Orders
const STAGES = {
  1: { status: "placed", label: "Order Placed" },
  2: { status: "accepted", label: "Restaurant Accepted" },
  3: { status: "preparing", label: "Food Preparing" },
  4: { status: "out_for_delivery", label: "Out for Delivery" },
  5: { status: "delivered", label: "Delivered" }
};

const orders = {
  findAll: (filter = {}) => {
    let list = [...loadDb().orders];
    if (filter.userId) {
      list = list.filter(o => o.userId === filter.userId);
    }
    if (filter.status) {
      list = list.filter(o => o.status === filter.status);
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  findById: (id) => loadDb().orders.find(o => o.id === id),
  create: (orderData) => {
    const db = loadDb();
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();
    
    const newOrder = {
      id: orderId,
      userId: orderData.userId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone || "+1 (555) 000-0000",
      items: orderData.items,
      subtotal: Number(orderData.subtotal),
      discountAmount: Number(orderData.discountAmount || 0),
      couponCode: orderData.couponCode || null,
      deliveryFee: Number(orderData.deliveryFee || 0),
      taxAmount: Number(orderData.taxAmount || 0),
      totalAmount: Number(orderData.totalAmount),
      deliveryAddress: orderData.deliveryAddress,
      paymentMethod: orderData.paymentMethod || "Demo Payment",
      paymentStatus: "Paid (Demo)",
      status: "placed",
      statusStage: 1,
      statusLabel: "Order Placed",
      driverName: "Alex S. (Assigned on dispatch)",
      driverPhone: "+1 (555) 789-0123",
      estimatedDeliveryTime: "25-35 mins",
      createdAt: now,
      updatedAt: now,
      history: [
        {
          stage: 1,
          title: "Order Placed",
          time: now,
          note: "Order has been confirmed and forwarded to the kitchen."
        }
      ]
    };

    db.orders.unshift(newOrder);
    saveDbSync();
    return newOrder;
  },
  updateStatus: (id, stageNum) => {
    const db = loadDb();
    const stage = STAGES[stageNum];
    if (!stage) return null;

    const order = db.orders.find(o => o.id === id);
    if (!order) return null;

    order.status = stage.status;
    order.statusStage = stageNum;
    order.statusLabel = stage.label;
    order.updatedAt = new Date().toISOString();

    if (stageNum === 5) {
      order.estimatedDeliveryTime = "Delivered";
    }

    const stageNotes = {
      1: "Order received by restaurant.",
      2: "Restaurant confirmed and accepted the order.",
      3: "Kitchen is preparing fresh ingredients.",
      4: "Driver is on the way to your delivery address.",
      5: "Package handed over. Enjoy your meal!"
    };

    // Avoid duplicate history stage
    if (!order.history.some(h => h.stage === stageNum)) {
      order.history.push({
        stage: stageNum,
        title: stage.label,
        time: new Date().toISOString(),
        note: stageNotes[stageNum]
      });
    }

    saveDbSync();
    return order;
  }
};

// Summary analytics for Admin
function getAdminStats() {
  const db = loadDb();
  const totalCustomers = db.users.filter(u => u.role === 'customer').length;
  const totalFoods = db.foods.length;
  const totalOrders = db.orders.length;
  const totalRevenue = db.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = db.orders.filter(o => o.statusStage < 5).length;
  const completedOrders = db.orders.filter(o => o.statusStage === 5).length;

  return {
    totalCustomers,
    totalFoods,
    totalOrders,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    pendingOrders,
    completedOrders
  };
}

// Initialize on startup
loadDb();

module.exports = {
  users,
  foods,
  categories,
  restaurants,
  coupons,
  orders,
  getAdminStats,
  STAGES
};
