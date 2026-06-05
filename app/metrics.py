import re

from app.ssh_client import run_command


def get_all_metrics():
    command = """
free -m | awk 'NR==2 {print $3}';
df / | awk 'NR==2 {print $5}' | tr -d '%';
uptime | awk -F'load average:' '{print $2}';
top -bn1 | grep 'Cpu(s)'
"""

    out = run_command(command)
    lines = out.strip().split("\n")

    ram = int(lines[0])
    disk_used_percent = float(lines[1])

    loads = [x.strip() for x in lines[2].split(",")]
    load1 = float(loads[0])
    load5 = float(loads[1])
    load15 = float(loads[2])

    cpu_line = lines[3]
    # top right-justifies CPU fields, so at 100.0 idle the leading space is
    # dropped (e.g. "ni,100.0 id"), which broke a plain whitespace split.
    # Grab the number immediately before "id" instead.
    idle = float(re.search(r"([\d.]+)\s*id", cpu_line).group(1))
    cpu_percent = round(100 - idle, 2)

    return {
        "ram": ram,
        "load": load1,
        "disk_used_percent": disk_used_percent,
        "load1": load1,
        "load5": load5,
        "load15": load15,
        "cpu_percent": cpu_percent,
    }


# Keep old function names so old imports do not break
def get_ram():
    return get_all_metrics()["ram"]


def get_load():
    return get_all_metrics()["load"]


def get_disk_used_percent():
    return get_all_metrics()["disk_used_percent"]


def get_load5():
    return get_all_metrics()["load5"]


def get_load15():
    return get_all_metrics()["load15"]


def get_cpu_percent():
    return get_all_metrics()["cpu_percent"]