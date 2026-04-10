# Aura - Property Rental Platform

A modern property rental platform with admin dashboard, reservation system, and complaint management features.

## Features

### 1. **Homepage - Property Search & Discovery**
- **Search Bar**: Filter properties by location (Delhi, Mumbai, Noida, Gurgaon, Kolkata, Jaipur)
- **Property Cards**: Display available properties with:
  - Property image
  - Property name and location
  - Number of bedrooms
  - Monthly rent price
- **Sidebar Filters**:
  - Filter by number of bedrooms (1, 2, 3, 4, 5+)
  - Filter by price range (Budget, Mid-range, Premium)
  - Apply filters to narrow down results

### 2. **Property Details Modal**
- **Image Slider**: Navigate through multiple property images
- **Airbnb-Style Details**:
  - Title and location
  - Bedroom/bathroom count
  - Price per month
  - Property description
  - Services & amenities checklist
  - Owner contact information
- **Reserve Button**: Book the property

### 3. **Navigation Bar**
- Icon-based navigation (no text labels)
- **Home**: Return to property listing
- **Complaints**: File and track complaints
- **Admin**: Access admin dashboard
- Present on all pages

### 4. **Complaints Page**
- **For Approved Residents**:
  - File complaints about reserved properties
  - Complaints include:
    - Property selection
    - Complaint description
    - Severity score (0-1, auto-calculated)
    - Churn risk assessment
- **LLM Integration** (Simulated):
  - Analyzes complaint severity
  - Calculates user churn risk
  - Provides recommendations

### 5. **Admin Panel**

#### Reservations Tab
- **Table View** showing:
  - Reservation date
  - User name
  - Property name
  - Reservation status (Pending/Approved/Declined)
- **Actions**:
  - Approve reservations
  - Decline reservations
  - View detailed reservation info
  - Access user contact details

#### Complaints Tab
- **Complaint Management**:
  - View all filed complaints
  - Severity score visualization
  - Churn risk percentage
  - Auto-generated recommendations
  - Mark complaints as resolved
- **Smart Recommendations** based on complaint type:
  - Water issues → Contact plumber
  - Electrical issues → Contact electrician
  - AC/Cooling → Contact AC technician
  - Property damage → Schedule inspection
  - Noise complaints → Contact management

## Project Structure

```
src/
├── components/
│   ├── Navigation.jsx      # Top navigation bar
│   ├── PropertyCard.jsx    # Individual property card
│   ├── SidebarFilter.jsx   # Filter sidebar
│   └── PropertyDetails.jsx # Expanded property modal
├── pages/
│   ├── HomePage.jsx        # Main property listing
│   ├── ComplaintsPage.jsx  # User complaints filing
│   └── AdminPage.jsx       # Admin dashboard
├── data/
│   └── properties.js       # Mock property data
├── App.jsx                 # Main app with routing
└── index.css              # Global styles
```

## Getting Started

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

## Technologies Used

- **React 19**: UI library
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Vite**: Build tool

## Data Persistence

The application uses **localStorage** to store:
- **Reservations**: User property bookings
- **Complaints**: Filed complaints with severity scores and recommendations

Data persists across browser sessions.

## Mock Data

### Properties Included
1. **Luxury Apartment in Delhi** - 3 BHK, ₹45,000/month
2. **Cozy Flat in Mumbai** - 2 BHK, ₹50,000/month
3. **Modern House in Noida** - 4 BHK, ₹35,000/month
4. **Premium Penthouse in Gurgaon** - 5 BHK, ₹75,000/month
5. **Budget-Friendly in Kolkata** - 1 BHK, ₹12,000/month
6. **Heritage Villa in Jaipur** - 3 BHK, ₹28,000/month

## User Flow

### Customer Journey
1. **Browse** properties on homepage
2. **Search** by location
3. **Filter** by preferences (bedrooms, price)
4. **View** detailed property information
5. **Reserve** the property
6. **Wait** for admin approval
7. **File** complaints if needed (after approval)

### Admin Journey
1. **Review** pending reservations
2. **Approve/Decline** bookings
3. **Monitor** filed complaints
4. **Track** severity and churn risk
5. **Take action** based on recommendations

## Features Roadmap

### Coming Soon
- Backend API integration
- Real LLM integration for complaint analysis
- Payment gateway integration
- User authentication system
- Property owner dashboard
- Advanced analytics
- Email notifications
- Real-time chat support

## Notes

- **Severity Score**: Simulated 0-1 value (0 = low severity, 1 = critical)
- **Churn Risk**: Simulated likelihood of tenant leaving (0-1 scale)
- **Recommendations**: Auto-generated based on complaint keywords
- All data is stored locally in browser localStorage

## Future Enhancements

1. **Backend Integration**: Connect to Node.js/Express server
2. **Real LLM**: Integrate with OpenAI or similar for actual NLP analysis
3. **User Profiles**: Login system with user authentication
4. **Payment Processing**: Integrate Stripe or Razorpay
5. **Notifications**: Email and SMS alerts for reservations and complaints
6. **Analytics Dashboard**: Advanced insights for property owners
7. **Property Management**: Owner dashboard to manage listings
8. **Rating System**: User reviews and ratings for properties
9. **Messaging**: In-app communication between users and owners

---

**Aura** - Find Your Dream Home! 🏠
