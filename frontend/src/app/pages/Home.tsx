import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../contexts/CartContext';
import { Truck, ShieldCheck, Clock, CreditCard } from 'lucide-react';

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setFeaturedProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const newArrivals = featuredProducts.slice(0, 4);
  const featured = featuredProducts.slice(4, 8);

  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    // Simulate API call
    toast.success('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl mb-6">
              Discover Amazing Products
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Shop the latest trends in electronics, fashion, and lifestyle products. Quality guaranteed.
            </p>
            <Link to="/products">
              <Button size="lg" className="gap-2">
                Shop Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">New Arrivals</h2>
              <p className="text-gray-600">Freshly added items for you</p>
            </div>
            <Link to="/products">
              <Button variant="outline">Browse All</Button>
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <p>Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Electronics', color: 'bg-blue-500' },
              { name: 'Fashion', color: 'bg-pink-500' },
              { name: 'Home & Living', color: 'bg-green-500' },
              { name: 'Accessories', color: 'bg-purple-500' }
            ].map((cat) => (
              <Link
                key={cat.name}
                to="/products"
                className="group relative overflow-hidden rounded-xl h-40 flex items-center justify-center text-white"
              >
                <div className={`absolute inset-0 ${cat.color} opacity-90 group-hover:scale-110 transition-transform duration-500`}></div>
                <h3 className="relative text-2xl font-bold z-10">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Editor's Choice</h2>
            <p className="text-gray-600">Handpicked items of the week</p>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <p>Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Shop With Us */}
      <section className="bg-white py-16 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: ShieldCheck, title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: Clock, title: '24/7 Support', desc: 'Ready to help you anytime' },
              { icon: CreditCard, title: 'Easy Returns', desc: '30-day money back guarantee' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <item.icon className="h-10 w-10 mb-4 text-gray-800" />
                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl mb-4">Join Our Community</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get exclusive deals, early access to new products, and special discounts.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-2 rounded-lg w-full sm:w-80 text-black border-none"
              required
            />
            <Button type="submit" variant="secondary" size="lg">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
