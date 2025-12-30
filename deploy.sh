#!/bin/bash
# RAGuard Deployment Script
# Run this on your EC2 instance

set -e

echo "🚀 Deploying RAGuard..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}Error: .env.production file not found!${NC}"
    echo "Please create .env.production with your environment variables."
    exit 1
fi

# Create network if it doesn't exist
echo -e "${YELLOW}Creating Docker network...${NC}"
docker network create nginx-network 2>/dev/null || echo "Network already exists"

# Stop existing container if running
echo -e "${YELLOW}Stopping existing container...${NC}"
docker-compose down 2>/dev/null || true

# Build the new image
echo -e "${YELLOW}Building Docker image...${NC}"
docker-compose --env-file .env.production build --no-cache

# Start the container
echo -e "${YELLOW}Starting container...${NC}"
docker-compose --env-file .env.production up -d

# Wait for health check
echo -e "${YELLOW}Waiting for health check...${NC}"
sleep 10

# Check if container is running
if docker ps | grep -q ragaurd-app; then
    echo -e "${GREEN}✅ RAGuard is running!${NC}"
    echo ""
    echo "Container status:"
    docker ps | grep ragaurd
    echo ""
    echo "To view logs: docker logs -f ragaurd-app"
    echo "To stop: docker-compose down"
else
    echo -e "${RED}❌ Container failed to start${NC}"
    echo "Logs:"
    docker logs ragaurd-app
    exit 1
fi

# Test the API
echo ""
echo -e "${YELLOW}Testing API endpoint...${NC}"
curl -s http://localhost:3000/api/v1/defend \
  -H "Authorization: Bearer rg_test_demo_key_for_local_development" \
  -H "Content-Type: application/json" \
  -d '{"input": "hello"}' | head -c 100
echo ""
echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
