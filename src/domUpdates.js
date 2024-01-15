import {
	getCustomerBooking,
	filterBookingsByUser,
	getTotalSpent,
	filterRoomsByType,
	filterRoomsByDate,
	generateDateString,
	apiFetch,
	getAllRoomTypes
} from "../src/customers";


//Query Selectors:
const aboutYosemite = document.querySelector('.about-yosemite');
const availableBookings = document.querySelector('.available-bookings');
const myAccount = document.querySelector('.my-account');
const selectedDateField = document.querySelector('#select-booking-date');
const selectedDateButton = document.querySelector('#submit-date')
const availableRoomTypesSection = document.querySelector('.rooms-type-buttons-section');

//DOM Variables:
let currentUser;
let bookingsData;
let roomsData;
let filteredRooms;
let availableRoomTypes;

//Event Listeners
window.addEventListener('load', function () {
	console.log('window had loaded');
	getCurrentUser();
	getBookingData();
	getRoomsData();
})

aboutYosemite.addEventListener('click', function () {
	console.log("Button about-yosemite was pressed");
	console.log(roomsData);
})
availableBookings.addEventListener('click', function () {
	console.log("Button available-bookings was pressed");
	console.log(bookingsData[1]);
})

myAccount.addEventListener('click', function () {
	console.log("Button my-account was pressed");
	console.log('Current User: ', currentUser);
})

selectedDateButton.addEventListener('click', function () {
	dateSubmissionAction();
	console.log("fitlered rooms available: ", filteredRooms);
	console.log("All filtered Room types: ", availableRoomTypes);
})

availableRoomTypesSection.addEventListener('click' , function () {

})

//Dom Functions:
function getCurrentUser() {
	apiFetch('customers')
		.then((customer) => {
			currentUser = customer
		})
}

function getBookingData() {
	apiFetch('bookings')
		.then((bookings) => {
			bookingsData = bookings.bookings;
		})
}

function getRoomsData() {
	apiFetch('rooms')
		.then((rooms) => {
			roomsData = rooms.rooms;
		})
}

function dateSubmissionAction() {
	const inputValue = selectedDateField.value;
	const formattedDate = inputValue.replace(/-/g, '/');
	console.log('Inputed Date: ', formattedDate);
	filteredRooms = filterRoomsByDate(formattedDate, roomsData, bookingsData)
	availableRoomTypes = getAllRoomTypes(filteredRooms);
	availableRoomTypesSection.innerHTML = '';
	availableRoomTypes.forEach((roomType , index) => {
		availableRoomTypesSection.innerHTML += `<button class="rooms-type-buttons" id="room-type-${index + 1}">${roomType}</button>`
	});
}

function hide(element) {
  element.classList.add('hidden');
}

function show(element) {
  element.classList.remove('hidden');
}

console.log('domUpdates.js had been sucessfully loaded');