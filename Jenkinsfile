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
        GITOPS_REPO = "omerbenda98/uitopia-cd"  // Create this repository first!
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
        stage('Update Staging Version in GitOps Repo') {
            when { not { branch 'main' } }
            steps {
                withCredentials([string(credentialsId: 'github', variable: 'GH_TOKEN')]) {
                    script {
                        sh """
                            rm -rf gitops
                            git clone https://${GH_TOKEN}@github.com/${GITOPS_REPO} gitops
                            cd gitops
                            echo "${VERSION}" > stage_version.txt
                            git config user.name "jenkins"
                            git config user.email "ci@jenkins.local"
                            git add stage_version.txt
                            git commit -m "Update staging version to ${VERSION}"
                            git push origin main
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
                        def prTitle = "Merge ${BRANCH_NAME} into main @${VERSION}"
                        def prBody = "This PR merges changes from ${BRANCH_NAME} into main with version ${VERSION}"
                        def prUrl = "https://api.github.com/repos/omerbenda98/ui-topia/pulls"
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
                    }
                }
            }
        }
        stage('Update Production Version in GitOps Repo') {
            when { branch 'main' }
            steps {
                script {
                    // Extract version number from the latest Git commit message
                    def version = sh(
                        script: "git log -1 --pretty=%B | grep -oE '@[0-9]+' | tr -d '@'",
                        returnStdout: true
                    ).trim()
                    
                    if (!version) {
                        error("❌ ERROR: No version number found in commit message. Make sure it includes @<number>.")
                    }
                    
                    env.NEW_VERSION = version
                    echo "📦 Extracted version from commit: ${env.NEW_VERSION}"
                    
                    withCredentials([usernamePassword(credentialsId: 'github', passwordVariable: 'GH_TOKEN', usernameVariable: 'GH_USERNAME')]) {
                        sh """
                            rm -rf gitops
                            git clone https://${GH_TOKEN}@github.com/${GITOPS_REPO} gitops
                            cd gitops
                            echo "${NEW_VERSION}" > production_version.txt
                            git config user.name "jenkins"
                            git config user.email "ci@jenkins.local"
                            git add production_version.txt
                            git commit -m "Update production version to ${NEW_VERSION}"
                            git push origin main
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