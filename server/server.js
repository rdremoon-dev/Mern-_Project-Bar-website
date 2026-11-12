const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.././server/.env') });
const { Resend } = require('resend');

const adminAuthRoutes = require('./routes/adminAuth');
const Booking = require('./model/booking');
const Event = require('./model/event');
const MenuItem = require('./model/menu');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use('/api/admin', adminAuthRoutes);

const publicAppUrl = (
  process.env.PUBLIC_APP_URL || 'http://localhost:5173'
).replace(/\/+$/, '');
const publicApiUrl = (
  process.env.PUBLIC_API_URL || 'http://localhost:3000'
).replace(/\/+$/, '');



// Initialize Resend
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  throw new Error(
    'Missing RESEND_API_KEY. Add it to the project root .env file.',
  );
}
const resend = new Resend(resendApiKey);

const sendEmail = async options => {
  const { error } = await resend.emails.send(options);
  if (error) {
    throw new Error(`Resend failed to send email: ${error.message}`);
  }
};

const escapeHtml = value =>
  String(value ?? '').replace(/[&<>"']/g, character => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });

const emailSubjectText = value =>
  String(value ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim();

const bookingDetailsHtml = booking => {
  const rows = [
    ['Name', booking.name],
    ['Email', booking.email],
    ['Phone', booking.phone],
    ['Date', booking.date],
    ['Time', booking.time],
    [
      'Guests',
      `${booking.guests} ${booking.guests === 1 ? 'guest' : 'guests'}`,
    ],
    ['Seating', (booking.area || 'Main Bar').replace(/-/g, ' ')],
    ['Occasion', booking.occasion || 'None'],
    ['Special requests', booking.requests || 'None'],
  ];

  return `
    <h2 style="margin: 28px 0 12px; color: #38252d; font-size: 18px;">Booking details</h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background-color: #ffffff; border: 1px solid #eadfe2;">
      ${rows
        .map(
          ([label, value], index) => `
            <tr>
              <td style="padding: 12px 14px; border-bottom: ${index === rows.length - 1 ? '0' : '1px solid #eee7e8'}; background-color: ${index % 2 === 0 ? '#fbf8f7' : '#ffffff'}; color: #75676c; font-size: 14px; width: 32%;">${escapeHtml(label)}</td>
              <td style="padding: 12px 14px; border-bottom: ${index === rows.length - 1 ? '0' : '1px solid #eee7e8'}; background-color: ${index % 2 === 0 ? '#fbf8f7' : '#ffffff'}; color: #30272a; font-size: 14px; font-weight: 600;">${escapeHtml(value)}</td>
            </tr>
          `,
        )
        .join('')}
    </table>
  `;
};

const approvalPage = ({ title, message, booking, action }) => `
  <!doctype html>
  <html lang="en">
    <head><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title></head>
    <body style="margin: 0; padding: 32px 16px; background: #f4f0ed; color: #302328; font-family: Arial, Helvetica, sans-serif;">
      <main style="box-sizing: border-box; max-width: 640px; margin: 0 auto; padding: 32px; background: #fff; border: 1px solid #e8dfdc; border-radius: 16px;">
        <h1 style="margin-top: 0;">${escapeHtml(title)}</h1>
        <p>${escapeHtml(message)}</p>
        ${booking ? bookingDetailsHtml(booking) : ''}
        ${action || ''}
      </main>
    </body>
  </html>
`;

const handleContentError = (res, error, label) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Invalid ${label} data.`,
    });
  }

  console.error(`${label} API error:`, error);
  return res.status(500).json({
    success: false,
    error: `Failed to process ${label}.`,
  });
};

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// 1. SUBMIT BOOKING (Saves as Pending & Emails Customer + Manager)
app.post('/api/book-table', async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, area, occasion, requests } =
      req.body;

    const newBooking = new Booking({
      name,
      email,
      phone,
      date,
      time,
      guests,
      area,
      occasion,
      requests,
      status: 'pending',
    });

    await newBooking.save();

    // EMAIL 1: Customer Pending Request Template
    await sendEmail({
      from: 'Acme <onboarding@resend.dev>',
      to: [process.env.BOOKING_NOTIFICATION_EMAIL || email],
      subject: `Reservation Request Received - Pub & Lounge`,
      html: `
        <div style="background-color: #f4f4f5; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #3f3f46;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <tr>
              <td align="center" style="padding: 24px; background-color: #ffffff; border-bottom: 1px solid #f4f4f5;">
                <h2 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #c94077;">Pub & Lounge</h2>
              </td>
            </tr>
            <tr>
              <td>
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80" alt="Pub & Lounge Atmosphere" width="600" style="width: 100%; height: auto; display: block;" />
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px; text-align: center;">
                <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 600; color: #18181b;">
                  We've received your request, ${escapeHtml(name)}!
                </h1>
                <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #71717a;">
                  Your reservation request is pending staff review. We'll email you as soon as your booking is confirmed.
                </p>
                ${bookingDetailsHtml(newBooking)}
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="padding: 10px 0 24px 0;">
                      <a href="${escapeHtml(publicAppUrl)}" target="_blank" style="background-color: #c94077; color: #ffffff; padding: 12px 30px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block;">
                        Visit Our Website
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      `,
    });

    // EMAIL 2: Action Request to Bar Manager
    if (process.env.BOOKING_NOTIFICATION_EMAIL) {
      const approveUrl = `${publicApiUrl}/api/bookings/${encodeURIComponent(newBooking._id)}/approve`;

      await sendEmail({
        from: 'Acme <onboarding@resend.dev>',
        to: [process.env.BOOKING_NOTIFICATION_EMAIL],
        subject: `Action Required: New Request from ${name} (${guests} pax)`,
        html: `
          <div style="background-color: #0c0a09; padding: 40px 20px; font-family: sans-serif; color: #f5f5f4;">
            <table align="center" width="100%" style="max-width: 600px; background-color: #171716; border: 1px solid #292524; border-radius: 16px; padding: 30px;">
              <tr>
                <td>
                  <h2 style="color: #c94077; margin-top: 0;">New Table Request (Pending)</h2>
                  ${bookingDetailsHtml(newBooking)}
                  <div style="margin-top: 30px;">
                    <a href="${escapeHtml(approveUrl)}" style="background-color: #c94077; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                      Review Reservation
                    </a>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        `,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking request submitted! Status is pending.',
    });
  } catch (error) {
    console.error('Booking error:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to process booking request.' });
  }
});

// 2. GET ALL BOOKINGS (For Admin Dashboard)
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to fetch bookings.' });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ success: true, events });
  } catch (error) {
    handleContentError(res, error, 'events');
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const body = req.body || {};
    const event = await Event.create({
      title: body.title,
      category: body.category,
      date: body.date,
      time: body.time,
      description: body.description,
      price: body.price,
      image: body.image,
    });
    res.status(201).json({ success: true, event });
  } catch (error) {
    handleContentError(res, error, 'event');
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid event ID.' });
    }

    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found.' });
    }

    res.json({ success: true, message: 'Event deleted.' });
  } catch (error) {
    handleContentError(res, error, 'event');
  }
});

app.get('/api/menus', async (req, res) => {
  try {
    const menus = await MenuItem.find().sort({ createdAt: -1 });
    res.json({ success: true, menus });
  } catch (error) {
    handleContentError(res, error, 'menu items');
  }
});

app.post('/api/menus', async (req, res) => {
  try {
    const body = req.body || {};
    const items = Array.isArray(body.items) ? body.items : [body];
    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one menu item is required.',
      });
    }

    const menus = await MenuItem.insertMany(
      items.map(item => ({
        name: item.name,
        category: item.category || body.category,
        price: item.price,
        description: item.description,
        image: item.image || body.image,
      })),
    );
    res.status(201).json({
      success: true,
      menu: menus[0],
      menus,
    });
  } catch (error) {
    handleContentError(res, error, 'menu item');
  }
});

app.delete('/api/menus/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid menu item ID.' });
    }

    const menu = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menu) {
      return res.status(404).json({ success: false, error: 'Menu item not found.' });
    }

    res.json({ success: true, message: 'Menu item deleted.' });
  } catch (error) {
    handleContentError(res, error, 'menu item');
  }
});

// 3. UPDATE BOOKING STATUS (Approve or Cancel from Admin Panel)
app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid booking status.' });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, error: 'Booking not found.' });
    }

    const previousStatus = booking.status;
    booking.status = status;
    await booking.save();

    if (previousStatus !== 'confirmed' && status === 'confirmed') {
      await sendEmail({
        from: 'Acme <onboarding@resend.dev>',
        to: [booking.email],
        subject: `Reservation Confirmed! - Pub & Lounge (${emailSubjectText(booking.date)} at ${emailSubjectText(booking.time)})`,
        html: `
          <div style="background-color: #f4f4f5; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #3f3f46;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              <tr>
                <td align="center" style="padding: 24px; background-color: #ffffff; border-bottom: 1px solid #f4f4f5;">
                  <h2 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #c94077;">Pub & Lounge</h2>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 600; color: #16a34a;">
                    You're All Set, ${escapeHtml(booking.name)}!
                  </h1>
                  <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #71717a;">
                    Your table reservation has been officially approved. Here are your booking details:
                  </p>
                  ${bookingDetailsHtml(booking)}
                </td>
              </tr>
            </table>
          </div>
        `,
      });
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Update status error:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to update booking status.' });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid booking ID.' });
    }

    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, error: 'Booking not found.' });
    }

    res.json({ success: true, message: 'Reservation deleted.' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to delete reservation.' });
  }
});

// Approval web routes
app.get('/api/bookings/:id/approve', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).send(
        approvalPage({
          title: 'Booking not found',
          message: 'This booking could not be found. It may have been removed.',
        }),
      );
    }

    if (booking.status === 'confirmed') {
      return res.send(
        approvalPage({
          title: 'Already confirmed',
          message: 'This reservation has already been confirmed.',
          booking,
        }),
      );
    }

    const action = `
      <form method="post" action="/api/bookings/${encodeURIComponent(booking._id)}/approve" style="margin-top: 24px;">
        <button type="submit" style="padding: 14px 24px; border: 0; border-radius: 8px; background: #c94077; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer;">Confirm reservation</button>
      </form>
    `;
    res.send(
      approvalPage({
        title: 'Review booking',
        message: 'Confirm that you want to approve this reservation.',
        booking,
        action,
      }),
    );
  } catch (error) {
    console.error('Approval page error:', error);
    res.status(500).send('Server error while loading booking.');
  }
});

app.post('/api/bookings/:id/approve', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).send(
        approvalPage({
          title: 'Booking not found',
          message: 'This booking could not be found.',
        }),
      );
    }

    if (booking.status === 'confirmed') {
      return res.send(
        approvalPage({
          title: 'Already confirmed',
          message: 'This reservation has already been confirmed.',
          booking,
        }),
      );
    }

    booking.status = 'confirmed';
    await booking.save();

    await sendEmail({
      from: 'Acme <onboarding@resend.dev>',
      to: [booking.email],
      subject: `Reservation Confirmed! - Pub & Lounge (${emailSubjectText(booking.date)} at ${emailSubjectText(booking.time)})`,
      html: `
        <div style="background-color: #f4f4f5; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #3f3f46;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <tr>
              <td align="center" style="padding: 24px; background-color: #ffffff; border-bottom: 1px solid #f4f4f5;">
                <h2 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #c94077;">Pub & Lounge</h2>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px; text-align: center;">
                <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 600; color: #16a34a; text-transform: capitalize;">
                  You're All Set, ${escapeHtml(booking.name)}!
                </h1>
                ${bookingDetailsHtml(booking)}
              </td>
            </tr>
          </table>
        </div>
      `,
    });

    res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px; background-color: #0c0a09; color: #ffffff; height: 100vh;">
        <h1 style="color: #22c55e;">Reservation Approved Successfully!</h1>
        <p>Status for <strong>${escapeHtml(booking.name)}</strong> updated to <strong>confirmed</strong>.</p>
      </div>
    `);
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).send('Server error while approving booking.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
