// Define your groups and prompts here
export const groups = [
    {
        "title": "Salesforce Agent",
        "prompts": [
            "Tell me the lastest emails from username@email.com",
            "Write an objection email to username@email.com matching the tone",
        ]
    },       
];

export const disclaimerSections = [
    {
        title: 'Alpha Theory Portfolio Analytics Agent',
        content: [
            'Fund Name',
            'Company Name',
            'Analyst ID',
            'Asset ID',
            'Long Short Indicator',
            'Bloomberg Ticker',
            'Historical Date',
            'Current Position (Delta-Adj)',
            'Optimal Position Abs',
            'Probability Weighted Return',
            'Status ID',
            'Current Price',
            'Scenarios Modified Date',
            'Trades Modified Date',
        ]
    },
    {
        title: 'Alpha Theory Price Target Analytics Agent',
        content: [
            'Scenario ID',
            'Created Date',
            'Analyst Name (lastName, firstName)',
            'Price Target Method Type',
            'Scenario Name',
            'Price Target Method Type Estimate',
            'Price Target Method Estimated Date Range',
            'Price Target Multiple',
            'Net Debt (Million)',
            'Shares Outstanding (Million)',
            'Ticker',
            'Price Target',
            'Probability',
            'Notes',
            'Occurence Date',
            'Previous Scenario'
        ]
    },
    {
        title: 'Alpha Theory Notes Agent',
        content: [
            "Asset ID",
            "Asset Notes ID",
            "Attached File Name",
            "Attached File Size",
            "Created Date",
            "Created By (lastName, firstName)",
            "Modified Date",
            "Notes",
            "Modified Price",
            "Source",
            "Subject",
            "Ticker"
        ]
    },
    {
        title: 'Financial Research Agent',
        content: [
            "Yahoo Finance",
            "Zacks Investment Research",
        ]
    },
    {
        title: 'News Agent',
        content: [
            "Duck Duck Go Search Engine (Public Web Browsing)"
        ]
    },      
];