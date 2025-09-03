# ScholarSift API Documentation

This document provides comprehensive documentation for the ScholarSift API, which allows developers to integrate ScholarSift's paper summarization capabilities into their own applications.

## Authentication

All API requests must include an API key in the `Authorization` header:

```
Authorization: Bearer YOUR_API_KEY
```

You can obtain an API key from your ScholarSift account settings page. API keys are only available for Basic and Premium subscription tiers.

## Base URL

All API endpoints are relative to the base URL:

```
https://api.scholarsift.com/v1
```

## Endpoints

### Summarize Paper

Generate a summary of a research paper from a URL or DOI.

**Endpoint:** `POST /summarize`

**Request Body:**

```json
{
  "source": "https://arxiv.org/abs/2101.12345",
  "options": {
    "format": "markdown",
    "length": "medium"
  }
}
```

**Parameters:**

- `source` (required): URL or DOI of the paper to summarize
- `options` (optional): Configuration options
  - `format`: Output format, one of `plain`, `markdown`, or `html` (default: `markdown`)
  - `length`: Summary length, one of `short`, `medium`, or `long` (default: `medium`)

**Response:**

```json
{
  "id": "sum_123456789",
  "summary": "# Paper Summary\n\n## Main Objective\nThis paper addresses...\n\n## Key Methodology\nThe authors approach...\n\n## Major Findings\nThe results show...\n\n## Significance\nThis research is important because...\n\n## Limitations\nThe authors acknowledge...",
  "metadata": {
    "title": "Paper Title",
    "authors": ["Author 1", "Author 2"],
    "publication": "Journal Name",
    "year": 2023,
    "url": "https://arxiv.org/abs/2101.12345"
  },
  "created_at": "2023-09-15T12:34:56Z"
}
```

**Error Responses:**

- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Invalid or missing API key
- `402 Payment Required`: API usage limit exceeded
- `404 Not Found`: Paper not found
- `500 Internal Server Error`: Server error

### Get Summary

Retrieve a previously generated summary by ID.

**Endpoint:** `GET /summaries/{summary_id}`

**Parameters:**

- `summary_id` (required): ID of the summary to retrieve

**Response:**

```json
{
  "id": "sum_123456789",
  "summary": "# Paper Summary\n\n## Main Objective\nThis paper addresses...\n\n## Key Methodology\nThe authors approach...\n\n## Major Findings\nThe results show...\n\n## Significance\nThis research is important because...\n\n## Limitations\nThe authors acknowledge...",
  "metadata": {
    "title": "Paper Title",
    "authors": ["Author 1", "Author 2"],
    "publication": "Journal Name",
    "year": 2023,
    "url": "https://arxiv.org/abs/2101.12345"
  },
  "created_at": "2023-09-15T12:34:56Z"
}
```

**Error Responses:**

- `401 Unauthorized`: Invalid or missing API key
- `404 Not Found`: Summary not found

### List Summaries

List all summaries created by the authenticated user.

**Endpoint:** `GET /summaries`

**Query Parameters:**

- `limit` (optional): Maximum number of summaries to return (default: 10, max: 100)
- `offset` (optional): Number of summaries to skip (default: 0)
- `sort` (optional): Sort order, one of `created_at`, `title` (default: `created_at`)
- `order` (optional): Sort direction, one of `asc`, `desc` (default: `desc`)

**Response:**

```json
{
  "summaries": [
    {
      "id": "sum_123456789",
      "metadata": {
        "title": "Paper Title 1",
        "authors": ["Author 1", "Author 2"],
        "url": "https://arxiv.org/abs/2101.12345"
      },
      "created_at": "2023-09-15T12:34:56Z"
    },
    {
      "id": "sum_987654321",
      "metadata": {
        "title": "Paper Title 2",
        "authors": ["Author 3", "Author 4"],
        "url": "https://doi.org/10.1000/xyz123"
      },
      "created_at": "2023-09-14T10:11:12Z"
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 10,
    "offset": 0,
    "next_offset": 10
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Invalid or missing API key
- `400 Bad Request`: Invalid query parameters

### Delete Summary

Delete a summary by ID.

**Endpoint:** `DELETE /summaries/{summary_id}`

**Parameters:**

- `summary_id` (required): ID of the summary to delete

**Response:**

```json
{
  "success": true,
  "message": "Summary deleted successfully"
}
```

**Error Responses:**

- `401 Unauthorized`: Invalid or missing API key
- `404 Not Found`: Summary not found

## Rate Limits

API rate limits depend on your subscription tier:

- **Basic**: 100 requests per day, 10 requests per minute
- **Premium**: 1,000 requests per day, 60 requests per minute

Rate limit information is included in the response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1631804400
```

## Webhook Notifications

Premium users can set up webhook notifications for asynchronous processing of long papers. Configure webhooks in your account settings.

**Webhook Payload:**

```json
{
  "event": "summary.completed",
  "summary_id": "sum_123456789",
  "created_at": "2023-09-15T12:34:56Z"
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The request was invalid",
    "details": "The 'source' parameter is required"
  }
}
```

## SDK Libraries

We provide official SDK libraries for easy integration:

- [JavaScript/TypeScript](https://github.com/scholarsift/scholarsift-js)
- [Python](https://github.com/scholarsift/scholarsift-python)
- [Ruby](https://github.com/scholarsift/scholarsift-ruby)

## Support

For API support, please contact api-support@scholarsift.com or visit our [Developer Forum](https://forum.scholarsift.com).

