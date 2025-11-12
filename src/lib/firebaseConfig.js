import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Use the provided Firebase config
const firebaseConfig = {
	apiKey: "AIzaSyDp45JHqKctF0U-GJHaoXi855lDFW1vM1A",
	authDomain: "instagram-audio-download-32d54.firebaseapp.com",
	projectId: "instagram-audio-download-32d54",
	storageBucket: "instagram-audio-download-32d54.firebasestorage.app",
	messagingSenderId: "515654674540",
	appId: "1:515654674540:web:e5f4743bc9f1e8a33d5049",
	measurementId: "G-Q0LV73J67D"
};

// Initialize app only once
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Initialize analytics only in supported environments (avoids SSR and non-browser errors)
isSupported().then((supported) => {
	if (supported) {
		getAnalytics(app);
	}
}).catch(() => {});

export const auth = getAuth(app);
export default app;


