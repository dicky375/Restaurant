import { useState } from 'react';
import { Leaf, Star, Search } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'starters' | 'mains' | 'desserts' | 'drinks';
  isVeg: boolean;
  isChefSpecial?: boolean;
};

const menuItems: MenuItem[] = [
  // Starters
  {
    id: 1,
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons, and our signature Caesar dressing',
    price: 12,
    image: 'https://images.unsplash.com/photo-1739436776460-35f309e3f887?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWVzYXIlMjBzYWxhZCUyMGZyZXNofGVufDF8fHx8MTc2NDM2MjExMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'starters',
    isVeg: true
  },
  {
    id: 2,
    name: 'Seafood Platter',
    description: 'Fresh oysters, shrimp, calamari, and mussels served with cocktail sauce',
    price: 24,
    image: 'https://images.unsplash.com/photo-1519351635902-7c60d09cb2ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwcGxhdHRlcnxlbnwxfHx8fDE3NjQzMjIxMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'starters',
    isVeg: false,
    isChefSpecial: true
  },
  {
    id: 3,
    name: 'Bruschetta Trio',
    description: 'Classic tomato basil, mushroom truffle, and roasted pepper on grilled bread',
    price: 14,
    image: 'https://images.unsplash.com/photo-1761095596765-c8abe01d3aea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwZm9vZCUyMHBsYXRpbmd8ZW58MXx8fHwxNzY0Mzk3NTU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'starters',
    isVeg: true
  },
  // Main Courses
  {
    id: 4,
    name: 'Truffle Pasta',
    description: 'Fresh pasta with black truffle, wild mushrooms, and parmesan in a creamy sauce',
    price: 32,
    image: 'https://images.unsplash.com/photo-1676300184847-4ee4030409c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2glMjBnb3VybWV0fGVufDF8fHx8MTc2NDMwMzU1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'mains',
    isVeg: true,
    isChefSpecial: true
  },
  {
    id: 5,
    name: 'Prime Ribeye Steak',
    description: '16oz premium aged ribeye, garlic mashed potatoes, seasonal vegetables, red wine reduction',
    price: 48,
    image: 'https://images.unsplash.com/photo-1758157835975-1cb4947750df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVhayUyMGRpbm5lciUyMHByZW1pdW18ZW58MXx8fHwxNzY0Mzk3NTYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'mains',
    isVeg: false,
    isChefSpecial: true
  },
  {
    id: 6,
    name: 'Pan-Seared Salmon',
    description: 'Atlantic salmon fillet with lemon butter, asparagus, and herb rice',
    price: 36,
    image: 'https://images.unsplash.com/photo-1519351635902-7c60d09cb2ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwcGxhdHRlcnxlbnwxfHx8fDE3NjQzMjIxMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'mains',
    isVeg: false
  },
  {
    id: 7,
    name: 'Vegetarian Risotto',
    description: 'Creamy arborio rice with seasonal vegetables, parmesan, and fresh herbs',
    price: 28,
    image: 'https://images.unsplash.com/photo-1761095596765-c8abe01d3aea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwZm9vZCUyMHBsYXRpbmd8ZW58MXx8fHwxNzY0Mzk3NTU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'mains',
    isVeg: true
  },
  // Desserts
  {
    id: 8,
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, vanilla ice cream, and berry compote',
    price: 12,
    image: 'https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2hvY29sYXRlJTIwY2FrZXxlbnwxfHx8fDE3NjQzMTIzODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'desserts',
    isVeg: true,
    isChefSpecial: true
  },
  {
    id: 9,
    name: 'Tiramisu',
    description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream',
    price: 10,
    image: 'https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2hvY29sYXRlJTIwY2FrZXxlbnwxfHx8fDE3NjQzMTIzODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'desserts',
    isVeg: true
  },
  {
    id: 10,
    name: 'Crème Brûlée',
    description: 'Vanilla bean custard with caramelized sugar crust and fresh berries',
    price: 11,
    image: 'https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2hvY29sYXRlJTIwY2FrZXxlbnwxfHx8fDE3NjQzMTIzODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'desserts',
    isVeg: true
  },
  // Drinks
  {
    id: 11,
    name: 'Signature Cocktail',
    description: 'House special with premium spirits, fresh citrus, and botanical infusions',
    price: 14,
    image: 'https://images.unsplash.com/photo-1650691960684-c15e3e2d5c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGRyaW5rJTIwYmFyfGVufDF8fHx8MTc2NDM5NzU2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'drinks',
    isVeg: true,
    isChefSpecial: true
  },
  {
    id: 12,
    name: 'Fine Wine Selection',
    description: 'Curated selection of red, white, and sparkling wines from renowned vineyards',
    price: 12,
    image: 'https://images.unsplash.com/photo-1650691960684-c15e3e2d5c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGRyaW5rJTIwYmFyfGVufDF8fHx8MTc2NDM5NzU2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'drinks',
    isVeg: true
  },
  {
    id: 13,
    name: 'Artisan Coffee',
    description: 'Freshly brewed espresso, cappuccino, or latte with premium beans',
    price: 5,
    image: 'https://images.unsplash.com/photo-1650691960684-c15e3e2d5c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGRyaW5rJTIwYmFyfGVufDF8fHx8MTc2NDM5NzU2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'drinks',
    isVeg: true
  }
];

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const MenuItemCard = ({ item }: { item: MenuItem }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 overflow-hidden">
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            {item.isChefSpecial && (
              <Badge className="bg-amber-600 hover:bg-amber-700">
                <Star className="w-3 h-3 mr-1" />
                Chef's Special
              </Badge>
            )}
          </div>
          <div className="absolute top-3 left-3">
            {item.isVeg ? (
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <div className="w-5 h-5 border-2 border-green-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <div className="w-5 h-5 border-2 border-red-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-900">{item.name}</h3>
            <span className="text-amber-600">${item.price}</span>
          </div>
          <p className="text-sm text-gray-600">{item.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4">Our Menu</h1>
          <p className="text-xl text-gray-600 mb-8">
            Crafted with passion, served with excellence
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center gap-6 mb-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-green-600 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            <span className="text-gray-600">Vegetarian</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-red-600 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            </div>
            <span className="text-gray-600">Non-Vegetarian</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-amber-600 text-amber-600" />
            <span className="text-gray-600">Chef's Special</span>
          </div>
        </div>

        {/* Menu Tabs */}
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="starters">Starters</TabsTrigger>
            <TabsTrigger value="mains">Main Course</TabsTrigger>
            <TabsTrigger value="desserts">Desserts</TabsTrigger>
            <TabsTrigger value="drinks">Drinks</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {/* Starters */}
            <div className="mb-12">
              <h2 className="text-3xl mb-6">Starters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.filter(item => item.category === 'starters').map(item => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Main Courses */}
            <div className="mb-12">
              <h2 className="text-3xl mb-6">Main Course</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.filter(item => item.category === 'mains').map(item => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Desserts */}
            <div className="mb-12">
              <h2 className="text-3xl mb-6">Desserts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.filter(item => item.category === 'desserts').map(item => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Drinks */}
            <div className="mb-12">
              <h2 className="text-3xl mb-6">Drinks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.filter(item => item.category === 'drinks').map(item => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="starters" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.filter(item => item.category === 'starters').map(item => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mains" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.filter(item => item.category === 'mains').map(item => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="desserts" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.filter(item => item.category === 'desserts').map(item => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="drinks" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.filter(item => item.category === 'drinks').map(item => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No menu items found matching your search.</p>
          </div>
        )}

        {/* Download Menu CTA */}
        <div className="mt-16 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl mb-4">Download Our Full Menu</h2>
          <p className="text-amber-100 mb-6">
            Get our complete menu with seasonal specials and wine pairings
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-white text-amber-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              Download PDF
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Email Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
