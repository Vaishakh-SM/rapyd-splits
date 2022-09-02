# 
FROM python:3.7.13

# 
WORKDIR /code

# 
COPY ./requirements.txt /code/requirements.txt

#
RUN pip install --upgrade pip

# 
RUN pip install --upgrade --no-cache-dir -r /code/requirements.txt

# 
COPY ./app /code/app

# 
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
