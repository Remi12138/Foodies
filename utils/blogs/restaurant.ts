async function searchYelpBusinesses(
  term: string,
  longitude: string,
  latitude: string
) {
  try {
    const response = await fetch(
      `https://api.yelp.com/v3/businesses/search?term=${term}&longitude=${longitude}&latitude=${latitude}&limit=20&sort_by=best_match`,
      {
        headers: {
          Authorization: `Bearer 7rQ5Lm4vERRjoBgA2vtbGk6-moj3vejwuJ3qg5sD48tL3DP8KWmDFY0KSkdh4ph_AJkwPPOKUSRbmETxGSvWdvkcCqpUlpZNih_dzL9S7aCo75dEbwV_r9FCxo0_Z3Yx`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export { searchYelpBusinesses };
