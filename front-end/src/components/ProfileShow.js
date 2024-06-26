import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UpdateProfile from "./ProfileUpdate";
import sunglasses from "../assets/avatars/sunglasses.png";
import dog from "../assets/avatars/dog.png";
import mountains from "../assets/avatars/mountains.png";
import map from "../assets/avatars/map.png";
import bottle from "../assets/avatars/bottle.png";
import shoe from "../assets/avatars/shoe.png";
import useAuth from "../hooks/useAuth";

const avatarOptions = {
    sunglasses,
    dog,
    mountains,
    map,
    bottle,
    shoe,
};

function Profile() {
    const { userId } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(null);
    const { user } = useAuth();
    const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
    const isProduction = process.env.NODE_ENV === "production";
    const baseUrl = isProduction
        ? ""
        : process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${baseUrl}/accounts/profiles/${userId}/`
                );
                if (!response.ok) {
                    throw new Error("Could not fetch user profile");
                }
                const data = await response.json();
                setUserProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId, profileUpdateSuccess]);

    useEffect(() => {
        const userProfileId = userProfile ? String(userProfile.id) : null;
        const currentUserId = user ? String(user.id) : null;

        const isAuth = Boolean(user);

        setIsCurrentUserProfile(isAuth && userProfileId === currentUserId);
    }, [user, userProfile]);

    if (loading) {
        return <div className="text-center mt-3 mt-md-5">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-3 mt-md-5">Error: {error}</div>;
    }

    if (!userProfile) {
        return <div className="text-center mt-3 mt-md-5">User not found</div>;
    }

    return (
        <div className="container d-flex justify-content-center mt-3 mt-md-5 vh-100">
            <div className="row flex-fill d-flex justify-content-center">
                <div className="col-lg-9">
                    <div className="card p-4">
                        <div className="card-body">
                            <h5 className="mb-4">Profile</h5>
                            <div className="mb-4">
                                <h4>Username</h4> {userProfile.username}
                            </div>
                            <div className="mb-4">
                                <h4>First Name</h4> {userProfile.first_name}
                            </div>
                            <div className="mb-4">
                                <h4>Last Name</h4> {userProfile.last_name}
                            </div>
                            <div className="mb-4">
                                <h4>Bio</h4> {userProfile.bio}
                            </div>
                            <div className="mb-4">
                                <h4 className="mb-3">Avatar</h4>{" "}
                                {userProfile.avatar && (
                                    <img
                                        src={avatarOptions[userProfile.avatar]}
                                        alt="avatar"
                                        className="rounded-circle ms-2"
                                        style={{ width: "45px" }}
                                    />
                                )}
                            </div>
                            {isCurrentUserProfile && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editProfileModal"
                                >
                                    Update Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="modal fade"
                id="editProfileModal"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-labelledby="editProfileModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title"
                                id="editProfileModalLabel"
                            >
                                Update Profile
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <UpdateProfile
                                userId={userId}
                                setProfileUpdateSuccess={
                                    setProfileUpdateSuccess
                                }
                                profileUpdateSuccess={profileUpdateSuccess}
                                username={userProfile.username}
                                firstName={userProfile.first_name}
                                lastName={userProfile.last_name}
                                email={userProfile.email}
                                bio={userProfile.bio}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
