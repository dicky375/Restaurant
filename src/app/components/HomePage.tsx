import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Phone, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import TestimonialsSlider from './TestimonialsSlider';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1744776411221-702f2848b0b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY0Mjg4NzkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Luxury restaurant interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl mb-6">
              Experience Fine Dining at Its Best
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Discover exquisite flavors, impeccable service, and an unforgettable ambiance at La Bella. Reserve your table today and indulge in a culinary journey.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate('/booking')} size="lg" className="bg-amber-600 hover:bg-amber-700">
                Book a Table
              </Button>
              <Button onClick={() => navigate('/menu')} size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20">
                View Menu
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20">
                Order Online
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl mb-6">Welcome to La Bella</h2>
              <p className="text-gray-600 mb-4">
                For over 20 years, La Bella has been serving the finest cuisine in the heart of New York City. Our passion for exceptional food, paired with our commitment to outstanding service, creates an unforgettable dining experience.
              </p>
              <p className="text-gray-600 mb-6">
                Our chefs use only the freshest, locally-sourced ingredients to craft authentic dishes that celebrate both tradition and innovation. Whether you're joining us for a romantic dinner, business lunch, or special celebration, we promise to make every moment memorable.
              </p>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-3xl text-amber-600 mb-1">20+</div>
                  <div className="text-sm text-gray-600">Years of Excellence</div>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl text-amber-600 mb-1">15K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl text-amber-600 mb-1">4.9</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1761095596765-c8abe01d3aea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwZm9vZCUyMHBsYXRpbmd8ZW58MXx8fHwxNzY0Mzk3NTU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Fine dining"
                className="w-full h-64 object-cover rounded-lg"
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1676300184847-4ee4030409c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2glMjBnb3VybWV0fGVufDF8fHx8MTc2NDMwMzU1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Pasta dish"
                className="w-full h-64 object-cover rounded-lg mt-8"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">What Our Guests Say</h2>
            <p className="text-gray-600">Don't just take our word for it - hear from our satisfied customers</p>
          </div>
          <TestimonialsSlider />
        </div>
      </section>

      {/* Location & Hours Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl mb-8">Visit Us</h2>
                
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-amber-100 rounded-lg">
                        <MapPin className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="mb-2">Location</h3>
                        <p className="text-gray-600">
                          123 Culinary Street<br />
                          New York, NY 10001<br />
                          United States
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-amber-100 rounded-lg">
                        <Clock className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="mb-2">Operating Hours</h3>
                        <div className="space-y-1 text-gray-600">
                          <p>Monday - Thursday: 11:00 AM - 10:00 PM</p>
                          <p>Friday - Saturday: 11:00 AM - 11:00 PM</p>
                          <p>Sunday: 10:00 AM - 9:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-amber-100 rounded-lg">
                        <Phone className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="mb-2">Contact</h3>
                        <p className="text-gray-600">
                          Phone: (555) 123-4567<br />
                          Email: hello@labella.com
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Map */}
            <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Restaurant Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-amber-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-6">Ready to Dine with Us?</h2>
          <p className="text-xl mb-8 text-amber-100">
            Book your table now and experience the finest dining in New York City
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => navigate('/booking')} size="lg" className="bg-white text-amber-800 hover:bg-amber-50 border-2 border-white shadow-lg">
              Reserve a Table
            </Button>
            <Button onClick={() => navigate('/menu')} size="lg" className="bg-amber-900 text-white hover:bg-amber-950 border-2 border-white">
              Explore Menu
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
