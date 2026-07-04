# Variables
DOCKER_COMPOSE = docker-compose
BACKEND_DIR = backend
FRONTEND_DIR = frontend

# Install dependencies
install:
	pip install -r $(BACKEND_DIR)/requirements.txt
	cd $(FRONTEND_DIR) && npm install

# Start development environment
dev:
	./scripts/dev.sh

# Build the project
build:
	cd $(FRONTEND_DIR) && npm run build

# Run tests
test:
	pytest $(BACKEND_DIR)/tests
	cd $(FRONTEND_DIR) && npm test

# Start Docker containers
docker-up:
	$(DOCKER_COMPOSE) up -d

# Stop Docker containers
docker-down:
	$(DOCKER_COMPOSE) down

# Clean up generated files
clean:
	rm -rf $(FRONTEND_DIR)/dist
	find $(BACKEND_DIR) -type d -name "__pycache__" -exec rm -r {} +
	find $(BACKEND_DIR) -type f -name "*.pyc" -delete