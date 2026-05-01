# Use Python base image
FROM python:3.11

# Set working directory inside container
WORKDIR /app

# Copy all files into container
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Default command (for backend)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]