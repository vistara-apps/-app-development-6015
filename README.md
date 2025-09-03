# ScholarSift

![ScholarSift Logo](https://i.imgur.com/47ecce46.jpeg)

**ScholarSift: Instant insights from research papers, powered by AI.**

ScholarSift helps researchers quickly understand the context and significance of cited papers, improving research efficiency and synthesis.

## Features

- **Instant Paper Summarization**: Generate concise summaries of research papers from URLs or DOIs.
- **Key Findings Highlight**: Quickly identify the most important findings and methodologies within the summary.
- **Contextual Integration**: Seamlessly integrate with reference management software (e.g., Zotero) and web browsers.
- **Subscription Tiers**: Free, Basic, and Premium plans to suit different research needs.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Supabase (Authentication, Database)
- **AI**: OpenAI API for paper summarization
- **Integrations**: Zotero API, Stripe for payments

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/scholarsift.git
   cd scholarsift
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
scholarsift/
├── docs/                  # Documentation
├── public/                # Static assets
├── src/
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── extension/             # Browser extension
├── .env.example           # Example environment variables
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite configuration
```

## Subscription Tiers

### Free Tier
- 5 summaries per month
- Basic paper analysis
- Web interface

### Basic Tier ($10/month)
- 50 summaries per month
- Advanced analysis
- Priority support
- Export options

### Premium Tier ($25/month)
- Unlimited summaries
- Advanced AI insights
- API access
- Zotero integration
- Priority support

## API Documentation

ScholarSift provides a REST API for Premium tier users. See the [API Documentation](docs/api.md) for details.

## Browser Extension

ScholarSift offers a browser extension for Chrome, Firefox, and Edge. See the [Extension Documentation](docs/extension.md) for details.

## Contributing

We welcome contributions to ScholarSift! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [OpenAI](https://openai.com/) for providing the AI models
- [Supabase](https://supabase.io/) for authentication and database services
- [Zotero](https://www.zotero.org/) for reference management integration
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for the build system

