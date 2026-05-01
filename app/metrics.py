from app.ssh_client import run_command

def get_ram():
    out = run_command("free -m")
    line = out.split("\n")[1].split()

    return int(line[2])   # used RAM

def get_load():
    out = run_command("uptime")
    load = out.split("load average:")[1].split(",")[0]
    return float(load)