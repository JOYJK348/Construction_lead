# Field Surveyor - Step 04: Door Specifications & Smart Camera Logic

## 1. Introduction
The **Door Specifications** step is the technical core of the survey. This is where the Site Engineer records the actual manufacturing requirements. It combines manual data entry with "Smart Camera" technology to ensure maximum accuracy.

## 2. Multi-Door Categorization
The system divides requirements into four logical tabs for easier management:
*   **Main Door**: The entry point, usually requiring premium wood and larger dimensions.
*   **Interior Door**: Bedroom and living room doors.
*   **Bathroom Door**: Usually requires waterproof materials (PVC/WPC).
*   **Further Details (General)**: Pooja doors, balconies, or fire exits.

## 3. Data Collection per Door
For every category, the engineer records:
*   **Material Selection**: Choosing from predefined options (Wooden, WPC, Flush, FRP, etc.).
*   **Dimensions (Input)**:
    *   **Height**: Vertical measurement.
    *   **Width**: Horizontal measurement.
*   **Quantity**: Total number of doors required with these specific measurements.
*   **Frame Type**: Specifying if it is a Double Frame or Single Frame.

## 4. Smart Camera Integration (The Deep Feature)
Durkkas uses a specialized camera module that does more than just capture an image:

### A. Automatic Geo-Tagging (Proof of Visit)
When the "Capture Photo" button is clicked, the app automatically triggers the **GPS module**:
*   **Latitude & Longitude**: Captured instantly.
*   **Village Discovery**: The system performs a "Reverse Geocode" to find the exact Village Name.
*   **Tamper Proof**: The Admin will see exactly where the photo was taken, preventing the surveyor from uploading old photos from a different location.

### B. Intelligent Image Compression
Since site visits often happen in low-signal areas (villages):
*   **Automatic Downscaling**: High-resolution photos are compressed (max 1024px, 60% quality) before upload.
*   **Bandwidth Efficiency**: Reduces a 5MB photo to roughly 200KB without losing critical technical detail.

### C. Live Preview & Management
*   **Zoom-In functionality**: Allows the surveyor to check if the measurements in the photo are readable.
*   **Easy Deletion**: Photots can be replaced if the first attempt was blurred.

## 5. Technical Workflow
1.  **Selection**: User selects Door Type (e.g., Interior).
2.  **Trigger**: User clicks the "Camera" icon.
3.  **Process**: Location is fetched -> Photo is captured -> Image is compressed.
4.  **State Update**: The data is mapped to the `door_specifications` JSON object in the database.

## 6. Business Value
*   **Elimination of Error**: Photos provide a visual reference that production teams can use if they doubt the manual measurements.
*   **Management Trust**: Geo-tagging ensures that every lead in the system represents a genuine, physical site visit.
*   **Cost Control**: Accurate quantity and frame type data allow for perfect material estimation, reducing wastage.
