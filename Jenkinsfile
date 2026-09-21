pipeline {
    agent any
    triggers {
        githubPush()
    }
    tools {
        // References the Node.js configuration name in Jenkins Global Tool Configuration
        nodejs 'node' 
    }

    environment {
        // Ensures Playwright can find system-level dependencies for browsers
        PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = '0'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Automatically pulls the latest code from the connected GitHub repo
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Installs packages from your package.json on Windows
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                // Installs the specific browsers on Windows.
                // Note: Windows doesn't use linux '--with-deps', so we run standard install
                bat 'npx playwright install'
            }
        }

        stage('Execute Tests') {
            steps {
                // Runs the test suite in headless mode on Windows
                bat 'npx playwright test'
            }
        }
    }

    post {
        always {
            // Publishes the JUnit results to the Jenkins Build UI
            junit allowEmptyResults: true, testResults: 'results.xml'
            
            // Keeps your Playwright HTML reports as Jenkins build artifacts
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
    }
}
