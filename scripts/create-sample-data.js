/**
 * Sample Data Creation Script
 * Run this to populate your database with test stations and ambulances
 */

const axios = require('axios');

const API_URL = 'https://bl8.vercel.app/api'; // Change to your URL

async function createSampleData() {
  console.log('🚀 Creating sample ambulance stations and ambulances...\n');

  try {
    // Create Station 1 - Cairo
    console.log('Creating Cairo Central Hospital...');
    const station1Response = await axios.post(`${API_URL}/admin/stations`, {
      name: "Cairo Central Hospital",
      governorate: "Cairo",
      district: "Nasr City",
      location: {
        latitude: 30.0444,
        longitude: 31.2357
      },
      address: "123 Medical St, Nasr City, Cairo",
      contactPhone: "+20123456789",
      totalAmbulances: 3
    });
    const station1Id = station1Response.data.station._id;
    console.log('✅ Station created! ID:', station1Id);

    // Create Ambulances for Station 1
    console.log('\nCreating ambulances for Cairo Central Hospital...');
    
    const ambulance1 = await axios.post(`${API_URL}/admin/ambulances`, {
      vehicleNumber: "AMB-001",
      stationId: station1Id,
      driver: {
        name: "Ahmed Hassan",
        phone: "+20111222333"
      }
    });
    console.log('✅ Ambulance AMB-001 created! ID:', ambulance1.data.ambulance._id);
    console.log('   👨‍✈️ Driver Login ID:', ambulance1.data.ambulance._id);

    const ambulance2 = await axios.post(`${API_URL}/admin/ambulances`, {
      vehicleNumber: "AMB-002",
      stationId: station1Id,
      driver: {
        name: "Mohamed Ali",
        phone: "+20111333444"
      }
    });
    console.log('✅ Ambulance AMB-002 created! ID:', ambulance2.data.ambulance._id);
    console.log('   👨‍✈️ Driver Login ID:', ambulance2.data.ambulance._id);

    // Create Station 2 - Alexandria
    console.log('\nCreating Alexandria General Hospital...');
    const station2Response = await axios.post(`${API_URL}/admin/stations`, {
      name: "Alexandria General Hospital",
      governorate: "Alexandria",
      district: "Smouha",
      location: {
        latitude: 31.2001,
        longitude: 29.9187
      },
      address: "456 Coast Rd, Smouha, Alexandria",
      contactPhone: "+20123456788",
      totalAmbulances: 2
    });
    const station2Id = station2Response.data.station._id;
    console.log('✅ Station created! ID:', station2Id);

    const ambulance3 = await axios.post(`${API_URL}/admin/ambulances`, {
      vehicleNumber: "AMB-003",
      stationId: station2Id,
      driver: {
        name: "Khaled Ibrahim",
        phone: "+20112444555"
      }
    });
    console.log('✅ Ambulance AMB-003 created! ID:', ambulance3.data.ambulance._id);
    console.log('   👨‍✈️ Driver Login ID:', ambulance3.data.ambulance._id);

    console.log('\n🎉 SUCCESS! Sample data created!\n');
    console.log('====================================');
    console.log('DRIVER LOGIN IDs (Save these!):');
    console.log('====================================');
    console.log('AMB-001:', ambulance1.data.ambulance._id);
    console.log('AMB-002:', ambulance2.data.ambulance._id);
    console.log('AMB-003:', ambulance3.data.ambulance._id);
    console.log('====================================\n');
    console.log('✅ You can now:');
    console.log('   1. Submit incident reports');
    console.log('   2. Login to driver portal with above IDs');
    console.log('   3. View admin dashboard\n');

  } catch (error) {
    console.error('❌ Error creating sample data:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

createSampleData();
