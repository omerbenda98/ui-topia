pipeline {
    agent any
    
    stages {
        stage('Install Test Dependencies') {
            steps {
                echo 'Setting up Python virtual environment and installing dependencies...'
                sh '''
                    # Install python3-venv if not already installed
                    sudo apt-get update
                    sudo apt-get install -y python3-venv
                    
                    # Create a virtual environment
                    python3 -m venv selenium-venv
                    
                    # Activate the virtual environment and install dependencies
                    . selenium-venv/bin/activate
                    pip install selenium pytest pytest-html webdriver-manager
                '''
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building the application...'
                // In a real pipeline with a Next.js app:
                // sh 'npm install'
                // sh 'npm run build'
            }
        }
        
        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium tests...'
                
                // Run the tests using the virtual environment
                sh '''
                    # Activate the virtual environment
                    . selenium-venv/bin/activate
                    
                    # Run the tests
                    pytest selenium-tests/test_uitopia.py -v
                '''
            }
            post {
                always {
                    echo 'Test stage completed'
                    // Archive screenshots if any were created
                    archiveArtifacts artifacts: 'selenium-tests/*.png', allowEmptyArchive: true
                }
            }
        }
        
        stage('Deploy') {
            when {
                expression { currentBuild.resultIsBetterOrEqualTo('SUCCESS') }
            }
            steps {
                echo 'Deploying application...'
                echo 'Application successfully deployed!'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed! Check the logs for details.'
        }
    }
}