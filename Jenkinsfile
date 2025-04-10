pipeline {
    agent any
    environment {
        IMAGE_NAME = 'omerbenda98/ui_topia'
        VERSION = "${BUILD_NUMBER}"
        email = 'omerbenda98@gmail.com'
        SLACK_CHANNEL = '#devops'
    }
    stages {
        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t ${IMAGE_NAME}:${VERSION} .
                    docker tag ${IMAGE_NAME}:${VERSION} ${IMAGE_NAME}:latest
                '''
            }
        }
        stage('Run app with Docker Compose') {
            steps {
                sh '''
                    docker compose down || true
                    docker compose up -d
                '''
            }
        }
        stage('Run Tests') {
            steps {
                sh '''
                    python3 -m venv .venv
                    . .venv/bin/activate
                    pip install -r selenium-tests/requirements.txt
                    pytest ./selenium-tests
                '''
            }
        }
        stage('Push Docker Image') {
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
        }
        post {
        failure {
            // emailext(
            //     subject: "${JOB_NAME}.${BUILD_NUMBER} FAILED",
            //     mimeType: 'text/html',
            //     to: "$email",
            //     body: "${JOB_NAME}.${BUILD_NUMBER} FAILED"
            // )
            slackSend(
                channel: "${SLACK_CHANNEL}",
                color: 'danger',
                message: "BUILD FAILED: Job '${JOB_NAME}' [${BUILD_NUMBER}] (${BUILD_URL})"
            )
        }
        success {
            // emailext(
            //     subject: "${JOB_NAME}.${BUILD_NUMBER} PASSED",
            //     mimeType: 'text/html',
            //     to: "$email",
            //     body: "${JOB_NAME}.${BUILD_NUMBER} PASSED"
            // )
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

