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
                            ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} "\
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