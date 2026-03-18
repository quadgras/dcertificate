CURL command reference for submitting formdata while testing -
```
curl -X POST http://localhost:5000/auth/recepient/register -d 'username=test2&password=test2_password&display_name=TEST2'
```
CURL command for submitting json -
```
curl -X POST http://localhost:5000/auth/recepient/register -H "Content-Type: application/json" -d '{"username":"test1", "password":"test1_password", "display_name":"TEST1"}'
```

dev_cert for https during development generated using 
`mkcert -install` to add trust score to browsers then
`mkcert localhost` to generate pem files in that folder.
"dev_cert/" folder is also on .gitignore to ignore it everywhere.
IMPORTANT - during development, use the same certificates
for frontend and backend. You can copy paste to different locations
but don't generate separately.