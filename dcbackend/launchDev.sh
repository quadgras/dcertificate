export INSTANCE_FOLDER="/home/pentgras/Temporary/dcertificate/instance_folder"
flask --app dcertificate --debug run --cert "dev_cert/localhost.pem" --key "dev_cert/localhost-key.pem"