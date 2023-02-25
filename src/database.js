import { FirebaseError, initializeApp } from "firebase/app";
import { getDatabase, ref, set as set_firebase, get, onValue, push, child } from "firebase/database";
import { writable } from 'svelte/store';
export let team = writable(localStorage.getItem("accountNumber"));
let $team;
team.subscribe(v => $team = v);
export let event = writable(localStorage.getItem("event"));
let $event;
event.subscribe(v => $event = v);
export let division = writable(localStorage.getItem("division"));
let $division;
division.subscribe(v => $division = v);
export let disableDivisionSelect = writable(false);
export let eventMatches = writable({
	qualifications: {},
	r16: {},
	"quarter-finals": {},
	"semi-finals": {},
	final: {}
});
let $eventMatches;
eventMatches.subscribe(v => $eventMatches = v);
let startingType = localStorage.getItem("sortingType")
if(!startingType){
	startingType = "rank"
	localStorage.setItem("sortingType", "rank")
}
export let sortingType = writable(startingType)
const FIREBASE_API_KEY = "AIzaSyACIQ7aK-Eedrj-UjJBLaNpOQg8YodVoMg"
const ROBOT_EVENTS_KEY =
	"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiYzBmOTA1YmJhYTUxMzljNGNiNGNhN2E5N2NiMTFjMTUxZGE1YzA2MTZlNGNjOTIzYTIyZjFiMzlkNGUzZTEzYzA3MGExZGRmYTYzZmM0ZDIiLCJpYXQiOjE2NzQzNTc0MDguMTc0MzgwMSwibmJmIjoxNjc0MzU3NDA4LjE3NDM4MjksImV4cCI6MjYyMTEyODYwOC4xNjY3ODE5LCJzdWIiOiIxMTE2NTUiLCJzY29wZXMiOltdfQ.JeWKVXzcFuAjpObWa0n3javoRWJykyQBfj_DBwpOXyttaM58U30_c3X8G6cOLkz5tWjDTubAU9IqhqjirEfrRHIj2aFoEtnfol9q_1uV4uZG78jNODscCVQL0qnGscOjn9WiE76rTlYovMkEfYtvEIiB63WIh36cM5rR9Vi_6Ng8CcMGV8T5uH-hnUMD9wL3UsBEUF8XepvI6Mpf_lbKrDPUEYDvvApfd84rLA2T6jgAwL3_z7tlF7b0CJ-ONGvjrezgkkyVUcF4azIuTV6Svlogj996dXAQfvHW64RAcHp-8CDItFt81CEh_15jasJEht6wKjTzqshDxsdqpFy2vZX2H2RabncVBmhNsmBPnQkDXpsrU6QAOF4pR308g0IvcsW4B_3ZLimU5vLg3GO57z1picRAVBo8r9NgZpcOZDoJBmiZs16v-h_1PCIQ4TOgEYKzNaq7cJBWCrToKFT_CftavB8Dd5kN9swXhoWiJGgLRY9dO8n0sP8Qrm-rQs2QczQWEFGxOroCnZLg2V_foUtpUK9hKQvvC-nGwIGM0izsAPjmvntY_oRucw4NkJyC9FWvAsHReh6YPUFX5LS437dfDlr0RXrPSg6v8SsONEL25pv8tqgZEYwDg8pHb8Y2QjnutBAM-8RH2yGfNEnLrVYObacT_raq4IgqQujcVEU";


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

(async () => {
	if($division || !$event) return
		division.set(Object.values(await getDivisionsFromDb())[0])
		localStorage.setItem("division", $division)
		location.reload()
})()

export let teams = writable({})
export let categories = writable({})
export let accounts = writable({})

export function updateDb(path, data) {
	set_firebase(ref(db, path), data)
}

export async function getEvents(teamId) {
	let response = await (await fetch(`https://www.robotevents.com/api/v2/teams/${teamId}/events?season%5B%5D=173`, { headers: { "accept": "application/json", "Authorization": `Bearer ${ROBOT_EVENTS_KEY}` } })).json()
	return response
}

export async function getDivisionsFromDb() {
	let divs = {}
	await get(child(ref(getDatabase()), `accounts/${$team}/events/${$event}/divisions`)).then((snapshot) => {
		divs = snapshot.val()
	})
	return divs
}

export async function getDivisions(eventId) {
	let response = await (await fetch(`https://www.robotevents.com/api/v2/events/${eventId}`, { headers: { "accept": "application/json", "Authorization": `Bearer ${ROBOT_EVENTS_KEY}` } })).json()
	return response
}

export async function updateMatches(page, eventId) {

	disableDivisionSelect.set(true);
	let response = await (
		await fetch(
			`https://www.robotevents.com/api/v2/events/${eventId}/divisions/${$division}/matches?page=${page}`,
			{
				headers: {
					accept: "application/json",
					Authorization: `Bearer ${ROBOT_EVENTS_KEY}`,
				},
			}
		)
	).json();



	for (let match of response.data) {
		let tempMatchInfo = $eventMatches
		let round = match.round
		if (round == 2) {
			tempMatchInfo.qualifications[match.matchnum] = match
		}
		else if (round == 6) {
			tempMatchInfo.r16[match.instance] = match
		}
		else if (round == 3) {
			tempMatchInfo["quarter-finals"][match.instance] = match
		}
		else if (round == 4) {
			tempMatchInfo["semi-finals"][match.instance] = match
		}
		else if (round == 5) {
			tempMatchInfo.final[match.instance] = match
		}

		eventMatches.set(tempMatchInfo)
	}

	if (response.meta.current_page != response.meta.last_page) {
		await updateMatches(page + 1, eventId);
	}

	disableDivisionSelect.set(false);
}

const callbacks = [];
const eventCallbacks = [];
export function dbUpdated(callback) {
	callbacks.push(callback);
}

export function eventsUpdated(callback) {
	eventCallbacks.push(callback);
}

const dbRefAccounts = ref(db, "accounts")
onValue(dbRefAccounts, snapshot => {
	accounts.set(snapshot.val())
	for (let i = 0; i < eventCallbacks.length; i++) {
		eventCallbacks[i]()
	}
});

const dbRefTeams = ref(db, `accounts/${$team}/events/${$event}/teams`)
onValue(dbRefTeams, snapshot => {
	teams.set(snapshot.val())
	for (let i = 0; i < callbacks.length; i++) {
		callbacks[i]()
	}
});

const dbRefCategories = ref(db, `accounts/${$team}/events/${$event}/categories`)
onValue(dbRefCategories, snapshot => {
	categories.set(snapshot.val())
	for (let i = 0; i < callbacks.length; i++) {
		callbacks[i]()
	}
})