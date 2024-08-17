import React from 'react';

const ProfileDetails = ({
    params,
}: {
    params: { profileId: string; profileDetails: string };
}) => {
    return (
        <div>
            Profile Details {params.profileId} {params.profileDetails}
        </div>
    );
};

export default ProfileDetails;
