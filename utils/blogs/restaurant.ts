async function searchYelpBusinesses(
  term: string,
  longitude: string,
  latitude: string
) {
  try {
    const yelp_api = process.env.EXPO_PUBLIC_YELP_API_SEARCH;
    console.log(yelp_api);
    const response = await fetch(
      `https://api.yelp.com/v3/businesses/search?term=${term}&longitude=${longitude}&latitude=${latitude}&limit=20&sort_by=best_match`,
      {
        headers: {
          Authorization: `Bearer ${yelp_api}`,
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
