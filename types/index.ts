export interface IMessage {
    /** Composite ID: rid:senderId:timestamp:random */
    id: string;
    /** Sequential index in the room session */
    idx: number;
    /** Room ID */
    rid: string;
    /** Local Unix timestamp */
    time: number;
    /** Whether the current session user sent this */
    isMyself: boolean;
    /** Whether the sender is a verified account */
    isVerified: boolean;
    /** The session ID of the current user */
    myselfId: string;
    /** Total count of items in the text/system array */
    total: number;
    /** Present if it's a message update (e.g., a Reaction/Like) */
    updated?: boolean;
    /** Present if it's a global server announcement */
    isFromServer?: boolean;

    /** The Sender Information */
    from: {
        id: string; // "system", "free4talk-admin", or UserID
        name?: string;
        avatar?: string;
        isVerified?: boolean;
        pid?: string; // Peer ID
        ss?: string;  // Session Signature / Hash
        leave?: boolean; // Present in typography:leave events
    };

    /** Content: Human Chat Messages */
    texts?: {
        msg: string;
        html: string;
        idx: number;
        hash: string;
        translateHTML?: string;
    }[];

    /** Content: System Notifications (Mutually exclusive with texts) */
    systems?: {
        kind: "typography:lines" | "alert:lines" | "typography" | "typography:leave";
        type: "warning" | "info" | "secondary";
        message?: string; // e.g., "Room Info"
        children: string | { name: string; time: string };
        idx: number;
        client?: Partial<IMessage["from"]>;
    }[];

    /** Content: Quoted Messages (Replies) */
    quotes?: {
        id: string;
        msg: string;
        html: string;
        from: Partial<IMessage["from"]>;
        isVerified: boolean;
        myselfId: string;
        hash: string;
    }[];

    /** Reactions/Likes Map */
    reactMap?: {
        [reactionType: string]: {
            [userId: string]: Partial<IMessage["from"]>;
        };
    };
}


export interface UserProfile {
    id: string;
    name: string;
    avatar: string;
}

export interface Creator extends UserProfile {
    isVerified: boolean;
}

export interface Client extends UserProfile {
    followers: number;
    following: number;
    friends: number;
    supporter: number;
}

export interface RoomSettings {
    noMic: boolean;
    alMic: number;
    isLocked: boolean;
}

export interface ITalkRoom {
    id: string;
    channel: string;
    platform: string;
    topic: string;
    maxPeople: number;
    language: string;
    secondLanguage: string;
    level: string;
    url: string;
    userId: string;
    creator: Creator;
    updatedAt: string; // or Date if you parse it
    createdAt: string; // or Date if you parse it
    clients: Client[];
    settings: RoomSettings;
}