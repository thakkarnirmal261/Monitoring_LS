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

    try:
        ssh.connect(
            HOST,
            username=USER,
            key_filename=KEY,
            timeout=15,
            banner_timeout=30,
            auth_timeout=30,
        )

        stdin, stdout, stderr = ssh.exec_command(command)

        output = stdout.read().decode().strip()
        error = stderr.read().decode().strip()

        if error:
            print("SSH stderr:", error)

        return output

    finally:
        ssh.close()