import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-8ce40ac3/health", (c) => {
  return c.json({ status: "ok" });
});

// Create a new booking
app.post("/make-server-8ce40ac3/bookings", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, date, time, guests, diningPreference } = body;

    // Validate required fields
    if (!name || !email || !phone || !date || !time || !guests) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Generate unique booking ID
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Store booking in KV store
    const bookingData = {
      id: bookingId,
      name,
      email,
      phone,
      date,
      time,
      guests: parseInt(guests),
      diningPreference: diningPreference || 'indoor',
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    await kv.set(bookingId, bookingData);

    // Send confirmation email (simulated - in production use a real email service)
    console.log(`Email sent to ${email} for booking ${bookingId}`);
    console.log('Booking details:', bookingData);

    return c.json({ 
      success: true, 
      bookingId,
      message: "Booking confirmed successfully" 
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return c.json({ error: "Failed to create booking" }, 500);
  }
});

// Get all bookings (for admin Excel export)
app.get("/make-server-8ce40ac3/bookings", async (c) => {
  try {
    const bookings = await kv.getByPrefix("booking_");
    
    // Sort by creation date (newest first)
    const sortedBookings = bookings.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return c.json({ bookings: sortedBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return c.json({ error: "Failed to fetch bookings" }, 500);
  }
});

// Get bookings for a specific date
app.get("/make-server-8ce40ac3/bookings/date/:date", async (c) => {
  try {
    const targetDate = c.req.param("date");
    const allBookings = await kv.getByPrefix("booking_");
    
    // Filter bookings for the specific date
    const dateBookings = allBookings.filter(booking => booking.date === targetDate);

    return c.json({ bookings: dateBookings });
  } catch (error) {
    console.error("Error fetching bookings for date:", error);
    return c.json({ error: "Failed to fetch bookings" }, 500);
  }
});

// Check table availability for a specific date/time
app.get("/make-server-8ce40ac3/availability/:date/:time", async (c) => {
  try {
    const targetDate = c.req.param("date");
    const targetTime = c.req.param("time");
    
    const allBookings = await kv.getByPrefix("booking_");
    
    // Count bookings for this date and time
    const matchingBookings = allBookings.filter(
      booking => booking.date === targetDate && booking.time === targetTime
    );

    // Calculate total guests for this slot
    const totalGuests = matchingBookings.reduce((sum, booking) => sum + booking.guests, 0);

    // Assume restaurant has capacity for 50 guests per time slot
    const maxCapacity = 50;
    const availableSeats = Math.max(0, maxCapacity - totalGuests);

    return c.json({ 
      available: availableSeats > 0,
      availableSeats,
      totalCapacity: maxCapacity,
      currentBookings: matchingBookings.length
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    return c.json({ error: "Failed to check availability" }, 500);
  }
});

// Import availability data (for restaurant owner to upload Excel data)
app.post("/make-server-8ce40ac3/availability/import", async (c) => {
  try {
    const body = await c.req.json();
    const { availabilityData } = body;

    // Store availability settings
    await kv.set("availability_settings", {
      data: availabilityData,
      updatedAt: new Date().toISOString()
    });

    return c.json({ success: true, message: "Availability data imported successfully" });
  } catch (error) {
    console.error("Error importing availability:", error);
    return c.json({ error: "Failed to import availability data" }, 500);
  }
});

Deno.serve(app.fetch);