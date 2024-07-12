export const userData = [
    {
        id: 1,
        avatar: '/at_icon.png',
        messages: [
            {
                id: 1,
                avatar: '/at_icon.png',
                name: 'Jane Doe',
                message: '"Hello, how can I help you today?"',
            },
        ],
        name: 'Jane Doe',
    },
];

export type UserData = (typeof userData)[number];

export const loggedInUserData = {
    id: 5,
    avatar: '/LoggedInUser.jpg',
    name: 'User',
};

export type LoggedInUserData = (typeof loggedInUserData);

export interface Message {
    id: number;
    avatar: string;
    name: string;
    message: string;
    processId?: string;  // Optional field to store the processId
}

export interface User {
    id: number;
    avatar: string;
    messages: Message[];
    name: string;
}