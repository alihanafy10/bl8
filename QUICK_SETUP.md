# ⚡ Quick Setup Guide - Ambulance Dispatch System

## 🎯 What You Have Now

A complete emergency response system with:
- ✅ Public incident reporting
- ✅ Smart ambulance dispatch
- ✅ Driver interface
- ✅ Admin dashboard
- ✅ Real-time tracking

---

## 🚀 System is LIVE on Vercel!

Your app is deployed at: `https://bl8.vercel.app`

---

## 📝 IMPORTANT: Add Sample Data to Test

Your system needs stations and ambulances to work. Here's how to add them:

### Method 1: Using API Calls (Postman/curl)

#### 1. Create Ambulance Station

```bash
curl -X POST https://bl8.vercel.app/api/admin/stations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cairo Central Hospital",
    "governorate": "Cairo",
    "district": "Nasr City",
    "location": {
      "latitude": 30.0444,
      "longitude": 31.2357
    },
    "address": "123 Medical St, Cairo",
    "contactPhone": "+20123456789",
    "totalAmbulances": 5
  }'
```

**Response will give you a station ID - SAVE IT!**

#### 2. Create Ambulance

```bash
curl -X POST https://bl8.vercel.app/api/admin/ambulances \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleNumber": "AMB-001",
    "stationId": "PUT_STATION_ID_HERE",
    "driver": {
      "name": "Ahmed Hassan",
      "phone": "+20111222333"
    }
  }'
```

**Response will give you an ambulance ID - SAVE IT FOR DRIVER LOGIN!**

### Method 2: Using MongoDB Directly

If you have access to MongoDB Atlas:

```javascript
// Insert Station
db.ambulancestations.insertOne({
  name: "Cairo Central Hospital",
  governorate: "Cairo",
  district: "Nasr City",
  location: { latitude: 30.0444, longitude: 31.2357 },
  address: "123 Medical St, Cairo",
  contactPhone: "+20123456789",
  totalAmbulances: 5,
  availableAmbulances: 5,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Insert Ambulance (use station _id from above)
db.ambulances.insertOne({
  vehicleNumber: "AMB-001",
  station: ObjectId("YOUR_STATION_ID"),
  status: "available",
  driver: {
    name: "Ahmed Hassan",
    phone: "+20111222333"
  },
  createdAt: new Date(),
  updatedAt: new Date()
});
```

---

## 🧪 Test the Complete System

### 1. Test Public Reporter
1. Go to `https://bl8.vercel.app`
2. Click through the interface:
   - Take incident photo
   - Take face verification
   - Add optional notes
   - Submit report
3. **You should see:** Ambulance dispatched with station name, distance, and ETA!

### 2. Test Driver Interface
1. Go to `https://bl8.vercel.app`
2. Click **"👨‍✈️ Driver Portal"**
3. Enter the ambulance ID (from step 2 above)
4. You'll see the dispatch assigned to you
5. Click through:
   - **Accept Dispatch**
   - **Depart to Scene** (can open Google Maps)
   - **Arrived at Scene** (this notifies management!)
   - **Complete Dispatch**

### 3. Test Admin Dashboard
1. Go to `https://bl8.vercel.app`
2. Click **"🏥 Admin Dashboard"**
3. Explore all tabs:
   - **Overview** - See statistics
   - **Active Dispatches** - Real-time tracking
   - **Stations** - All stations with availability
   - **Ambulances** - All ambulances with status

---

## 🗺️ How Smart Dispatch Works

When someone reports an incident:

1. **System captures location** (governorate, district, GPS)
2. **Searches for stations** in same governorate with available ambulances
3. **If none found** → Searches ALL stations
4. **Calculates distance** to each station
5. **Selects nearest station**
6. **Assigns available ambulance**
7. **Calculates ETA** (distance / 60 km/h)
8. **Shows user:** Station name, ambulance number, distance, ETA

---

## 📊 Status Tracking

### Complete Journey:

```
USER REPORTS
    ↓
SYSTEM DISPATCHES (finds nearest station)
    ↓
DRIVER ACCEPTS
    ↓
DRIVER DEPARTS
    ↓
DRIVER ARRIVES (management notified)
    ↓
DRIVER COMPLETES
    ↓
AMBULANCE AVAILABLE AGAIN
```

---

## 🎨 Three Interfaces in One App

### 1. Public Interface (Default)
- For general public
- Report incidents
- Get ambulance ETA

### 2. Driver Portal
- Click "👨‍✈️ Driver Portal" button
- Mobile-optimized
- Google Maps integration
- Update status in real-time

### 3. Admin Dashboard
- Click "🏥 Admin Dashboard" button
- Real-time statistics
- Monitor all dispatches
- Track ambulances
- View stations

---

## 📱 Access Points

**Main App:** https://bl8.vercel.app

**Navigation:**
- **Public Reporter:** Default homepage
- **Driver Portal:** Click button at top → Login with ambulance ID
- **Admin Dashboard:** Click button at top
- **Back to Reporter:** Click "← Back to Reporter" button

---

## 🔐 Production Recommendations

Before going live with real users:

1. **Add Authentication** - Secure driver and admin portals
2. **Add Admin Creation UI** - Build forms for creating stations/ambulances
3. **Test with Real Data** - Add your actual stations
4. **SMS Integration** - Notify drivers via SMS
5. **Push Notifications** - Real-time alerts
6. **Location Tracking** - Real-time GPS updates

---

## 🆘 Troubleshooting

### "No suitable ambulance station found"
**Problem:** No stations with available ambulances in database

**Solution:** Add stations and ambulances using the API calls above

### Driver can't see dispatch
**Problem:** Wrong ambulance ID or no active dispatches

**Solution:** 
1. Check ambulance ID is correct (MongoDB _id)
2. Make sure a report was submitted
3. Check admin dashboard to verify dispatch was created

### Ambulance not showing as available
**Problem:** Ambulance status not updated after completing dispatch

**Solution:** 
1. Complete the dispatch properly using driver interface
2. Check ambulance status in admin dashboard
3. Manually update in MongoDB if needed:
   ```javascript
   db.ambulances.updateOne(
     { _id: ObjectId("YOUR_AMBULANCE_ID") },
     { $set: { status: "available", currentDispatch: null } }
   )
   ```

---

## 📈 Sample Data Script

Here's a complete script to add multiple stations and ambulances:

```javascript
// Add to MongoDB or use API calls

// Cairo Station
{
  name: "Cairo Central Hospital",
  governorate: "Cairo",
  district: "Nasr City",
  location: { latitude: 30.0444, longitude: 31.2357 },
  address: "123 Medical St, Cairo",
  contactPhone: "+20123456789",
  totalAmbulances: 3,
  availableAmbulances: 3,
  isActive: true
}

// Alexandria Station  
{
  name: "Alexandria General Hospital",
  governorate: "Alexandria",
  district: "Smouha",
  location: { latitude: 31.2001, longitude: 29.9187 },
  address: "456 Coast Rd, Alexandria",
  contactPhone: "+20123456788",
  totalAmbulances: 2,
  availableAmbulances: 2,
  isActive: true
}

// Ambulances for Cairo
AMB-001, AMB-002, AMB-003

// Ambulances for Alexandria
AMB-004, AMB-005
```

---

## ✅ Verification Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel deployed successfully
- [ ] MongoDB connected
- [ ] At least 1 station created
- [ ] At least 1 ambulance created
- [ ] Public reporter works
- [ ] Driver portal accessible
- [ ] Admin dashboard shows data
- [ ] Can submit report and see dispatch
- [ ] Driver can update status
- [ ] Admin can view statistics

---

## 🎉 You're Ready!

Your complete emergency response system is deployed and ready to use!

**Next steps:**
1. Add your actual ambulance stations
2. Register your ambulances
3. Train drivers to use the driver portal
4. Monitor everything from admin dashboard

**Questions?** Check `AMBULANCE_SYSTEM_GUIDE.md` for detailed documentation.
