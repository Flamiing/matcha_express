import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
    params: {
        profileId: string;
    };
};

export const generateMetadata = async ({
    params,
}: Props): Promise<Metadata> => {
    const title = await new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Profile ${params.profileId}`);
        }, 5);
    });

    return {
        title: {
            absolute: `${title} | Matcha`,
            template: '%s | Profile',
            default: 'Profile',
        },
        description: `Profile page for user ${params.profileId}`,
    };
};

const ProfilePage = ({ params }: { params: { profileId: string } }) => {
    if (parseInt(params.profileId) > 10) {
        return notFound();
    }

    return <div>Profile Page {params.profileId}</div>;
};

export default ProfilePage;
