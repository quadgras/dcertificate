CURL command reference for submitting formdata while testing -
```
curl -X POST http://localhost:5000/auth/recepient/register -d 'username=test2&password=test2_password&display_name=TEST2'
```
CURL command for submitting json -
```
curl -X POST http://localhost:5000/auth/recepient/register -H "Content-Type: application/json" -d '{"username":"test1", "password":"test1_password", "display_name":"TEST1"}'
```