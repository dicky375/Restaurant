import { Star } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Food Critic',
    rating: 5,
    text: 'Absolutely phenomenal experience! The ambiance was perfect, the service impeccable, and the food was out of this world. The chef\'s special pasta dish was the best I\'ve ever had. Will definitely be coming back!',
    initials: 'SJ'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Regular Customer',
    rating: 5,
    text: 'La Bella has become our go-to restaurant for special occasions. The staff remembers us by name, and they always go above and beyond. The wine selection is excellent, and the desserts are divine.',
    initials: 'MC'
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Business Executive',
    rating: 5,
    text: 'I\'ve hosted several business dinners here, and it never disappoints. The private dining area is perfect for professional gatherings, and the menu has options to please everyone. Highly recommended!',
    initials: 'ER'
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Anniversary Celebration',
    rating: 5,
    text: 'We celebrated our 25th anniversary at La Bella, and it was magical. The staff made us feel so special, and the food was extraordinary. The steak was cooked to perfection, and the atmosphere was romantic and intimate.',
    initials: 'DT'
  },
  {
    id: 5,
    name: 'Lisa Patel',
    role: 'Food Blogger',
    rating: 5,
    text: 'As someone who reviews restaurants professionally, La Bella stands out in every aspect. The presentation is artistic, the flavors are complex yet balanced, and the service is attentive without being intrusive. A true gem!',
    initials: 'LP'
  }
];

export default function TestimonialsSlider() {
  return (
    <div className="relative px-12">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarFallback className="bg-amber-100 text-amber-600">
                          {testimonial.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                    </div>

                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-gray-600">{testimonial.text}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
}
