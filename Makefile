start_server:
	uvicorn app.main:app --port 3001 --reload

start_frontend:
	cd frontend && yarn dev