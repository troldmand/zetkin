export default function getCampaignEvents(orgId : string, campId : string) {
    return async () : Promise<{ id: number, activity: { title: string } }[]> => {
        const eventsRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns/${campId}/actions`);
        const eventsData = await eventsRes.json();
        return eventsData.data;
    };
}