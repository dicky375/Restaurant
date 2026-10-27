import { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Check, Utensils, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export default function BookingPage() {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('');
  const [diningPreference, setDiningPreference] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [availability, setAvailability] = useState<{
    available: boolean;
    availableSeats: number;
    totalCapacity: number;
    currentBookings: number;
  } | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // Generate available time slots
  const timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
    '9:00 PM', '9:30 PM', '10:00 PM'
  ];

  // Check availability when date and time change
  useEffect(() => {
    if (date && time) {
      checkAvailability();
    }
  }, [date, time]);

  const checkAvailability = async () => {
    if (!date || !time) return;
    
    setIsCheckingAvailability(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8ce40ac3/availability/${dateStr}/${encodeURIComponent(time)}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAvailability(data);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const getAvailabilityStatus = () => {
    if (!availability) return null;
    
    if (!availability.available) {
      return { status: 'unavailable', message: 'Fully booked at this time' };
    } else if (availability.availableSeats <= 10) {
      return { status: 'limited', message: `Only ${availability.availableSeats} seats left` };
    } else {
      return { status: 'available', message: `${availability.availableSeats} seats available` };
    }
  };

  const availabilityStatus = getAvailabilityStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !guests || !diningPreference || !name || !email || !phone) {
      toast.error('Please fill in all fields');
      return;
    }

    // Check if table is available
    if (availability && !availability.available) {
      toast.error('Sorry, no tables available at this time. Please select a different time slot.');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8ce40ac3/bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            date: date.toISOString().split('T')[0],
            time,
            guests,
            diningPreference
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBookingId(data.bookingId);
        setIsSubmitted(true);
        toast.success('Booking confirmed! Check your email for details.');
        
        // Simulate email notification
        setTimeout(() => {
          toast.info('Confirmation email sent to ' + email);
        }, 1000);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Failed to submit booking. Please try again.');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const downloadExcel = () => {
    if (!date) return;
    
    // Create CSV content
    const csvContent = [
      ['Reservation Details - La Bella Restaurant'],
      [''],
      ['Name', name],
      ['Email', email],
      ['Phone', phone],
      ['Date', formatDate(date)],
      ['Time', time],
      ['Number of Guests', guests],
      ['Dining Preference', diningPreference === 'indoor' ? 'Indoor Dining' : 'Outdoor Dining'],
      [''],
      ['Restaurant Information'],
      ['Address', '123 Culinary Street, New York, NY 10001'],
      ['Phone', '(555) 123-4567'],
      ['Email', 'hello@labella.com']
    ].map(row => row.join(',')).join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `LaBella_Reservation_${name.replace(/\s+/g, '_')}_${date.toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Reservation details downloaded!');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl mb-4">Booking Confirmed!</h1>
                <p className="text-gray-600 mb-6">
                  Thank you, {name}! Your table has been reserved.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                  <h3 className="mb-4">Reservation Details</h3>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-3 text-amber-600" />
                      <span>{date && formatDate(date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-3 text-amber-600" />
                      <span>{time}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-3 text-amber-600" />
                      <span>{guests} {parseInt(guests) === 1 ? 'Guest' : 'Guests'}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-amber-600" />
                      <span>{diningPreference === 'indoor' ? 'Indoor Dining' : 'Outdoor Dining'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-amber-800 mb-2">
                    A confirmation email has been sent to <strong>{email}</strong> and an SMS to <strong>{phone}</strong>
                  </p>
                  {bookingId && (
                    <p className="text-xs text-amber-700">
                      Booking ID: <strong>{bookingId}</strong>
                    </p>
                  )}
                </div>

                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={() => setIsSubmitted(false)}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    Make Another Reservation
                  </Button>
                  <Button 
                    onClick={downloadExcel}
                    variant="outline"
                    className="border-amber-600 text-amber-600 hover:bg-amber-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4">Reserve Your Table</h1>
          <p className="text-xl text-gray-600">
            Book your dining experience at La Bella
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Reservation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <Label htmlFor="date" className="mb-2 block">Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="w-full flex items-center justify-start px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>{date ? formatDate(date) : 'Pick a date'}</span>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time and Guests */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="time" className="mb-2 block">Select Time</Label>
                      <Select value={time} onValueChange={setTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="guests" className="mb-2 block">Number of Guests</Label>
                      <Select value={guests} onValueChange={setGuests}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select guests" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Guest' : 'Guests'}
                            </SelectItem>
                          ))}
                          <SelectItem value="9+">9+ Guests (Contact us)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Dining Preference */}
                  <div>
                    <Label className="mb-2 block">Dining Preference</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setDiningPreference('indoor')}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          diningPreference === 'indoor'
                            ? 'border-amber-600 bg-amber-50'
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <Utensils className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                        <div className="text-sm">Indoor Dining</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiningPreference('outdoor')}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          diningPreference === 'outdoor'
                            ? 'border-amber-600 bg-amber-50'
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <MapPin className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                        <div className="text-sm">Outdoor Dining</div>
                      </button>
                    </div>
                  </div>

                  {/* Availability Indicator */}
                  {availabilityStatus && (
                    <div className={`p-4 rounded-lg ${
                      availabilityStatus.status === 'available' ? 'bg-green-50 border border-green-200' :
                      availabilityStatus.status === 'limited' ? 'bg-yellow-50 border border-yellow-200' :
                      availabilityStatus.status === 'unavailable' ? 'bg-red-50 border border-red-200' :
                      'bg-orange-50 border border-orange-200'
                    }`}>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          availabilityStatus.status === 'available' ? 'bg-green-500' :
                          availabilityStatus.status === 'limited' ? 'bg-yellow-500' :
                          availabilityStatus.status === 'unavailable' ? 'bg-red-500' :
                          'bg-orange-500'
                        }`}></div>
                        <span className="text-sm">{availabilityStatus.message}</span>
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="border-t pt-6">
                    <h3 className="mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    size="lg"
                  >
                    Confirm Reservation
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reservation Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-600">
                <div>
                  <h4 className="text-gray-900 mb-2">Cancellation</h4>
                  <p>Please cancel at least 24 hours in advance to avoid a cancellation fee.</p>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-2">Late Arrival</h4>
                  <p>Tables are held for 15 minutes past reservation time. Please call if running late.</p>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-2">Large Groups</h4>
                  <p>For parties of 9 or more, please call us directly at (555) 123-4567.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">Phone</div>
                  <div className="text-gray-900">(555) 123-4567</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Email</div>
                  <div className="text-gray-900">reservations@labella.com</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Hours</div>
                  <div className="text-gray-900">Mon-Thu: 11AM-10PM</div>
                  <div className="text-gray-900">Fri-Sat: 11AM-11PM</div>
                  <div className="text-gray-900">Sun: 10AM-9PM</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
