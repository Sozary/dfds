const axios = require("axios");
const { addDays, format } = require("date-fns");

// Function to generate dates
function generateDates(startDate, numberOfDays) {
  return Array.from({ length: numberOfDays }, (_, i) =>
    format(addDays(startDate, i), "yyyy-MM-dd")
  );
}

async function getFares(departureDate, returnDate) {
  const url = `https://www.dfds.com/sbwapi/booking/cabin-fares-flow?salesOwnerId=17&localeCode=en&salesChannelCode=PIB&outboundRouteCode=CHOS&outboundDepartureDate=${departureDate}&productCode=MCHOS&returnRouteCode=OSCH&returnDepartureDate=${returnDate}&adults=2&children=0&infants=0&isAmendment=false`;
  try {
    const response = await axios.get(url);
    const data = response.data;
    const fareResults = [];
    const processRows = (rows) => {
      rows.forEach((row) => {
        row?.cabins?.forEach((cabin) => {
          cabin?.categories?.forEach((category) => {
            fareResults.push({
              departureDate,
              returnDate,
              cabinType: cabin.groupDescription,
              cabinCategory: category.category,
              price: category.price,
              currency: category.currency,
            });
          });
        });
      });
    };

    if (data.out && data.out.rows) {
      processRows(data.out.rows);
    }
    if (data.return && data.return.rows) {
      processRows(data.return.rows);
    }

    return fareResults;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

async function checkFaresForNextMonths() {
  const today = new Date();
  const outboundDates = generateDates(today, 10);
  const returnDates = outboundDates.map((date) =>
    format(addDays(new Date(date), 1), "yyyy-MM-dd")
  );
  const res = [];

  for (let i = 0; i < outboundDates.length; i++) {
    const outboundDate = outboundDates[i];
    const returnDate = returnDates[i];
    console.log(
      `Checking fares for Outbound: ${outboundDate}, Return: ${returnDate}`
    );
    const fares = await getFares(outboundDate, returnDate);
    res.push({
      outboundDate,
      returnDate,
      fares,
    });
  }
  console.log(JSON.stringify(res, null, 2));
}

checkFaresForNextMonths();
