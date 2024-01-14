//Will hold all users functions
/*
get what bookings they have in our system
get what bookings they've made in the past for the future
show them rooms based of a specific:
	type of room
show them rooms availability based on a specific date


*/

function getCustomerBooking(customer, bookingsArray) {
	let customerID = customer.id;
	let finalArray = []
	finalArray = bookingsArray.filter((booking) => booking.userID === customerID);
	if (finalArray.length > 0) {
		return finalArray
	} else {
		return 'Error: You Have no bookings in our system.'
	}
}

function filterBookingsByUser(bookingsArray) {
	if (bookingsArray === 'Error: You Have no bookings in our system.') {
		return 'Error: You Have no Bookings in our System.'
	}
	let filteredBookingObject = { pastBookings: [], upcomingBookings: [] }
	let currentDate = new Date();
	bookingsArray.forEach(booking => {
		let bookingDate = new Date(booking.date);
		if (bookingDate < currentDate) {
			filteredBookingObject.pastBookings.push(booking)
		} else {
			filteredBookingObject.upcomingBookings.push(booking);
		}
	});
	return filteredBookingObject;
}

function getTotalSpent(bookingsArray, roomsArray) {
	if (bookingsArray === 'Error: You Have no bookings in our system.') {
		return 'Error: You Have no Bookings in our System.'
	}
	let roomNumbersArray = [];
	let totalCostSpent = 0;
	bookingsArray.forEach(booking => {
		roomNumbersArray.push(booking.roomNumber)
	});
	roomsArray.forEach(room => {
		roomNumbersArray.forEach(roomNumber => {
			if (room.number === roomNumber) {
				totalCostSpent += room.costPerNight;
			}
		})
	});
	return Number(totalCostSpent.toFixed(2));
}

function filterRoomsByType(specificRoomType, roomsArray) {
	let filterRooms = roomsArray.filter((room) => room.roomType === specificRoomType);
	if (filterRooms.length === 0) {
		return 'Error: The Room type you inputed does not exist'
	} else {
		return filterRooms;
	}
}

function filterRoomsByDate(specificDate, roomsArray, bookingsArray) {
	let openRooms = roomsArray.filter(room => {
		return !bookingsArray.some(booking =>
			(booking.roomNumber === room.number && booking.date === specificDate)
		)
	})
	return openRooms;
}

function generateDateString(year, month, day) {
	return
}

function testFetch() {
	let apiUrl = 'http://localhost:3001/api/v1/customers';
	fetch(apiUrl)
		.then(response => response.json())
		.then(data => console.log(data));
}

export {
	getCustomerBooking,
	filterBookingsByUser,
	getTotalSpent,
	filterRoomsByType,
	filterRoomsByDate,
	generateDateString
}

// testFetch();