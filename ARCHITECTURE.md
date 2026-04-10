# Aura Platform - Architecture & Implementation Details

## Project Overview

**Aura** is a full-featured property rental platform with the following core modules:
- Property Discovery & Booking System
- User Complaint Management
- Admin Dashboard with Analytics
- LLM-powered severity assessment (simulated)

## Technology Stack

```
Frontend: React 19 + Vite
Styling: Tailwind CSS 4
Routing: React Router v6
Icons: Lucide React
State: React Hooks + localStorage
Build: Vite 7
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│         React Router - Main Navigation              │
└──────────┬──────────────────────────────────────────┘
           │
    ┌──────┴──────┐
    │ Navigation  │
    │ Bar (Icons) │
    └──────┬──────┘
           │
    ┌──────┴─────────────────────────┐
    │                                 │
    ▼                                 ▼
┌─────────────┐        ┌──────────────────────────────┐
│  HomePage   │        │   Secondary Routes           │
│             │        ├──────────────────────────────┤
├─────────────┤        │ • ComplaintsPage             │
│ • Search    │        │ • AdminPage                  │
│ • Filter    │        │                              │
│ • Card Grid │        │ (Same Navigation, Different  │
│ • Modal     │        │  Content)                    │
└─────────────┘        └──────────────────────────────┘
```

## Component Hierarchy

### Navigation.jsx
```
<Navigation />
├── Home Button → /
├── Complaints Button → /complaints
└── Admin Button → /admin
```

### HomePage.jsx
```
<HomePage />
├── <SearchSection />
│   └── Location Search Input
├── <MainContent>
│   ├── <SidebarFilter />
│   │   ├── Bedrooms Filter
│   │   └── Price Range Filter
│   └── <PropertyGrid />
│       └── <PropertyCard /> × N
└── <PropertyDetails /> (Modal)
    ├── Image Slider
    ├── Property Info
    ├── Services List
    └── Reserve Button
```

### ComplaintsPage.jsx
```
<ComplaintsPage />
├── <ComplaintForm /> (Sidebar)
│   ├── Property Selector
│   ├── Complaint Text Area
│   └── Submit Button
└── <ComplaintsList />
    └── <ComplaintCard /> × N
        ├── Severity Score
        ├── Churn Risk
        └── Recommendations
```

### AdminPage.jsx
```
<AdminPage />
├── <TabSelector />
├── [Reservations Tab] OR [Complaints Tab]
│   ├── <ReservationsTable />
│   │   └── Approve/Decline Actions
│   └── <ComplaintsGrid />
│       └── Recommendations & Severity
└── <Modal /> (Details View)
```

## Data Flow

### 1. Property Data Flow
```
properties.js (Mock Data)
    ↓
HomePage (Display in Cards)
    ↓
PropertyDetails Modal (Detailed View)
    ↓
User clicks "Reserve"
```

### 2. Reservation Flow
```
User Reserves Property
    ↓
Save to localStorage (reservations)
    ↓
Admin Tab shows pending reservations
    ↓
Admin Approves/Declines
    ↓
Status updates in localStorage
    ↓
Complaints page checks for "approved" status
```

### 3. Complaint Flow
```
User files complaint (only if approved)
    ↓
Save to localStorage (complaints)
    ↓
Calculate Severity (LLM simulation)
    ↓
Calculate Churn Risk (LLM simulation)
    ↓
Generate Recommendations (Keyword matching)
    ↓
Admin views in Complaints Tab
    ↓
Admin marks as resolved
```

## State Management

### Component-Level State (React Hooks)

#### HomePage.jsx
```javascript
const [searchQuery, setSearchQuery] = useState('')
const [filteredProperties, setFilteredProperties] = useState(properties)
const [filters, setFilters] = useState({ bedrooms: '', priceRange: 'all' })
const [selectedProperty, setSelectedProperty] = useState(null)
const [reservations, setReservations] = useState(() => 
  JSON.parse(localStorage.getItem('reservations')) || []
)
```

#### ComplaintsPage.jsx
```javascript
const [reservations, setReservations] = useState(() => 
  JSON.parse(localStorage.getItem('reservations')) || []
)
const [complaints, setComplaints] = useState(() => 
  JSON.parse(localStorage.getItem('complaints')) || []
)
const [selectedProperty, setSelectedProperty] = useState('')
const [complaintText, setComplaintText] = useState('')
const [showForm, setShowForm] = useState(false)
```

#### AdminPage.jsx
```javascript
const [reservations, setReservations] = useState(() => 
  JSON.parse(localStorage.getItem('reservations')) || []
)
const [complaints, setComplaints] = useState(() => 
  JSON.parse(localStorage.getItem('complaints')) || []
)
const [activeTab, setActiveTab] = useState('reservations')
const [selectedReservation, setSelectedReservation] = useState(null)
const [showDetails, setShowDetails] = useState(false)
```

### LocalStorage Schema

#### reservations
```javascript
[
  {
    id: number,
    propertyId: number,
    propertyName: string,
    location: string,
    price: number,
    bedrooms: number,
    date: string (DD/MM/YYYY),
    status: 'pending' | 'approved' | 'declined',
    userName: string,
    userPhone: string
  }
]
```

#### complaints
```javascript
[
  {
    id: number,
    propertyId: number,
    propertyName: string,
    complaintText: string,
    date: string (DD/MM/YYYY),
    severity: number (0-1),
    churnRisk: number (0-1),
    status: 'pending' | 'resolved',
    recommendations: string[]
  }
]
```

## Key Features Implementation

### 1. Search & Filter Logic
```javascript
// SearchQuery filter
let filtered = properties.filter(prop =>
  prop.location.toLowerCase().includes(searchQuery.toLowerCase())
)

// Bedroom filter
if (filters.bedrooms) {
  filtered = filtered.filter(prop => 
    filters.bedrooms === '5' 
      ? prop.bedrooms >= 5 
      : prop.bedrooms === parseInt(filters.bedrooms)
  )
}

// Price range filter
if (filters.priceRange === 'budget') {
  filtered = filtered.filter(prop => prop.price < 25000)
}
```

### 2. Image Slider in PropertyDetails
```javascript
const [currentImageIndex, setCurrentImageIndex] = useState(0)

const nextImage = () => {
  setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
}

const prevImage = () => {
  setCurrentImageIndex((prev) => 
    (prev - 1 + property.images.length) % property.images.length
  )
}
```

### 3. Severity & Churn Risk Calculation (Simulated)
```javascript
// In real app, this would be actual LLM API call
const severity = Math.random() // 0-1
const churnRisk = Math.random() // 0-1

// Display as percentage
<span>{(severity * 100).toFixed(1)}%</span>
```

### 4. Recommendation Engine (Keyword-Based)
```javascript
const getRecommendations = (text) => {
  const textLower = text.toLowerCase()
  let recommendations = []

  if (textLower.includes('water') || textLower.includes('tap')) {
    recommendations.push('Contact plumber: 1800-PLUMBER')
  }
  if (textLower.includes('electric') || textLower.includes('light')) {
    recommendations.push('Contact electrician: 1800-ELECTRIC')
  }
  // ... more conditions
  
  return recommendations
}
```

## Styling Approach

### Tailwind CSS Configuration
- Gradient backgrounds for headers
- Card-based layout system
- Responsive grid (mobile-first)
- Hover effects and transitions
- Color-coded status badges

### Color Scheme
```
Primary: Blue (#3B82F6)
Secondary: Purple (#A855F7)
Success: Green (#16A34A)
Warning: Yellow (#EAB308)
Error: Red (#DC2626)
Neutral: Gray (various shades)
```

### Responsive Breakpoints
```
Mobile: < 768px (single column)
Tablet: 768px - 1024px (2 columns)
Desktop: > 1024px (3+ columns)
```

## API Integration Points (Future)

### Current: Mock Data
```
properties.js → Hardcoded array
```

### Future: API Endpoints
```
GET /api/properties
  ├── Query: ?location=Delhi&bedrooms=2&maxPrice=50000
  └── Response: Property[]

POST /api/reservations
  ├── Body: { propertyId, userId, startDate }
  └── Response: Reservation

GET /api/reservations?status=pending
  └── Response: Reservation[]

POST /api/reservations/:id/approve
  └── Response: Reservation

POST /api/complaints
  ├── Body: { propertyId, text, userId }
  └── Response: Complaint (with severity from LLM)

GET /api/complaints
  └── Response: Complaint[]

POST /api/complaints/:id/resolve
  └── Response: Complaint
```

## LLM Integration Points (Future)

### Current: Simulated
```javascript
severity = Math.random() // 0-1
churnRisk = Math.random() // 0-1
recommendations = getRecommendations(text) // Keyword matching
```

### Future: Real LLM
```javascript
async function analyzComplaint(text) {
  const response = await fetch('/api/llm/analyze', {
    method: 'POST',
    body: JSON.stringify({ complaint: text })
  })
  
  return {
    severity: response.severity, // 0-1 from LLM
    churnRisk: response.churnRisk, // 0-1 from LLM
    recommendations: response.recommendations // Generated by LLM
  }
}
```

## Performance Optimizations

### Current Implementation
- React.memo for cards (optional)
- useEffect for filtering
- localStorage for persistence
- Lazy image loading (via native img)

### Future Optimizations
- Code splitting per route
- Image optimization & CDN
- API response caching
- Virtual scrolling for large lists
- Memoization of filter functions

## Security Considerations

### Current (Development Only)
- localStorage used for demo
- No authentication
- No input sanitization

### Future (Production)
- JWT authentication
- HTTPS for all API calls
- XSS protection (DOMPurify)
- CSRF tokens
- Rate limiting
- Input validation
- SQL injection prevention (backend)

## Testing Strategy

### Unit Tests
- Filter logic
- Recommendation engine
- Data transformation functions

### Integration Tests
- Search + Filter together
- Reservation flow
- Complaint submission + admin review

### E2E Tests
- Complete user journey
- Admin workflow
- Data persistence

## Deployment

### Build
```bash
npm run build
```

### Output
```
dist/
├── index.html
├── assets/
│   ├── index-*.js
│   └── index-*.css
```

### Deployment Options
- Vercel (recommended)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Docker containerization

## File Size Metrics

```
Bundle Size (Gzip): ~45KB
JS: ~35KB
CSS: ~10KB
Images: Loaded from URLs
```

---

**Architecture designed for scalability and future backend integration.**
