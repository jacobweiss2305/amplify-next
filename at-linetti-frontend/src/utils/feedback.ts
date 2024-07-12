import * as AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});


// Initialize DynamoDB Document Client
const dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1',  // Specify the AWS region
});

interface FeedbackUpdateParams {
    processId: string;
    feedback: boolean | null;
}

/**
 * Updates the feedback state for a given message in DynamoDB.
 * @param params {FeedbackUpdateParams} - Parameters containing messageId and new feedback state.
 */
export const updateFeedback = async (params: FeedbackUpdateParams): Promise<void> => {
    const { processId, feedback } = params;
    try {
        await dynamoDB.update({
            TableName: process.env["NEXT_PUBLIC_AWS_DYNAMODB_TABLE_NAME"] || '',  // Provide a default value if undefined
            Key: { processId },
            UpdateExpression: 'SET #feedback = :feedback',
            ExpressionAttributeNames: {
                '#feedback': 'feedback'
            },
            ExpressionAttributeValues: {
                ':feedback': feedback
            }
        }).promise();
    } catch (error) {
        console.error("Failed to update feedback:", error);
    }
};
