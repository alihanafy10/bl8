# 🔌 Ambulance Service API Integration Guide

This document explains how to integrate the Emergency Incident Reporter with your ambulance service's API.

## Overview

The application sends incident reports to your ambulance service API endpoint. Reports include:
- Incident photos and face verification photos
- GPS coordinates
- Governorate and region information
- Incident description
- Timestamp
- Unique report ID

## Report Data Format

### POST Request to Ambulance API

The application will send a POST request with the following JSON payload:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "location": {
    "latitude": 30.0444,
    "longitude": 31.2357,
    "governorate": "Cairo",
    "region": "Nasr City"
  },
  "description": "Traffic accident on Ring Road",
  "photos": {
    "incident": "incident-1705318200000-123456789.jpg",
    "face": "face-1705318200000-987654321.jpg"
  },
  "reportId": "RPT-1705318200000-ABC123XYZ"
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | ISO 8601 String | When the report was created |
| `location.latitude` | Number | GPS latitude coordinate |
| `location.longitude` | Number | GPS longitude coordinate |
| `location.governorate` | String | Egyptian governorate name (English) |
| `location.region` | String | City/region within governorate |
| `description` | String | User-provided incident description |
| `photos.incident` | String | Filename of incident photo |
| `photos.face` | String | Filename of face verification photo |
| `reportId` | String | Unique report identifier |

## Configuration

### Environment Variables

Set these in your `.env` file:

```env
# Required: Your ambulance service API endpoint
AMBULANCE_API_URL=https://api.your-ambulance-service.com/reports

# Optional: API authentication key
AMBULANCE_API_KEY=your_secret_api_key_here

# Optional: Enable/disable API auth
API_AUTH_ENABLED=true
```

### Authentication

#### Bearer Token Authentication

If your API uses Bearer token authentication:

```env
AMBULANCE_API_KEY=your_bearer_token
```

The application will send:
```
Authorization: Bearer your_bearer_token
```

#### API Key Authentication

For custom header authentication, modify `server/index.js`:

```javascript
const headers = {
  'X-API-Key': process.env.AMBULANCE_API_KEY
};
```

#### No Authentication

If your API doesn't require authentication, leave `AMBULANCE_API_KEY` empty:

```env
AMBULANCE_API_URL=https://api.your-ambulance-service.com/reports
# AMBULANCE_API_KEY not set
```

## Implementation Examples

### Example 1: Basic REST API

```javascript
// Your ambulance service API endpoint
POST https://api.ambulance.com/v1/reports

// Expected response
{
  "success": true,
  "reportId": "RPT-1705318200000-ABC123XYZ",
  "dispatchStatus": "ambulance_dispatched",
  "estimatedArrival": 15
}
```

### Example 2: With Authentication

```javascript
POST https://api.ambulance.com/v1/reports
Headers:
  Authorization: Bearer your_secret_token
  Content-Type: application/json

Body: {
  // Report data as shown above
}

Response: {
  "success": true,
  "reportId": "RPT-1705318200000-ABC123XYZ",
  "message": "Report received and ambulance dispatched"
}
```

### Example 3: With Photo URLs

If you need to send photo URLs instead of filenames, modify `server/index.js`:

```javascript
const reportData = {
  // ... other fields
  photos: {
    incident: `${process.env.BASE_URL}/uploads/${req.files.incidentPhoto[0].filename}`,
    face: `${process.env.BASE_URL}/uploads/${req.files.facePhoto[0].filename}`
  }
};
```

Add to `.env`:
```env
BASE_URL=https://your-app-domain.com
```

## Handling Photos

### Option 1: Filename Only (Default)

The application sends just the filename. Your ambulance service can:
1. Request photos via a separate endpoint
2. Pull photos from a shared storage
3. Use a webhook to receive photos

### Option 2: Base64 Encoded Photos

To send photos as base64 strings, modify `server/index.js`:

```javascript
const fs = require('fs');

// Read and encode photos
const incidentPhotoBase64 = fs.readFileSync(
  req.files.incidentPhoto[0].path, 
  { encoding: 'base64' }
);
const facePhotoBase64 = fs.readFileSync(
  req.files.facePhoto[0].path, 
  { encoding: 'base64' }
);

const reportData = {
  // ... other fields
  photos: {
    incident: {
      filename: req.files.incidentPhoto[0].filename,
      data: incidentPhotoBase64,
      mimetype: 'image/jpeg'
    },
    face: {
      filename: req.files.facePhoto[0].filename,
      data: facePhotoBase64,
      mimetype: 'image/jpeg'
    }
  }
};
```

### Option 3: Upload to Cloud Storage

Upload photos to AWS S3, Azure Blob, or similar:

```javascript
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// Upload incident photo
const incidentUrl = await uploadToS3(req.files.incidentPhoto[0]);
const faceUrl = await uploadToS3(req.files.facePhoto[0]);

const reportData = {
  // ... other fields
  photos: {
    incident: incidentUrl,
    face: faceUrl
  }
};
```

## Error Handling

The application handles API errors gracefully:

1. **API Unreachable**: Report is saved locally, user notified
2. **Authentication Failure**: Logged in console, report saved locally
3. **Timeout**: Request times out after 30 seconds
4. **Invalid Response**: Report saved, error logged

### Customize Error Handling

Modify `server/index.js`:

```javascript
try {
  const apiResponse = await axios.post(
    process.env.AMBULANCE_API_URL,
    reportData,
    { 
      headers,
      timeout: 30000 // 30 second timeout
    }
  );
  
  if (apiResponse.data.success) {
    console.log('Report successfully sent to ambulance service');
  }
} catch (apiError) {
  console.error('Failed to send to ambulance API:', apiError.message);
  
  // Send alert, retry, or queue for later
  // Your custom error handling here
}
```

## Testing Your Integration

### 1. Mock API Testing

Use a mock API service like [RequestBin](https://requestbin.com/) or [Webhook.site](https://webhook.site/):

```env
AMBULANCE_API_URL=https://webhook.site/your-unique-id
```

### 2. Local Testing Server

Create a test API server:

```javascript
// test-api-server.js
const express = require('express');
const app = express();
app.use(express.json());

app.post('/reports', (req, res) => {
  console.log('Received report:', req.body);
  res.json({
    success: true,
    reportId: req.body.reportId,
    message: 'Test report received'
  });
});

app.listen(4000, () => {
  console.log('Test API server running on http://localhost:4000');
});
```

```env
AMBULANCE_API_URL=http://localhost:4000/reports
```

### 3. Postman Collection

Import this Postman request to test your API:

```json
{
  "name": "Ambulance Report Test",
  "request": {
    "method": "POST",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer your_api_key"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"timestamp\": \"2024-01-15T10:30:00.000Z\",\n  \"location\": {\n    \"latitude\": 30.0444,\n    \"longitude\": 31.2357,\n    \"governorate\": \"Cairo\",\n    \"region\": \"Nasr City\"\n  },\n  \"description\": \"Test incident\",\n  \"photos\": {\n    \"incident\": \"test-incident.jpg\",\n    \"face\": \"test-face.jpg\"\n  },\n  \"reportId\": \"RPT-TEST-12345\"\n}"
    },
    "url": {
      "raw": "https://your-api.com/reports",
      "protocol": "https",
      "host": ["your-api", "com"],
      "path": ["reports"]
    }
  }
}
```

## Security Considerations

1. **HTTPS Required**: Always use HTTPS for API endpoints
2. **API Key Security**: Never commit API keys to version control
3. **Rate Limiting**: Implement rate limiting on your API
4. **Input Validation**: Validate all incoming data
5. **Photo Verification**: Verify photo integrity and size
6. **Authentication**: Use strong authentication mechanisms
7. **Logging**: Log all API requests for audit trails

## Webhook Integration (Alternative)

Instead of pushing to your API, you can set up a webhook:

```javascript
// In server/index.js
app.post('/api/webhook', (req, res) => {
  // Your ambulance service calls this webhook
  const { reportId, status, ambulanceId } = req.body;
  
  // Update report status
  console.log(`Report ${reportId}: ${status}`);
  
  res.json({ success: true });
});
```

## Support

For integration assistance:
1. Check API error logs in console
2. Test with mock API first
3. Verify network connectivity
4. Check authentication credentials
5. Review your API documentation

## Example API Implementations

### Node.js/Express Example

```javascript
app.post('/api/reports', authenticate, async (req, res) => {
  try {
    const report = await Report.create(req.body);
    
    // Dispatch ambulance
    await dispatchAmbulance(report.location);
    
    res.json({
      success: true,
      reportId: report.id,
      message: 'Ambulance dispatched'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Python/Flask Example

```python
@app.route('/api/reports', methods=['POST'])
@require_auth
def create_report():
    data = request.get_json()
    
    report = Report.create(data)
    dispatch_ambulance(data['location'])
    
    return jsonify({
        'success': True,
        'reportId': report.id,
        'message': 'Ambulance dispatched'
    })
```

---

**Need Help?** Contact your development team or consult your ambulance service API documentation.
