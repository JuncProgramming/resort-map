# AI Workflow Documentation

## Overview
This project was developed partly with an AI assistant (Google Gemini). It was used to write most of the backend, the documentation, some functions in the frontend and as a help with the dependencies and some of the test logic. It also wrote most of the boilerplate code.

## Tools Used
* **Primary AI Assistant:** Google Gemini 3.1 Pro.
* **Secondary AI Tool:** 5.3 Codex (used occasionally for bug-catching and best-practice reviews).
* **Technique:** JSON prompting.

## Workflow & Steps Taken

The development process was highly iterative and driven by a strong initial context setup:

### 1. Context Injection via JSON Prompt
* **Setup:** I started by using a specialized Gemini chat to generate a comprehensive, structured JSON prompt tailored specifically to this coding test.
* **Execution:** I pasted this JSON prompt into my main working chat. It contained all project instructions, provided files (assets, map layout, bookings), and explicit focal points (like "Right-sized design" and "no over-engineering") for the AI to prioritize throughout the session.

### 2. Architectural Planning
* **Action:** Before writing a single line of code, I initiated a discussion with the AI regarding the project's architecture.
* **Outcome:** We established a solid, step-by-step development plan.

### 3. AI-Driven Development
* **Action:** Once the architectural plan was set, the workflow became incredibly smooth and somewhat automated.
* **Outcome:** After we finished a specific feature, component, or file, the AI proactively proposed the logical next step (e.g., moving from API implementation to writing tests, or extracting types). This meant I rarely had to manually instruct it on what to do next; I simply steered its suggestions and focused on reviewing the logic and fixing little things it had skipped or written poorly (rarely).

### 4. Code Quality & Bug Catching
* **Action:** While Gemini handled the heavy lifting, project orchestration, and feature implementation, I occasionally utilized 5.3 Codex.
* **Outcome:** This served as a secondary verification layer to catch subtle bugs, validate logic, and ensure the code strictly adhered to the best practices.

## Conclusion
Using AI significantly accelerated the process of writing boilerplate code and making decisions about lesser known topics to me. It allowed me to focus on more important things like architectural decisions while the AI assisted with syntax, simple debugging, writing and formatting documentation.