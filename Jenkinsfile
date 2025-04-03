pipeline {
    agent any
    
    stages {
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh '''
                    docker build -t myapp ./app
                    
                '''
            }
        }
        

        stage('Test') {
            steps {
                echo 'Testing...'
                // sh 'python3 selenium-tests/test.py'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying...'
            }
        }
    }

}
// pipeline {
//     agent any
    
//     stages {
//         stage('Install Test Dependencies') {
//             steps {
//                 echo 'Setting up Python virtual environment and installing dependencies...'
//                 sh '''
//                     # Create a virtual environment (without requiring sudo)
//                     python3 -m venv selenium-venv || python -m venv selenium-venv
                    
//                     # Activate the virtual environment and install dependencies
//                     . selenium-venv/bin/activate
//                     pip install selenium pytest pytest-html webdriver-manager
//                 '''
//             }
//         }
        
//         stage('Run Selenium Tests') {
//             steps {
//                 echo 'Running Selenium tests...'
                
//                 // Run the tests using the virtual environment
//                 sh '''
//                     # Activate the virtual environment
//                     . selenium-venv/bin/activate
                    
//                     # Print versions for debugging
//                     python --version
//                     pip list | grep -E "selenium|pytest|webdriver" || pip list
                    
//                     # Run a simple test to verify Selenium works
//                     python -c "
// import sys
// from selenium import webdriver
// from selenium.webdriver.chrome.options import Options
// print('Selenium is installed correctly')
// try:
//     options = Options()
//     options.add_argument('--headless=new')
//     options.add_argument('--no-sandbox')
//     options.add_argument('--disable-dev-shm-usage')
//     driver = webdriver.Chrome(options=options)
//     print('WebDriver created successfully')
//     driver.quit()
// except Exception as e:
//     print(f'Error: {e}')
//     sys.exit(1)
// "
//                 '''
//             }
//         }
        
//         stage('Deploy Demo') {
//             steps {
//                 echo 'This is a demo deployment stage'
//                 echo 'In a real pipeline, deployment steps would go here'
//             }
//         }
//     }
    
//     post {
//         always {
//             // Clean up the virtual environment
//             sh 'rm -rf selenium-venv || true'
//         }
//         success {
//             echo 'Pipeline completed successfully!'
//         }
//         failure {
//             echo 'Pipeline failed! Check the logs for details.'
//         }
//     }
// }