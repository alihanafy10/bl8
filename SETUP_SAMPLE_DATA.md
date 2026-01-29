# 📊 Setting Up Sample Data

Your system needs ambulance stations and ambulances to work. Here are 3 easy methods:

---

## Method 1: Using Browser Console (Easiest!) ⭐

1. **Open your app:** https://bl8.vercel.app
2. **Open browser console:** Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
3. **Copy and paste this code:**

```javascript
// Create Cairo Station
fetch('https://bl8.vercel.app/api/admin/stations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Cairo Central Hospital",
    governorate: "Cairo",
    district: "Nasr City",
    location: { latitude: 30.0444, longitude: 31.2357 },
    address: "123 Medical St, Cairo",
    contactPhone: "+20123456789",
    totalAmbulances: 3
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Station created!', data);
  const stationId = data.station._id;
  
  // Create Ambulance
  return fetch('https://bl8.vercel.app/api/admin/ambulances', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vehicleNumber: "AMB-001",
      stationId: stationId,
      driver: { name: "Ahmed Hassan", phone: "+20111222333" }
    })
  });
})
.then(res => res.json())
.then(data => {
  console.log('✅ Ambulance created!');
  console.log('🚑 Vehicle:', data.ambulance.vehicleNumber);
  console.log('👨‍✈️ DRIVER LOGIN ID:', data.ambulance._id);
  alert('✅ Sample data created! Driver ID copied to console.');
})
.catch(err => console.error('❌ Error:', err));
```

4. **Press Enter**
5. **Check console output** - You'll see the Driver Login ID
6. **Copy the Driver Login ID** (the long string after `👨‍✈️ DRIVER LOGIN ID:`)

---

## Method 2: Using Postman or curl

### Step 1: Create Station

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
    "totalAmbulances": 3
  }'
```

**Copy the `_id` from the response!**

### Step 2: Create Ambulance

```bash
curl -X POST https://bl8.vercel.app/api/admin/ambulances \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleNumber": "AMB-001",
    "stationId": "PASTE_STATION_ID_HERE",
    "driver": {
      "name": "Ahmed Hassan",
      "phone": "+20111222333"
    }
  }'
```

**Copy the ambulance `_id` - This is your Driver Login ID!**

---

## Method 3: Directly in MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Browse Collections → `ambulancestations`
3. Click "Insert Document"
4. Paste:

```json
{
  "name": "Cairo Central Hospital",
  "governorate": "Cairo",
  "district": "Nasr City",
  "location": { "latitude": 30.0444, "longitude": 31.2357 },
  "address": "123 Medical St, Cairo",
  "contactPhone": "+20123456789",
  "totalAmbulances": 3,
  "availableAmbulances": 3,
  "isActive": true,
  "createdAt": { "$date": "2024-01-01T00:00:00.000Z" },
  "updatedAt": { "$date": "2024-01-01T00:00:00.000Z" }
}
```

5. Copy the generated `_id`
6. Browse Collections → `ambulances`
7. Click "Insert Document"
8. Paste (replace `YOUR_STATION_ID`):

```json
{
  "vehicleNumber": "AMB-001",
  "station": { "$oid": "YOUR_STATION_ID" },
  "status": "available",
  "driver": {
    "name": "Ahmed Hassan",
    "phone": "+20111222333"
  },
  "createdAt": { "$date": "2024-01-01T00:00:00.000Z" },
  "updatedAt": { "$date": "2024-01-01T00:00:00.000Z" }
}
```

9. Copy the generated ambulance `_id` - **This is your Driver Login ID!**

---

## 🧪 After Creating Data:

### Test Public Reporter:
1. Go to https://bl8.vercel.app
2. Submit a report
3. You should see: **"Ambulance Dispatched!"** with station name and ETA

### Test Driver Portal:
1. Click "👨‍✈️ Driver Portal"
2. Enter the Ambulance ID you copied
3. You should see an active dispatch
4. Try the workflow: Accept → Depart → Arrive → Complete

### Test Admin Dashboard:
1. Click "🏥 Admin Dashboard"
2. You should see:
   - 1 station
   - 1 ambulance
   - Statistics

---

## 📝 Quick Reference

**Station JSON Template:**
```json
{
  "name": "Your Hospital Name",
  "governorate": "Your Governorate",
  "district": "Your District",
  "location": { "latitude": 0.000, "longitude": 0.000 },
  "address": "Full address",
  "contactPhone": "+20XXXXXXXXX",
  "totalAmbulances": 3
}
```

**Ambulance JSON Template:**
```json
{
  "vehicleNumber": "AMB-XXX",
  "stationId": "station_id_from_above",
  "driver": {
    "name": "Driver Name",
    "phone": "+20XXXXXXXXX"
  }
}
```

---

## ⚠️ Important Notes:

1. **Driver Login ID** = Ambulance `_id` (not vehicle number!)
2. **Station must exist** before creating ambulances
3. **availableAmbulances** automatically matches totalAmbulances
4. Without data, reports will save but won't dispatch ambulances

---

## 🎯 Minimum Setup:

To test the full system, you need **at least**:
- ✅ 1 Ambulance Station
- ✅ 1 Ambulance

Then you can test the complete flow! 🚀
