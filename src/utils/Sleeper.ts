export const fetchDraftDetails = async (draftId: string) => {
  try {
    const draftResponse = await fetch(
      `https://api.sleeper.app/v1/draft/${draftId}`
    );
    const draftData = await draftResponse.json();
    return draftData;
  } catch (error) {
    console.error('Error fetching draft picks:', error);
  }
};

export const fetchDraftPicks = async (draftId: string) => {
  try {
    if (!draftId) {
      console.log('DraftId not provided');
      return;
    }
    const url = `https://api.sleeper.app/v1/draft/${draftId}/picks`;
    console.log('Updating picks', url);
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching draft picks:', error);
  }
};
