pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.62.1'  // match npx playwright --version exactly
            args '-u root:root'
        }
    }

    triggers {
        githubPush()
    }

    environment {
        DOCKER_HOST = 'tcp://localhost:2375'  // only needed if Jenkins runs as a service account — remove if not needed
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Execute Tests') {
            steps {
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'results.xml'
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
    }
}
