# Clarity AI

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/hyturkyilmaz/Funnelmate)

An AI-powered marketing analytics platform that simplifies Google and Meta Ads analysis through a beautiful dashboard and a conversational chat interface.

Clarity AI is a sophisticated, AI-powered marketing analytics dashboard designed for C-level executives and mid-level managers. It provides a unified, visually stunning interface to analyze performance across Google Analytics, Google Ads, and Meta Ads. The core experience revolves around a clean, information-dense dashboard and an intuitive chat interface, allowing users to ask natural language questions and receive simple, yet detailed, analyses of their campaigns, ad sets, and creatives.

## Key Features

-   **Unified Dashboard:** A high-level overview of key performance indicators (KPIs) from all connected marketing platforms in one place.
-   **AI-Powered Chat:** A conversational interface to get specific insights using natural language queries.
-   **Seamless Integrations:** Easily connect and manage data sources like Google Analytics, Google Ads, and Meta Ads.
-   **Subscription Management:** A dedicated section for users to manage their subscription plans and view billing history.
-   **Visually Stunning UI:** A clean, professional, and data-forward design built for clarity and ease of use.
-   **Responsive Perfection:** Flawless layouts across all device sizes, from mobile to desktop.

## Technology Stack

-   **Frontend:** React, Vite, TypeScript, React Router
-   **Backend:** Hono on Cloudflare Workers
-   **State Management:** Zustand
-   **Styling:** Tailwind CSS, shadcn/ui
-   **UI & Interaction:** Framer Motion, Lucide React
-   **Data Visualization:** Recharts
-   **Storage:** Cloudflare Durable Objects

## Project Structure

The project is a monorepo with three main parts:

-   `src/`: The frontend React application.
-   `worker/`: The Hono backend API running on a Cloudflare Worker.
-   `shared/`: TypeScript types and mock data shared between the frontend and backend.

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up).
-   Wrangler CLI installed and configured: `bun install -g wrangler`.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd clarity_ai_analytics_dashboard
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

## Development

To start the local development server, which includes both the Vite frontend and the Wrangler dev server for the worker, run:

```bash
bun dev
```

This will start the Vite development server, typically on `http://localhost:3000`, which will proxy API requests to the Cloudflare Worker running locally.

## Available Scripts

-   `bun dev`: Starts the local development server.
-   `bun build`: Builds the frontend application for production.
-   `bun lint`: Lints the codebase.
-   `bun deploy`: Deploys the application to your Cloudflare account.

## Deployment

This project is designed to be deployed on the Cloudflare network.

1.  **Authenticate with Wrangler:**
    ```bash
    wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script from the root of the project:
    ```bash
    bun deploy
    ```

This command will build the frontend application and deploy both the static assets and the worker to your Cloudflare account.

Alternatively, you can deploy your own version of this project with a single click:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/hyturkyilmaz/Funnelmate)