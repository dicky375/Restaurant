import { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Check, Utensils } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function BookingPage() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('');
  const [diningPreference, setDiningPreference] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingCode, setBookingCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
    '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM'
  ];
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!date || !time || !guests || !name || !email || !phone) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const resourceType = diningPreference === 'outdoor' ? 'GARDEN' : 'TABLE';
      
      // --- NEW DATE PARSING LOGIC ---
      const [hoursStr, minutesStr] = time.split(':');
      const [mins, modifier] = minutesStr.split(' ');
      let hours = parseInt(hoursStr, 10);
      
      if (hours === 12) hours = 0;
      if (modifier === 'PM') hours += 12;

      const finalDate = new Date(date);
      finalDate.setHours(hours, parseInt(mins, 10), 0, 0);
      // -------------------------------

      const response = await fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceType,
          startAt: finalDate.toISOString(), // Use the correctly parsed date
          guestCount: parseInt(guests),
          hostName: name,
          hostEmail: email,
          hostPhone: phone,
          specialRequests: `Time: ${time}, Preference: ${diningPreference || 'None'}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to create booking');

      setBookingCode(data.manageCode);
      setIsSubmitted(true);
      toast.success('Booking confirmed!');
      
    } catch (error: any) {
      console.error('❌ ERROR:', error);
      toast.error(error.message || 'Failed to connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <Card className="text-center max-w-md w-full">
          <CardContent className="p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl mb-4">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-6">Thank you, {name}!</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">Confirmation Code:</p>
              <p className="text-2xl font-mono font-bold text-amber-700 tracking-widest">{bookingCode}</p>
            </div>
            <button onClick={() => setIsSubmitted(false)} className="bg-amber-600 text-white font-bold py-3 px-6 rounded-md">
              Make Another Reservation
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl mb-4">Reserve Your Table</h1>
        </div>

        <Card>
          <CardHeader><CardTitle>Reservation Details</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            
            <div>
              <Label className="mb-2 block">Select Date</Label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Time</Label>
                <select 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="">Choose time</option>
                  {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                </select>
              </div>
              <div>
                <Label className="mb-2 block">Guests</Label>
                <select 
                  value={guests} 
                  onChange={(e) => setGuests(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="">Select guests</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => <option key={num} value={num}>{num} Guests</option>)}
                </select>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Dining Preference</Label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button" 
                  onClick={() => setDiningPreference('indoor')} 
                  className={`p-4 border-2 rounded-lg transition-all ${diningPreference === 'indoor' ? 'border-amber-600 bg-amber-50' : 'border-gray-200'}`}
                >
                  <Utensils className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                  <div className="text-sm">Indoor Dining</div>
                </button>
                <button 
                  type="button" 
                  onClick={() => setDiningPreference('outdoor')} 
                  className={`p-4 border-2 rounded-lg transition-all ${diningPreference === 'outdoor' ? 'border-amber-600 bg-amber-50' : 'border-gray-200'}`}
                >
                  <MapPin className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                  <div className="text-sm">Outdoor Dining</div>
                </button>
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleSubmit} 
              disabled={isSubmitting} 
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-md transition-colors"
            >
              {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
            </button>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}