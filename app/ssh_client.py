import paramiko
import os
from dotenv import load_dotenv

load_dotenv()

HOST = os.getenv("PROD_HOST")
USER = os.getenv("PROD_USER")
KEY = os.getenv("PEM_PATH")

def run_command(command):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    ssh.connect(HOST, username=USER, key_filename=KEY)

    stdin, stdout, stderr = ssh.exec_command(command)
    output = stdout.read().decode()

    ssh.close()
    return output