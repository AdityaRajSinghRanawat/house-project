# Aura Platform - Quick Reference Guide

## Installation & Setup

### 1. Install Dependencies
```bash
cd c:\Users\Aditya\OneDrive\PROGRAMMING\aura
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Opens at: `http://localhost:5173/`

### 3. Build for Production
```bash
npm run build
```
Output: `dist/` folder

### 4. Preview Production Build
```bash
npm run preview
```

### 5. Lint Code
```bash
npm run lint
```

## File Structure Reference

```
aura/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx      (Top nav with icon buttons)
│   │   ├── PropertyCard.jsx    (Individual property card)
│   │   ├── SidebarFilter.jsx   (Bedrooms & price filters)
│   │   └── PropertyDetails.jsx (Property modal with slider)
│   │
│   ├── pages/
│   │   ├── HomePage.jsx        (Main landing page)
│   │   ├── ComplaintsPage.jsx  (User complaints)
│   │   └── AdminPage.jsx       (Admin dashboard)
│   │
│   ├── data/
│   │   └── properties.js       (Mock property data)
│   │
│   ├── App.jsx                 (Router setup)
│   ├── main.jsx                (Entry point)
│   ├── index.css               (Global styles)
│   └── App.css                 (Component styles)
│
├── public/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── FEATURES.md                 (Feature documentation)
├── ARCHITECTURE.md             (Technical architecture)
├── TESTING_GUIDE.md            (Testing procedures)
└── README.md                   (Original readme)
```

## Key Routes

```
/                    → HomePage (Browse & Reserve Properties)
/complaints          → ComplaintsPage (File & Manage Complaints)
/admin               → AdminPage (Manage Reservations & Complaints)
```

## Component API Reference

### Navigation Component
```jsx
<Navigation />
// Displays:
// - Aura logo
// - Home icon → /
// - Complaints icon → /complaints
// - Admin icon → /admin
```

### PropertyCard Component
```jsx
<PropertyCard 
  property={propertyObject}
  onClick={() => setSelectedProperty(propertyObject)}
/>
// Props:
// - property: { id, name, location, bedrooms, price, image, ... }
// - onClick: Callback to open property details
```

### SidebarFilter Component
```jsx
<SidebarFilter 
  filters={filters}
  setFilters={setFilters}
  onApply={() => {}}
/>
// State:
// - filters: { bedrooms: string, priceRange: 'all'|'budget'|'mid'|'premium' }
```

### PropertyDetails Component
```jsx
<PropertyDetails 
  property={selectedProperty}
  isOpen={boolean}
  onClose={() => {}}
  onReserve={(property) => {}}
/>
// Props:
// - property: Property object with images array
// - isOpen: Boolean to show/hide modal
// - onClose: Callback when user clicks close
// - onReserve: Callback when Reserve button clicked
```

## Data Structures

### Property Object
```javascript
{
  id: 1,
  name: "Luxury Apartment in Delhi",
  location: "Delhi",
  bedrooms: 3,
  bathrooms: 2,
  price: 45000,
  image: "https://...",
  images: ["https://...", ...],
  description: "Modern luxury apartment...",
  services: ["WiFi", "AC", "Parking", ...],
  owner: {
    name: "Rajesh Kumar",
    phone: "+91-98765-43210",
    email: "rajesh@example.com"
  }
}
```

### Reservation Object
```javascript
{
  id: 1707172800000,
  propertyId: 1,
  propertyName: "Luxury Apartment in Delhi",
  location: "Delhi",
  price: 45000,
  bedrooms: 3,
  date: "6/2/2026",
  status: "pending", // or "approved" or "declined"
  userName: "User",
  userPhone: "+91-98765-00000"
}
```

### Complaint Object
```javascript
{
  id: 1707172800000,
  propertyId: 1,
  propertyName: "Luxury Apartment in Delhi",
  complaintText: "Water tap is not working properly",
  date: "6/2/2026",
  severity: 0.75, // 0-1 scale
  churnRisk: 0.62, // 0-1 scale
  status: "pending", // or "resolved"
  recommendations: [
    "Contact plumber: 1800-PLUMBER",
    "Schedule property inspection"
  ]
}
```

## localStorage Management

### View Stored Data
```javascript
// In browser console:
JSON.parse(localStorage.getItem('reservations'))
JSON.parse(localStorage.getItem('complaints'))
```

### Clear All Data
```javascript
// In browser console:
localStorage.clear()
location.reload()
```

### Clear Specific Item
```javascript
localStorage.removeItem('reservations')
localStorage.removeItem('complaints')
```

## Styling Classes (Tailwind)

### Common Classes Used
```
Spacing: px-6, py-4, gap-4, mb-8, etc.
Colors: bg-blue-600, text-gray-700, etc.
Layout: flex, grid, grid-cols-1, lg:grid-cols-4
Effects: hover:shadow-xl, transition, rounded-lg
```

### Color Meanings
```
Blue (#3B82F6)     → Primary actions (Reserve, Apply)
Green (#16A34A)    → Success (Approved, Resolved)
Yellow (#EAB308)   → Pending/Warning status
Red (#DC2626)      → Decline/Error actions
Purple (#A855F7)   → Secondary gradient
Gray               → Text and backgrounds
```

## Common Development Tasks

### Add a New Property
1. Open `src/data/properties.js`
2. Add new object to `properties` array
3. Include all required fields (id, name, location, bedrooms, etc.)

### Add a Filter Option
1. Open `src/components/SidebarFilter.jsx`
2. Add new filter input (radio button, checkbox, select)
3. Update filter state structure
4. Add filtering logic in `HomePage.jsx` useEffect

### Add a New Route
1. Create new component file in `src/pages/`
2. Import in `App.jsx`
3. Add new `<Route>` in Routes component
4. Add navigation button in `Navigation.jsx`

### Connect to Real API
1. Create API service file: `src/services/api.js`
2. Replace hardcoded data calls with fetch/axios
3. Update component state management to handle async data
4. Add loading/error states

## Debugging Tips

### Browser DevTools
```javascript
// Check navigation working
window.location.pathname

// Monitor state changes
console.log('filters:', filters)

// Check localStorage updates
setInterval(() => {
  console.log(JSON.parse(localStorage.getItem('reservations')))
}, 1000)

// Monitor component renders
// Use React DevTools extension
```

### Common Issues
```
Issue: Styles not applying
Fix: Clear browser cache (Ctrl+Shift+Delete)

Issue: Old data showing
Fix: localStorage.clear() and refresh

Issue: Images not loading
Fix: Check image URLs are valid HTTPS

Issue: Filter not working
Fix: Ensure filter logic in useEffect dependency array
```

## Environment Variables (Future)

### Create `.env` file
```
VITE_API_URL=https://api.example.com
VITE_LLM_API_KEY=your_api_key
VITE_ENV=development
```

### Access in Code
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

## Git Commands

### Initialize git (if needed)
```bash
git init
git add .
git commit -m "Initial commit: Aura property rental platform"
```

### Create a feature branch
```bash
git checkout -b feature/add-notifications
```

### Commit changes
```bash
git add .
git commit -m "Add notification system"
```

## Performance Tips

### Monitor Bundle Size
```bash
npm run build
# Check dist/ folder size
```

### Optimize Images
```javascript
// Use optimized image URLs with query params
src={url + '?w=400&h=300&fit=crop'}
```

### Reduce Re-renders
```javascript
// Use useCallback for onClick handlers
const handleFilter = useCallback(() => {
  // filter logic
}, [dependencies])
```

## Documentation Files

- **README.md** - Project overview
- **FEATURES.md** - Feature documentation
- **ARCHITECTURE.md** - Technical details
- **TESTING_GUIDE.md** - Testing procedures
- **QUICK_REFERENCE.md** - This file

## Useful Links

- React Docs: https://react.dev
- React Router: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev
- Vite: https://vitejs.dev

## Support & Next Steps

### To Deploy
1. Run `npm run build`
2. Upload `dist/` folder to hosting (Vercel, Netlify, etc.)

### To Add Backend
1. Create Node.js/Express server
2. Add environment variables for API URL
3. Replace fetch calls with actual endpoints
4. Add authentication system

### To Integrate LLM
1. Sign up with OpenAI or similar
2. Create backend endpoint for analysis
3. Call LLM API in complaint submission
4. Store severity/churn scores in database

---

**Happy Coding! 🚀**
