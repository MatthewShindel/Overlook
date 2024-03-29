//Will hold all users functions


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
	if (openRooms.length === 0) {
		return "Error: There are no rooms available on that specific date."
	} else {
		return openRooms;
	}
}

function generateDateString(year, month, day) {
	const dateString = `${year}/${month}/${day}`
	const numericYear = parseInt(year, 10);
	const numericMonth = parseInt(month, 10);
	const numericDay = parseInt(day, 10);

	switch (true) {
		case isNaN(numericYear) || isNaN(numericMonth) || isNaN(numericDay):
			return 'Invalid input: Please provide valid values for year, month, and day.';
		case numericYear < 1990 || numericYear > 2099:
			return 'Invalid year: Please provide a valid year.';
		case numericMonth < 1 || numericMonth > 12:
			return 'Invalid month: Please provide a month between 1 and 12.';
		case numericDay < 1 || numericDay > 31:
			return 'Invalid day: Please provide a day between 1 and 31.';
		default:
			return dateString;
	}
}

function getAllRoomTypes(roomsArray) {
	let finalArray = [...new Set(roomsArray.map(item => item.roomType))]
	return finalArray
}


function apiFetch(apiType) {
	let apiUrl;
	apiUrl = `http://localhost:3001/api/v1/${apiType}`
	return fetch(apiUrl)
		.then(response => response.json())
}

function addNewBooking(user, dateString, roomNumber) {


	return fetch('http://localhost:3001/api/v1/bookings', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"userID": user.id,
			"date": dateString,
			"roomNumber": Number(roomNumber)
		})
	})
		.then((response) => {
			if (!response.ok)
				throw new Error(`Failed to add booking. Status: ${response.status}`);
			return response.json();
		}).then(data => console.log('success!')).then()
		.catch((error) => console.log('Error adding booking to bookings API'));
}



export {
	getCustomerBooking,
	filterBookingsByUser,
	getTotalSpent,
	filterRoomsByType,
	filterRoomsByDate,
	generateDateString,
	apiFetch,
	getAllRoomTypes,
	addNewBooking
}

// testFetch();