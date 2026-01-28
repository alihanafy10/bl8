# Face Detection Models

This directory should contain the face-api.js models for face detection.

## Required Files

Download these files from the face-api.js repository:

1. `tiny_face_detector_model-weights_manifest.json`
2. `tiny_face_detector_model-shard1`

## Download Instructions

### Using curl (Recommended):

```bash
cd client/public/models

curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json

curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1
```

### Using wget:

```bash
cd client/public/models

wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json

wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1
```

### Manual Download:

1. Visit: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
2. Download the two files listed above
3. Place them in this directory

## Why Tiny Face Detector?

We use the Tiny Face Detector model because:
- **Small size**: ~300KB total (fast loading)
- **Fast performance**: Real-time detection on most devices
- **Good accuracy**: Sufficient for face verification
- **Mobile-friendly**: Works well on mobile browsers

## Verification

After downloading, this directory should contain:
```
client/public/models/
├── README.md (this file)
├── tiny_face_detector_model-weights_manifest.json
└── tiny_face_detector_model-shard1
```

## Troubleshooting

### Models not loading
- Check file names are exact (case-sensitive)
- Verify files are not corrupted (re-download if needed)
- Check browser console for 404 errors
- Ensure files are in correct directory

### Face detection not working
- Models will load automatically when app starts
- Check browser console for loading errors
- Application will work even if models fail to load
- Face capture will still function, just without validation

## Alternative Models

If you need different models (more accurate but larger):

**SSD MobileNet v1** (larger, more accurate):
- `ssd_mobilenetv1_model-weights_manifest.json`
- `ssd_mobilenetv1_model-shard1`
- `ssd_mobilenetv1_model-shard2`

To use different model, update `CameraCapture.js`:
```javascript
await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
// Use: new faceapi.SsdMobilenetv1Options()
```

## License

Models are from face-api.js and subject to their license terms.
Visit: https://github.com/justadudewhohacks/face-api.js
