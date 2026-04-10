# Aura Platform - Component & File Directory

## 📂 Project Structure

```
aura/
│
├── 📄 Configuration Files
│   ├── package.json              (Dependencies & scripts)
│   ├── vite.config.js            (Vite configuration)
│   ├── eslint.config.js          (Linting rules)
│   ├── index.html                (HTML entry point)
│   └── tailwind.config.js        (Tailwind setup)
│
├── 📁 src/
│   │
│   ├── 🎨 Components (Reusable)
│   │   ├── Navigation.jsx        (Top navigation bar with icon buttons)
│   │   ├── PropertyCard.jsx      (Property card component)
│   │   ├── SidebarFilter.jsx     (Filter sidebar)
│   │   └── PropertyDetails.jsx   (Property modal with image slider)
│   │
│   ├── 📄 Pages (Routes)
│   │   ├── HomePage.jsx          (Property listing & search)
│   │   ├── ComplaintsPage.jsx    (User complaints filing)
│   │   └── AdminPage.jsx         (Admin dashboard)
│   │
│   ├── 💾 Data
│   │   └── properties.js         (Mock property data - 6 properties)
│   │
│   ├── 🎯 Root Files
│   │   ├── App.jsx               (Main app with routing)
│   │   ├── main.jsx              (React DOM entry)
│   │   ├── App.css               (App styles)
│   │   └── index.css             (Global styles)
│   │
│   └── 📁 assets/               (Images, icons)
│
├── 📁 public/                   (Static files)
│
└── 📚 Documentation
    ├── README.md                 (Original readme)
    ├── FEATURES.md               (Feature documentation)
    ├── ARCHITECTURE.md           (Technical architecture)
    ├── TESTING_GUIDE.md          (Testing procedures)
    ├── QUICK_REFERENCE.md        (Developer reference)
    ├── IMPLEMENTATION_SUMMARY.md (What's been built)
    └── COMPONENT_DIRECTORY.md    (This file)
```

## 🎨 Components Detailed

### Navigation.jsx
**Location:** `src/components/Navigation.jsx`
**Purpose:** Top navigation bar present on all pages
**Features:**
- Logo display
- 3 icon-based navigation buttons
- Home route
- Complaints route
- Admin route
**Props:** None (uses React Router)
**Dependencies:** react-router-dom, lucide-react

```jsx
Usage in App.jsx:
<Router>
  <Navigation />
  <Routes>...</Routes>
</Router>
```

---

### PropertyCard.jsx
**Location:** `src/components/PropertyCard.jsx`
**Purpose:** Display individual property information in card format
**Features:**
- Property image
- Property name
- Location
- Bedroom count
- Monthly price
- Hover effects
- Click handler for expansion
**Props:**
```javascript
property: {
  id, name, location, bedrooms, bathrooms, 
  price, image, images, description, 
  services, owner
}
onClick: (property) => void
```
**Usage:**
```jsx
<PropertyCard 
  property={property}
  onClick={() => setSelectedProperty(property)}
/>
```

---

### SidebarFilter.jsx
**Location:** `src/components/SidebarFilter.jsx`
**Purpose:** Filter properties by bedroom count and price range
**Features:**
- Bedroom dropdown filter
- Price range radio buttons
- Apply filters button
- Form validation
**Props:**
```javascript
filters: { bedrooms: string, priceRange: string }
setFilters: (filters) => void
onApply: () => void
```
**Usage:**
```jsx
<SidebarFilter 
  filters={filters} 
  setFilters={setFilters}
  onApply={() => {}}
/>
```

---

### PropertyDetails.jsx
**Location:** `src/components/PropertyDetails.jsx`
**Purpose:** Display detailed property information in modal
**Features:**
- Image slider with prev/next buttons
- Current image indicator
- Property details grid
- Services checklist
- Owner contact information
- Reserve button
- Modal close button
**Props:**
```javascript
property: PropertyObject
isOpen: boolean
onClose: () => void
onReserve: (property) => void
```
**State:**
```javascript
currentImageIndex: number
```
**Usage:**
```jsx
<PropertyDetails
  property={selectedProperty}
  isOpen={!!selectedProperty}
  onClose={() => setSelectedProperty(null)}
  onReserve={handleReserve}
/>
```

---

## 📄 Pages Detailed

### HomePage.jsx
**Location:** `src/pages/HomePage.jsx`
**Purpose:** Main landing page with property search and discovery
**Features:**
- Location-based search box
- Real-time filtering
- Property grid (responsive)
- Sidebar filters
- Property details modal
- Reservation functionality
**State:**
```javascript
searchQuery: string
filteredProperties: Property[]
filters: { bedrooms: string, priceRange: string }
selectedProperty: Property | null
reservations: Reservation[]
```
**Methods:**
- handleReserve(property) - Save reservation to localStorage
- useEffect filters properties on search/filter change
**Route:** `/`

---

### ComplaintsPage.jsx
**Location:** `src/pages/ComplaintsPage.jsx`
**Purpose:** Allow users to file complaints about reserved properties
**Features:**
- Complaint form (only for approved reservations)
- Property selector
- Complaint text area
- Submit button
- Complaint history display
- Severity score
- Churn risk percentage
- Auto-generated recommendations
- Status tracking
**State:**
```javascript
reservations: Reservation[]
complaints: Complaint[]
selectedProperty: string
complaintText: string
showForm: boolean
```
**Methods:**
- handleSubmit(e) - File complaint
- getRecommendations(text) - Generate keyword-based recommendations
**Route:** `/complaints`

---

### AdminPage.jsx
**Location:** `src/pages/AdminPage.jsx`
**Purpose:** Admin dashboard for managing reservations and complaints
**Features:**
- Tab switching (Reservations/Complaints)
- Reservation table with approve/decline
- Detailed reservation modal
- Complaint management
- Severity visualization
- Churn risk display
- Recommendation listing
- Status management
**State:**
```javascript
reservations: Reservation[]
complaints: Complaint[]
activeTab: 'reservations' | 'complaints'
selectedReservation: Reservation | null
showDetails: boolean
```
**Methods:**
- handleApproveReservation(id)
- handleDeclineReservation(id)
- handleResolveComplaint(id)
- getChurnRiskColor(risk)
- getSeverityColor(severity)
**Route:** `/admin`

---

## 💾 Data Files

### properties.js
**Location:** `src/data/properties.js`
**Purpose:** Mock property data for demonstration
**Contents:** Array of 6 properties
**Structure:**
```javascript
{
  id: number,
  name: string,
  location: string,
  bedrooms: number,
  bathrooms: number,
  price: number,
  image: string (URL),
  images: string[] (URLs),
  description: string,
  services: string[],
  owner: {
    name: string,
    phone: string,
    email: string
  }
}
```
**Properties:**
1. Delhi - Luxury Apartment
2. Mumbai - Cozy Flat
3. Noida - Modern House
4. Gurgaon - Premium Penthouse
5. Kolkata - Budget-Friendly
6. Jaipur - Heritage Villa

---

## 🎯 Root Application Files

### App.jsx
**Purpose:** Main application component with routing
**Features:**
- Router setup
- Route configuration
- Provider setup (if needed)
**Routes:**
```jsx
/ → HomePage
/complaints → ComplaintsPage
/admin → AdminPage
```
**Structure:**
```jsx
<Router>
  <Navigation />
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/complaints" element={<ComplaintsPage />} />
    <Route path="/admin" element={<AdminPage />} />
  </Routes>
</Router>
```

---

### main.jsx
**Purpose:** React DOM entry point
**Features:**
- Renders App in root element
- Strict mode for development
**Content:**
```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

### Styling Files

#### App.css
- Basic global styles
- Scrollbar styling
- Font configuration

#### index.css
- Tailwind CSS imports
- Global typography
- Base styles

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────┐
│      LocalStorage (Browser)             │
│  ┌──────────────┐     ┌──────────────┐  │
│  │ Reservations │     │ Complaints   │  │
│  └──────────────┘     └──────────────┘  │
└────────┬──────────────────────┬─────────┘
         │                      │
    ┌────▼────┐            ┌───▼────┐
    │ HomePage │            │ Admin  │
    │          │            │ Page   │
    └────┬─────┘            └───┬────┘
         │                      │
    Reserves            Reviews &
    Property            Approves
         │                      │
         ▼                      ▼
    Complaint       Complaint
    Page            History
         │               │
         └───────┬───────┘
                 │
          Recommendations
          Generated
```

---

## 🔌 Component Dependencies

### Component Import Tree
```
App.jsx
├── Navigation.jsx
│   ├── react-router-dom (Link)
│   └── lucide-react (Icons)
│
├── HomePage.jsx
│   ├── PropertyCard.jsx
│   │   └── lucide-react (Icons)
│   ├── SidebarFilter.jsx
│   ├── PropertyDetails.jsx
│   │   └── lucide-react (Icons)
│   └── data/properties.js
│
├── ComplaintsPage.jsx
│   ├── lucide-react (Icons)
│   └── data/properties.js
│
└── AdminPage.jsx
    └── lucide-react (Icons)
```

---

## 📊 File Statistics

| File | Lines | Purpose |
|------|-------|---------|
| Navigation.jsx | 25 | Navigation bar |
| PropertyCard.jsx | 28 | Property card |
| SidebarFilter.jsx | 76 | Filter sidebar |
| PropertyDetails.jsx | 130 | Modal with slider |
| HomePage.jsx | 135 | Property listing |
| ComplaintsPage.jsx | 160 | Complaint filing |
| AdminPage.jsx | 190 | Admin dashboard |
| properties.js | 75 | Mock data |
| App.jsx | 17 | Main app |
| **Total** | **~900** | **Production code** |

---

## 🎯 Quick Component Lookup

**Need to modify...**
- Navigation layout → `Navigation.jsx`
- Property card design → `PropertyCard.jsx`
- Filter options → `SidebarFilter.jsx`
- Image slider → `PropertyDetails.jsx`
- Search functionality → `HomePage.jsx`
- Complaint form → `ComplaintsPage.jsx`
- Admin features → `AdminPage.jsx`
- Property list → `properties.js`
- Routes → `App.jsx`

---

## 🔗 Component Relationships

```
┌──────────────────────────────────┐
│      App (Router + Routes)       │
└────────────┬─────────────────────┘
             │
    ┌────────┼────────┐
    │        │        │
    ▼        ▼        ▼
┌────────┐┌──────────┐┌─────────┐
│ Home   ││Complaints││ Admin   │
│ Page   ││ Page     ││ Page    │
└─┬──────┘└──────────┘└─────────┘
  │
  ├─ Navigation (All pages)
  ├─ PropertyCard (HomePage)
  ├─ SidebarFilter (HomePage)
  └─ PropertyDetails (HomePage Modal)
```

---

**Component Directory Version: 1.0**
**Last Updated: February 6, 2026**

For detailed component usage, see ARCHITECTURE.md
For quick commands, see QUICK_REFERENCE.md
For testing, see TESTING_GUIDE.md
