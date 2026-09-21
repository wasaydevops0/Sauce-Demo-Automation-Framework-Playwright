pipeline {
    agent any
    
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
                // Installs packages from your package.json
                sh 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                // Installs the specific browsers and their OS dependencies
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Execute Tests') {
            steps {
                // Runs the test suite in headless mode
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            // Publishes the JUnit results to the Jenkins Build UI
            junit 'results.xml'
            
            // Optional: Keeps your Playwright HTML reports as Jenkins artifacts
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
    }
}
