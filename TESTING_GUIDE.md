# Aura Platform - Testing Guide

## Quick Start Testing

### 1. Homepage Testing
- [ ] Visit `http://localhost:5173/`
- [ ] Verify navigation bar with 3 icons appears at top
- [ ] Search for "Delhi" - should show Delhi properties
- [ ] Search for "Mumbai" - should show Mumbai properties
- [ ] Try other locations: Noida, Gurgaon, Kolkata, Jaipur
- [ ] Verify property cards display with image, name, bedrooms, and price

### 2. Filter Testing
- [ ] Click on "2 Bedrooms" filter - should show only 2 bedroom properties
- [ ] Select price range "₹25,000 - ₹50,000"
- [ ] Click "Apply Filters" - results should update
- [ ] Reset and try different filter combinations

### 3. Property Details Testing
- [ ] Click on any property card to open modal
- [ ] Click left/right arrows to browse through property images
- [ ] Verify property details (bedrooms, bathrooms, price, services)
- [ ] Check amenities list
- [ ] View owner contact information
- [ ] Click "Reserve" button - should show success message

### 4. Complaints Page Testing
- [ ] Click Complaints icon in navigation
- [ ] Should say "No approved reservations yet" initially
- [ ] Go back and reserve a property first
- [ ] Return to Complaints page
- [ ] Click "New Complaint" button
- [ ] Select the reserved property from dropdown
- [ ] Type a complaint like "water tap is not working"
- [ ] Click "Submit Complaint"
- [ ] Verify complaint appears in the list with:
  - Severity Score (0-100%)
  - Churn Risk (0-100%)
  - Recommendations

### 5. Admin Panel Testing

#### Reservations Tab
- [ ] Click Admin icon in navigation
- [ ] Should be on "Reservations" tab by default
- [ ] Verify reserved property appears in table with status "pending"
- [ ] Click "Approve" button - status should change to "approved"
- [ ] Verify you can click property name to see details
- [ ] Test declining a new reservation

#### Complaints Tab
- [ ] Click on "Complaints" tab
- [ ] Verify filed complaints appear
- [ ] Check severity scores are displayed
- [ ] Verify churn risk percentages
- [ ] Read through recommendations
- [ ] Click "Mark as Resolved" button
- [ ] Verify status changes to "resolved"

### 6. Navigation Testing
- [ ] Verify all 3 navigation icons work:
  - Home icon → returns to homepage
  - Document icon → goes to complaints
  - Settings icon → goes to admin panel
- [ ] Navigation bar is visible on all pages
- [ ] Icons are tooltipped on hover (optional)

### 7. Data Persistence Testing
- [ ] Make a reservation
- [ ] Refresh the page (F5)
- [ ] Verify reservation still exists
- [ ] File a complaint
- [ ] Refresh again
- [ ] Verify complaint still appears

## Test Scenarios

### Scenario 1: Customer Booking a Property
1. Search for "Gurgaon"
2. Click on "Premium Penthouse in Gurgaon"
3. Review details and services
4. Click "Reserve"
5. Go to Admin panel
6. Approve the reservation
7. Return to Complaints page
8. File a complaint about the AC
9. Admin reviews and provides recommendations

### Scenario 2: Multiple Complaints
1. Reserve 2 different properties
2. File 3 different complaints with various issues:
   - "Water pressure is very low"
   - "Electrical outlet not working"
   - "Neighbor noise is unbearable"
3. Admin reviews and checks different severity levels

## Expected Behaviors

### Severity Score Calculation
The system simulates severity scores (0-1) based on complaint keywords:
- Water issues = higher severity
- Electrical issues = high severity
- AC issues = medium severity
- Noise = medium-low severity

### Churn Risk
Simulated percentage (0-100%) indicating likelihood of tenant leaving based on complaint severity.

### Auto-Recommendations
- "water", "tap" → Contact plumber
- "electric", "light" → Contact electrician
- "ac", "cooling" → Contact AC technician
- "repair", "broken" → Schedule inspection
- "noise", "neighbor" → Contact management

## Browser Developer Tools

### To Clear Data
Open Console and run:
```javascript
localStorage.clear()
location.reload()
```

### To Inspect Stored Data
Open Console and run:
```javascript
console.log("Reservations:", JSON.parse(localStorage.getItem('reservations')))
console.log("Complaints:", JSON.parse(localStorage.getItem('complaints')))
```

## Common Issues & Solutions

### Issue: Property cards not showing
- **Solution**: Check if search term matches available locations (Delhi, Mumbai, Noida, Gurgaon, Kolkata, Jaipur)

### Issue: Can't file complaint
- **Solution**: Must reserve a property first. Admin must approve it before you can file complaints.

### Issue: Data disappeared after refresh
- **Solution**: Check browser's localStorage is enabled. Try clearing browser cache.

### Issue: Styles not loading properly
- **Solution**: Ensure Tailwind CSS compiled correctly. Run `npm run dev` again.

---

**Happy Testing!** 🎉
