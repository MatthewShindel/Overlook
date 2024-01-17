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
const aboutYosemiteArticle = document.querySelector('.about-yosemite-article');
const availableBookings = document.querySelector('.available-bookings');
const selectBookingDateSection = document.querySelector('.select-booking-date-section')
const newLogin = document.querySelector('.new-user-login');
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
const loginModal = document.querySelector('#login-modal');
const confirmLoginButton = document.querySelector('.confirm-login-button');
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
	showLoginModal();
	getBookingData();
	getRoomsData();
	console.log('window has loaded');
})

confirmLoginButton.addEventListener('click', function () {
	loginCustomer()
})

aboutYosemite.addEventListener('click', function () {
	console.log("Button about-yosemite was pressed");
	show(aboutYosemiteArticle);
	hide(selectBookingDateSection);
	hide(roomsTypeSection);
	hide(finalRoomsSection);
})


newLogin.addEventListener('click', function () {
	console.log("Button new-user-login was pressed");
	showLoginModal()
})

openUserInfoButton.addEventListener('click', function () {
	showAccountInformation(currentUser)
	openSideBar();
})

closeUserInfoButton.addEventListener('click', closeSideBar);

availableBookings.addEventListener('click', function () {
	console.log("Button available-bookings was pressed");
	hide(aboutYosemiteArticle);
	show(selectBookingDateSection);
})

selectedDateButton.addEventListener('click', function () {
	dateSubmissionAction();
	show(roomsTypeSection);
})

availableRoomTypesButtonSection.addEventListener('click', function (event) {
	getSpecificRoomType(event);//Generate display of rooms availble in range
	show(finalRoomsSection);
})

finalRoomsDisplaySection.addEventListener('click', function (event) {
	getFinalSelectedRoom(event);
})

finalRoomModal.addEventListener('click', function (event) {
	bookChosenRoom(event)

})
//Dom Functions:



function getCurrentUser(userNumber) {
	apiFetch(`customers/${userNumber}`)
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
	availableRooms = filterRoomsByDate(formattedDate, roomsData, bookingsData)
	if (availableRooms === "Error: There are no rooms available on that specific date.") {
		document.getElementById('apology-modal').style.display = 'block'
		return;
	} else {
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
		finalRooms = filterRoomsByType(selectedRoomType, availableRooms)
		displayFilteredRooms(finalRooms);
	} else {
		return;
	}
}

function displayFilteredRooms(roomsArray) {
	finalRoomsDisplaySection.innerHTML = ''
	roomsArray.forEach(room => {
		finalRoomsDisplaySection.innerHTML += `
		<div tabindex="0" class="displayed-room" id="${room.number}">
		<h4>Room: ${room.number}</h4>
		<p> ${room.numBeds} ${room.bedSize} Size Bed</p>
		<p>Bidet Included</p>
		<h5>Cost per Night: $${room.costPerNight}</h5>
		<input type="button" value="Book Room" onclick="document.getElementById('confirm-modal').style.display='block'" class="w3-button book-room-button">
		</div>
		`
	})
}


function getFinalSelectedRoom(event) {
	if (event.target.closest('input').classList.contains('book-room-button')) {
		choosenRoom = event.target.closest('div').id;
		finalRoomModalText.innerHTML = ''
		finalRoomModalText.innerHTML += `
		Are you Booking for Room #${choosenRoom}
		`
	} else {

	}
	showAccountInformation(currentUser);
}

function bookChosenRoom(event) {
	if (event.target.closest('input').classList.contains('confirm-room-button')) {
		addNewBooking(currentUser, savedDate, choosenRoom).then(data => {
			getCurrentUser(currentUser.id);
			getBookingData();
			getRoomsData();
			document.getElementById('confirm-modal').style.display = 'none'
			hide(finalRoomsSection)
			hide(roomsTypeSection)
			hide(selectBookingDateSection)
			show(aboutYosemiteArticle);
		})
	} else {
		return;
	}
}

function capitalizeEachWord(string) {
	return string.replace(/\b\w/g, match => match.toUpperCase());
}

function showAccountInformation(user) {
	let customerBooking = getCustomerBooking(user, bookingsData)

	currentUserBookings = filterBookingsByUser(customerBooking)
	currentUserTotalSpent = getTotalSpent(customerBooking, roomsData)

	userSidebarInfo.innerHTML = `
	<h3 class="user-info">My Account:</h3>
	<p class="user-info">User Id: ${currentUser.id}</p>
	<p class="user-info">Past Bookings:${currentUserBookings.pastBookings.length}</p>
	<p class="user-info"> Future Bookings:${currentUserBookings.upcomingBookings.length}</p>
	<p class="user-info">Total Amount Spent:${currentUserTotalSpent}</p>`;

}

function showLoginModal() {
	loginModal.style.display = 'block';
}

function loginCustomer() {
	const usernameInput = document.getElementById('username').value
	const passwordInput = document.getElementById('password').value

	const lastTwoNumbers = usernameInput.slice(-2);

	if ((passwordInput === 'password' || passwordInput === '1')) {
		alert('Successful Login!')
		getCurrentUser(lastTwoNumbers)
		document.getElementById('username').value = '';
		document.getElementById('password').value = '';

		loginModal.style.display = 'none'
	} else {
		alert('Invalid Login Information. Please try Again.')
	}

}

function hide(element) {
	element.classList.remove('visible');
	element.classList.add('hidden');
}

function show(element) {
	element.classList.remove('hidden');
	element.classList.add('visible');
}

function openSideBar() {
	document.getElementById("user-sidebar").style.width = "200px";
}

function closeSideBar() {
	document.getElementById("user-sidebar").style.width = "0px";
}

console.log('domUpdates.js had been sucessfully loaded');