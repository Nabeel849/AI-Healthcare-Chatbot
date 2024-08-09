import requests

url_user = 'htt'

url = 'http://localhost:5000/api/ai-response'
payload = {"query": "How to cure cough and cold?"}

response = requests.post(url, json=payload)
print(response.json())
