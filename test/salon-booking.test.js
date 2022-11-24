import assert from 'assert';
import SalonBooking from '../salon-booking.js';
import pgPromise from 'pg-promise';

// TODO configure this to work.
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://buhle:buhle123@localhost:5432/salon_test";

const config = { 
	connectionString : DATABASE_URL
}

const pgp = pgPromise();
const db = pgp(config);

let booking = SalonBooking(db);

describe("The Booking Salon", function () {

    beforeEach(async function () {

        await db.none(`delete from booking`);

    });

    it("should be able to list treatments", async function () {

        const treatments = await booking.findAllTreatments();
        assert.equal(4, treatments?.length);
    });

    it("should be able to find a stylist", async function () {

        const stylist = await booking.findStylist("0786448520");
        assert.equal('Zezethu', stylist.first_name);
    });

    it("should be able to allow a client to make a booking", async function () {
        const client = await booking.findClient("0787858920");

        let treatmentId = 1;
        let stylistId = 1;
        let date = '2022-11-24';
        let time = '11:00';

        await booking.makeBooking(client.id, treatmentId, stylistId, date, time);

        const bookings = await booking.findClientBookings(client.id);
        assert.equal(1, bookings.length);
    });

    it("should be able to get client booking(s)", async function () {

        const client1 = await booking.findClient("0715354455");
        const client2 = await booking.findClient("0635249875");
        
        const treatment1 = await booking.findTreatment("BAL");
        const treatment2 = await booking.findTreatment("PED");

        // day1 - 11:00
        let stylistId1 = 1;
        let date1 = '2022-11-24';
        let time1 = '11:00';

        // day1 - 12:00
        let stylistId2 = 2;
        let date2 = '2022-11-24';
        let time2 = '11:00';

        await booking.makeBooking(client1.id, treatment1.id, stylistId1, date1, time1);
        await booking.makeBooking(client1.id, treatment2.id, stylistId2, date2, time2);
        await booking.makeBooking(client2.id, treatment1.id, stylistId2, date2, time2);

        const clientBooking = await booking.findClientBookings(client1.id);

        assert.equal(2, clientBooking.length)
    })

    it("should be able to get bookings for a date", async function () {
        const client1 = await booking.findClient("0715354455");
        const client2 = await booking.findClient("0635249875");

        const treatment1 = await booking.findTreatment("BAL");
        const treatment2 = await booking.findTreatment("PED");

        // day1 - 11:00
        let stylistId1 = 1;
        let date1 = '2022-11-24';
        let time1 = '11:00';

        // day1 - 12:00
        let stylistId2 = 2;
        let date2 = '2022-11-24';
        let time2 = '12:00';

        await booking.makeBooking(client1.id, treatment1.id, stylistId1, date1, time1);
        await booking.makeBooking(client1.id, treatment2.id, stylistId2, date2, time2);
        await booking.makeBooking(client2.id, treatment1.id, stylistId2, date2, time2);

        const bookings = await booking.findAllBookings(date2);

        assert.equal(2, bookings.length);

    });

    it("should be able to find the total income for a day", async function() {
        const client1 = await booking.findClient("0715354455");
        const client2 = await booking.findClient("0635249875");

        const treatment1 = await booking.findTreatment("BAL");
        const treatment2 = await booking.findTreatment("PED");

        // day1 - 11:00
        let stylistId1 = 1;
        let date1 = '2022-11-24';
        let time1 = '11:00';

        // day1 - 12:00
        let stylistId2 = 2;
        let date2 = '2022-11-24';
        let time2 = '12:00';

        await booking.makeBooking(client1.id, treatment1.id, stylistId1, date1, time1);
        await booking.makeBooking(client1.id, treatment2.id, stylistId2, date2, time2);
        await booking.makeBooking(client2.id, treatment1.id, stylistId2, date2, time2);
        const total = await booking.totalIncomeForDay('2022-11-24');
        
        assert.equal(Number(total.total_income), 415);
    })

    it("should be able to find the most valuable client", async function() {
        const client1 = await booking.findClient("0715354455");
        const client2 = await booking.findClient("0635249875");

        const treatment1 = await booking.findTreatment("BAL");
        const treatment2 = await booking.findTreatment("PED");

        // day1 - 11:00
        let stylistId1 = 1;
        let date1 = '2022-11-24';
        let time1 = '11:00';

        // day1 - 12:00
        let stylistId2 = 2;
        let date2 = '2022-11-24';
        let time2 = '12:00';

        await booking.makeBooking(client1.id, treatment1.id, stylistId1, date1, time1);
        await booking.makeBooking(client1.id, treatment2.id, stylistId2, date2, time2);
        await booking.makeBooking(client2.id, treatment1.id, stylistId2, date2, time1);

        const vmax = await booking.mostValuableClient()
        assert.equal('Emihle', vmax.first_name);
    })
    it.skip("should be able to find the total commission for a given stylist", function() {
        assert.equal(1, 2);
    })

    after(function () {
        db.$pool.end()
    });

});