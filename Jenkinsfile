pipeline {
    agent any
    triggers {
        githubPush()
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                // Builds an image tagged 'playwright-tests'
                bat 'docker build -t playwright-tests .'
            }
        }

        stage('Execute Tests in Container') {
            steps {
                // Runs the tests inside the container and mounts the reports folder back to Jenkins
                bat 'docker run --rm --ipc=host -v "%cd%\\playwright-report:/app/playwright-report" playwright-tests'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
    }
}
