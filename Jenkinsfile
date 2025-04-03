pipeline {
    agent any
    
    stages {
        
        stage('Install Dependencies') {
            steps {
                sh '''
                    # Install required Python packages
                    pip install selenium pytest pytest-html webdriver-manager
                '''
            }
        }
        stage('Build') {
            steps {
                echo 'Building the application...'
            }
        }
        
        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium tests...'
                sh 'pytest selenium-tests/test_uitopia.py'
            }
        }
        

        
        stage('Deploy') {
            steps {
                echo 'Deploying to production environment...'
                echo 'Copying artifacts to production server...'
                echo 'Restarting production services...'
            }
        }
    }
    
}