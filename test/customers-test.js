import chai from 'chai';
const expect = chai.expect;
// import { expect } from 'chai';

import { getCustomerBooking, filterBookingsByUser, getTotalSpent, filterRoomsByType, filterRoomsByDate, generateDateString} from "../src/customers";

describe('Customer tests', () => {
	let testUser1;
	let testUser2;
	let testUser3;
	let testUser4;
	let testBookings;
	let CorrectBookings1;
	let CorrectBookings2;
	let CorrectBookings3;
	let testRooms;
	beforeEach(function () {
		testUser1 = {
			"id": 1, "name": "Leatha Ullrich"
		}
		testUser2 = {
			"id": 2, "name": "Rocio Schuster"
		}
		testUser3 = {
			"id": 3, "name": "Kelvin Schiller"
		}
		testUser4 = {
			"id": 4, "name": "Kennedi Emard"
		}

		testBookings = [{ "id": "5fwrgu4i7k55hl6sz", "userID": 4, "date": "2022/04/22", "roomNumber": 3 },
		{ "id": "5fwrgu4i7k55hl6t5", "userID": 2, "date": "2021/02/24", "roomNumber": 2 },
		{ "id": "5fwrgu4i7k55hl6t6", "userID": 4, "date": "2022/01/10", "roomNumber": 3 },
		{ "id": "5fwrgu4i7k55hl6t7", "userID": 2, "date": "2024/02/16", "roomNumber": 4 },
		{ "id": "5fwrgu4i7k55hl6t8", "userID": 1, "date": "2022/02/05", "roomNumber": 5 },
		{ "id": "5fwrgu4i7k55hl6t9", "userID": 38, "date": "2025/12/14", "roomNumber": 1 }];

		CorrectBookings1 = [{ "id": "5fwrgu4i7k55hl6t8", "userID": 1, "date": "2022/02/05", "roomNumber": 5 }];

		CorrectBookings2 = [{ "id": "5fwrgu4i7k55hl6t5", "userID": 2, "date": "2021/02/24", "roomNumber": 2 },
		{ "id": "5fwrgu4i7k55hl6t7", "userID": 2, "date": "2024/02/16", "roomNumber": 4 }]

		CorrectBookings3 = [{ "id": "5fwrgu4i7k55hl6sz", "userID": 4, "date": "2022/04/22", "roomNumber": 3 },
		 { "id": "5fwrgu4i7k55hl6t6", "userID": 4, "date": "2022/01/10", "roomNumber": 3 }]

		testRooms = [{ "number": 1, "roomType": "residential suite", "bidet": true, "bedSize": "queen", "numBeds": 1, "costPerNight": 358.4 },
		{ "number": 2, "roomType": "suite", "bidet": false, "bedSize": "full", "numBeds": 2, "costPerNight": 477.38 },
		{ "number": 3, "roomType": "single room", "bidet": false, "bedSize": "king", "numBeds": 1, "costPerNight": 591.14 },
		{ "number": 4, "roomType": "single room", "bidet": false, "bedSize": "queen", "numBeds": 1, "costPerNight": 429.44 },
		{ "number": 5, "roomType": "single room", "bidet": true, "bedSize": "queen", "numBeds": 2, "costPerNight": 340.17 }]

	});
	describe('getCustomerBookings', () => {
		it('should see if a Customer can find their bookings', () => {
			let response = getCustomerBooking(testUser1, testBookings);
			expect(response).to.deep.equals(CorrectBookings1);
		})
		it('should see if another Customer can find their bookings', () => {
			let response = getCustomerBooking(testUser2, testBookings);
			expect(response).to.deep.equals(CorrectBookings2);
		})

		it('should see if a Customers can find their bookings, even if they booked the same room twice', () => {
			let response = getCustomerBooking(testUser4, testBookings);
			expect(response).to.deep.equals(CorrectBookings3);
		})

		it('should see if a Customer gets an error message if they do not have any bookings', () => {
			let response = getCustomerBooking(testUser3, testBookings);
			expect(response).to.deep.equals("Error: You Have no bookings in our system.");
		})
	});

	describe("filterBookingsByUser", () => {
		it('Should be able to filter a list of bookings to only show past bookings', () => {
			let totalBookings = getCustomerBooking(testUser2, testBookings);
			let response = filterBookingsByUser(totalBookings);
			expect(response.pastBookings[0]).to.deep.equals(CorrectBookings2[0]);
		})
		it('Should be able to filter a list of bookings to only show upcoming bookings', () => {
			let totalBookings = getCustomerBooking(testUser2, testBookings);
			let response = filterBookingsByUser(totalBookings);
			expect(response.upcomingBookings[0]).to.deep.equals(CorrectBookings2[1]);
		})
		it('Should be able to filter a list of bookings, and be able to access both past and upcoming bookings, even if one is empty', () => {
			let totalBookings = getCustomerBooking(testUser1, testBookings);
			let response = filterBookingsByUser(totalBookings);
			expect(response.pastBookings[0]).to.deep.equals(CorrectBookings1[0]);
			expect(response.upcomingBookings).to.deep.equals([]);
		})

		it('Should be able to filter a list of bookings, and be able see if there are no bookings past or present', () => {
			let totalBookings = getCustomerBooking(testUser3, testBookings);
			let response = filterBookingsByUser(totalBookings);
			expect(response).to.deep.equals('Error: You Have no Bookings in our System.');
		})

		it('Should be able to filter a list of bookings, even if the samme room is booked twice', () => {
			let totalBookings = getCustomerBooking(testUser4, testBookings);
			let response = filterBookingsByUser(totalBookings);
			expect(response.pastBookings).to.deep.equals(CorrectBookings3);
			expect(response.upcomingBookings).to.deep.equals([]);
		})
	});

	describe("getTotalSpent", () => {

		it('Should be able get a total value of all bookings', () => {
			let totalBookings = getCustomerBooking(testUser1, testBookings);
			let response = getTotalSpent(totalBookings, testRooms);
			expect(response).to.deep.equals(340.17);
		})
		it('Should be able get a total value of all bookings if you have booked multiple rooms', () => {
			let totalBookings = getCustomerBooking(testUser2, testBookings);
			let response = getTotalSpent(totalBookings, testRooms);
			expect(response).to.deep.equals(906.82);
		})
		it('Should be able get catch an error if you pass a bad array to the function', () => {
			let totalBookings = getCustomerBooking(testUser3, testBookings);
			let response = getTotalSpent(totalBookings, testRooms);
			expect(response).to.deep.equals('Error: You Have no Bookings in our System.');
		})

		it('Should be able get a total value of all bookings even if you have booked the same room twice', () => {
			let totalBookings = getCustomerBooking(testUser4, testBookings);
			let response = getTotalSpent(totalBookings, testRooms);
			expect(response).to.deep.equals(1182.28);
		})
	});

	describe('filterRoomsByType', () => {
		it('Should be able filter an array of rooms by "single room" ', () => {
			let response = filterRoomsByType('single room', testRooms);
			expect(response).to.deep.equals(testRooms.filter((room) => room.roomType === "single room"));
		})
		it('Should be able filter an array of rooms by "suite" ', () => {
			let response = filterRoomsByType('suite', testRooms);
			expect(response).to.deep.equals(testRooms.filter((room) => room.roomType === "suite"));
		})
		it('Should be able filter an array of rooms by "residential suite" ', () => {
			let response = filterRoomsByType('residential suite', testRooms);
			expect(response).to.deep.equals(testRooms.filter((room) => room.roomType === "residential suite"));
		})
		it('Should return an error message if the room type does not exsist', () => {
			let response = filterRoomsByType('Galaxy room', testRooms);
			expect(response).to.deep.equals('Error: The Room type you inputed does not exist');
		})
	});

	describe("filterRoomsByDate", () => {
		let testDate;
		let filteredRooms;
		beforeEach(function () {
			testDate = "2022/02/05"
			testBookings = [{ "id": "5fwrgu4i7k55hl6sz", "userID": 4, "date": "2022/04/22", "roomNumber": 3 },
			{ "id": "5fwrgu4i7k55hl6t5", "userID": 2, "date": "2021/02/24", "roomNumber": 2 },
			{ "id": "5fwrgu4i7k55hl6t6", "userID": 4, "date": "2022/01/10", "roomNumber": 3 },
			{ "id": "5fwrgu4i7k55hl6t7", "userID": 2, "date": "2021/02/24", "roomNumber": 4 },
			{ "id": "5fwrgu4i7k55hl6t8", "userID": 1, "date": "2022/02/05", "roomNumber": 5 },
			{ "id": "5fwrgu4i7k55hl6t9", "userID": 38, "date": "2021/02/24", "roomNumber": 1 }];

			filteredRooms = [{ "number": 1, "roomType": "residential suite", "bidet": true, "bedSize": "queen", "numBeds": 1, "costPerNight": 358.4 },
			{ "number": 2, "roomType": "suite", "bidet": false, "bedSize": "full", "numBeds": 2, "costPerNight": 477.38 },
			{ "number": 3, "roomType": "single room", "bidet": false, "bedSize": "king", "numBeds": 1, "costPerNight": 591.14 },
			{ "number": 4, "roomType": "single room", "bidet": false, "bedSize": "queen", "numBeds": 1, "costPerNight": 429.44 }]
		})
		it('Should be able filter out one element in an array of Bookings to see which rooms are available on that date', () => {
			let response = filterRoomsByDate(testDate,testRooms,testBookings)
			expect(response).to.deep.equals(filteredRooms);
		})
		it('Should be able filter an array of Bookings to see which rooms are available on that date', () => {
			testDate = "2021/02/24"
			filteredRooms = 
			[{ "number": 3, "roomType": "single room", "bidet": false, "bedSize": "king", "numBeds": 1, "costPerNight": 591.14 },
			{ "number": 5, "roomType": "single room", "bidet": true, "bedSize": "queen", "numBeds": 2, "costPerNight": 340.17 }]
			let response = filterRoomsByDate(testDate,testRooms,testBookings)
			expect(response).to.deep.equals(filteredRooms);
		})
		it('Should return the original array if the date is completely open', () => {
			testDate = "2020/01/21"
			let response = filterRoomsByDate(testDate,testRooms,testBookings)
			expect(response).to.deep.equals(testRooms);
		})
	});
	describe("generateDateString" , () => {
		it('Should be generate a string for date to use for searches', () => {
			let response = generateDateString("2023","02","25");
			expect(response).to.deep.equals("2023/02/25");
		})
		it('Should return an error if any variable is not valid', () => {
			let response1 = generateDateString("2023","02","45");
			let response2 = generateDateString("2023","21","25");
			let response3 = generateDateString("3023","02","25");
			let response4 = generateDateString("1923","02","25");
			let response5 = generateDateString("Potato","Tomato","25");	
			expect(response1).to.deep.equals("Invalid day: Please provide a day between 1 and 31.");
			expect(response2).to.deep.equals("Invalid month: Please provide a month between 1 and 12.");
			expect(response3).to.deep.equals("Invalid year: Please provide a valid year.");
			expect(response4).to.deep.equals("Invalid year: Please provide a valid year.");
			expect(response5).to.deep.equals("Invalid input: Please provide valid values for year, month, and day.");
		})

	})

})