import {
	getCustomerBooking,
	filterBookingsByUser,
	getTotalSpent,
	filterRoomsByType,
	filterRoomsByDate,
	generateDateString,
	apiFetch,
	getAllRoomTypes,
	addNewBooking
} from "../src/customers";


//Query Selectors:
const aboutYosemite = document.querySelector('.about-yosemite');
const availableBookings = document.querySelector('.available-bookings');
const selectBookingDateSection = document.querySelector('.select-booking-date-section')
const myAccount = document.querySelector('.my-account');
const userSidebarInfo = document.querySelector('.user-sidebar-information');
const openUserInfoButton = document.querySelector('.user-open-button');
const closeUserInfoButton = document.querySelector('.user-close-button');

const selectedDateField = document.querySelector('#select-booking-date');
const selectedDateButton = document.querySelector('#submit-date')
const roomsTypeSection = document.querySelector('.rooms-type')
const availableRoomTypesButtonSection = document.querySelector('.rooms-type-buttons-section');
const finalRoomsSection = document.querySelector('.available-rooms');
const finalRoomsDisplaySection = document.querySelector('.final-rooms-section');
const finalRoomModal = document.querySelector('.final-room-modal');
const finalRoomModalText = document.querySelector('.final-room-modal-text')
//DOM Variables:
let currentUser;
let currentUserBookings;
let currentUserTotalSpent;
let bookingsData;
let roomsData;
let savedDate;
let availableRooms;
let availableRoomTypes;
let finalRooms;
let choosenRoom;

//Event Listeners
window.addEventListener('load', function () {
	getCurrentUser();
	getBookingData();
	getRoomsData();
	console.log('window has loaded');
})

aboutYosemite.addEventListener('click', function () {
	console.log("Button about-yosemite was pressed");
	console.log(roomsData);
})


myAccount.addEventListener('click', function () {
	console.log("Button my-account was pressed");
	// console.log('Current User: ', currentUser.name);
	showAccountInformation(currentUser);
})

openUserInfoButton.addEventListener('click', function () {
	showAccountInformation(currentUser)
	openSideBar();
})

closeUserInfoButton.addEventListener('click', closeSideBar);

availableBookings.addEventListener('click', function () {
	console.log("Button available-bookings was pressed");
	// console.log(bookingsData[1]);
	show(selectBookingDateSection);
})

selectedDateButton.addEventListener('click', function () {
	dateSubmissionAction();//generates buttons for availableRoomsTypeSection
	// console.log("fitlered rooms available: ", availableRooms);
	// console.log("All filtered Room types: ", availableRoomTypes);
	show(roomsTypeSection);
})

availableRoomTypesButtonSection.addEventListener('click', function (event) {
	getSpecificRoomType(event);//Generate display of rooms availble in range
	show(finalRoomsSection);
})

finalRoomsDisplaySection.addEventListener('click' ,  function (event) {
	getFinalSelectedRoom(event);
})

finalRoomModal.addEventListener('click', function (event){
	bookChosenRoom(event)
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
	savedDate = formattedDate;
	// console.log('Inputed Date: ', savedDate);
	availableRooms = filterRoomsByDate(formattedDate, roomsData, bookingsData)
	if (availableRooms === "Error: There are no rooms available on that specific date.") {
		document.getElementById('apology-modal').style.display='block'
		return;
	}else{
		availableRoomTypes = getAllRoomTypes(availableRooms);
		availableRoomTypesButtonSection.innerHTML = '';
		availableRoomTypes.forEach((roomType, index) => {
		availableRoomTypesButtonSection.innerHTML += `<button class="rooms-type-buttons" id="${roomType}">${capitalizeEachWord(roomType)}</button>`
		});
	}
}

function getSpecificRoomType(event) {
	let selectedRoomType;
	if (event.target.closest('button').classList.contains('rooms-type-buttons')) {
		selectedRoomType = event.target.closest('button').id
		// console.log("Select Button ID: ", selectedRoomType);
		finalRooms = filterRoomsByType(selectedRoomType, availableRooms)
		displayFilteredRooms(finalRooms);
	}else{

	}
}

function displayFilteredRooms(roomsArray) {
	finalRoomsDisplaySection.innerHTML = ''
	roomsArray.forEach(room => {
		finalRoomsDisplaySection.innerHTML += `
		<div tabindex="0" class="displayed-room" id="${room.number}" style="border: 1px solid red;">
		<h4>Room: ${room.number}</h4>
		<p> ${room.numBeds} ${room.bedSize} Size Bed</p>
		<p>Bidet Included</p>
		<h5>Cost per Night: ${room.costPerNight}</h5>
		<input type="button" value="Book Room" onclick="document.getElementById('confirm-modal').style.display='block'" class="w3-button w3-black book-room-button">
		</div>
		`
	})
}


function getFinalSelectedRoom(event) {
	if (event.target.closest('input').classList.contains('book-room-button')) {
		choosenRoom = event.target.closest('div').id;
		finalRoomModalText.innerHTML =''
		finalRoomModalText.innerHTML += `
		Are you Booking for Room #${choosenRoom}
		`
		// console.log("Room id",choosenRoom);
		// console.log("Current User",currentUser);
		// console.log(savedDate);
		// addNewBooking(currentUser,savedDate,choosenRoom)
	}else {

	}
	showAccountInformation(currentUser);
}

function bookChosenRoom(event) {
	if (event.target.closest('input').classList.contains('confirm-room-button')) {
		addNewBooking(currentUser,savedDate,choosenRoom).then(data => {
			getCurrentUser();
			getBookingData();
			getRoomsData();
			document.getElementById('confirm-modal').style.display='none'
		})
	}else {
		return;
	}
}

function capitalizeEachWord(string) {
	return string.replace(/\b\w/g, match => match.toUpperCase());
}

function showAccountInformation(user) {
	let customerBooking = getCustomerBooking(user,bookingsData)
	
	currentUserBookings = filterBookingsByUser(customerBooking)
	currentUserTotalSpent = getTotalSpent(customerBooking,roomsData)

	userSidebarInfo.innerHTML = `
	<p class="user-past-bookings">Past Bookings:${currentUserBookings.pastBookings.length}</p>
	<p class="user-upcoming-bookings"> Future Bookings:${currentUserBookings.upcomingBookings.length}</p>
	<p class="user-total-spent">Total Amount Spent:${currentUserTotalSpent}</p>`;

}

function hide(element) {
	element.classList.add('hidden');
}

function show(element) {
	element.classList.remove('hidden');
}

function openSideBar() {
	document.getElementById("user-sidebar").style.width = "250px";
}

function closeSideBar() {
	document.getElementById("user-sidebar").style.width = "0px";
}

console.log('domUpdates.js had been sucessfully loaded');