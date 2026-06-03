pipeline {
    agent any

    stages {
        stage('Restore Backend') {
            steps {
                bat 'dotnet restore RichBackend/RichBackend.csproj'
            }
        }

        stage('Build Backend') {
            steps {
                bat 'dotnet build RichBackend/RichBackend.csproj --no-restore'
            }
        }

        stage('Install Frontend') {
            steps {
                dir('web-frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('web-frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Docker Compose Config') {
            steps {
                bat 'docker compose config'
            }
        }
    }
}
