export interface FollowDTO {
    userId: number; 
}

export interface FollowResponseDTO {
    isFollowing: boolean;
    message?: string; 
}

export interface FollowingListResponseDTO {
    following: Array<{ 
        userId: number; 
        userName: string | null; 
        fullName?: string | null;
        profileImageUrl?: string | null; 
    }>;
}

export interface FollowersListResponseDTO {
    followers: Array<{ 
        userId: number; 
        userName: string | null; 
        fullName?: string | null; 
        profileImageUrl?: string | null; 
    }>;
}
