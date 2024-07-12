"use client";


import React from 'react';
import { Amplify } from 'aws-amplify';

import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../aws-exports';
Amplify.configure(awsExports);

import { ChatLayout } from "@/components/chat/chat-layout";
import Group from "@/components/ui/group";
import Link from "next/link";
import { groups } from '@/utils/data';

import '../custom-auth-styles.css';

function App() {

    return (
        <div className="App">
            <Authenticator>
                {({ signOut }) => (

                    <main className="flex flex-col items-center justify-center p-4 md:px-24 py-16 gap-8">
                        <header className='App-header'>

                            <button
                                onClick={signOut}
                                className="sign-out-btn"
                                aria-label="Sign out"
                                style={{ margin: '20px' }}
                            >
                                <span className="mr-2">🚪</span> {/* Consider replacing emoji with an SVG icon */}
                                Sign Out
                            </button>
                        </header>
                        <div className="flex justify-center items-center w-full mb-8">
                            <Link href="https://www.alphatheory.com/" className="text-5xl font-bold text-gradient">
                                Alpha Theory Sales and Customer Success AI Agent
                            </Link>
                        </div>

                        <div className="z-10 border rounded-lg max-w-7xl w-full h-[600px] shadow-lg">
                            <ChatLayout navCollapsedSize={12} className="p-4" />
                        </div>

                        <div className="z-10 max-w-7xl w-full mb-12 bg-card text-card-foreground shadow-lg rounded-lg p-8">
                            <h2 className="text-3xl font-bold mb-6 text-gradient">Prompt Library</h2>
                            {/* Here we map over each group and create a Group component */}
                            <div className="space-y-4">
                                {groups.map((group, index) => (
                                    <Group key={index} title={group.title}>
                                        <ul className="list-disc pl-6 mb-2">
                                            {group.prompts.map((prompt, index) => (
                                                <li key={index} className="mb-2">{prompt}</li>
                                            ))}
                                        </ul>
                                    </Group>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between max-w-7xl w-full items-start text-sm md:text-base text-muted-foreground mt-8">
                            <p>Powered by Alpha Theory AI technology</p>
                        </div>
                    </main>

                )}
            </Authenticator>
        </div>
    );
}

export default withAuthenticator(App);