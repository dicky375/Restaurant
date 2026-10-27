import { useState, useEffect } from 'react';
import { Download, Calendar, Users, Clock, Mail, Phone, MapPin, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  diningPreference: string;
  createdAt: string;
  status: string;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8ce40ac3/bookings`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
        toast.success('Bookings loaded successfully');
      } else {
        toast.error('Failed to load bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error loading bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadExcel = () => {
    if (bookings.length === 0) {
      toast.error('No bookings to download');
      return;
    }

    // Create CSV content with all bookings
    const headers = ['Booking ID', 'Name', 'Email', 'Phone', 'Date', 'Time', 'Guests', 'Dining Preference', 'Status', 'Created At'];
    const rows = bookings.map(booking => [
      booking.id,
      booking.name,
      booking.email,
      booking.phone,
      booking.date,
      booking.time,
      booking.guests,
      booking.diningPreference === 'indoor' ? 'Indoor' : 'Outdoor',
      booking.status,
      new Date(booking.createdAt).toLocaleString()
    ]);

    const csvContent = [
      ['La Bella Restaurant - All Bookings'],
      ['Generated on: ' + new Date().toLocaleString()],
      [''],
      headers,
      ...rows
    ].map(row => row.join(',')).join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `LaBella_All_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Bookings downloaded successfully!');
  };

  const downloadDateBookings = async () => {
    if (!filterDate) {
      toast.error('Please select a date');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8ce40ac3/bookings/date/${filterDate}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const dateBookings = data.bookings;

        if (dateBookings.length === 0) {
          toast.error('No bookings found for this date');
          return;
        }

        // Create CSV for specific date
        const headers = ['Booking ID', 'Name', 'Email', 'Phone', 'Time', 'Guests', 'Dining Preference', 'Status'];
        const rows = dateBookings.map((booking: Booking) => [
          booking.id,
          booking.name,
          booking.email,
          booking.phone,
          booking.time,
          booking.guests,
          booking.diningPreference === 'indoor' ? 'Indoor' : 'Outdoor',
          booking.status
        ]);

        const csvContent = [
          [`La Bella Restaurant - Bookings for ${filterDate}`],
          ['Generated on: ' + new Date().toLocaleString()],
          [''],
          headers,
          ...rows,
          [''],
          ['Summary'],
          ['Total Bookings', dateBookings.length],
          ['Total Guests', dateBookings.reduce((sum: number, b: Booking) => sum + b.guests, 0)]
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `LaBella_Bookings_${filterDate}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success(`Downloaded ${dateBookings.length} booking(s) for ${filterDate}`);
      }
    } catch (error) {
      console.error('Error downloading date bookings:', error);
      toast.error('Error downloading bookings');
    }
  };

  const filteredBookings = filterDate 
    ? bookings.filter(b => b.date === filterDate)
    : bookings;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage restaurant bookings and reservations</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">{bookings.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600" />
                Today's Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">
                {bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">
                {bookings.filter(b => b.date >= new Date().toISOString().split('T')[0]).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Export Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Export Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="filterDate" className="mb-2 block">Filter by Date</Label>
                <Input
                  id="filterDate"
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  placeholder="Select date"
                />
              </div>
              <div className="flex gap-3 items-end">
                <Button
                  onClick={downloadDateBookings}
                  className="bg-amber-600 hover:bg-amber-700"
                  disabled={!filterDate}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Date
                </Button>
                <Button
                  onClick={downloadExcel}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
                <Button
                  onClick={fetchBookings}
                  variant="outline"
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {filterDate ? `Bookings for ${filterDate}` : 'All Bookings'}
              <span className="ml-2 text-sm text-gray-500">({filteredBookings.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading bookings...</div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No bookings found</div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Customer</div>
                        <div>{booking.name}</div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Mail className="w-3 h-3 mr-1" />
                          {booking.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Phone className="w-3 h-3 mr-1" />
                          {booking.phone}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Date & Time</div>
                        <div className="flex items-center mb-1">
                          <Calendar className="w-4 h-4 mr-2 text-amber-600" />
                          {booking.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-amber-600" />
                          {booking.time}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Details</div>
                        <div className="flex items-center mb-1">
                          <Users className="w-4 h-4 mr-2 text-amber-600" />
                          {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-amber-600" />
                          {booking.diningPreference === 'indoor' ? 'Indoor' : 'Outdoor'}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Status</div>
                        <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {booking.status}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Booked: {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
