// frontend\src\utils\router_agent.ts

import OpenAI from 'openai';

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY'],
  dangerouslyAllowBrowser: true,
});

// Define the type for the detailed messages array
type DetailedMessage = {
  role: 'system' | 'user';
  content: string;
  name?: string; // Make name optional as it might not be needed for user messages
};

// Function to generate chat completions
export default async function getAgentName(question: string): Promise<string | null> {
  try {
    const messages: DetailedMessage[] = [
      {
        role: 'system',
        name: 'system',  // You might adjust the name based on your system's role identification
        content: `       
        You are a highly reliable routing agent and your job is to route a question to the appropriate agent. 

        Only respond with the agent name even if the question is unrelated or unclear. Defer to the salesforce agent when in doubt.
     
        Agent Name and Description:

        - salesforce
            -- Given a user's name, email, or company name, this agent will answer a users question by searching salesforce and jira for the answer.

        - jira
            -- Search for recent jira tickets (holistically). 
            -- Search for jira tickets by email. Must have valid email to search.
            -- Search for specific jira ticket by ticket number. Must have valid ticket number to search.
        
        - blog
            -- Agent to help answer questions about the Alpha Theory Blog.
            -- This agent has access to all blog posts and can provide detailed information.

        - website
            -- Agents that has access to the latest information on the Alpha Theory website.
            
        `
      },
      {
        role: 'user',
        name: 'user',  // User's identifier if necessary
        content: question
      }
    ];

    // Create the chat completion request
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages
    });

    // Check if the message content is null
    if (chatCompletion.choices[0].message.content === null) {
      return null;
    } else {
      return chatCompletion.choices[0].message.content;
    }
  } catch (error) {
    console.error('Error generating chat completion:', error);
    return null;  // Return null in case of an error
  }
}