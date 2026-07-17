# Demo Instructions

AUDIT ALP is built with a self-contained "Demo Mode" to instantly showcase its capabilities without requiring actual enterprise data.

## Running the Demo

1. Start the application (`npm run dev` or `npm start`).
2. Navigate to the **Landing Page** and click **Start New Audit**.
3. On the **Create New Audit** page, look for the **Load Demo Data** button in the top right corner.
4. Click **Load Demo Data**. 

### What Happens Next?

- **Auto-Population**: The system will automatically populate the audit metadata (Name: "Q3 Treasury Operations Audit", Department: "Treasury & Finance") and simulate the attachment of 6 required business documents (RCMs, General Ledgers, Vendor Master Data, etc.).
- **Automatic Execution**: The application will immediately transition to the **Audit Execution** page.
- **Live Workflow**: You will watch the AI workforce process the audit in real-time. Eight specialized AI agents will activate sequentially, displaying their current tasks, live logs, and confidence scores.
- **Review & Reporting**: Once execution reaches 100%, click **Review Findings** to explore the generated analytics dashboard, the human-in-the-loop finding review center, and the auto-generated executive report.

This entire flow runs locally and does not require external API connections, making it perfect for rapid presentations.
