import { FirebaseError, initializeApp } from "firebase/app";
import { getDatabase, ref, set as set_firebase, get, onValue, push, child } from "firebase/database";
import { writable } from 'svelte/store';
const FIREBASE_API_KEY = "AIzaSyACIQ7aK-Eedrj-UjJBLaNpOQg8YodVoMg"

const firebaseConfig = {
	apiKey: FIREBASE_API_KEY,
	authDomain: "vrc-scouting-6c4df.firebaseapp.com",
	databaseURL: "https://vrc-scouting-6c4df-default-rtdb.firebaseio.com",
	projectId: "vrc-scouting-6c4df",
	storageBucket: "vrc-scouting-6c4df.appspot.com",
	messagingSenderId: "20598010112",
	appId: "1:20598010112:web:cbd9e337b13351808103e5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase();

export let teams = {}
export let categories = writable({})

export function updateDb(path, data){
	set_firebase(ref(db, path), data)
}

const callbacks = [];
export function dbUpdated(callback){
	callbacks.push(callback);
}

const dbRefTeams = ref(db, "teams")
onValue(dbRefTeams, snapshot => {
	teams = snapshot.val()
	for(let i = 0; i < callbacks.length; i++){
		callbacks[i]()
	}
});

const dbRefCategories = ref(db, "categories")
onValue(dbRefCategories, snapshot => {
	categories.set(snapshot.val())
	for(let i = 0; i < callbacks.length; i++){
		callbacks[i]()
	}
})