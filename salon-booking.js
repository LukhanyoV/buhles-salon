export default function salonBooking(db) {

    // find all treatments
    async function findAllTreatments() {
        return await db.any("SELECT * FROM treatment")
    }
    
    // should be able to find a stylist
    async function findStylist(phoneNumber) {
        return await db.oneOrNone("SELECT * FROM stylist WHERE phone_number = $1", [phoneNumber])
    }

    // should be able to find a client
    async function findClient(phoneNumber) {
        return await db.oneOrNone("SELECT * FROM client WHERE phone_number = $1", [phoneNumber])
    }

    // should find a treatment by code
    async function findTreatment(code) {
        return await db.oneOrNone("SELECT * FROM treatment WHERE code = $1", [code])
    }

    // find bookings for given date and time
    async function findAllBookings(date, time) {
        if(date && !time){
            return await db.any("SELECT * FROM booking WHERE booking_date = $1", [date])
        }
        return await db.any("SELECT * FROM booking WHERE booking_date = $1 AND booking_time = $2", [date, time])
    }

    // client should be able to make a booking 
    async function makeBooking(clientId, treatmentId, stylistId, date, time) {
        const bookings = await findAllBookings(date, time)
        // check if a given stylist has been booked for the time slot
        const find = bookings.find(booking => booking.stylist_id == stylistId)
        // check if there are no bookings
        // for a given date and timeslot there can only be two bookings
        // a stylist can only be booked once for given timeslot
        if((!bookings || bookings.length < 2) && !find){
            await db.none("INSERT INTO booking (booking_date, booking_time, client_id, treatment_id, stylist_id) VALUES ($1, $2, $3, $4, $5)", [date, time, clientId, treatmentId, stylistId])
        } 
    }

    // find all bookings by a client
    async function findClientBookings(clientId) {
        return await db.any("SELECT * FROM booking WHERE client_id = $1", [clientId])
    }

    // get total income for a gievn day
    async function totalIncomeForDay(date) {
        return await db.oneOrNone("SELECT SUM(price) AS total_income FROM booking AS b JOIN treatment AS t ON b.treatment_id = t.id WHERE b.booking_date = $1", [date])
    }

    // get the most valuable client
    async function mostValuableClient() {
        return await db.oneOrNone(`
        SELECT * FROM (
            select sum(price) as expense, first_name, last_name from booking 
            join client on booking.client_id = client.id 
            join treatment on treatment.id = booking.treatment_id 
            group by client_id, first_name, last_name
        ) as temptable ORDER BY expense DESC LIMIT 1
        `)
    }

    // total commision for a stylist on a given day
    async function totalCommission(date, stylistId)	{
        const totalDay = await totalIncomeForDay(date)
        const stylist = await db.oneOrNone("SELECT commission_percentage FROM stylist WHERE id = $1", [stylistId])
        if(!totalDay || !stylist) return 0;
        return totalDay.total_income * stylist.commission_percentage;
    }

    return {
        findAllTreatments,
        findStylist,
        findClient,
        findTreatment,
        findAllBookings,
        makeBooking,
        findClientBookings,
        totalIncomeForDay,
        mostValuableClient,
        totalCommission
    }
}  