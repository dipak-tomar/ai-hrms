# Resume Parser API Documentation

## Overview

The Resume Parser is an AI-powered system that automatically extracts structured data from uploaded resume files (PDF, DOC, DOCX) using OpenAI's GPT-4 model. It includes candidate management, job matching, and recruitment tracking capabilities.

## Features

### 🔄 Core Functionality
- **File Upload**: Support for PDF, DOC, and DOCX files (max 10MB)
- **Text Extraction**: Automated text extraction from resume files
- **AI Parsing**: Intelligent parsing using OpenAI GPT-4
- **Structured Data**: Extract personal info, skills, experience, education, etc.
- **Job Matching**: AI-powered matching between resumes and job requirements
- **Candidate Management**: Complete candidate lifecycle management

### 🎯 AI Features
- **Smart Parsing**: Extract structured data from unstructured resume text
- **Skill Detection**: Automatically categorize and extract skills
- **Experience Calculation**: Calculate total years of experience
- **Job Matching**: Score candidates against job requirements
- **Keyword Matching**: Match keywords between resumes and job descriptions

## API Endpoints

### Authentication
All endpoints require authentication via Bearer token.

### Upload & Parse Resume

```http
POST /api/resume-parser/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Form Data:**
- `resume` (file): Resume file (PDF/DOC/DOCX, max 10MB)
- `candidateData` (string, optional): JSON string with additional candidate info

**Response:**
```json
{
  "success": true,
  "message": "Resume uploaded and parsed successfully",
  "data": {
    "candidate": {
      "id": "candidate_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "totalExperience": 5,
      "skills": [...],
      "status": "NEW",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "resume": {
      "id": "resume_id",
      "originalFileName": "resume.pdf",
      "fileType": "PDF",
      "fileSize": 1234567,
      "parsedData": {
        "personalInfo": {...},
        "skills": [...],
        "experience": [...],
        "education": [...]
      },
      "uploadedAt": "2024-01-01T00:00:00.000Z",
      "parsedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Get Candidates

```http
GET /api/resume-parser/candidates?page=1&limit=10&status=NEW&skills=JavaScript,Python
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (int, optional): Page number (default: 1)
- `limit` (int, optional): Items per page (default: 10, max: 100)
- `status` (string, optional): Filter by status
- `skills` (string, optional): Comma-separated list of skills
- `experienceMin` (int, optional): Minimum years of experience
- `experienceMax` (int, optional): Maximum years of experience

**Response:**
```json
{
  "success": true,
  "message": "Candidates retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Get Candidate by ID

```http
GET /api/resume-parser/candidates/:candidateId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Candidate retrieved successfully",
  "data": {
    "id": "candidate_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "resumes": [...],
    "applications": [...],
    "interviews": [...]
  }
}
```

### Update Candidate Status

```http
PUT /api/resume-parser/candidates/:candidateId/status
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "REVIEWED"
}
```

**Valid Statuses:**
- `NEW`
- `REVIEWED`
- `SHORTLISTED`
- `INTERVIEW_SCHEDULED`
- `INTERVIEWED`
- `SELECTED`
- `REJECTED`
- `HIRED`
- `WITHDRAWN`

### Match Resume with Job

```http
POST /api/resume-parser/match
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "resumeId": "resume_id",
  "jobId": "job_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Resume matched with job successfully",
  "data": {
    "matchScore": 85.5,
    "skillMatches": [
      {
        "skill": "JavaScript",
        "matched": true,
        "weight": 9
      }
    ],
    "experienceMatch": true,
    "keywordMatches": ["React", "Node.js", "API"],
    "recommendations": [
      "Strong technical skills alignment",
      "Experience level matches requirements"
    ]
  }
}
```

### Get Resume Matches for Job

```http
GET /api/resume-parser/jobs/:jobId/matches?minScore=50
Authorization: Bearer <token>
```

**Query Parameters:**
- `minScore` (int, optional): Minimum match score (0-100, default: 50)

**Response:**
```json
{
  "success": true,
  "message": "Resume matches retrieved successfully",
  "data": [
    {
      "id": "match_id",
      "matchScore": 85.5,
      "skillMatches": [...],
      "keywordMatches": [...],
      "resume": {
        "candidate": {...}
      },
      "job": {...}
    }
  ]
}
```

### Get Parsing Statistics

```http
GET /api/resume-parser/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Parsing statistics retrieved successfully",
  "data": {
    "totalCandidates": 150,
    "candidatesByStatus": {
      "new": 45,
      "reviewed": 30,
      "shortlisted": 25,
      "interviewed": 20,
      "selected": 15,
      "rejected": 10,
      "hired": 5
    },
    "topSkills": ["JavaScript", "Python", "React"],
    "averageExperience": 4.2
  }
}
```

## Data Models

### Candidate
```typescript
interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  address?: any;
  profileSummary?: string;
  totalExperience?: number;
  expectedSalary?: number;
  currentSalary?: number;
  noticePeriod?: string;
  status: CandidateStatus;
  source?: string;
  referredBy?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  skills?: any;
  createdAt: Date;
  updatedAt: Date;
}
```

### Resume
```typescript
interface Resume {
  id: string;
  candidateId: string;
  originalFileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  rawText: string;
  parsedData: any;
  skills?: any;
  experience?: any;
  education?: any;
  certifications?: any;
  languages?: any;
  projects?: any;
  aiScore?: number;
  keywordMatches?: any;
  isLatest: boolean;
  uploadedAt: Date;
  parsedAt?: Date;
}
```

### Parsed Resume Data Structure
```typescript
interface ParsedResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: any;
    dateOfBirth?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    githubUrl?: string;
  };
  professionalSummary?: string;
  skills: Array<{
    name: string;
    category: string;
    proficiency?: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
    responsibilities: string[];
    achievements?: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    grade?: string;
    achievements?: string[];
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    issueDate?: string;
    expiryDate?: string;
    credentialId?: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    startDate?: string;
    endDate?: string;
    url?: string;
  }>;
  languages?: Array<{
    name: string;
    proficiency: string;
  }>;
  totalExperience?: number;
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "field_name",
      "message": "Validation error message"
    }
  ]
}
```

### Common Error Codes
- `400`: Bad Request (validation errors, missing file)
- `401`: Unauthorized (invalid or missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (candidate/resume not found)
- `413`: Payload Too Large (file size exceeds limit)
- `415`: Unsupported Media Type (invalid file format)
- `500`: Internal Server Error (parsing failure, AI service error)

## Usage Examples

### Upload Resume with cURL
```bash
curl -X POST \
  http://localhost:3001/api/resume-parser/upload \
  -H "Authorization: Bearer your-jwt-token" \
  -F "resume=@/path/to/resume.pdf" \
  -F 'candidateData={"source":"LinkedIn","referredBy":"John Smith"}'
```

### Match Resume with Job
```bash
curl -X POST \
  http://localhost:3001/api/resume-parser/match \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeId": "resume_id_here",
    "jobId": "job_id_here"
  }'
```

## Configuration

### Environment Variables
```bash
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hrms_db

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_PATH=./uploads/resumes
```

### File Type Support
- **PDF**: `.pdf` files using pdf-parse
- **DOC**: `.doc` files using mammoth
- **DOCX**: `.docx` files using mammoth

### AI Model Configuration
- **Model**: GPT-4 (for best parsing accuracy)
- **Temperature**: 0.1 (for consistent, deterministic results)
- **Max Tokens**: 3000 (for comprehensive parsing)

## Security & Permissions

### Role-Based Access
- **HR_ADMIN**: Full access to all features
- **HR_MANAGER**: Full access to recruitment features
- **MANAGER**: Can view candidates and match resumes
- **EMPLOYEE**: No access to resume parser features

### File Security
- Files are stored securely on the server
- Unique filenames prevent conflicts
- File type validation prevents malicious uploads
- File size limits prevent abuse

## Performance & Limitations

### Processing Time
- Text extraction: 1-3 seconds
- AI parsing: 5-15 seconds
- Job matching: 3-8 seconds

### Rate Limits
- 100 requests per hour per user
- 10 resume uploads per hour per user

### File Limitations
- Maximum file size: 10MB
- Supported formats: PDF, DOC, DOCX
- Text must be extractable (no scanned images without OCR)

## Troubleshooting

### Common Issues

1. **"Failed to extract text from resume"**
   - File may be corrupted or password-protected
   - Scanned PDF without OCR capability
   - Unsupported file format

2. **"Invalid resume format or insufficient content"**
   - Resume doesn't contain enough text
   - Missing key information (name, email, etc.)
   - Text extraction failed

3. **"Failed to parse resume with AI"**
   - OpenAI API key missing or invalid
   - Network connectivity issues
   - API rate limits exceeded

4. **"Email is required for candidate creation"**
   - Resume doesn't contain email address
   - AI failed to extract email from text
   - Provide email in candidateData parameter

## Integration Examples

### Frontend Integration (React)
```javascript
const uploadResume = async (file, candidateData = {}) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('candidateData', JSON.stringify(candidateData));
  
  const response = await fetch('/api/resume-parser/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return await response.json();
};
```

### Batch Processing
```javascript
const processBatch = async (files) => {
  const results = [];
  for (const file of files) {
    try {
      const result = await uploadResume(file);
      results.push(result);
    } catch (error) {
      console.error(`Failed to process ${file.name}:`, error);
    }
  }
  return results;
};
```

---

## 📊 Implementation Status: COMPLETE ✅

The Resume Parser system is fully implemented with:
- ✅ File upload and text extraction utilities
- ✅ AI-powered resume parsing with OpenAI GPT-4
- ✅ Comprehensive database models for candidates, resumes, jobs
- ✅ Complete service layer with business logic
- ✅ REST API controllers with validation
- ✅ Secure routes with authentication and authorization
- ✅ Job matching algorithms with AI scoring
- ✅ Error handling and file management

**Ready for frontend integration!** 🚀 