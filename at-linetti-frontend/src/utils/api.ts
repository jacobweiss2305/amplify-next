// utils/api.ts
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

import * as dotenv from 'dotenv';

dotenv.config();

const apiUrl = process.env["NEXT_PUBLIC_AWS_GATEWAY_API_URL"];

interface InitiateResponse {
    processId: string;
}

interface StatusResponse {
    status: 'COMPLETED' | 'FAILED' | 'PENDING';
    processId: string;
    result?: string;
}

export const fetchIdToken = async () => {
    try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        return idToken;
    } catch (error) {
        console.error("Failed to fetch user data");
        throw error;
    }
};

export const fetchUserName = async () => {
    try {
        const { username, userId, signInDetails } = await getCurrentUser();
        return signInDetails?.loginId;
    } catch (error) {
        console.error("Failed to fetch user data");
        throw error;
    }
};


export type TestType = 'blog' | 'website' | 'salesforce' | 'jira';

// Utility function to make API requests using ID token for authentication
async function makeApiRequest<T>(url: string, method: 'GET' | 'POST', body?: any): Promise<T | null> {
    try {
        const token = await fetchIdToken();
        if (!token) {
            console.error('Unable to fetch ID token for authorization.');
            return null;
        }
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        };

        const response = await fetch(url, {
            method: method,
            headers: headers,
            body: body ? JSON.stringify(body) : undefined
        });

        if (response.ok) {
            return response.json();
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error during API call`);
        return null;
    }
}

// Function to initiate a test of various types
export const testInitiate = async (type: TestType, question: string): Promise<string | null> => {
    const initiateUrl = `${apiUrl}/initiate/${type}`;
    const username = await fetchUserName();
    const payload = { question, username };
    const data: InitiateResponse | null = await makeApiRequest<InitiateResponse>(initiateUrl, 'POST', payload);
    return data ? data.processId : null;
};

// Function to check the status of a process
export const testStatus = async (processId: string): Promise<string | null> => {
    const statusUrl = `${apiUrl}/status/${processId}`;
    return new Promise((resolve) => {
        const checkStatus = async () => {
            const result: StatusResponse | null = await makeApiRequest<StatusResponse>(statusUrl, 'GET');
            if (result && result.status === 'COMPLETED') {
                resolve(result.result || null);
            } else if (result && result.status === 'FAILED') {
                resolve(null);
            } else {
                setTimeout(checkStatus, 5000);
            }
        };
        checkStatus();
    });
};
