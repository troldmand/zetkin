import { GetServerSideProps } from 'next';
import { useQuery } from 'react-query';

import DefaultOrgLayout from '../../../../components/layout/DefaultOrgLayout';
import EventDetails from '../../../../components/EventDetails';
import getEvent from '../../../../fetching/getEvent';
import getEventResponses from '../../../../fetching/getEventResponses';
import getOrg from '../../../../fetching/getOrg';
import { PageWithLayout } from '../../../../types';
import { scaffold } from '../../../../utils/next';
import { useEventResponses } from '../../../../hooks';
import { ZetkinEvent, ZetkinOrganization } from '../../../../types/zetkin';

const scaffoldOptions = {
    localeScope: ['misc.publicHeader', 'pages.orgEvent'],
};

export const getServerSideProps: GetServerSideProps = scaffold(
    async (context) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { orgId, eventId } = context.params!;
        const { user } = context;

        await context.queryClient.prefetchQuery(
            ['event', eventId],
            getEvent(orgId as string, eventId as string, context.apiFetch),
        );
        await context.queryClient.prefetchQuery(
            ['org', orgId],
            getOrg(orgId as string, context.apiFetch),
        );

        if (user) {
            await context.queryClient.prefetchQuery(
                'eventResponses',
                getEventResponses(context.apiFetch),
            );
        }
        else {
            null;
        }

        const eventState = context.queryClient.getQueryState(['event', eventId]);
        const orgState = context.queryClient.getQueryState(['org', orgId]);

        if (
            eventState?.status === 'success' &&
            orgState?.status === 'success'
        ) {
            return {
                props: {
                    eventId,
                    orgId,
                },
            };
        }
        else {
            return {
                notFound: true,
            };
        }
    },
    scaffoldOptions,
);

type EventPageProps = {
    eventId: string;
    orgId: string;
};

const EventPage: PageWithLayout<EventPageProps> = (props) => {
    const { orgId, eventId } = props;
    const eventQuery = useQuery(['event', eventId], getEvent(orgId, eventId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));
    const { eventResponses, onSignup, onUndoSignup } = useEventResponses();

    if (!eventQuery.data) {
        return null;
    }

    const event = eventQuery.data as ZetkinEvent;
    const org = orgQuery.data as ZetkinOrganization;

    const response = eventResponses?.find(
        (response) => response.action_id === event.id,
    );

    return (
        <EventDetails
            event={ event }
            onSignup={ onSignup }
            onUndoSignup={ onUndoSignup }
            org={ org }
            response={ response }
        />
    );
};

EventPage.getLayout = function getLayout(page, props) {
    return (
        <DefaultOrgLayout orgId={ props.orgId as string }>
            { page }
        </DefaultOrgLayout>
    );
};

export default EventPage;
