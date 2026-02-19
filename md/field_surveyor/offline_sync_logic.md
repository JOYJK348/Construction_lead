# Field Surveyor - Offline Integrity & Sync Logic

## 1. Introduction
The site visits often take place in remote villages or construction sites with poor network connectivity (Edge/2G). To ensure that a surveyor never loses data, the application implements a robust **Offline-First Mode**.

## 2. In-Progress Storage (Local State)
*   **Volatile Memory**: While filling the 6-step form, the data is held in the React state.
*   **Session Persistence**: (Planned Improvement) Integrating `localStorage` for form drafts, so that if the phone's battery dies or the browser refreshes, the data is not lost.

## 3. Handling Upload Failures
If a surveyor clicks "Submit" and the internet is unstable:
*   **Retry Logic**: The application displays a "Network Error - Retrying" message.
*   **Lead Preservation**: The data remains in the form UI, allowing the surveyor to move to a higher signal area (like a nearby road or terrace) and click submit again without re-entering the data.

## 4. Media Synchronization (Image Handling)
*   **Foreground Upload**: Images are compressed locally (client-side) before they are ever sent to the server.
*   **Optimistic Notifications**: The app informs the user as each photo is successfully staged for upload.

## 5. Background Refresh
Even if the surveyor isn't filling a form, the app keeps the dashboard updated:
*   **Status Sync**: When the phone regains internet, the app fetches the latest approval/rejection statuses from the server in the background.
*   **Subscription Management**: Uses Supabase Realtime channels to listen for updates specific to that surveyor's ID.

## 6. Business Value
*   **Zero Data Loss**: Ensures that a whole day's work isn't lost due to a simple network glitch.
*   **Surveyor Productivity**: Engineers can focus on capturing measurements and photos without worrying about "Are bars (signal) high enough?".
*   **Reliability**: Builds trust in the digital system among a workforce that might be used to traditional paper-based methods.
