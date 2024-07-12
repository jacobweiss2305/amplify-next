import { fetchAuthSession } from 'aws-amplify/auth';

export const fetchIdToken = async () => {
try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    return { idToken }; // Optional: return the data if needed elsewhere
} catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error; // Optional: re-throw to handle the error outside
  }
};
