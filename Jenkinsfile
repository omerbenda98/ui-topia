pipeline {
    agent {
        label 'node1' 
    }
    environment {
        IMAGE_NAME = 'omerbenda98/ui_topia'
        VERSION = "${BUILD_NUMBER}"
        email = 'omerbenda98@gmail.com'
        SLACK_CHANNEL = '#devops'
        REMOTE_USER = 'ubuntu'
        REMOTE_HOST_PROD = '172.31.86.183'   // Add your production server IP
        REMOTE_HOST_STAGE = '172.31.83.109'  // Add your staging server IP
        DB_HOST = 'db'
        CONTAINER_NAME = 'ui_topia'
    }
    stages {
        stage('Build Docker Image') {
            when { not { branch 'main' } }
            steps {
                sh '''
                    docker build -t ${IMAGE_NAME}:${VERSION} .
                    docker tag ${IMAGE_NAME}:${VERSION} ${IMAGE_NAME}:latest
                '''
            }
        }
        stage('Run app with Docker compose') {
            when { not { branch 'main' } }
            steps {
                sh '''
                    docker compose down || true
                    docker compose up -d
                '''
            }
        }
        stage('Run Tests') {
            when { not { branch 'main' } }
            steps {
                sh '''
                    python3 -m venv .venv
                    . .venv/bin/activate
                    pip install -r selenium-tests/requirements.txt
                    pytest ./selenium-tests/test_simple.py
                '''
            }
        }
        stage('Push Docker Image') {
            when { not { branch 'main' } }
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    script {
                        docker.withRegistry('', 'docker-hub') {
                            docker.image("${IMAGE_NAME}").push("${VERSION}")
                            docker.image("${IMAGE_NAME}").push('latest')    
                        }
                    }
                }
            }
        }
        stage('Deploy to Staging') {
            when { not { branch 'main' } }
            steps {
                withCredentials([
                    string(credentialsId: 'mongodb-uri', variable: 'MONGODB_URI'),
                    string(credentialsId: 'nextauth-secret', variable: 'NEXTAUTH_SECRET'),
                    string(credentialsId: 'google-id', variable: 'GOOGLE_ID'),
                    string(credentialsId: 'google-client-secret', variable: 'GOOGLE_CLIENT_SECRET')
                ]) {
                    sshagent(credentials: ['ssh']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST_STAGE} "\
                            # Stop and remove existing container if it exists
                            docker stop ${CONTAINER_NAME} 2>/dev/null || true
                            docker rm ${CONTAINER_NAME} 2>/dev/null || true
                            
                            # Pull the latest image
                            docker pull ${IMAGE_NAME}:${VERSION}
                            
                            # Run with parameters
                            docker run -d --name ${CONTAINER_NAME} \
                              -e MONGODB_URI='${MONGODB_URI}' \
                              -e NEXTAUTH_URL='http://localhost:3000' \
                              -e NEXTAUTH_URL_INTERNAL='http://localhost:3000' \
                              -e NEXTAUTH_SECRET='${NEXTAUTH_SECRET}' \
                              -e GOOGLE_ID='${GOOGLE_ID}' \
                              -e GOOGLE_CLIENT_SECRET='${GOOGLE_CLIENT_SECRET}' \
                              -p 3000:3000 \
                              --restart always \
                              ${IMAGE_NAME}:${VERSION}"
                        """
                    }
                }
            }
        }
        stage('Create PR to main') {
            when { not { branch 'main' } }
            steps {
                withCredentials([string(credentialsId: 'github', variable: 'GH_TOKEN')]) {
                    script {
                        def prTitle = "Merge ${BRANCH_NAME} into main #${VERSION}"
                        def prBody = "This PR merges changes from ${BRANCH_NAME} into main."
                        def prUrl = "https://api.github.com/repos/omerbenda98/ui_topia/pulls"
                        def json = """
                        {
                            "title": "${prTitle}",
                            "head": "${BRANCH_NAME}",
                            "base": "main",
                            "body": "${prBody}"
                        }
                        """
                        sh """
                            curl -X POST -H "Authorization: token ${GH_TOKEN}" \
                            -H "Accept: application/vnd.github.v3+json" \
                            -d '${json}' ${prUrl}
                        """
                          // Add -v for verbose output and -w to capture HTTP status
                def result = sh (
                    script: """
                        curl -v -w "\\nHTTP_STATUS:%{http_code}" -X POST \
                        -H "Authorization: token ${GH_TOKEN}" \
                        -H "Accept: application/vnd.github.v3+json" \
                        -H "Content-Type: application/json" \
                        -d '${json}' ${prUrl}
                    """,
                    returnStdout: true
                )
                
                echo "Full curl output:"
                echo result
                
                // Check if HTTP status is 201 (created)
                if (result.contains("HTTP_STATUS:201")) {
                    echo "✅ Pull Request created successfully!"
                } else {
                    echo "❌ PR creation might have failed"
                    echo "Check the output above for details"
                }
                    }
                }
            }
        }
        stage('Deploy to Production') {
            steps {
                withCredentials([
                    string(credentialsId: 'mongodb-uri', variable: 'MONGODB_URI'),
                    string(credentialsId: 'nextauth-secret', variable: 'NEXTAUTH_SECRET'),
                    string(credentialsId: 'google-id', variable: 'GOOGLE_ID'),
                    string(credentialsId: 'google-client-secret', variable: 'GOOGLE_CLIENT_SECRET')
                ]) {
                    sshagent(credentials: ['ssh']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST_PROD} "\
                            # Stop and remove existing container if it exists
                            docker stop ${CONTAINER_NAME} 2>/dev/null || true
                            docker rm ${CONTAINER_NAME} 2>/dev/null || true
                            
                            # Pull the latest image
                            docker pull ${IMAGE_NAME}:latest
                            
                            # Run with parameters
                            docker run -d --name ${CONTAINER_NAME} \
                              -e MONGODB_URI='${MONGODB_URI}' \
                              -e NEXTAUTH_URL='http://localhost:3000' \
                              -e NEXTAUTH_URL_INTERNAL='http://localhost:3000' \
                              -e NEXTAUTH_SECRET='${NEXTAUTH_SECRET}' \
                              -e GOOGLE_ID='${GOOGLE_ID}' \
                              -e GOOGLE_CLIENT_SECRET='${GOOGLE_CLIENT_SECRET}' \
                              -p 3000:3000 \
                              --restart always \
                              ${IMAGE_NAME}:latest"
                        """
                    }
                }
            }
        }
    }
    post {
        failure {
            slackSend(
                channel: "${SLACK_CHANNEL}",
                color: 'danger',
                message: "BUILD FAILED: Job '${JOB_NAME}' [${BUILD_NUMBER}] (${BUILD_URL})"
            )
        }
        success {
            slackSend(
                channel: "${SLACK_CHANNEL}",
                color: 'good',
                message: "BUILD SUCCESSFUL: Job '${JOB_NAME}' [${BUILD_NUMBER}] (${BUILD_URL})"
            )
        }
        always {
            sh '''
                docker compose down || true
            '''
        }
    }
}