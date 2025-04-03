# Selenium Tests for UI-topia

This directory contains Selenium tests for the UI-topia Next.js application.

## Local Setup

1. **Install Python dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

2. **Install Chrome**:
   Ensure Chrome browser is installed on your system.

3. **Start your Next.js app**:

   ```bash
   cd /path/to/your/nextjs/app
   npm run dev  # or npm run start for production build
   ```

4. **Run tests**:
   ```bash
   python -m unittest discover
   ```

## Jenkins Setup

1. **Create a new Pipeline job in Jenkins**

2. **Configure source code management**:

   - Connect to your GitHub repository
   - Ensure the repository includes the Selenium test files

3. **Use the provided Jenkins pipeline script**:

   - Copy the content of `jenkins-pipeline.groovy` into the Pipeline script area
   - Update the paths and URLs to match your environment

4. **Required Jenkins plugins**:

   - Pipeline
   - Git Integration
   - HTML Publisher (for test reports)

5. **Jenkins agent requirements**:
   - Python 3.7+
   - Chrome browser
   - Node.js and npm (if starting the app within the pipeline)

## Environment Variables

- `TEST_URL`: URL of the application to test (defaults to http://localhost:3000)
- `CI`: Set to 'true' in CI environments to run Chrome in headless mode

## Customizing Tests

The current tests are basic examples. To expand:

1. Add more test methods to the `UItopiaTests` class
2. Create new test classes for different features
3. Update selectors to match your actual HTML structure

## Google Authentication Testing

Because the app uses Google authentication, some considerations:

- Create a test user with Google auth credentials for testing
- For automated testing, consider implementing a test bypass for authentication
- Alternatively, use a mock authentication server for testing

## Troubleshooting

If you encounter issues with Chrome WebDriver:

- Ensure Chrome is installed
- Try installing a specific version of ChromeDriver that matches your Chrome version
- In Jenkins, make sure the agent has proper permissions to launch Chrome
