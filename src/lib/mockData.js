/**
 * 📚 LEARNING NOTE: Mock Data
 * 
 * "Mock" means "fake" or "pretend". We use mock data during
 * development so we can build and test our website before
 * connecting to a real database. Later, we'll replace this
 * with data from Supabase!
 * 
 * Each product has "variants" — different sizes (S, M, L)
 * with different prices and stock counts.
 */

export const PRODUCTS = [
  {
    id: "prod-1",
    name: "Ocean Friends",
    description: "Dive into a world of adorable sea creatures! Each bag contains tiny handcrafted ocean animals — from cute dolphins to sparkly starfish.",
    theme: "animals",
    hints: "🐠 Something fishy, 🐚 Something shelly, ✨ Something sparkly",
    images: ["/images/placeholder-ocean.png"],
    is_featured: true,
    is_active: true,
    variants: [
      { id: "var-1a", size: "small", price: 50, stock_count: 8 },
      { id: "var-1b", size: "medium", price: 75, stock_count: 5 },
      { id: "var-1c", size: "large", price: 100, stock_count: 3 },
    ],
  },
  {
    id: "prod-2",
    name: "Enchanted Garden",
    description: "A magical garden in a bag! Discover tiny flowers, butterflies, and maybe even a fairy or two hidden inside.",
    theme: "fantasy",
    hints: "🌸 Something blooming, 🦋 Something fluttery, 🧚 Something magical",
    images: ["/images/placeholder-garden.png"],
    is_featured: true,
    is_active: true,
    variants: [
      { id: "var-2a", size: "small", price: 50, stock_count: 10 },
      { id: "var-2b", size: "medium", price: 75, stock_count: 6 },
      { id: "var-2c", size: "large", price: 100, stock_count: 4 },
    ],
  },
  {
    id: "prod-3",
    name: "Sweet Treats Bakery",
    description: "The cutest miniature bakery treats you've ever seen! Tiny cakes, cookies, and pastries — all handmade with love.",
    theme: "food",
    hints: "🧁 Something sweet, 🍪 Something crunchy, 🎂 Something layered",
    images: ["/images/placeholder-bakery.png"],
    is_featured: true,
    is_active: true,
    variants: [
      { id: "var-3a", size: "small", price: 50, stock_count: 12 },
      { id: "var-3b", size: "medium", price: 75, stock_count: 7 },
      { id: "var-3c", size: "large", price: 100, stock_count: 2 },
    ],
  },
  {
    id: "prod-4",
    name: "Space Explorers",
    description: "Blast off into space! Tiny rockets, planets, and astronauts await you in this cosmic blind bag.",
    theme: "space",
    hints: "🚀 Something fast, 🌙 Something glowing, 👽 Something mysterious",
    images: ["/images/placeholder-space.png"],
    is_featured: false,
    is_active: true,
    variants: [
      { id: "var-4a", size: "small", price: 50, stock_count: 6 },
      { id: "var-4b", size: "medium", price: 75, stock_count: 4 },
      { id: "var-4c", size: "large", price: 100, stock_count: 3 },
    ],
  },
  {
    id: "prod-5",
    name: "Dino World",
    description: "Roar! Travel back in time with adorable miniature dinosaurs. Each one is hand-painted and full of personality!",
    theme: "animals",
    hints: "🦕 Something tall, 🦖 Something fierce, 🌿 Something green",
    images: ["/images/placeholder-dino.png"],
    is_featured: true,
    is_active: true,
    variants: [
      { id: "var-5a", size: "small", price: 50, stock_count: 9 },
      { id: "var-5b", size: "medium", price: 75, stock_count: 5 },
      { id: "var-5c", size: "large", price: 100, stock_count: 1 },
    ],
  },
  {
    id: "prod-6",
    name: "Rainbow Unicorns",
    description: "Everything sparkles in this magical unicorn bag! Glitter, rainbows, and the cutest tiny unicorns you've ever seen.",
    theme: "fantasy",
    hints: "🦄 Something magical, 🌈 Something colourful, ✨ Something glittery",
    images: ["/images/placeholder-unicorn.png"],
    is_featured: false,
    is_active: true,
    variants: [
      { id: "var-6a", size: "small", price: 50, stock_count: 11 },
      { id: "var-6b", size: "medium", price: 75, stock_count: 8 },
      { id: "var-6c", size: "large", price: 100, stock_count: 5 },
    ],
  },
];

export const THEMES = [
  { id: "all", label: "All", emoji: "🎁" },
  { id: "animals", label: "Animals", emoji: "🐾" },
  { id: "fantasy", label: "Fantasy", emoji: "🧚" },
  { id: "food", label: "Food", emoji: "🧁" },
  { id: "space", label: "Space", emoji: "🚀" },
];

export const SIZES = [
  { id: "small", label: "Small", short: "S" },
  { id: "medium", label: "Medium", short: "M" },
  { id: "large", label: "Large", short: "L" },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Aunt Priya",
    text: "My daughter absolutely LOVED the Ocean Friends bag! The tiny starfish was her favourite. Ordering more! 🌟",
    emoji: "😍",
  },
  {
    id: 2,
    name: "Uncle Raj",
    text: "These girls are so talented! The miniatures are so detailed. Great surprise for my son's birthday. 🎂",
    emoji: "🎉",
  },
  {
    id: 3,
    name: "Mrs. Sharma (B-204)",
    text: "Such a creative idea! My kids keep asking for more blind bags. The Dino World was a huge hit! 🦕",
    emoji: "💕",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    emoji: "🔍",
    title: "Browse & Pick",
    description: "Explore our collection of handcrafted blind bags. Each one is a surprise!",
  },
  {
    step: 2,
    emoji: "📦",
    title: "Place Your Order",
    description: "Add to cart, enter your details, and your order is confirmed instantly!",
  },
  {
    step: 3,
    emoji: "🎉",
    title: "Get Surprised!",
    description: "Pick up or get it delivered. Open your bag and discover the magic inside!",
  },
];
