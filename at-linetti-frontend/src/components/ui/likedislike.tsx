import React, { useState } from 'react';
import { updateFeedback } from '@/utils/feedback'; // Adjust the path as necessary

interface LikeDislikeButtonProps {
    messageId: string;  // Adjust to string if your IDs are strings in DynamoDB
}

const LikeDislikeButton: React.FC<LikeDislikeButtonProps> = ({ messageId }) => {
    const [likeState, setLikeState] = useState<'like' | 'dislike' | 'none'>('none');

    const handleLike = async () => {
        const newState = likeState === 'like' ? 'none' : 'like';
        setLikeState(newState);
        await updateLikeDislikeState(messageId, newState);
    };

    const handleDislike = async () => {
        const newState = likeState === 'dislike' ? 'none' : 'dislike';
        setLikeState(newState);
        await updateLikeDislikeState(messageId, newState);
    };

    const updateLikeDislikeState = async (messageId: string, state: 'like' | 'dislike' | 'none') => {
        let feedback: boolean | null = null;
        if (state === 'like') feedback = true;
        else if (state === 'dislike') feedback = false;

        try {
            await updateFeedback({ processId: messageId, feedback });  // Assuming processId is used here
        } catch (error) {
            console.error('Failed to update feedback');
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handleLike}
                className={`p-2 rounded-full ${likeState === 'like' ? 'bg-green-200 hover:bg-green-300' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-150`}
            >
                👍
            </button>
            <button
                onClick={handleDislike}
                className={`p-2 rounded-full ${likeState === 'dislike' ? 'bg-red-200 hover:bg-red-300' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-150`}
            >
                👎
            </button>
        </div>
    );
};

export default LikeDislikeButton;
