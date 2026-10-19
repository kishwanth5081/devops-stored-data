// Image 3: Systems, Network & Ops (14 Categories, 163 Commands)
export const SYSTEMS_OPS_COMMANDS = [
  {
    "id": "proc-ps-ef",
    "category": "processes",
    "categoryLabel": "Processes",
    "title": "List All Running Processes (Standard Full Format)",
    "command": "ps -ef",
    "description": "Displays UID, PID, Parent PID (PPID), CPU consumption, start time, TTY, and command arguments.",
    "privilege": "user",
    "tags": [
      "processes",
      "ps",
      "process-list",
      "ppid"
    ],
    "explanation": "POSIX standard process list format.",
    "expectedOutput": "UID          PID    PPID  C STIME TTY          TIME CMD\nroot           1       0  0 Oct10 ?        00:00:08 /sbin/init\nkishwanth   1740    1410  0 10:15 ?        00:00:12 node src/server.js",
    "prerequisites": "Coreutils."
  },
  {
    "id": "proc-ps-aux-cpu",
    "category": "processes",
    "categoryLabel": "Processes",
    "title": "List Top 10 Processes by CPU Consumption",
    "command": "ps aux --sort=-%cpu | head -n 11",
    "description": "Identifies CPU-heavy processes consuming excessive processor cycles.",
    "privilege": "user",
    "tags": [
      "processes",
      "ps",
      "cpu",
      "top-processes"
    ],
    "explanation": "Sorts by %CPU descending.",
    "expectedOutput": "USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nnode        1740  8.4  1.8 842100 142100 ?       Sl   10:15   0:42 node src/server.js\nnginx       1420  1.2  0.4  84120  32100 ?       S    10:00   0:05 nginx: worker process",
    "prerequisites": "Linux."
  },
  {
    "id": "proc-ps-aux-mem",
    "category": "processes",
    "categoryLabel": "Processes",
    "title": "List Top 10 Processes by Memory (RAM) Consumption",
    "command": "ps aux --sort=-%mem | head -n 11",
    "description": "Finds memory-intensive daemons or memory leak suspects.",
    "privilege": "user",
    "tags": [
      "processes",
      "ps",
      "memory",
      "ram",
      "leak"
    ],
    "explanation": "Sorts by %MEM descending.",
    "expectedOutput": "USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\npostgres    1842  0.4  4.2 984210 341020 ?       Ss   Oct10   1:12 postgres: writer process\nnode        1740  1.1  2.1 842100 168200 ?       Sl   10:15   0:15 node src/server.js",
    "prerequisites": "Linux."
  },
  {
    "id": "proc-top-batch",
    "category": "processes",
    "categoryLabel": "Processes",
    "title": "Capture Real-Time CPU & Memory Summary Snapshot",
    "command": "top -b -n 1 | head -n 25",
    "description": "Takes a non-interactive batch snapshot of system load averages, task states, and top tasks.",
    "privilege": "user",
    "tags": [
      "processes",
      "top",
      "load",
      "snapshot"
    ],
    "explanation": "-b runs in batch mode suitable for piping to log files or scripts.",
    "expectedOutput": "top - 12:50:01 up 42 days,  load average: 0.18, 0.22, 0.19\nTasks: 184 total,   1 running, 183 sleeping,   0 stopped,   0 zombie\n%Cpu(s):  2.4 us,  1.1 sy,  0.0 ni, 96.2 id,  0.2 wa,  0.0 hi,  0.1 si\nMiB Mem :   7842.1 total,   4210.4 free,   1842.2 used,   1789.5 buff/cache",
    "prerequisites": "procps."
  },
  {
    "id": "proc-htop",
    "category": "processes",
    "categoryLabel": "Processes",
    "title": "Launch Interactive Colorized Process Monitor (htop)",
    "command": "htop",
    "description": "Full-screen visual ncurses process manager with per-core CPU bars, memory visualizer, and mouse support.",
    "privilege": "user",
    "tags": [
      "processes",
      "htop",
      "interactive",
      "monitoring"
    ],
    "explanation": "Press F6 to sort, F9 to send signals, q to quit.",
    "expectedOutput": "[htop interactive interface opened]",
    "prerequisites": "htop package."
  },
  {
    "id": "proc-kill-sigterm",
    "category": "processes",
    "categoryLabel": "Processes",
    "title": "Gracefully Terminate Process via SIGTERM (15)",
    "command": "kill -15 1740",
    "description": "Requests process to save state, close sockets, and exit cleanly.",
    "privilege": "user",
    "tags": [
      "processes",
      "kill",
      "sigterm",
      "graceful"
    ],
    "explanation": "Sends SIGTERM (signal 15). Default behavior of kill.",
    "expectedOutput": "",
    "prerequisites": "Process owned by user or sudo."
  },
  {
    "id": "proc-kill-sigkill",
    "category": "processes",
    "categoryLabel": "Processes",
    "title": "Force Kill Unresponsive Process via SIGKILL (9)",
    "command": "kill -9 1740",
    "description": "Kernel immediately halts and destroys process without calling cleanup handlers.",
    "privilege": "user",
    "tags": [
      "processes",
      "kill",
      "sigkill",
      "force"
    ],
    "explanation": "SIGKILL cannot be caught or ignored by application code.",
    "expectedOutput": "",
    "prerequisites": "PID."
  },
  {
    "id": "proc-pkill-name",
    "category": "processes",
    "categoryLabel": "Processes",
    "title": "Kill Processes Matching Command Name Pattern",
    "command": "pkill -f \"node src/server.js\"",
    "description": "Sends signal to all processes whose command line matches regex pattern.",
    "privilege": "user",
    "tags": [
      "processes",
      "pkill",
      "pattern",
      "regex"
    ],
    "explanation": "-f matches against full command line arguments, not just binary name.",
    "expectedOutput": "",
    "prerequisites": "procps."
  },
  {
    "id": "proc-killall",
    "category": "processes",
    "categoryLabel": "Processes",
    "title": "Kill All Processes of Specific Binary",
    "command": "sudo killall nginx",
    "description": "Terminates all instances executing the named binary.",
    "privilege": "sudo",
    "tags": [
      "processes",
      "killall",
      "binary",
      "terminate"
    ],
    "explanation": "Matches exact process binary names.",
    "expectedOutput": "",
    "prerequisites": "psmisc package."
  },
  {
    "id": "proc-pgrep-list",
    "category": "processes",
    "categoryLabel": "Processes",
    "title": "Lookup PIDs of Process by Name",
    "command": "pgrep -l node",
    "description": "Prints Process IDs and process names matching query string.",
    "privilege": "user",
    "tags": [
      "processes",
      "pgrep",
      "pid",
      "lookup"
    ],
    "explanation": "Handy for obtaining PID for use in subsequent shell commands.",
    "expectedOutput": "1740 node\n1892 node",
    "prerequisites": "procps."
  },
  {
    "id": "proc-pstree",
    "category": "processes",
    "categoryLabel": "Processes",
    "title": "Display Visual Process Tree with PIDs",
    "command": "pstree -p 1740",
    "description": "Shows hierarchical parent-child relationships and worker threads.",
    "privilege": "user",
    "tags": [
      "processes",
      "pstree",
      "hierarchy",
      "threads"
    ],
    "explanation": "-p includes process PIDs next to thread names.",
    "expectedOutput": "node(1740)─┬─{node}(1741)\n           ├─{node}(1742)\n           ├─{node}(1743)\n           └─{node}(1744)",
    "prerequisites": "psmisc."
  },
  {
    "id": "proc-nohup-background",
    "category": "processes",
    "categoryLabel": "Processes",
    "title": "Run Process in Background Immune to Hangups (nohup)",
    "command": "nohup ./backup_job.sh > backup.log 2>&1 &",
    "description": "Detaches script from terminal session preventing termination when SSH disconnects.",
    "privilege": "user",
    "tags": [
      "processes",
      "nohup",
      "background",
      "daemon"
    ],
    "explanation": "Ignores SIGHUP signal and redirects stdout/stderr to log file.",
    "expectedOutput": "[1] 19820",
    "prerequisites": "Executable script."
  },
  {
    "id": "proc-jobs-list",
    "category": "processes",
    "categoryLabel": "Processes",
    "title": "List Active Background Jobs in Current Shell",
    "command": "jobs -l",
    "description": "Lists job numbers, PIDs, and running state for jobs started in current shell.",
    "privilege": "user",
    "tags": [
      "processes",
      "jobs",
      "background",
      "shell"
    ],
    "explanation": "Built-in shell job control tool.",
    "expectedOutput": "[1]+ 19820 Running                 nohup ./backup_job.sh > backup.log 2>&1 &",
    "prerequisites": "Shell session."
  },
  {
    "id": "proc-fg-resume",
    "category": "processes",
    "categoryLabel": "Processes",
    "title": "Bring Background Job to Foreground",
    "command": "fg %1",
    "description": "Restores background job #1 to active interactive terminal control.",
    "privilege": "user",
    "tags": [
      "processes",
      "fg",
      "foreground",
      "job-control"
    ],
    "explanation": "Allows user interaction with previously suspended or backgrounded command.",
    "expectedOutput": "nohup ./backup_job.sh > backup.log 2>&1",
    "prerequisites": "Job in background."
  },
  {
    "id": "proc-bg-continue",
    "category": "processes",
    "categoryLabel": "Processes",
    "title": "Resume Suspended Job in Background",
    "command": "bg %1",
    "description": "Resumes execution of a job suspended with Ctrl+Z in background.",
    "privilege": "user",
    "tags": [
      "processes",
      "bg",
      "resume",
      "background"
    ],
    "explanation": "Sends SIGCONT to suspended process.",
    "expectedOutput": "[1]+ ./backup_job.sh &",
    "prerequisites": "Suspended job."
  },
  {
    "id": "proc-renice",
    "category": "processes",
    "categoryLabel": "Processes",
    "title": "Change Priority of Running Process",
    "command": "sudo renice -n 10 -p 1740",
    "description": "Adjusts process scheduling priority (-20 highest priority, 19 lowest / nicest).",
    "privilege": "sudo",
    "tags": [
      "processes",
      "renice",
      "priority",
      "scheduling"
    ],
    "explanation": "Prevents non-critical batch jobs from degrading latency of web APIs.",
    "expectedOutput": "1740 (process ID) old priority 0, new priority 10",
    "prerequisites": "Root/sudo."
  },
  {
    "id": "proc-nice-start",
    "category": "processes",
    "categoryLabel": "Processes",
    "title": "Launch Process with Low Scheduling Priority",
    "command": "nice -n 19 tar -czf backup.tar.gz /var/data",
    "description": "Starts heavy compression task giving way to interactive and web processes.",
    "privilege": "user",
    "tags": [
      "processes",
      "nice",
      "priority",
      "background"
    ],
    "explanation": "Ensures background backups do not cause CPU spikes.",
    "expectedOutput": "",
    "prerequisites": "Coreutils."
  },
  {
    "id": "systemd-status",
    "category": "services-systemd",
    "categoryLabel": "Services and Systemd",
    "title": "Check Systemd Service Status & Recent Logs",
    "command": "sudo systemctl status devops-portal",
    "description": "Displays active/inactive status, PID, memory usage, cgroups hierarchy, and latest journal entries.",
    "privilege": "sudo",
    "tags": [
      "systemd",
      "status",
      "service",
      "diagnostics"
    ],
    "explanation": "Primary command for verifying service health.",
    "expectedOutput": "● devops-portal.service - DevOps Stored Data Backend Service\n     Loaded: loaded (/etc/systemd/system/devops-portal.service; enabled; preset: enabled)\n     Active: active (running) since Wed 2026-10-15 10:00:00 UTC; 1 day ago\n   Main PID: 1740 (node)",
    "prerequisites": "Systemd."
  },
  {
    "id": "systemd-start",
    "category": "services-systemd",
    "categoryLabel": "Services and Systemd",
    "title": "Start Service",
    "command": "sudo systemctl start nginx",
    "description": "Launches unit daemon.",
    "privilege": "sudo",
    "tags": [
      "systemd",
      "start",
      "service"
    ],
    "explanation": "Executes ExecStart command defined in unit file.",
    "expectedOutput": "",
    "prerequisites": "Service installed."
  },
  {
    "id": "systemd-stop",
    "category": "services-systemd",
    "categoryLabel": "Services and Systemd",
    "title": "Stop Service",
    "command": "sudo systemctl stop nginx",
    "description": "Sends SIGTERM and stops unit daemon.",
    "privilege": "sudo",
    "tags": [
      "systemd",
      "stop",
      "service"
    ],
    "explanation": "Gracefully terminates service processes.",
    "expectedOutput": "",
    "prerequisites": "Running service."
  },
  {
    "id": "systemd-restart",
    "category": "services-systemd",
    "categoryLabel": "Services and Systemd",
    "title": "Restart Service",
    "command": "sudo systemctl restart nginx",
    "description": "Stops and re-launches service process.",
    "privilege": "sudo",
    "tags": [
      "systemd",
      "restart",
      "service"
    ],
    "explanation": "Performs full stop followed by start sequence.",
    "expectedOutput": "",
    "prerequisites": "Service."
  },
  {
    "id": "systemd-reload",
    "category": "services-systemd",
    "categoryLabel": "Services and Systemd",
    "title": "Reload Service Configuration Without Stopping",
    "command": "sudo systemctl reload nginx",
    "description": "Executes ExecReload command without resetting network sockets or process IDs.",
    "privilege": "sudo",
    "tags": [
      "systemd",
      "reload",
      "zero-downtime"
    ],
    "explanation": "Ideal for updating routing configs without dropping active client connections.",
    "expectedOutput": "",
    "prerequisites": "Service supporting reload."
  },
  {
    "id": "systemd-enable",
    "category": "services-systemd",
    "categoryLabel": "Services and Systemd",
    "title": "Enable Service to Start Automatically at Boot",
    "command": "sudo systemctl enable nginx",
    "description": "Creates symlinks in /etc/systemd/system/multi-user.target.wants/ to launch service on boot.",
    "privilege": "sudo",
    "tags": [
      "systemd",
      "enable",
      "autostart",
      "boot"
    ],
    "explanation": "Ensures services survive server restarts.",
    "expectedOutput": "Created symlink /etc/systemd/system/multi-user.target.wants/nginx.service → /lib/systemd/system/nginx.service.",
    "prerequisites": "Root."
  },
  {
    "id": "systemd-disable",
    "category": "services-systemd",
    "categoryLabel": "Services and Systemd",
    "title": "Disable Service from Autostarting on Boot",
    "command": "sudo systemctl disable apache2",
    "description": "Removes symlinks preventing daemon from launching automatically when system boots.",
    "privilege": "sudo",
    "tags": [
      "systemd",
      "disable",
      "boot"
    ],
    "explanation": "Service can still be manually started.",
    "expectedOutput": "Removed /etc/systemd/system/multi-user.target.wants/apache2.service.",
    "prerequisites": "Root."
  },
  {
    "id": "systemd-mask",
    "category": "services-systemd",
    "categoryLabel": "Services and Systemd",
    "title": "Mask Service to Prevent Accidental Startup",
    "command": "sudo systemctl mask apache2",
    "description": "Links unit file to /dev/null making it impossible for any user or script to start service.",
    "privilege": "sudo",
    "tags": [
      "systemd",
      "mask",
      "disable",
      "security"
    ],
    "explanation": "Stronger than disable; prevents dependency services from pulling it in.",
    "expectedOutput": "Created symlink /etc/systemd/system/apache2.service → /dev/null.",
    "prerequisites": "Root."
  },
  {
    "id": "systemd-unmask",
    "category": "services-systemd",
    "categoryLabel": "Services and Systemd",
    "title": "Unmask Service",
    "command": "sudo systemctl unmask apache2",
    "description": "Deletes /dev/null symlink restoring regular unit file capabilities.",
    "privilege": "sudo",
    "tags": [
      "systemd",
      "unmask",
      "restore"
    ],
    "explanation": "Re-enables manual or automated execution.",
    "expectedOutput": "Removed /etc/systemd/system/apache2.service.",
    "prerequisites": "Root."
  },
  {
    "id": "systemd-daemon-reload",
    "category": "services-systemd",
    "categoryLabel": "Services and Systemd",
    "title": "Reload Systemd Manager Configuration",
    "command": "sudo systemctl daemon-reload",
    "description": "Re-scans /etc/systemd/system for newly created or modified unit files.",
    "privilege": "sudo",
    "tags": [
      "systemd",
      "daemon-reload",
      "reload-units"
    ],
    "explanation": "Must be executed whenever you edit .service files before restarting.",
    "expectedOutput": "",
    "prerequisites": "Root."
  },
  {
    "id": "systemd-list-running",
    "category": "services-systemd",
    "categoryLabel": "Services and Systemd",
    "title": "List All Currently Running Services",
    "command": "systemctl list-units --type=service --state=running",
    "description": "Displays all active daemon services managed by systemd.",
    "privilege": "user",
    "tags": [
      "systemd",
      "list",
      "running",
      "services"
    ],
    "explanation": "Overview of all active system daemons.",
    "expectedOutput": "UNIT                    LOAD   ACTIVE SUB     DESCRIPTION\ncron.service            loaded active running Regular background program processing daemon\nnginx.service           loaded active running A high performance web server\nssh.service             loaded active running OpenBSD Secure Shell server",
    "prerequisites": "Systemd."
  },
  {
    "id": "systemd-list-failed",
    "category": "services-systemd",
    "categoryLabel": "Services and Systemd",
    "title": "List All Failed Services on Host",
    "command": "systemctl --failed",
    "description": "Quickly audits crashed or degraded units requiring troubleshooting.",
    "privilege": "user",
    "tags": [
      "systemd",
      "failed",
      "troubleshoot",
      "errors"
    ],
    "explanation": "Zero units returned indicates fully healthy system.",
    "expectedOutput": "0 loaded units listed.",
    "prerequisites": "Systemd."
  },
  {
    "id": "systemd-cat-unit",
    "category": "services-systemd",
    "categoryLabel": "Services and Systemd",
    "title": "View Unit File Source Code & Drop-In Overrides",
    "command": "systemctl cat devops-portal.service",
    "description": "Displays the underlying unit configuration file and any drop-in overrides.",
    "privilege": "user",
    "tags": [
      "systemd",
      "cat",
      "unit-file",
      "inspect"
    ],
    "explanation": "Shows exact Environment, ExecStart, Restart policies without needing to locate file on disk.",
    "expectedOutput": "# /etc/systemd/system/devops-portal.service\n[Unit]\nDescription=DevOps Stored Data Backend Service\nAfter=network.target\n\n[Service]\nType=simple\nUser=kishwanth\nWorkingDirectory=/opt/devops-stored-data\nExecStart=/usr/bin/node src/server.js\nRestart=always\n\n[Install]\nWantedBy=multi-user.target",
    "prerequisites": "Systemd."
  },
  {
    "id": "systemd-is-active",
    "category": "services-systemd",
    "categoryLabel": "Services and Systemd",
    "title": "Script-Friendly Check if Service is Active",
    "command": "systemctl is-active --quiet nginx && echo \"Nginx is running\" || echo \"Nginx is down\"",
    "description": "Returns exit code 0 if service is active, non-zero if inactive or failed.",
    "privilege": "user",
    "tags": [
      "systemd",
      "is-active",
      "scripting",
      "health"
    ],
    "explanation": "Ideal for health checks in automated shell scripts.",
    "expectedOutput": "Nginx is running",
    "prerequisites": "Systemd."
  },
  {
    "id": "systemd-is-enabled",
    "category": "services-systemd",
    "categoryLabel": "Services and Systemd",
    "title": "Check if Service is Enabled for Boot Autostart",
    "command": "systemctl is-enabled nginx",
    "description": "Outputs enabled, disabled, or masked status.",
    "privilege": "user",
    "tags": [
      "systemd",
      "is-enabled",
      "boot"
    ],
    "explanation": "Checks presence of symlinks in target wants directory.",
    "expectedOutput": "enabled",
    "prerequisites": "Systemd."
  },
  {
    "id": "systemd-journalctl-tail",
    "category": "services-systemd",
    "categoryLabel": "Services and Systemd",
    "title": "Stream Real-Time Service Journal Logs (journalctl -f)",
    "command": "journalctl -u devops-portal -f -n 50",
    "description": "Streams live console log output from target service systemd journal.",
    "privilege": "user",
    "tags": [
      "systemd",
      "journalctl",
      "logs",
      "stream"
    ],
    "explanation": "Unified system logging showing both stdout and stderr with timestamps.",
    "expectedOutput": "Oct 16 12:55:01 srv devops-portal[1740]: [INFO] User kishwanth authenticated\nOct 16 12:55:12 srv devops-portal[1740]: [INFO] Handled GET /api/files (200 OK)",
    "prerequisites": "Systemd."
  },
  {
    "id": "systemd-journalctl-today",
    "category": "services-systemd",
    "categoryLabel": "Services and Systemd",
    "title": "Filter Service Logs Generated Today",
    "command": "journalctl -u nginx --since today --priority=err",
    "description": "Extracts only error-level log lines generated by Nginx since midnight.",
    "privilege": "user",
    "tags": [
      "systemd",
      "journalctl",
      "errors",
      "filter"
    ],
    "explanation": "Limits output to serious errors for rapid issue identification.",
    "expectedOutput": "-- Logs begin at Mon 2026-10-01, end at Thu 2026-10-16. --\n-- No entries --",
    "prerequisites": "Systemd."
  },
  {
    "id": "systemd-journalctl-kernel",
    "category": "services-systemd",
    "categoryLabel": "Services and Systemd",
    "title": "Inspect Kernel Hardware & Driver Messages (journalctl -k)",
    "command": "journalctl -k -b --priority=err",
    "description": "Queries kernel ring buffer (dmesg) for hardware faults, NIC resets, or disk errors.",
    "privilege": "user",
    "tags": [
      "systemd",
      "journalctl",
      "kernel",
      "dmesg",
      "hardware"
    ],
    "explanation": "-k filters for kernel messages, -b restricts to current boot.",
    "expectedOutput": "Oct 16 04:00:12 srv kernel: ACPI: Error allocating memory",
    "prerequisites": "Systemd."
  },
  {
    "id": "disk-df-human",
    "category": "disk-storage",
    "categoryLabel": "Disk and Storage",
    "title": "Check Filesystem Disk Space Usage (df -hT)",
    "command": "df -hT --exclude-type=tmpfs --exclude-type=devtmpfs",
    "description": "Displays disk capacity, used space, available space, and filesystem type for mounted partitions.",
    "privilege": "user",
    "tags": [
      "disk",
      "df",
      "storage",
      "capacity"
    ],
    "explanation": "-h gives gigabytes/megabytes, -T shows ext4/xfs/btrfs.",
    "expectedOutput": "Filesystem     Type  Size  Used Avail Use% Mounted on\n/dev/sda1      ext4   80G   18G   58G  24% /\n/dev/sdb1      ext4  500G  120G  355G  26% /data",
    "prerequisites": "Linux."
  },
  {
    "id": "disk-du-summary",
    "category": "disk-storage",
    "categoryLabel": "Disk and Storage",
    "title": "Calculate Directory Sizes in Human-Readable Units",
    "command": "du -sh /var/log/* 2>/dev/null | sort -h",
    "description": "Summarizes storage occupied by each folder inside /var/log, sorted smallest to largest.",
    "privilege": "user",
    "tags": [
      "disk",
      "du",
      "directory-size",
      "human"
    ],
    "explanation": "-s gives summary for directory rather than printing every file.",
    "expectedOutput": "4.0K\t/var/log/bootstrap.log\n12M\t/var/log/nginx\n142M\t/var/log/journal",
    "prerequisites": "Coreutils."
  },
  {
    "id": "disk-du-top10",
    "category": "disk-storage",
    "categoryLabel": "Disk and Storage",
    "title": "Find Top 10 Largest Folders in Root Directory",
    "command": "sudo du -h --max-depth=1 / 2>/dev/null | sort -rh | head -n 11",
    "description": "Analyzes root drive to identify which top-level directories consume the most storage.",
    "privilege": "sudo",
    "tags": [
      "disk",
      "du",
      "top10",
      "storage-hog"
    ],
    "explanation": "First step in cleaning up full disks.",
    "expectedOutput": "18G\t/\n8.4G\t/var\n4.2G\t/usr\n2.8G\t/home\n1.2G\t/opt",
    "prerequisites": "Root."
  },
  {
    "id": "disk-lsblk-tree",
    "category": "disk-storage",
    "categoryLabel": "Disk and Storage",
    "title": "List All Block Devices & Partition Filesystems",
    "command": "lsblk -f",
    "description": "Renders tree of physical disks (sda, nvme0n1), partitions, UUIDs, and mount points.",
    "privilege": "user",
    "tags": [
      "disk",
      "lsblk",
      "partitions",
      "uuid"
    ],
    "explanation": "Shows how physical drives and LVM volumes map to system mount points.",
    "expectedOutput": "NAME   FSTYPE FSVER LABEL UUID                                 FSAVAIL FSUSE% MOUNTPOINTS\nsda                                                                           \n├─sda1 ext4   1.0         4f8e9a2b-1c3d-4e5f-6a7b-8c9d0e1f2a3b   58.2G    24% /\n└─sda2 swap   1           7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d                [SWAP]",
    "prerequisites": "util-linux."
  },
  {
    "id": "disk-fdisk-list",
    "category": "disk-storage",
    "categoryLabel": "Disk and Storage",
    "title": "Inspect Disk Partition Table & Sector Geometries",
    "command": "sudo fdisk -l /dev/sda",
    "description": "Displays partition table scheme (GPT or MBR), sector size, and partition offsets.",
    "privilege": "sudo",
    "tags": [
      "disk",
      "fdisk",
      "partition-table",
      "gpt"
    ],
    "explanation": "Low-level drive sector inspection tool.",
    "expectedOutput": "Disk /dev/sda: 80 GiB, 85899345920 bytes, 167772160 sectors\nDisk model: VBOX HARDDISK   \nUnits: sectors of 1 * 512 = 512 bytes\nSector size (logical/physical): 512 bytes / 512 bytes\nDisklabel type: gpt\n\nDevice       Start       End   Sectors Size Type\n/dev/sda1     2048 163577855 163575808  78G Linux filesystem\n/dev/sda2 163577856 167770111   4192256   2G Linux swap",
    "prerequisites": "Root."
  },
  {
    "id": "disk-smartctl",
    "category": "disk-storage",
    "categoryLabel": "Disk and Storage",
    "title": "Check Drive Hardware Health & SMART Attributes",
    "command": "sudo smartctl -H /dev/sda",
    "description": "Queries hard drive / NVMe S.M.A.R.T. controller to test for impending hardware failure.",
    "privilege": "sudo",
    "tags": [
      "disk",
      "smartctl",
      "hardware",
      "health"
    ],
    "explanation": "Reports overall health test result.",
    "expectedOutput": "smartctl 7.4 2023-08-01 r5530 [x86_64-linux-6.8.0-45-generic]\n=== START OF READ SMART DATA SECTION ===\nSMART overall-health self-assessment test result: PASSED",
    "prerequisites": "smartmontools package."
  },
  {
    "id": "disk-mount",
    "category": "disk-storage",
    "categoryLabel": "Disk and Storage",
    "title": "Mount Filesystem to Target Directory",
    "command": "sudo mount /dev/sdb1 /mnt/data",
    "description": "Attaches partition /dev/sdb1 to /mnt/data directory.",
    "privilege": "sudo",
    "tags": [
      "disk",
      "mount",
      "storage"
    ],
    "explanation": "Makes partition files accessible under mount path.",
    "expectedOutput": "",
    "prerequisites": "Root."
  },
  {
    "id": "disk-umount",
    "category": "disk-storage",
    "categoryLabel": "Disk and Storage",
    "title": "Unmount Filesystem Safely",
    "command": "sudo umount /mnt/data",
    "description": "Flushes cached writes and detaches filesystem.",
    "privilege": "sudo",
    "tags": [
      "disk",
      "umount",
      "storage"
    ],
    "explanation": "Safely detaches drive so physical media or network volume can be detached.",
    "expectedOutput": "",
    "prerequisites": "Drive not in use."
  },
  {
    "id": "disk-lsof-mount",
    "category": "disk-storage",
    "categoryLabel": "Disk and Storage",
    "title": "Find Processes Preventing Drive Unmount (\"target is busy\")",
    "command": "sudo lsof +D /mnt/data",
    "description": "Lists all processes keeping open file handles or working directories on the mounted disk.",
    "privilege": "sudo",
    "tags": [
      "disk",
      "lsof",
      "busy",
      "troubleshoot"
    ],
    "explanation": "Fixes umount: target is busy error by identifying who is holding files.",
    "expectedOutput": "COMMAND   PID      USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\nbash     8412 kishwanth  cwd    DIR    8,17     4096    2 /mnt/data/reports",
    "prerequisites": "Root."
  },
  {
    "id": "disk-fsck",
    "category": "disk-storage",
    "categoryLabel": "Disk and Storage",
    "title": "Check and Repair Filesystem Integrity",
    "command": "sudo fsck -f -y /dev/sdb1",
    "description": "Checks ext4 filesystem for corrupted inodes or bad blocks and automatically repairs them.",
    "privilege": "sudo",
    "tags": [
      "disk",
      "fsck",
      "repair",
      "integrity"
    ],
    "explanation": "Never run fsck on a mounted filesystem; unmount first.",
    "expectedOutput": "fsck from util-linux 2.39.3\ne2fsck 1.47.0 (5-Feb-2023)\nPass 1: Checking inodes, blocks, and sizes\nPass 2: Checking directory structure\nDataDisk: 12/65536 files (0.0% non-contiguous), 4210/262144 blocks",
    "prerequisites": "Unmounted partition."
  },
  {
    "id": "disk-mkfs-ext4",
    "category": "disk-storage",
    "categoryLabel": "Disk and Storage",
    "title": "Format Partition with Ext4 Filesystem & Label",
    "command": "sudo mkfs.ext4 -L \"DevOpsData\" /dev/sdb1",
    "description": "Creates an ext4 filesystem structure on partition with persistent volume label.",
    "privilege": "sudo",
    "tags": [
      "disk",
      "mkfs",
      "format",
      "ext4"
    ],
    "explanation": "Caution: erases existing partition data.",
    "expectedOutput": "mke2fs 1.47.0 (5-Feb-2023)\nCreating filesystem with 262144 4k blocks and 65536 inodes\nFilesystem UUID: 8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d\nWriting superblocks and filesystem accounting information: done",
    "prerequisites": "Root."
  },
  {
    "id": "disk-iostat",
    "category": "disk-storage",
    "categoryLabel": "Disk and Storage",
    "title": "Monitor Disk I/O Throughput & Wait Times",
    "command": "iostat -xz 1 3",
    "description": "Displays disk read/write KB/s, await (queue latency), and %utilization across drives.",
    "privilege": "user",
    "tags": [
      "disk",
      "iostat",
      "performance",
      "throughput"
    ],
    "explanation": "%util near 100% indicates disk bottleneck.",
    "expectedOutput": "Device            r/s     w/s     rkB/s     wkB/s  await %util\nsda              1.20   12.40     48.20    184.10   1.42  2.10",
    "prerequisites": "sysstat package."
  },
  {
    "id": "disk-sync",
    "category": "disk-storage",
    "categoryLabel": "Disk and Storage",
    "title": "Flush Dirty OS Disk Caches to Storage Hardware",
    "command": "sync",
    "description": "Forces all unwritten cached buffers in RAM to be physically written to persistent storage.",
    "privilege": "user",
    "tags": [
      "disk",
      "sync",
      "flush",
      "buffer"
    ],
    "explanation": "Useful before hard reboot or unmounting external drives.",
    "expectedOutput": "",
    "prerequisites": "Coreutils."
  },
  {
    "id": "net-ip-addr",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Display All Network Interfaces & IP Addresses",
    "command": "ip addr show",
    "description": "Lists all network adapters (eth0, wlan0, docker0) with IPv4 and IPv6 CIDRs and link state.",
    "privilege": "user",
    "tags": [
      "networking",
      "ip",
      "interfaces",
      "ip-address"
    ],
    "explanation": "Standard Linux iproute2 tool replacing legacy ifconfig.",
    "expectedOutput": "1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP\n    inet 192.168.0.132/24 brd 192.168.0.255 scope global dynamic eth0",
    "prerequisites": "iproute2."
  },
  {
    "id": "net-ip-route",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Display IP Routing Table & Default Gateway",
    "command": "ip route show",
    "description": "Shows default gateway router IP and local subnet routing rules.",
    "privilege": "user",
    "tags": [
      "networking",
      "ip",
      "route",
      "gateway"
    ],
    "explanation": "Identifies which interface handles outbound internet traffic.",
    "expectedOutput": "default via 192.168.0.1 dev eth0 proto dhcp src 192.168.0.132 metric 100\n172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1\n192.168.0.0/24 dev eth0 proto kernel scope link src 192.168.0.132 metric 100",
    "prerequisites": "iproute2."
  },
  {
    "id": "net-ip-link-toggle",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Bring Network Interface Up or Down",
    "command": "sudo ip link set dev eth0 down && sudo ip link set dev eth0 up",
    "description": "Resets network link state to renegotiate DHCP or apply hardware configuration changes.",
    "privilege": "sudo",
    "tags": [
      "networking",
      "ip",
      "link",
      "reset"
    ],
    "explanation": "Bounces the physical or virtual adapter.",
    "expectedOutput": "",
    "prerequisites": "Root."
  },
  {
    "id": "net-ping-count",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Test Network Connectivity & Latency with Count",
    "command": "ping -c 4 8.8.8.8",
    "description": "Sends 4 ICMP echo requests measuring round-trip time and packet loss.",
    "privilege": "user",
    "tags": [
      "networking",
      "ping",
      "icmp",
      "latency"
    ],
    "explanation": "Basic reachability test.",
    "expectedOutput": "PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.\n64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=12.4 ms\n64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=11.9 ms\n\n--- 8.8.8.8 ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss, time 3004ms",
    "prerequisites": "iputils-ping."
  },
  {
    "id": "net-traceroute",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Trace Network Hops to Destination (traceroute)",
    "command": "traceroute -n 1.1.1.1",
    "description": "Discovers intermediate routers and latency along the path using incrementing TTL packets.",
    "privilege": "user",
    "tags": [
      "networking",
      "traceroute",
      "hops",
      "routing"
    ],
    "explanation": "-n prevents slow reverse DNS lookups on intermediate router IPs.",
    "expectedOutput": "traceroute to 1.1.1.1 (1.1.1.1), 30 hops max, 60 byte packets\n 1  192.168.0.1  1.214 ms  1.182 ms  1.150 ms\n 2  10.20.0.1  8.412 ms  8.390 ms  8.351 ms\n 3  1.1.1.1  12.420 ms  12.380 ms  12.310 ms",
    "prerequisites": "traceroute package."
  },
  {
    "id": "net-tcptraceroute",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Trace Path Using TCP SYN Packets (Bypass ICMP Firewalls)",
    "command": "tcptraceroute example.com 443",
    "description": "Traces network path using TCP port 443 packets to pass through firewalls that block ICMP ping.",
    "privilege": "user",
    "tags": [
      "networking",
      "tcptraceroute",
      "tcp",
      "firewall"
    ],
    "explanation": "Pinpoints whether packet loss is caused by network routing or cloud security group blocks.",
    "expectedOutput": "Selected device eth0, address 192.168.0.132 for outgoing packets\nTracing the path to example.com (93.184.216.34) on TCP port 443 (https), 30 hops max\n 1  192.168.0.1  1.421 ms\n 2  93.184.216.34 [open]  14.210 ms",
    "prerequisites": "tcptraceroute."
  },
  {
    "id": "net-ss-all-sockets",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Display Active Network Sockets & Connections",
    "command": "ss -tunap",
    "description": "Lists TCP and UDP sockets with connection states (ESTAB, TIME-WAIT) and associated PIDs.",
    "privilege": "user",
    "tags": [
      "networking",
      "ss",
      "sockets",
      "connections"
    ],
    "explanation": "-t = TCP, -u = UDP, -n = numeric, -a = all, -p = show process.",
    "expectedOutput": "Netid State  Recv-Q Send-Q Local Address:Port Peer Address:PortProcess\ntcp   ESTAB  0      0      192.168.0.132:5000 192.168.0.82:54212 users:((\"node\",pid=1740,fd=22))",
    "prerequisites": "iproute2."
  },
  {
    "id": "net-ss-listening-tcp",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "List All Listening TCP Ports with Bound Daemons",
    "command": "ss -tlnp",
    "description": "Lists all open server listening ports and the processes bound to them.",
    "privilege": "user",
    "tags": [
      "networking",
      "ss",
      "listening",
      "ports"
    ],
    "explanation": "Quickly shows whether services are listening on localhost (127.0.0.1) or all interfaces (0.0.0.0).",
    "expectedOutput": "State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess\nLISTEN 0      511          0.0.0.0:80         0.0.0.0:*    users:((\"nginx\",pid=1420,fd=6))\nLISTEN 0      4096         0.0.0.0:5000       0.0.0.0:*    users:((\"node\",pid=1740,fd=19))",
    "prerequisites": "iproute2."
  },
  {
    "id": "net-nslookup",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Query DNS Records via nslookup",
    "command": "nslookup api.github.com",
    "description": "Queries configured system nameserver to resolve IP addresses for hostnames.",
    "privilege": "user",
    "tags": [
      "networking",
      "dns",
      "nslookup",
      "resolve"
    ],
    "explanation": "Standard interactive and batch DNS lookup utility.",
    "expectedOutput": "Server:\t\t192.168.0.1\nAddress:\t192.168.0.1#53\n\nNon-authoritative answer:\nName:\tapi.github.com\nAddress: 140.82.112.6",
    "prerequisites": "dnsutils."
  },
  {
    "id": "net-dig-short",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Query DNS Record Answer Only via Dig",
    "command": "dig example.com +short",
    "description": "Returns only the resolved IP address without headers or authoritative comments.",
    "privilege": "user",
    "tags": [
      "networking",
      "dig",
      "dns",
      "short"
    ],
    "explanation": "Clean format for script variable assignment.",
    "expectedOutput": "93.184.216.34",
    "prerequisites": "dnsutils."
  },
  {
    "id": "net-nc-port-test",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Test Remote TCP Port Connectivity (Netcat)",
    "command": "nc -zv -w 3 127.0.0.1 5000",
    "description": "Attempts TCP three-way handshake with target port without sending application data.",
    "privilege": "user",
    "tags": [
      "networking",
      "netcat",
      "nc",
      "port-test"
    ],
    "explanation": "-z = scanning mode (zero I/O), -v = verbose, -w = timeout seconds.",
    "expectedOutput": "Connection to 127.0.0.1 5000 port [tcp/*] succeeded!",
    "prerequisites": "netcat package."
  },
  {
    "id": "net-curl-head",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Fetch HTTP Response Headers Only (curl -I)",
    "command": "curl -I -s http://localhost:5000/health",
    "description": "Sends HTTP HEAD request returning status codes, cookies, and server headers.",
    "privilege": "user",
    "tags": [
      "networking",
      "curl",
      "http",
      "headers"
    ],
    "explanation": "Fast verification of HTTP response status codes without downloading payload body.",
    "expectedOutput": "HTTP/1.1 200 OK\nX-Powered-By: Express\nContent-Type: application/json; charset=utf-8\nDate: Thu, 16 Oct 2026 12:58:00 GMT",
    "prerequisites": "curl."
  },
  {
    "id": "net-curl-post-json",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Send HTTP POST JSON Request via Curl",
    "command": "curl -X POST http://localhost:5000/api/auth/login -H \"Content-Type: application/json\" -d '{\"username\":\"kishwanth\",\"password\":\"user_password\"}'",
    "description": "Transmits JSON body with appropriate Content-Type header to API endpoint.",
    "privilege": "user",
    "tags": [
      "networking",
      "curl",
      "post",
      "json",
      "api"
    ],
    "explanation": "Used for automated API smoke testing.",
    "expectedOutput": "{\"success\":true,\"token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\",\"user\":{\"username\":\"kishwanth\"}}",
    "prerequisites": "curl."
  },
  {
    "id": "net-curl-download-resume",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Download File with Resumption Support",
    "command": "curl -O -C - https://example.com/large-archive.tar.gz",
    "description": "Downloads remote file and automatically resumes from last downloaded byte if interrupted.",
    "privilege": "user",
    "tags": [
      "networking",
      "curl",
      "download",
      "resume"
    ],
    "explanation": "-C - determines offset automatically.",
    "expectedOutput": "** Resuming transfer from byte position 14892018\n  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n100  42.0M  100 42.0M    0     0  14.2M      0  0:00:02  0:00:02 --:--:-- 14.2M",
    "prerequisites": "curl."
  },
  {
    "id": "net-wget-download",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Download File in Background via Wget",
    "command": "wget -c -b https://example.com/database_backup.dump.gz",
    "description": "Downloads file with continuation (-c) running in background (-b) logging to wget-log.",
    "privilege": "user",
    "tags": [
      "networking",
      "wget",
      "download",
      "background"
    ],
    "explanation": "Survives terminal disconnect.",
    "expectedOutput": "Continuing in background, pid 19412.\nOutput will be written to 'wget-log'.",
    "prerequisites": "wget."
  },
  {
    "id": "net-tcpdump-sniff",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Capture Network Packets on Specific Interface & Port",
    "command": "sudo tcpdump -i any -n \"port 5000 or port 80\" -c 10",
    "description": "Captures and decodes packet headers on ports 5000 or 80 up to 10 packets.",
    "privilege": "sudo",
    "tags": [
      "networking",
      "tcpdump",
      "packets",
      "sniff"
    ],
    "explanation": "-i any captures across all interfaces, -n skips DNS lookups.",
    "expectedOutput": "12:59:01.1420 IP 192.168.0.82.54212 > 192.168.0.132.5000: Flags [P.], seq 1:42, ack 1, win 502, length 41\n12:59:01.1422 IP 192.168.0.132.5000 > 192.168.0.82.54212: Flags [.], ack 42, win 501, length 0",
    "prerequisites": "tcpdump."
  },
  {
    "id": "net-ip-neigh",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Display ARP / Neighbor Cache Table",
    "command": "ip neigh show",
    "description": "Lists local network IP addresses mapped to their hardware Ethernet MAC addresses.",
    "privilege": "user",
    "tags": [
      "networking",
      "arp",
      "mac-address",
      "neighbor"
    ],
    "explanation": "Modern Linux replacement for arp -a.",
    "expectedOutput": "192.168.0.1 dev eth0 lladdr 70:54:d2:14:82:90 REACHABLE\n192.168.0.82 dev eth0 lladdr 00:e0:4c:68:01:22 STALE",
    "prerequisites": "iproute2."
  },
  {
    "id": "net-ip-stats-link",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Check Interface Packet Drop & Error Statistics",
    "command": "ip -s link show eth0",
    "description": "Displays TX/RX byte counters, packet drops, carrier errors, and collisions.",
    "privilege": "user",
    "tags": [
      "networking",
      "interface",
      "errors",
      "drops"
    ],
    "explanation": "Diagnoses faulty cables or network card driver issues.",
    "expectedOutput": "2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP mode DEFAULT group default qlen 1000\n    link/ether 08:00:27:14:82:90 brd ff:ff:ff:ff:ff:ff\n    RX:  bytes packets errors dropped missed  mcast\n     142089240  104200      0       0      0      0\n    TX:  bytes packets errors dropped carrier collsns\n      84102910   84120      0       0       0      0",
    "prerequisites": "iproute2."
  },
  {
    "id": "net-iperf3-client",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Benchmark Raw Network Bandwidth via iperf3",
    "command": "iperf3 -c 192.168.0.1 -t 5 -P 2",
    "description": "Measures maximum TCP bandwidth throughput between client and server over 5 seconds.",
    "privilege": "user",
    "tags": [
      "networking",
      "iperf3",
      "bandwidth",
      "throughput",
      "speedtest"
    ],
    "explanation": "-P 2 uses 2 parallel TCP streams.",
    "expectedOutput": "[SUM]   0.00-5.00   sec   562 MBytes   942 Mbits/sec                  sender\n[SUM]   0.00-5.00   sec   560 MBytes   939 Mbits/sec                  receiver",
    "prerequisites": "iperf3."
  },
  {
    "id": "net-host-lookup",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Perform Forward and Reverse DNS Lookups",
    "command": "host 8.8.8.8 && host dns.google",
    "description": "Simple forward and reverse PTR resolution utility.",
    "privilege": "user",
    "tags": [
      "networking",
      "host",
      "dns",
      "ptr"
    ],
    "explanation": "Resolves IP to canonical hostname and vice versa.",
    "expectedOutput": "8.8.8.8.in-addr.arpa domain name pointer dns.google.\ndns.google has address 8.8.8.8\ndns.google has IPv6 address 2001:4860:4860::8888",
    "prerequisites": "bind-utils."
  },
  {
    "id": "net-public-wan-ip",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Check Public WAN IP Address of Server",
    "command": "curl -s https://ifconfig.me && echo \"\"",
    "description": "Queries remote external service to discover internet-facing public IPv4 address.",
    "privilege": "user",
    "tags": [
      "networking",
      "wan-ip",
      "public-ip",
      "curl"
    ],
    "explanation": "Finds external NAT IP.",
    "expectedOutput": "203.0.113.42",
    "prerequisites": "Internet access."
  },
  {
    "id": "net-whois-domain",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Inspect WHOIS Domain Registration & Registrar Info",
    "command": "whois example.com | grep -E \"Registrar:|Creation Date:|Registry Expiry Date:\"",
    "description": "Queries WHOIS database for domain registrar, creation date, and expiration.",
    "privilege": "user",
    "tags": [
      "networking",
      "whois",
      "domain",
      "registration"
    ],
    "explanation": "Verifies domain ownership and renewal status.",
    "expectedOutput": "Registrar: RESERVED-Internet Assigned Numbers Authority\nCreation Date: 1995-08-14T04:00:00Z\nRegistry Expiry Date: 2027-08-13T04:00:00Z",
    "prerequisites": "whois package."
  },
  {
    "id": "net-nmap-subnet",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Scan Subnet for Active Live Hosts (Ping Sweep)",
    "command": "sudo nmap -sn 192.168.0.0/24",
    "description": "Performs ping sweep across entire /24 subnet discovering all online devices.",
    "privilege": "sudo",
    "tags": [
      "networking",
      "nmap",
      "subnet",
      "sweep"
    ],
    "explanation": "-sn skips port scan and tests host discovery only.",
    "expectedOutput": "Nmap scan report for router (192.168.0.1)\nHost is up (0.0012s latency).\nNmap scan report for devops-srv (192.168.0.132)\nHost is up (0.0001s latency).\nNmap done: 256 IP addresses (4 hosts up) scanned in 1.82 seconds",
    "prerequisites": "nmap."
  },
  {
    "id": "net-ping-mtu-size",
    "category": "networking",
    "categoryLabel": "Networking",
    "title": "Test Path MTU Size to Detect Packet Fragmentation",
    "command": "ping -c 2 -M do -s 1472 8.8.8.8",
    "description": "Sends ICMP packets with Don't Fragment (DF) bit set to determine maximum MTU.",
    "privilege": "user",
    "tags": [
      "networking",
      "mtu",
      "fragmentation",
      "ping"
    ],
    "explanation": "1472 bytes payload + 28 bytes IP/ICMP header = 1500 bytes standard Ethernet MTU.",
    "expectedOutput": "1480 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=12.2 ms\n1480 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=12.1 ms",
    "prerequisites": "iputils-ping."
  },
  {
    "id": "ssh-connect-key",
    "category": "ssh-file-transfer",
    "categoryLabel": "SSH and File Transfer",
    "title": "Connect to Remote Server Using SSH Private Key",
    "command": "ssh -i ~/.ssh/id_rsa -p 22 kishwanth@192.168.0.132",
    "description": "Authenticates securely with remote Linux server using public-key cryptography.",
    "privilege": "user",
    "tags": [
      "ssh",
      "connect",
      "remote",
      "auth"
    ],
    "explanation": "Specifies explicit identity file (-i) and SSH port (-p).",
    "expectedOutput": "Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-45-generic x86_64)\nLast login: Thu Oct 16 10:15:00 2026 from 192.168.0.50\nkishwanth@devops-srv:~$",
    "prerequisites": "SSH client."
  },
  {
    "id": "ssh-keygen-ed25519",
    "category": "ssh-file-transfer",
    "categoryLabel": "SSH and File Transfer",
    "title": "Generate Modern ED25519 SSH Keypair",
    "command": "ssh-keygen -t ed25519 -C \"admin@devops.local\" -f ~/.ssh/id_ed25519",
    "description": "Generates secure, compact elliptic-curve cryptographic keypair.",
    "privilege": "user",
    "tags": [
      "ssh",
      "keygen",
      "ed25519",
      "security"
    ],
    "explanation": "ED25519 is faster and more secure than legacy RSA 2048.",
    "expectedOutput": "Generating public/private ed25519 key pair.\nYour identification has been saved in ~/.ssh/id_ed25519\nYour public key has been saved in ~/.ssh/id_ed25519.pub\nThe key fingerprint is: SHA256:7a8b9c0d1e2f... admin@devops.local",
    "prerequisites": "OpenSSH."
  },
  {
    "id": "ssh-copy-id-host",
    "category": "ssh-file-transfer",
    "categoryLabel": "SSH and File Transfer",
    "title": "Copy Public Key to Remote Server (ssh-copy-id)",
    "command": "ssh-copy-id -i ~/.ssh/id_ed25519.pub kishwanth@192.168.0.132",
    "description": "Appends local public key to ~/.ssh/authorized_keys on remote server with proper permissions.",
    "privilege": "user",
    "tags": [
      "ssh",
      "ssh-copy-id",
      "passwordless",
      "setup"
    ],
    "explanation": "Enables passwordless key authentication.",
    "expectedOutput": "/usr/bin/ssh-copy-id: INFO: 1 key(s) added\nNow try logging into the machine, with: \"ssh 'kishwanth@192.168.0.132'\"",
    "prerequisites": "Remote server."
  },
  {
    "id": "ssh-socks-proxy",
    "category": "ssh-file-transfer",
    "categoryLabel": "SSH and File Transfer",
    "title": "Establish Dynamic SOCKS5 Proxy Tunnel",
    "command": "ssh -D 1080 -N -f -C kishwanth@bastion.example.com",
    "description": "Routes local browser or curl traffic through remote bastion host via SOCKS5 proxy on port 1080.",
    "privilege": "user",
    "tags": [
      "ssh",
      "socks5",
      "proxy",
      "tunnel"
    ],
    "explanation": "-D 1080 opens SOCKS port, -N executes no remote command, -f forks to background.",
    "expectedOutput": "",
    "prerequisites": "SSH access to remote host."
  },
  {
    "id": "ssh-local-port-forward",
    "category": "ssh-file-transfer",
    "categoryLabel": "SSH and File Transfer",
    "title": "Forward Local Port to Remote Internal Database",
    "command": "ssh -L 5432:localhost:5432 -N kishwanth@remote-db.example.com",
    "description": "Tunnel localhost:5432 securely through SSH into remote server's internal database port.",
    "privilege": "user",
    "tags": [
      "ssh",
      "port-forward",
      "tunnel",
      "database"
    ],
    "explanation": "Allows GUI SQL tools (DBeaver, pgAdmin) to access private databases without public IP.",
    "expectedOutput": "",
    "prerequisites": "SSH host."
  },
  {
    "id": "ssh-scp-single-file",
    "category": "ssh-file-transfer",
    "categoryLabel": "SSH and File Transfer",
    "title": "Secure Copy File to Remote Server (scp)",
    "command": "scp -P 22 ./dist/app.tar.gz kishwanth@192.168.0.132:/opt/releases/",
    "description": "Transfers file encrypted over SSH protocol to target directory on remote host.",
    "privilege": "user",
    "tags": [
      "ssh",
      "scp",
      "file-transfer",
      "deploy"
    ],
    "explanation": "Standard file copy utility built into OpenSSH.",
    "expectedOutput": "app.tar.gz                           100%   18MB  24.2MB/s   00:00",
    "prerequisites": "SSH server."
  },
  {
    "id": "ssh-scp-recursive-dir",
    "category": "ssh-file-transfer",
    "categoryLabel": "SSH and File Transfer",
    "title": "Secure Copy Directory Tree Recursively (scp -r)",
    "command": "scp -r ./dist kishwanth@192.168.0.132:/var/www/html/",
    "description": "Transfers entire directory and all nested subdirectories to remote machine.",
    "privilege": "user",
    "tags": [
      "ssh",
      "scp",
      "recursive",
      "transfer"
    ],
    "explanation": "-r flag copies folders recursively.",
    "expectedOutput": "index.html                           100%   450     1.2MB/s   00:00\nassets/index.js                      100%   416KB  18.4MB/s   00:00",
    "prerequisites": "SSH access."
  },
  {
    "id": "ssh-rsync-sync",
    "category": "ssh-file-transfer",
    "categoryLabel": "SSH and File Transfer",
    "title": "Incremental Directory Sync with Progress (rsync)",
    "command": "rsync -avzP --delete ./dist/ kishwanth@192.168.0.132:/var/www/html/",
    "description": "Fast differential transfer: copies only modified bytes and removes obsolete files at destination.",
    "privilege": "user",
    "tags": [
      "ssh",
      "rsync",
      "sync",
      "delta",
      "deploy"
    ],
    "explanation": "-a = archive, -v = verbose, -z = compress, -P = progress, --delete = mirror exact state.",
    "expectedOutput": "sending incremental file list\n./\nassets/index.js\n          416,540 100%   28.12MB/s    0:00:00 (xfr#1, to-chk=0/24)\n\nsent 142,890 bytes  received 1,420 bytes  288,620.00 bytes/sec\ntotal size is 450,120  speedup is 3.12",
    "prerequisites": "rsync installed on local and remote host."
  },
  {
    "id": "ssh-rsync-dryrun",
    "category": "ssh-file-transfer",
    "categoryLabel": "SSH and File Transfer",
    "title": "Preview Rsync Synchronization with Dry-Run",
    "command": "rsync -avzn --delete ./dist/ kishwanth@192.168.0.132:/var/www/html/",
    "description": "Simulates sync and outputs exact files that would be uploaded or deleted without making changes.",
    "privilege": "user",
    "tags": [
      "ssh",
      "rsync",
      "dry-run",
      "preview",
      "safety"
    ],
    "explanation": "-n flag prevents actual disk modification.",
    "expectedOutput": "sending incremental file list\ndeleting old-bundle-8a9b.js\nassets/index.js\n\nsent 842 bytes  received 120 bytes\nDRY RUN (no changes made)",
    "prerequisites": "rsync."
  },
  {
    "id": "pkg-apt-update",
    "category": "package-mgmt-apt",
    "categoryLabel": "Package Management: ...",
    "title": "Update APT Package Repositories Index",
    "command": "sudo apt update",
    "description": "Downloads latest package metadata lists from mirrors defined in /etc/apt/sources.list.",
    "privilege": "sudo",
    "tags": [
      "package",
      "apt",
      "update",
      "debian",
      "ubuntu"
    ],
    "explanation": "Refreshes package cache without installing software.",
    "expectedOutput": "Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease\nGet:2 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]\nFetched 126 kB in 1s (142 kB/s)\nReading package lists... Done\n4 packages can be upgraded. Run 'apt list --upgradable' to see them.",
    "prerequisites": "APT."
  },
  {
    "id": "pkg-apt-upgrade",
    "category": "package-mgmt-apt",
    "categoryLabel": "Package Management: ...",
    "title": "Upgrade All Installed Packages with Security Patches",
    "command": "sudo apt upgrade -y",
    "description": "Downloads and applies latest updates for all packages installed on system.",
    "privilege": "sudo",
    "tags": [
      "package",
      "apt",
      "upgrade",
      "patch"
    ],
    "explanation": "-y flag automatically confirms prompts.",
    "expectedOutput": "Reading package lists... Done\nBuilding dependency tree... Done\n0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.",
    "prerequisites": "Root."
  },
  {
    "id": "pkg-apt-search",
    "category": "package-mgmt-apt",
    "categoryLabel": "Package Management: ...",
    "title": "Search APT Repository for Package Names",
    "command": "apt search nginx-full",
    "description": "Searches cached package indices for matching names and descriptions.",
    "privilege": "user",
    "tags": [
      "package",
      "apt",
      "search"
    ],
    "explanation": "Displays available packages matching search query.",
    "expectedOutput": "Sorting... Done\nFull Text Search... Done\nnginx-full/noble 1.24.0-2ubuntu7 amd64\n  nginx web/proxy server (standard version)",
    "prerequisites": "APT."
  },
  {
    "id": "pkg-apt-show",
    "category": "package-mgmt-apt",
    "categoryLabel": "Package Management: ...",
    "title": "Display Detailed Package Metadata & Dependencies",
    "command": "apt show docker-ce 2>/dev/null || apt show docker.io",
    "description": "Displays installed version, download size, dependencies, maintainer, and description.",
    "privilege": "user",
    "tags": [
      "package",
      "apt",
      "show",
      "dependencies"
    ],
    "explanation": "Inspects package manifest before installing.",
    "expectedOutput": "Package: docker.io\nVersion: 24.0.7-0ubuntu4.1\nPriority: optional\nSection: admin\nInstalled-Size: 104 MB\nMaintainer: Ubuntu Developers\nHomepage: https://www.docker.com",
    "prerequisites": "APT."
  },
  {
    "id": "pkg-apt-install",
    "category": "package-mgmt-apt",
    "categoryLabel": "Package Management: ...",
    "title": "Install Specific Packages via APT",
    "command": "sudo apt install -y curl git jq htop ca-certificates",
    "description": "Resolves dependencies, downloads deb packages, and configures daemons.",
    "privilege": "sudo",
    "tags": [
      "package",
      "apt",
      "install"
    ],
    "explanation": "Installs essential core DevOps command-line tooling.",
    "expectedOutput": "Setting up jq (1.7.1-3build1) ...\nSetting up htop (3.3.0-4build1) ...\nProcessing triggers for man-db ...",
    "prerequisites": "Root."
  },
  {
    "id": "pkg-apt-remove",
    "category": "package-mgmt-apt",
    "categoryLabel": "Package Management: ...",
    "title": "Remove Package Keeping Configuration Files",
    "command": "sudo apt remove -y nginx",
    "description": "Uninstalls binary files while keeping /etc/nginx/ configuration files intact.",
    "privilege": "sudo",
    "tags": [
      "package",
      "apt",
      "remove"
    ],
    "explanation": "Preserves configs in case package is re-installed later.",
    "expectedOutput": "Removing nginx (1.24.0-2ubuntu7) ...",
    "prerequisites": "Root."
  },
  {
    "id": "pkg-apt-purge",
    "category": "package-mgmt-apt",
    "categoryLabel": "Package Management: ...",
    "title": "Completely Purge Package & All Configuration Files",
    "command": "sudo apt purge -y nginx nginx-common",
    "description": "Uninstalls package and deletes all configuration directories in /etc/.",
    "privilege": "sudo",
    "tags": [
      "package",
      "apt",
      "purge",
      "clean"
    ],
    "explanation": "Leaves zero residual configuration files.",
    "expectedOutput": "Purging configuration files for nginx-common (1.24.0-2ubuntu7) ...",
    "prerequisites": "Root."
  },
  {
    "id": "pkg-apt-autoremove",
    "category": "package-mgmt-apt",
    "categoryLabel": "Package Management: ...",
    "title": "Remove Unused Orphaned Dependencies",
    "command": "sudo apt autoremove -y && sudo apt autoclean",
    "description": "Removes packages installed as dependencies that are no longer needed by any installed software.",
    "privilege": "sudo",
    "tags": [
      "package",
      "apt",
      "autoremove",
      "clean"
    ],
    "explanation": "Frees disk space consumed by old kernels and orphaned libraries.",
    "expectedOutput": "0 upgraded, 0 newly installed, 2 to remove.\nRemoving linux-image-6.5.0-28-generic (6.5.0-28.29) ...",
    "prerequisites": "Root."
  },
  {
    "id": "pkg-dpkg-install",
    "category": "package-mgmt-apt",
    "categoryLabel": "Package Management: ...",
    "title": "Install Local .deb Package File via DPKG",
    "command": "sudo dpkg -i package.deb && sudo apt install -f -y",
    "description": "Installs local Debian package archive and automatically resolves missing dependencies with apt -f.",
    "privilege": "sudo",
    "tags": [
      "package",
      "dpkg",
      "deb",
      "install"
    ],
    "explanation": "Low-level package installer for manually downloaded .deb files.",
    "expectedOutput": "Selecting previously unselected package.\nPreparing to unpack package.deb ...\nSetting up package ...",
    "prerequisites": "Downloaded .deb file."
  },
  {
    "id": "pkg-dnf-upgrade",
    "category": "package-mgmt-yum",
    "categoryLabel": "Package Management: ...",
    "title": "Check and Apply Updates on RHEL / CentOS / Fedora",
    "command": "sudo dnf upgrade --refresh -y",
    "description": "Refreshes repository metadata and upgrades all packages on RPM-based distributions.",
    "privilege": "sudo",
    "tags": [
      "package",
      "dnf",
      "yum",
      "rhel",
      "centos"
    ],
    "explanation": "DNF is the next-generation package manager replacing YUM.",
    "expectedOutput": "Dependencies resolved.\nNothing to do.\nComplete!",
    "prerequisites": "RHEL/CentOS system."
  },
  {
    "id": "pkg-dnf-install",
    "category": "package-mgmt-yum",
    "categoryLabel": "Package Management: ...",
    "title": "Install Package via DNF",
    "command": "sudo dnf install -y epel-release htop",
    "description": "Installs EPEL repository and htop on Enterprise Linux.",
    "privilege": "sudo",
    "tags": [
      "package",
      "dnf",
      "install",
      "rpm"
    ],
    "explanation": "Resolves dependencies using libsolv sat solver.",
    "expectedOutput": "Installed:\n  htop-3.3.0-1.el9.x86_64\nComplete!",
    "prerequisites": "Root."
  },
  {
    "id": "pkg-dnf-remove",
    "category": "package-mgmt-yum",
    "categoryLabel": "Package Management: ...",
    "title": "Remove Package via DNF",
    "command": "sudo dnf remove -y httpd",
    "description": "Uninstalls Apache httpd package.",
    "privilege": "sudo",
    "tags": [
      "package",
      "dnf",
      "remove"
    ],
    "explanation": "Removes package and unneeded dependencies.",
    "expectedOutput": "Removed:\n  httpd-2.4.57-5.el9.x86_64\nComplete!",
    "prerequisites": "Root."
  },
  {
    "id": "pkg-dnf-search",
    "category": "package-mgmt-yum",
    "categoryLabel": "Package Management: ...",
    "title": "Search Repository for Package by Keyword",
    "command": "dnf search redis",
    "description": "Queries RPM repository for package names or descriptions matching redis.",
    "privilege": "user",
    "tags": [
      "package",
      "dnf",
      "search"
    ],
    "explanation": "Displays matching packages available for install.",
    "expectedOutput": "====================== Name Exactly Matched: redis ======================\nredis.x86_64 : A persistent key-value database",
    "prerequisites": "DNF."
  },
  {
    "id": "pkg-rpm-query-info",
    "category": "package-mgmt-yum",
    "categoryLabel": "Package Management: ...",
    "title": "Query Installed RPM Package Information",
    "command": "rpm -qi nginx",
    "description": "Displays build date, vendor, license, and summary of installed RPM package.",
    "privilege": "user",
    "tags": [
      "package",
      "rpm",
      "query",
      "inspect"
    ],
    "explanation": "Reads directly from the local RPM database (/var/lib/rpm).",
    "expectedOutput": "Name        : nginx\nVersion     : 1.24.0\nRelease     : 1.el9\nArchitecture: x86_64\nInstall Date: Wed 15 Oct 2026\nGroup       : System Environment/Daemons\nSize        : 1421004",
    "prerequisites": "RPM."
  },
  {
    "id": "pkg-rpm-query-files",
    "category": "package-mgmt-yum",
    "categoryLabel": "Package Management: ...",
    "title": "List All Files Installed by RPM Package",
    "command": "rpm -ql nginx",
    "description": "Lists all binaries, manpages, and config files owned by the specified RPM package.",
    "privilege": "user",
    "tags": [
      "package",
      "rpm",
      "files",
      "list"
    ],
    "explanation": "Useful for tracking where configs and binaries were placed on disk.",
    "expectedOutput": "/etc/nginx/nginx.conf\n/usr/sbin/nginx\n/usr/share/man/man8/nginx.8.gz",
    "prerequisites": "Installed RPM package."
  },
  {
    "id": "pkg-rpm-file-owner",
    "category": "package-mgmt-yum",
    "categoryLabel": "Package Management: ...",
    "title": "Identify Which RPM Package Owns a File",
    "command": "rpm -qf /etc/nginx/nginx.conf",
    "description": "Returns the exact RPM package name and version that installed the specified file path.",
    "privilege": "user",
    "tags": [
      "package",
      "rpm",
      "owner",
      "inspect"
    ],
    "explanation": "Determines what package to reinstall or inspect when a file is corrupted.",
    "expectedOutput": "nginx-1.24.0-1.el9.x86_64",
    "prerequisites": "RPM."
  },
  {
    "id": "arc-tar-czvf",
    "category": "archives-compression",
    "categoryLabel": "Archives and Compre...",
    "title": "Create Compressed Gzip Tarball (.tar.gz)",
    "command": "tar -czvf /backup/app-backup-$(date +%F).tar.gz /opt/devops-stored-data",
    "description": "Archives directory tree and compresses with gzip (-z) showing progress verbosely (-v).",
    "privilege": "user",
    "tags": [
      "archive",
      "tar",
      "gzip",
      "backup"
    ],
    "explanation": "-c = create, -z = gzip, -v = verbose, -f = file destination.",
    "expectedOutput": "/opt/devops-stored-data/\n/opt/devops-stored-data/package.json\n/opt/devops-stored-data/src/\nArchive created successfully (24.2MB)",
    "prerequisites": "tar."
  },
  {
    "id": "arc-tar-xzvf",
    "category": "archives-compression",
    "categoryLabel": "Archives and Compre...",
    "title": "Extract Gzip Tarball into Directory",
    "command": "tar -xzvf archive.tar.gz -C /opt/releases/",
    "description": "Decompresses and extracts files into specified destination directory (-C).",
    "privilege": "user",
    "tags": [
      "archive",
      "tar",
      "extract",
      "gzip"
    ],
    "explanation": "-x = extract.",
    "expectedOutput": "extracted 142 files to /opt/releases/",
    "prerequisites": "tar."
  },
  {
    "id": "arc-tar-cjvf-bzip2",
    "category": "archives-compression",
    "categoryLabel": "Archives and Compre...",
    "title": "Create High-Compression Bzip2 Archive (.tar.bz2)",
    "command": "tar -cjvf archive.tar.bz2 ./source_dir",
    "description": "Uses bzip2 algorithm (-j) achieving smaller archive file size than gzip.",
    "privilege": "user",
    "tags": [
      "archive",
      "tar",
      "bzip2",
      "compression"
    ],
    "explanation": "Better compression ratio at expense of slightly more CPU time.",
    "expectedOutput": "source_dir/",
    "prerequisites": "bzip2."
  },
  {
    "id": "arc-tar-xjvf-bzip2",
    "category": "archives-compression",
    "categoryLabel": "Archives and Compre...",
    "title": "Extract Bzip2 Archive (.tar.bz2)",
    "command": "tar -xjvf archive.tar.bz2",
    "description": "Decompresses bzip2 archive into current directory.",
    "privilege": "user",
    "tags": [
      "archive",
      "tar",
      "extract",
      "bzip2"
    ],
    "explanation": "Extracts bz2 tar archive.",
    "expectedOutput": "",
    "prerequisites": "tar."
  },
  {
    "id": "arc-tar-list",
    "category": "archives-compression",
    "categoryLabel": "Archives and Compre...",
    "title": "List Archive Contents Without Extracting",
    "command": "tar -ztvf archive.tar.gz | head -n 15",
    "description": "Inspects file paths and permissions stored inside tarball without writing to disk.",
    "privilege": "user",
    "tags": [
      "archive",
      "tar",
      "list",
      "inspect"
    ],
    "explanation": "-t = list table of contents.",
    "expectedOutput": "-rw-r--r-- kishwanth/devops  820 2026-10-15 10:00 package.json\ndrwxr-xr-x kishwanth/devops    0 2026-10-15 10:00 src/",
    "prerequisites": "tar."
  },
  {
    "id": "arc-zip-recursive",
    "category": "archives-compression",
    "categoryLabel": "Archives and Compre...",
    "title": "Create Standard ZIP Archive",
    "command": "zip -r archive.zip ./project -x \"*.git*\" \"node_modules/*\"",
    "description": "Compresses folder into standard .zip archive excluding git and node_modules.",
    "privilege": "user",
    "tags": [
      "archive",
      "zip",
      "compress",
      "exclude"
    ],
    "explanation": "Cross-platform format compatible with Windows, macOS, and Linux.",
    "expectedOutput": "updating: project/ (stored 0%)\n  adding: project/src/server.js (deflated 62%)",
    "prerequisites": "zip package."
  },
  {
    "id": "arc-unzip",
    "category": "archives-compression",
    "categoryLabel": "Archives and Compre...",
    "title": "Extract ZIP Archive to Target Directory",
    "command": "unzip -q archive.zip -d /opt/target_dir",
    "description": "Extracts ZIP archive quietly (-q) into specified target directory (-d).",
    "privilege": "user",
    "tags": [
      "archive",
      "unzip",
      "extract"
    ],
    "explanation": "Restores directory structure.",
    "expectedOutput": "",
    "prerequisites": "unzip."
  },
  {
    "id": "arc-gzip-file",
    "category": "archives-compression",
    "categoryLabel": "Archives and Compre...",
    "title": "Compress Single File Keeping Original (gzip -k)",
    "command": "gzip -k server.log",
    "description": "Compresses file producing server.log.gz while retaining original uncompressed file (-k).",
    "privilege": "user",
    "tags": [
      "archive",
      "gzip",
      "compress",
      "keep"
    ],
    "explanation": "Standard gzip deletes original file unless -k (keep) is specified.",
    "expectedOutput": "",
    "prerequisites": "gzip."
  },
  {
    "id": "arc-gunzip-file",
    "category": "archives-compression",
    "categoryLabel": "Archives and Compre...",
    "title": "Decompress Gzip File Keeping Compressed Copy",
    "command": "gunzip -k server.log.gz",
    "description": "Restores uncompressed server.log while keeping the .gz file intact.",
    "privilege": "user",
    "tags": [
      "archive",
      "gunzip",
      "decompress"
    ],
    "explanation": "Extracts gzip stream.",
    "expectedOutput": "",
    "prerequisites": "gzip."
  },
  {
    "id": "arc-tar-xz-compress",
    "category": "archives-compression",
    "categoryLabel": "Archives and Compre...",
    "title": "Create Maximum-Compression XZ Archive (.tar.xz)",
    "command": "tar -cJf archive.tar.xz ./data",
    "description": "Uses LZMA2 algorithm producing smallest possible archive size for long-term cold backups.",
    "privilege": "user",
    "tags": [
      "archive",
      "tar",
      "xz",
      "lzma2",
      "maximum-compression"
    ],
    "explanation": "-J flag enables XZ compression.",
    "expectedOutput": "",
    "prerequisites": "xz-utils."
  },
  {
    "id": "arc-tar-xz-extract",
    "category": "archives-compression",
    "categoryLabel": "Archives and Compre...",
    "title": "Extract XZ Archive (.tar.xz)",
    "command": "tar -xJf archive.tar.xz",
    "description": "Decompresses and extracts .tar.xz archive.",
    "privilege": "user",
    "tags": [
      "archive",
      "tar",
      "xz",
      "extract"
    ],
    "explanation": "Extracts XZ tar archive.",
    "expectedOutput": "",
    "prerequisites": "tar."
  },
  {
    "id": "env-print-sorted",
    "category": "environment-shell",
    "categoryLabel": "Environment and Shell",
    "title": "Print All Exported Environment Variables Sorted",
    "command": "env | sort",
    "description": "Displays all environment variables accessible to the current process sorted alphabetically.",
    "privilege": "user",
    "tags": [
      "env",
      "variables",
      "shell",
      "sort"
    ],
    "explanation": "Useful for auditing inherited daemon configuration.",
    "expectedOutput": "HOME=/home/kishwanth\nNODE_ENV=production\nPATH=/usr/local/bin:/usr/bin:/bin\nPORT=5000\nUSER=kishwanth",
    "prerequisites": "Coreutils."
  },
  {
    "id": "env-echo-specific",
    "category": "environment-shell",
    "categoryLabel": "Environment and Shell",
    "title": "Print Specific Environment Variable",
    "command": "echo \"$NODE_ENV\"",
    "description": "Outputs evaluated value of variable.",
    "privilege": "user",
    "tags": [
      "env",
      "echo",
      "variable"
    ],
    "explanation": "Returns empty string if variable is unset.",
    "expectedOutput": "production",
    "prerequisites": "Shell."
  },
  {
    "id": "env-export-var",
    "category": "environment-shell",
    "categoryLabel": "Environment and Shell",
    "title": "Export Environment Variable to Child Processes",
    "command": "export API_SECRET=\"devops_secret_key_2026\"",
    "description": "Sets variable and marks it for export so subprocesses inherit it.",
    "privilege": "user",
    "tags": [
      "env",
      "export",
      "shell",
      "child-process"
    ],
    "explanation": "Without export, variable is only visible to the current shell script.",
    "expectedOutput": "",
    "prerequisites": "Shell."
  },
  {
    "id": "env-unset-var",
    "category": "environment-shell",
    "categoryLabel": "Environment and Shell",
    "title": "Unset Environment Variable",
    "command": "unset API_SECRET",
    "description": "Removes variable from shell environment memory.",
    "privilege": "user",
    "tags": [
      "env",
      "unset",
      "cleanup"
    ],
    "explanation": "Prevents subsequent commands from accessing sensitive token.",
    "expectedOutput": "",
    "prerequisites": "Shell."
  },
  {
    "id": "env-source-bashrc",
    "category": "environment-shell",
    "categoryLabel": "Environment and Shell",
    "title": "Reload Shell Profile Without Opening New Terminal",
    "command": "source ~/.bashrc",
    "description": "Executes commands from ~/.bashrc in current shell context updating aliases and PATH.",
    "privilege": "user",
    "tags": [
      "env",
      "source",
      "bashrc",
      "reload"
    ],
    "explanation": "Shorthand: . ~/.bashrc.",
    "expectedOutput": "",
    "prerequisites": "~/.bashrc."
  },
  {
    "id": "env-echo-shell",
    "category": "environment-shell",
    "categoryLabel": "Environment and Shell",
    "title": "Display Active Default Shell Path",
    "command": "echo \"$SHELL\"",
    "description": "Prints executable path of default user shell.",
    "privilege": "user",
    "tags": [
      "env",
      "shell",
      "path"
    ],
    "explanation": "Reads $SHELL environment variable.",
    "expectedOutput": "/bin/bash",
    "prerequisites": "Shell."
  },
  {
    "id": "env-set-options",
    "category": "environment-shell",
    "categoryLabel": "Environment and Shell",
    "title": "List All Configured Shell Options",
    "command": "set -o",
    "description": "Displays state (on/off) of all shell flags (errexit, nounset, pipefail, etc.).",
    "privilege": "user",
    "tags": [
      "env",
      "set",
      "options",
      "shell"
    ],
    "explanation": "Shows strict mode status in active shell.",
    "expectedOutput": "allexport      \toff\nerrexit        \toff\nnounset        \toff\npipefail       \toff\nvi             \toff",
    "prerequisites": "Bash."
  },
  {
    "id": "env-set-x-debug",
    "category": "environment-shell",
    "categoryLabel": "Environment and Shell",
    "title": "Enable Command Debugging Trace (set -x)",
    "command": "set -x",
    "description": "Causes shell to print each command and its evaluated arguments to stderr before executing.",
    "privilege": "user",
    "tags": [
      "env",
      "set",
      "debug",
      "trace"
    ],
    "explanation": "Indispensable for pinpointing where a complex script is failing.",
    "expectedOutput": "+ set -x",
    "prerequisites": "Shell."
  },
  {
    "id": "env-set-plus-x",
    "category": "environment-shell",
    "categoryLabel": "Environment and Shell",
    "title": "Disable Command Debugging Trace (set +x)",
    "command": "set +x",
    "description": "Turns off verbose command printing.",
    "privilege": "user",
    "tags": [
      "env",
      "set",
      "disable-debug"
    ],
    "explanation": "Returns shell output to normal quiet execution.",
    "expectedOutput": "",
    "prerequisites": "Shell."
  },
  {
    "id": "env-set-e-errexit",
    "category": "environment-shell",
    "categoryLabel": "Environment and Shell",
    "title": "Exit Immediately on Any Error (set -e)",
    "command": "set -e",
    "description": "Aborts script immediately if any simple command exits with a non-zero exit status.",
    "privilege": "user",
    "tags": [
      "env",
      "set",
      "errexit",
      "safety"
    ],
    "explanation": "Prevents cascading failures in deployment automation.",
    "expectedOutput": "",
    "prerequisites": "Shell."
  },
  {
    "id": "env-path-pretty",
    "category": "environment-shell",
    "categoryLabel": "Environment and Shell",
    "title": "Display Search PATH Directories Formatted as List",
    "command": "echo \"$PATH\" | tr \":\" \"\\n\"",
    "description": "Splits colon-delimited executable search path into one directory per line.",
    "privilege": "user",
    "tags": [
      "env",
      "path",
      "tr",
      "directories"
    ],
    "explanation": "Easy visual verification of directory lookup precedence.",
    "expectedOutput": "/home/kishwanth/.local/bin\n/usr/local/sbin\n/usr/local/bin\n/usr/sbin\n/usr/bin\n/bin",
    "prerequisites": "Shell."
  },
  {
    "id": "env-prepend-path",
    "category": "environment-shell",
    "categoryLabel": "Environment and Shell",
    "title": "Prepend Custom Directory to PATH for Single Command",
    "command": "PATH=\"/opt/custom/bin:$PATH\" my_binary",
    "description": "Overrides PATH for specific command execution without mutating current shell environment.",
    "privilege": "user",
    "tags": [
      "env",
      "path",
      "override",
      "isolated"
    ],
    "explanation": "Scoped environment assignment.",
    "expectedOutput": "",
    "prerequisites": "Custom binary."
  },
  {
    "id": "env-ulimit-all",
    "category": "environment-shell",
    "categoryLabel": "Environment and Shell",
    "title": "Show All Process Resource Limits (ulimit -a)",
    "command": "ulimit -a",
    "description": "Displays operating system resource boundaries: open files, max user processes, stack size, etc.",
    "privilege": "user",
    "tags": [
      "env",
      "ulimit",
      "limits",
      "cgroups"
    ],
    "explanation": "Critical when diagnosing Too many open files errors under high traffic.",
    "expectedOutput": "open files                      (-n) 1024\nmax user processes              (-u) 31200\nvirtual memory          (kbytes, -v) unlimited\nmax locked memory       (kbytes, -l) 2048",
    "prerequisites": "Shell."
  },
  {
    "id": "env-ulimit-openfiles",
    "category": "environment-shell",
    "categoryLabel": "Environment and Shell",
    "title": "Increase Open File Descriptors Limit to 65535",
    "command": "ulimit -n 65535",
    "description": "Raises per-process open socket and file handle limit for high-concurrency servers.",
    "privilege": "user",
    "tags": [
      "env",
      "ulimit",
      "file-descriptors",
      "tuning"
    ],
    "explanation": "Essential for Nginx, Redis, and high-throughput Node.js microservices.",
    "expectedOutput": "",
    "prerequisites": "Hard limits in /etc/security/limits.conf."
  },
  {
    "id": "env-locale-check",
    "category": "environment-shell",
    "categoryLabel": "Environment and Shell",
    "title": "Check System Locale & Character Encoding",
    "command": "locale",
    "description": "Outputs active language, character set (UTF-8), and formatting rules.",
    "privilege": "user",
    "tags": [
      "env",
      "locale",
      "utf8",
      "encoding"
    ],
    "explanation": "Prevents character corruption and collation errors in database scripts.",
    "expectedOutput": "LANG=en_US.UTF-8\nLANGUAGE=\nLC_CTYPE=\"en_US.UTF-8\"\nLC_ALL=",
    "prerequisites": "Coreutils."
  },
  {
    "id": "cron-crontab-edit",
    "category": "scheduling-automation",
    "categoryLabel": "Scheduling and Autom...",
    "title": "Edit Current User Crontab Schedule",
    "command": "crontab -e",
    "description": "Opens user crontab file in default text editor to add or modify periodic background jobs.",
    "privilege": "user",
    "tags": [
      "cron",
      "crontab",
      "schedule",
      "edit"
    ],
    "explanation": "Syntax: [min] [hour] [day-of-month] [month] [day-of-week] command.",
    "expectedOutput": "[Crontab editor opened]",
    "prerequisites": "cron service running."
  },
  {
    "id": "cron-crontab-list",
    "category": "scheduling-automation",
    "categoryLabel": "Scheduling and Autom...",
    "title": "List All Scheduled Crontab Jobs for User",
    "command": "crontab -l",
    "description": "Displays all active cron jobs configured for current user.",
    "privilege": "user",
    "tags": [
      "cron",
      "crontab",
      "list",
      "jobs"
    ],
    "explanation": "Outputs cron table to stdout.",
    "expectedOutput": "0 2 * * * /opt/scripts/backup_db.sh > /dev/null 2>&1\n*/15 * * * * curl -s http://localhost:5000/health > /tmp/health.log",
    "prerequisites": "Crontab."
  },
  {
    "id": "cron-crontab-remove",
    "category": "scheduling-automation",
    "categoryLabel": "Scheduling and Autom...",
    "title": "Remove All Crontab Jobs for Current User",
    "command": "crontab -r",
    "description": "Erases the user crontab schedule file completely.",
    "privilege": "user",
    "tags": [
      "cron",
      "crontab",
      "remove",
      "cleanup"
    ],
    "explanation": "Caution: deletes all user cron jobs without backup.",
    "expectedOutput": "",
    "prerequisites": "Existing crontab."
  },
  {
    "id": "cron-system-crontab",
    "category": "scheduling-automation",
    "categoryLabel": "Scheduling and Autom...",
    "title": "Inspect System-Wide Crontab Configuration",
    "command": "cat /etc/crontab",
    "description": "Displays system-level cron table specifying execution user accounts (e.g. root).",
    "privilege": "user",
    "tags": [
      "cron",
      "crontab",
      "system",
      "root"
    ],
    "explanation": "Unlike user crontabs, /etc/crontab includes the user column.",
    "expectedOutput": "SHELL=/bin/sh\nPATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin\n17 * * * * root    cd / && run-parts --report /etc/cron.hourly",
    "prerequisites": "Readable /etc/crontab."
  },
  {
    "id": "cron-systemd-timers-list",
    "category": "scheduling-automation",
    "categoryLabel": "Scheduling and Autom...",
    "title": "List Systemd Timer Units & Next Trigger Time",
    "command": "systemctl list-timers --all",
    "description": "Displays all active and inactive systemd timers, next trigger timestamp, and left duration.",
    "privilege": "user",
    "tags": [
      "cron",
      "systemd-timers",
      "schedule",
      "timers"
    ],
    "explanation": "Modern systemd alternative to cron with dependency tracking and journal logging.",
    "expectedOutput": "NEXT                        LEFT        LAST PASSED UNIT                         ACTIVATES\nThu 2026-10-16 13:15:00 UTC 18min left  -    -      devops-sync.timer            devops-sync.service\nFri 2026-10-17 00:00:00 UTC 11h left    -    -      logrotate.timer              logrotate.service",
    "prerequisites": "Systemd."
  },
  {
    "id": "cron-systemd-timer-trigger",
    "category": "scheduling-automation",
    "categoryLabel": "Scheduling and Autom...",
    "title": "Trigger Systemd Scheduled Service On-Demand",
    "command": "sudo systemctl start devops-sync.service",
    "description": "Executes the background service associated with a timer immediately without waiting for schedule.",
    "privilege": "sudo",
    "tags": [
      "cron",
      "systemd",
      "trigger",
      "manual"
    ],
    "explanation": "Runs service manually to test execution before waiting for scheduled timer.",
    "expectedOutput": "",
    "prerequisites": "Root."
  },
  {
    "id": "cron-at-schedule",
    "category": "scheduling-automation",
    "categoryLabel": "Scheduling and Autom...",
    "title": "Schedule One-Time Job at Specific Future Time (at)",
    "command": "echo \"/opt/scripts/deploy.sh\" | at 02:00 tomorrow",
    "description": "Queues a one-off task for single execution at 2:00 AM tomorrow.",
    "privilege": "user",
    "tags": [
      "cron",
      "at",
      "one-off",
      "schedule"
    ],
    "explanation": "Unlike cron, at executes once and does not repeat.",
    "expectedOutput": "job 4 at Fri Oct 17 02:00:00 2026",
    "prerequisites": "at daemon running."
  },
  {
    "id": "sysinfo-uname",
    "category": "system-information",
    "categoryLabel": "System Information",
    "title": "Display Full Kernel Architecture & Build Version",
    "command": "uname -srmo",
    "description": "Outputs kernel name, release version, machine hardware architecture, and operating system.",
    "privilege": "user",
    "tags": [
      "sysinfo",
      "uname",
      "kernel",
      "arch"
    ],
    "explanation": "Identifies OS kernel.",
    "expectedOutput": "Linux 6.8.0-45-generic x86_64 GNU/Linux",
    "prerequisites": "Coreutils."
  },
  {
    "id": "sysinfo-os-release",
    "category": "system-information",
    "categoryLabel": "System Information",
    "title": "Display Linux Distribution Details",
    "command": "cat /etc/os-release",
    "description": "Reads distribution name, version ID, and vendor codename.",
    "privilege": "user",
    "tags": [
      "sysinfo",
      "os-release",
      "distro",
      "version"
    ],
    "explanation": "Standard systemd specification file.",
    "expectedOutput": "NAME=\"Ubuntu\"\nVERSION=\"24.04 LTS (Noble Numbat)\"\nID=ubuntu\nVERSION_ID=\"24.04\"",
    "prerequisites": "Readable /etc/os-release."
  },
  {
    "id": "sysinfo-lscpu",
    "category": "system-information",
    "categoryLabel": "System Information",
    "title": "Detailed CPU Architecture & Core Specifications",
    "command": "lscpu",
    "description": "Displays CPU model name, socket count, cores per socket, threads per core, cache sizes, and virtualization flags.",
    "privilege": "user",
    "tags": [
      "sysinfo",
      "lscpu",
      "cpu",
      "cores",
      "hardware"
    ],
    "explanation": "Queries sysfs and /proc/cpuinfo.",
    "expectedOutput": "Architecture:            x86_64\n  CPU op-mode(s):        32-bit, 64-bit\nCPU(s):                  4\nModel name:              Intel(R) Xeon(R) CPU E5-2680 v4 @ 2.40GHz\nVirtualization features: VT-x\nL3 cache:                35 MiB",
    "prerequisites": "util-linux."
  },
  {
    "id": "sysinfo-lshw-memory",
    "category": "system-information",
    "categoryLabel": "System Information",
    "title": "Inspect Physical Memory (RAM) Hardware Slots",
    "command": "sudo lshw -short -class memory",
    "description": "Displays installed DIMM modules, capacities, clock speeds, and empty RAM slots on motherboard.",
    "privilege": "sudo",
    "tags": [
      "sysinfo",
      "lshw",
      "memory",
      "ram",
      "hardware"
    ],
    "explanation": "Reads DMI/SMBIOS memory table.",
    "expectedOutput": "H/W path         Device     Class          Description\n======================================================\n/0/0                        memory         64KiB BIOS\n/0/4                        memory         8GiB System Memory\n/0/4/0                      memory         4GiB DIMM DDR4 2400 MHz\n/0/4/1                      memory         4GiB DIMM DDR4 2400 MHz",
    "prerequisites": "lshw package."
  },
  {
    "id": "sysinfo-lspci",
    "category": "system-information",
    "categoryLabel": "System Information",
    "title": "List PCI Controllers, NICs & GPU Hardware",
    "command": "lspci -tv",
    "description": "Displays visual tree of all PCI bus devices including Ethernet controllers and NVMe controllers.",
    "privilege": "user",
    "tags": [
      "sysinfo",
      "lspci",
      "pci",
      "devices"
    ],
    "explanation": "Scans /sys/bus/pci.",
    "expectedOutput": "-[0000:00]-+-00.0  Intel Corporation 440FX\n           +-03.0  Intel Corporation 82540EM Gigabit Ethernet Controller\n           +-0d.0  SATA controller: Intel Corporation 82801HM/HEM",
    "prerequisites": "pciutils."
  },
  {
    "id": "sysinfo-lsusb",
    "category": "system-information",
    "categoryLabel": "System Information",
    "title": "List Connected USB Hubs & Peripherals",
    "command": "lsusb",
    "description": "Displays USB bus controllers and connected external hardware devices.",
    "privilege": "user",
    "tags": [
      "sysinfo",
      "lsusb",
      "usb",
      "peripherals"
    ],
    "explanation": "Queries USB device descriptors.",
    "expectedOutput": "Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub\nBus 002 Device 002: ID 80ee:0021 VirtualBox USB Tablet",
    "prerequisites": "usbutils."
  },
  {
    "id": "sysinfo-boot-time",
    "category": "system-information",
    "categoryLabel": "System Information",
    "title": "Display System Last Boot Time & Current Runlevel",
    "command": "who -b && runlevel",
    "description": "Outputs exact date and time when the operating system was booted up.",
    "privilege": "user",
    "tags": [
      "sysinfo",
      "boot",
      "uptime",
      "runlevel"
    ],
    "explanation": "Reads utmp system record.",
    "expectedOutput": "         system boot  2026-09-04 09:12\nN 5",
    "prerequisites": "Coreutils."
  },
  {
    "id": "sysinfo-dmidecode",
    "category": "system-information",
    "categoryLabel": "System Information",
    "title": "Inspect BIOS, Motherboard & Server Serial Number",
    "command": "sudo dmidecode -t system",
    "description": "Dumps Desktop Management Interface (DMI) table with hardware manufacturer and serials.",
    "privilege": "sudo",
    "tags": [
      "sysinfo",
      "dmidecode",
      "bios",
      "motherboard"
    ],
    "explanation": "Essential for tracking physical hardware asset tags and vendor support serials.",
    "expectedOutput": "System Information\n\tManufacturer: Dell Inc.\n\tProduct Name: PowerEdge R640\n\tSerial Number: 4F92KD2\n\tUUID: 4c4c4544-0046-3910-8032-b7c04f524432",
    "prerequisites": "Root."
  },
  {
    "id": "sysinfo-hostnamectl",
    "category": "system-information",
    "categoryLabel": "System Information",
    "title": "Display Hostname, Machine ID & Virtualization Hypervisor",
    "command": "hostnamectl status",
    "description": "Provides consolidated system overview including transient hostname, machine ID, and virtualization type.",
    "privilege": "user",
    "tags": [
      "sysinfo",
      "hostnamectl",
      "virtualization",
      "machine-id"
    ],
    "explanation": "systemd system overview command.",
    "expectedOutput": " Static hostname: devops-srv\n       Icon name: computer-vm\n         Chassis: vm\n      Machine ID: e7a89bc0d1e2f3a4b5c6d7e8f9a0b1c2\n   Virtualization: kvm\n Operating System: Ubuntu 24.04.1 LTS\n           Kernel: Linux 6.8.0-45-generic\n     Architecture: x86-64",
    "prerequisites": "systemd."
  },
  {
    "id": "sysinfo-fdisk-disks",
    "category": "system-information",
    "categoryLabel": "System Information",
    "title": "List All Physical Disk Drives & Capacities",
    "command": "sudo fdisk -l | grep \"Disk /dev\"",
    "description": "Extracts summary of all physical drive devices attached to host.",
    "privilege": "sudo",
    "tags": [
      "sysinfo",
      "fdisk",
      "disks",
      "storage"
    ],
    "explanation": "Quick inventory of physical storage hardware.",
    "expectedOutput": "Disk /dev/sda: 80 GiB, 85899345920 bytes, 167772160 sectors\nDisk /dev/sdb: 500 GiB, 536870912000 bytes, 1048576000 sectors",
    "prerequisites": "Root."
  },
  {
    "id": "fw-ufw-status-verbose",
    "category": "firewall-security",
    "categoryLabel": "Firewall and Security",
    "title": "Show UFW Firewall Rules & Status Verbose",
    "command": "sudo ufw status verbose",
    "description": "Displays default inbound/outbound policies and all active port allowance rules.",
    "privilege": "sudo",
    "tags": [
      "firewall",
      "ufw",
      "security",
      "status"
    ],
    "explanation": "Uncomplicated Firewall (UFW) frontend to Netfilter / iptables.",
    "expectedOutput": "Status: active\nLogging: on (low)\nDefault: deny (incoming), allow (outgoing), disabled (routed)\n\nTo                         Action      From\n--                         ------      ----\n22/tcp                     ALLOW IN    Anywhere\n80/tcp                     ALLOW IN    Anywhere\n443/tcp                    ALLOW IN    Anywhere\n5000/tcp                   ALLOW IN    192.168.0.0/24",
    "prerequisites": "ufw installed."
  },
  {
    "id": "fw-ufw-enable",
    "category": "firewall-security",
    "categoryLabel": "Firewall and Security",
    "title": "Enable UFW Firewall at Boot",
    "command": "sudo ufw enable",
    "description": "Enables firewall rules immediately and persists across system reboots.",
    "privilege": "sudo",
    "tags": [
      "firewall",
      "ufw",
      "enable"
    ],
    "explanation": "Make sure port 22 is allowed before enabling to avoid SSH lockout!",
    "expectedOutput": "Firewall is active and enabled on system startup",
    "prerequisites": "Root."
  },
  {
    "id": "fw-ufw-allow-port",
    "category": "firewall-security",
    "categoryLabel": "Firewall and Security",
    "title": "Allow Inbound TCP Port with Rule Comment",
    "command": "sudo ufw allow 22/tcp comment \"SSH Remote Administration\"",
    "description": "Permits inbound traffic on port 22 with documentation comment.",
    "privilege": "sudo",
    "tags": [
      "firewall",
      "ufw",
      "allow",
      "ssh"
    ],
    "explanation": "Adds rule to iptables chain.",
    "expectedOutput": "Rule added\nRule added (v6)",
    "prerequisites": "Root."
  },
  {
    "id": "fw-ufw-allow-subnet",
    "category": "firewall-security",
    "categoryLabel": "Firewall and Security",
    "title": "Allow Traffic from Specific LAN Subnet to Port 5000",
    "command": "sudo ufw allow from 192.168.0.0/24 to any port 5000 proto tcp comment \"DevOps Portal LAN\"",
    "description": "Restricts access to port 5000 exclusively to internal network devices.",
    "privilege": "sudo",
    "tags": [
      "firewall",
      "ufw",
      "subnet",
      "lan"
    ],
    "explanation": "Blocks public internet scanners while allowing office network access.",
    "expectedOutput": "Rule added",
    "prerequisites": "Root."
  },
  {
    "id": "fw-ufw-delete-numbered",
    "category": "firewall-security",
    "categoryLabel": "Firewall and Security",
    "title": "Delete Firewall Rule by Rule Number",
    "command": "sudo ufw status numbered && sudo ufw delete 3",
    "description": "Lists numbered rules and prompts for deletion of rule #3.",
    "privilege": "sudo",
    "tags": [
      "firewall",
      "ufw",
      "delete",
      "numbered"
    ],
    "explanation": "Safest way to remove outdated firewall rules.",
    "expectedOutput": "[ 3] 8080/tcp                   ALLOW IN    Anywhere\nDeleting:\n allow 8080/tcp\nProceed with operation (y|n)? y\nRule deleted",
    "prerequisites": "Root."
  },
  {
    "id": "fw-ufw-deny-ip",
    "category": "firewall-security",
    "categoryLabel": "Firewall and Security",
    "title": "Block Malicious IP Address or Subnet Immediately",
    "command": "sudo ufw insert 1 deny from 198.51.100.23 to any comment \"Brute force attacker\"",
    "description": "Inserts high-priority drop rule at top of rule table blocking hostile host.",
    "privilege": "sudo",
    "tags": [
      "firewall",
      "ufw",
      "deny",
      "block-ip",
      "security"
    ],
    "explanation": "Placing at rule position 1 guarantees immediate drop before any allow rules.",
    "expectedOutput": "Rule inserted",
    "prerequisites": "Root."
  },
  {
    "id": "fw-iptables-list",
    "category": "firewall-security",
    "categoryLabel": "Firewall and Security",
    "title": "List Raw Kernel Iptables Rules with Packet Counters",
    "command": "sudo iptables -L -n -v --line-numbers",
    "description": "Inspects raw Linux Netfilter packet filtering chains (INPUT, FORWARD, OUTPUT).",
    "privilege": "sudo",
    "tags": [
      "firewall",
      "iptables",
      "netfilter",
      "kernel"
    ],
    "explanation": "Shows packet and byte counters per rule.",
    "expectedOutput": "Chain INPUT (policy DROP 12 packets, 480 bytes)\nnum   pkts bytes target     prot opt in     out     source               destination         \n1     142K   82M ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0           \n2     892K  142M ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0            state RELATED,ESTABLISHED",
    "prerequisites": "Root."
  },
  {
    "id": "fw-firewalld-reload",
    "category": "firewall-security",
    "categoryLabel": "Firewall and Security",
    "title": "Reload Firewalld Rules on RHEL / CentOS",
    "command": "sudo firewall-cmd --reload && sudo firewall-cmd --list-all",
    "description": "Applies permanent firewalld zone configuration updates without dropping sessions.",
    "privilege": "sudo",
    "tags": [
      "firewall",
      "firewalld",
      "rhel",
      "centos"
    ],
    "explanation": "Standard firewall manager on Red Hat family Linux.",
    "expectedOutput": "success\npublic (active)\n  target: default\n  services: cockpit dhcpv6-client ssh http https\n  ports: 5000/tcp",
    "prerequisites": "firewalld."
  },
  {
    "id": "bash-strict-mode",
    "category": "bash-scripting",
    "categoryLabel": "Bash Scripting",
    "title": "Unofficial Bash Strict Mode Header",
    "command": "set -euo pipefail\nIFS=$'\\n\\t'",
    "description": "Production safety preamble: exits on error, unset variables, pipeline failures, and prevents word splitting.",
    "privilege": "user",
    "tags": [
      "bash",
      "strict-mode",
      "safety",
      "boilerplate"
    ],
    "explanation": "Standard header for robust production shell scripts.",
    "expectedOutput": "",
    "prerequisites": "Bash."
  },
  {
    "id": "bash-check-dir-exists",
    "category": "bash-scripting",
    "categoryLabel": "Bash Scripting",
    "title": "Check if Directory Exists Conditional",
    "command": "if [ -d \"/var/log/nginx\" ]; then echo \"Directory exists\"; else mkdir -p \"/var/log/nginx\"; fi",
    "description": "Tests for directory existence before writing logs or executing operations.",
    "privilege": "user",
    "tags": [
      "bash",
      "conditional",
      "directory",
      "test"
    ],
    "explanation": "-d tests directory existence.",
    "expectedOutput": "Directory exists",
    "prerequisites": "Bash."
  },
  {
    "id": "bash-check-file-readable",
    "category": "bash-scripting",
    "categoryLabel": "Bash Scripting",
    "title": "Check if Configuration File Exists & Is Readable",
    "command": "if [ -r \".env\" ]; then echo \"Config readable\"; else echo \"Missing .env\" >&2; exit 1; fi",
    "description": "Validates file presence and read permissions.",
    "privilege": "user",
    "tags": [
      "bash",
      "file",
      "permissions",
      "validation"
    ],
    "explanation": "-r tests readable file.",
    "expectedOutput": "Config readable",
    "prerequisites": "Bash."
  },
  {
    "id": "bash-check-cmd-installed",
    "category": "bash-scripting",
    "categoryLabel": "Bash Scripting",
    "title": "Verify Required CLI Tool is Installed",
    "command": "command -v docker >/dev/null 2>&1 || { echo \"ERROR: Docker required but not installed.\" >&2; exit 1; }",
    "description": "Fails fast if necessary prerequisite binary is missing from $PATH.",
    "privilege": "user",
    "tags": [
      "bash",
      "prerequisites",
      "command",
      "validation"
    ],
    "explanation": "More portable and safer than which.",
    "expectedOutput": "",
    "prerequisites": "Bash."
  },
  {
    "id": "bash-while-read-line",
    "category": "bash-scripting",
    "categoryLabel": "Bash Scripting",
    "title": "Iterate Over Lines of File Safely",
    "command": "while IFS= read -r host; do echo \"Deploying to: $host\"; done < hosts.txt",
    "description": "Reads file line-by-line preserving whitespace and backslashes safely.",
    "privilege": "user",
    "tags": [
      "bash",
      "loop",
      "read",
      "file-stream"
    ],
    "explanation": "IFS= prevents trimming whitespace; -r prevents backslash escape mangling.",
    "expectedOutput": "Deploying to: 192.168.0.10\nDeploying to: 192.168.0.11",
    "prerequisites": "Input file."
  },
  {
    "id": "bash-read-prompt-default",
    "category": "bash-scripting",
    "categoryLabel": "Bash Scripting",
    "title": "Prompt User for Input with Default Fallback Value",
    "command": "read -p \"Enter Target Environment [production]: \" ENV\nENV=${ENV:-production}\necho \"Selected: $ENV\"",
    "description": "Prompts user interactively and falls back to default value if Enter is pressed.",
    "privilege": "user",
    "tags": [
      "bash",
      "interactive",
      "read",
      "fallback"
    ],
    "explanation": "${VAR:-default} parameter expansion.",
    "expectedOutput": "Enter Target Environment [production]: \nSelected: production",
    "prerequisites": "Interactive shell."
  },
  {
    "id": "bash-trap-cleanup",
    "category": "bash-scripting",
    "categoryLabel": "Bash Scripting",
    "title": "Trap Signal Handler for Guaranteed Tempfile Cleanup",
    "command": "TMP_DIR=$(mktemp -d)\ntrap 'rm -rf \"$TMP_DIR\"; echo \"[Cleanup] Removed $TMP_DIR\"' EXIT INT TERM",
    "description": "Guarantees temporary folder deletion when script finishes or is aborted via Ctrl+C.",
    "privilege": "user",
    "tags": [
      "bash",
      "trap",
      "cleanup",
      "signals",
      "safety"
    ],
    "explanation": "Traps EXIT, SIGINT, and SIGTERM signals.",
    "expectedOutput": "[Cleanup] Removed /tmp/tmp.8f921Kd0",
    "prerequisites": "Bash."
  },
  {
    "id": "bash-string-manipulation",
    "category": "bash-scripting",
    "categoryLabel": "Bash Scripting",
    "title": "Pure Bash String Slicing & Extension Stripping",
    "command": "FILE=\"backup_2026_10_16.tar.gz\"\necho \"Base: ${FILE%%.*}\"\necho \"Ext:  ${FILE#*.}\"",
    "description": "Manipulates strings and strips file extensions without calling external processes like awk or sed.",
    "privilege": "user",
    "tags": [
      "bash",
      "parameter-expansion",
      "strings"
    ],
    "explanation": "%% strips longest match from end; # strips shortest match from front.",
    "expectedOutput": "Base: backup_2026_10_16\nExt:  tar.gz",
    "prerequisites": "Bash."
  },
  {
    "id": "bash-array-iteration",
    "category": "bash-scripting",
    "categoryLabel": "Bash Scripting",
    "title": "Bash Array Declaration and For Loop Iteration",
    "command": "declare -a SERVERS=(\"srv-web-01\" \"srv-web-02\" \"srv-db-01\")\nfor s in \"${SERVERS[@]}\"; do echo \"Health check: $s\"; done",
    "description": "Declares indexed array and loops over all elements handling spaces correctly.",
    "privilege": "user",
    "tags": [
      "bash",
      "arrays",
      "loop",
      "iteration"
    ],
    "explanation": "\"${ARR[@]}\" preserves word boundaries.",
    "expectedOutput": "Health check: srv-web-01\nHealth check: srv-web-02\nHealth check: srv-db-01",
    "prerequisites": "Bash."
  },
  {
    "id": "diag-port-process-owner",
    "category": "useful-troubleshooting",
    "categoryLabel": "Useful DevOps Troubl...",
    "title": "Identify Which Process is Bound to Port 5000",
    "command": "sudo lsof -i :5000 || sudo ss -lptn \"sport = :5000\"",
    "description": "Pinpoints PID and executable holding port 5000 when addressing Address already in use error.",
    "privilege": "sudo",
    "tags": [
      "troubleshooting",
      "lsof",
      "port-conflict",
      "eaddrinuse"
    ],
    "explanation": "Quick diagnosis when application fails to start.",
    "expectedOutput": "COMMAND  PID      USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\nnode    1740 kishwanth   19u  IPv4  84210      0t0  TCP *:5000 (LISTEN)",
    "prerequisites": "Root/sudo."
  },
  {
    "id": "diag-deleted-open-files",
    "category": "useful-troubleshooting",
    "categoryLabel": "Useful DevOps Troubl...",
    "title": "Find Deleted Open Files Still Consuming Disk Space",
    "command": "sudo lsof +L1",
    "description": "Detects files that were rm deleted but space remains unreleased because process keeps handle open.",
    "privilege": "sudo",
    "tags": [
      "troubleshooting",
      "disk-full",
      "lsof",
      "deleted-open"
    ],
    "explanation": "Common reason why df shows 100% full even after deleting large log files.",
    "expectedOutput": "COMMAND   PID     USER   FD   TYPE DEVICE   SIZE/OFF NLINK NODE NAME\nnode     1740 kishwanth    4w   REG   8,1  1428591820     0  1421 /var/log/app.log (deleted)",
    "prerequisites": "Root."
  },
  {
    "id": "diag-oom-killer",
    "category": "useful-troubleshooting",
    "categoryLabel": "Useful DevOps Troubl...",
    "title": "Check Kernel Ring Buffer for Out-Of-Memory (OOM) Kills",
    "command": "sudo dmesg -T | grep -i -E \"oom|killed process\" | tail -n 10",
    "description": "Inspects kernel events to confirm if Node.js or database was terminated by Linux OOM killer.",
    "privilege": "sudo",
    "tags": [
      "troubleshooting",
      "oom",
      "dmesg",
      "memory-spike"
    ],
    "explanation": "Identifies processes killed due to host RAM exhaustion.",
    "expectedOutput": "[Thu Oct 16 02:14:02 2026] Out of memory: Killed process 8412 (python3) total-vm:4218000kB, anon-rss:2104000kB",
    "prerequisites": "Root."
  },
  {
    "id": "diag-dns-nodnssec",
    "category": "useful-troubleshooting",
    "categoryLabel": "Useful DevOps Troubl...",
    "title": "Diagnose Internal DNS Resolution Failures",
    "command": "dig +trace +nodnssec api.internal.local",
    "description": "Traces DNS resolution without DNSSEC validation to diagnose internal service mesh naming errors.",
    "privilege": "user",
    "tags": [
      "troubleshooting",
      "dns",
      "dig",
      "service-mesh"
    ],
    "explanation": "Isolates DNS server forwarding bugs.",
    "expectedOutput": "api.internal.local. 60 IN A 10.0.1.50",
    "prerequisites": "dnsutils."
  },
  {
    "id": "diag-top-mem-processes",
    "category": "useful-troubleshooting",
    "categoryLabel": "Useful DevOps Troubl...",
    "title": "Inspect Memory Consumers with Arguments",
    "command": "ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem | head -n 12",
    "description": "Detailed process snapshot showing exact command-line arguments and memory percentages.",
    "privilege": "user",
    "tags": [
      "troubleshooting",
      "ps",
      "memory",
      "cpu"
    ],
    "explanation": "Renders comprehensive process diagnostics.",
    "expectedOutput": "  PID  PPID CMD                         %MEM %CPU\n 1842     1 postgres: devops_db          4.2  0.4\n 1740  1410 node src/server.js           2.1  1.1",
    "prerequisites": "procps."
  },
  {
    "id": "diag-iotop-monitor",
    "category": "useful-troubleshooting",
    "categoryLabel": "Useful DevOps Troubl...",
    "title": "Monitor Disk I/O per Process in Real-Time",
    "command": "sudo iotop -oPa -d 2",
    "description": "Interactive top-like monitor showing only processes actively writing or reading to disk.",
    "privilege": "sudo",
    "tags": [
      "troubleshooting",
      "iotop",
      "disk-io",
      "bottleneck"
    ],
    "explanation": "Finds rogue process thrashing storage.",
    "expectedOutput": "Total DISK READ: 0.00 B/s | Total DISK WRITE: 142.10 K/s\n  PID  PRIO  USER     DISK READ  DISK WRITE  SWAPIN      IO    COMMAND\n 1842 be/4 postgres    0.00 B/s  120.40 K/s  0.00 %  1.20 % postgres: writer process",
    "prerequisites": "iotop package."
  },
  {
    "id": "diag-strace-process",
    "category": "useful-troubleshooting",
    "categoryLabel": "Useful DevOps Troubl...",
    "title": "Trace System Calls of Running Process (strace)",
    "command": "sudo strace -p 1740 -f -e trace=network,file 2>&1 | head -n 25",
    "description": "Attaches to running PID and monitors all file open, read, write, and network socket syscalls.",
    "privilege": "sudo",
    "tags": [
      "troubleshooting",
      "strace",
      "syscalls",
      "debug"
    ],
    "explanation": "The ultimate tool for debugging why a process is hanging or what file it is trying to open.",
    "expectedOutput": "[pid  1740] openat(AT_FDCWD, \"/opt/devops-stored-data/data/devops_stored.sqlite\", O_RDWR|O_CREAT, 0666) = 19\n[pid  1740] epoll_wait(18, [{events=EPOLLIN, data={u32=19, u64=19}}], 1024, -1) = 1",
    "prerequisites": "strace package."
  },
  {
    "id": "diag-strace-file-missing",
    "category": "useful-troubleshooting",
    "categoryLabel": "Useful DevOps Troubl...",
    "title": "Trace File Open Errors (No Such File or Directory)",
    "command": "strace -e openat node src/server.js 2>&1 | grep -i \"no such file\"",
    "description": "Tracks down missing module paths, broken symlinks, or missing config files during startup.",
    "privilege": "user",
    "tags": [
      "troubleshooting",
      "strace",
      "file-not-found"
    ],
    "explanation": "Filters openat syscall returns.",
    "expectedOutput": "openat(AT_FDCWD, \"/opt/devops/config.local.json\", O_RDONLY) = -1 ENOENT (No such file or directory)",
    "prerequisites": "strace."
  },
  {
    "id": "diag-ssl-handshake-ciphers",
    "category": "useful-troubleshooting",
    "categoryLabel": "Useful DevOps Troubl...",
    "title": "Inspect SSL Handshake & Certificate Chain Details",
    "command": "openssl s_client -connect localhost:5000 -servername devops.local -showcerts </dev/null",
    "description": "Dumps full x509 certificate chain, SNI negotiation, and negotiated cipher suite.",
    "privilege": "user",
    "tags": [
      "troubleshooting",
      "ssl",
      "handshake",
      "certs"
    ],
    "explanation": "Diagnoses self-signed cert trust issues and intermediate CA missing errors.",
    "expectedOutput": "CONNECTED(00000003)\n---\nCertificate chain\n 0 s:CN = devops.local\n   i:C = US, O = Let's Encrypt, CN = R3\n---",
    "prerequisites": "OpenSSL."
  },
  {
    "id": "diag-mtr-latency-loss",
    "category": "useful-troubleshooting",
    "categoryLabel": "Useful DevOps Troubl...",
    "title": "Test Network Latency & Packet Loss Report (MTR)",
    "command": "mtr -r -c 10 1.1.1.1",
    "description": "Combines traceroute and ping into an 10-cycle loss and jitter report across every network hop.",
    "privilege": "user",
    "tags": [
      "troubleshooting",
      "mtr",
      "packet-loss",
      "jitter"
    ],
    "explanation": "Proves whether packet loss is on the local ISP, cloud transit, or remote host.",
    "expectedOutput": "HOST: devops-srv               Loss%   Snt   Last   Avg  Best  Wrst StDev\n  1.|-- 192.168.0.1              0.0%    10    1.1   1.2   1.0   1.5   0.2\n  2.|-- 10.20.0.1                0.0%    10    8.2   8.4   8.1   8.9   0.3\n  3.|-- 1.1.1.1                  0.0%    10   12.1  12.3  11.9  13.0   0.4",
    "prerequisites": "mtr-tiny package."
  },
  {
    "id": "diag-high-load-cause",
    "category": "useful-troubleshooting",
    "categoryLabel": "Useful DevOps Troubl...",
    "title": "Analyze High Load Average (CPU Bound vs Disk I/O Wait)",
    "command": "cat /proc/loadavg && vmstat 1 5",
    "description": "Outputs virtual memory and CPU stats (r = runnable processes, b = blocked on I/O, wa = I/O wait).",
    "privilege": "user",
    "tags": [
      "troubleshooting",
      "loadavg",
      "vmstat",
      "iowait"
    ],
    "explanation": "High load with high wa means slow disk storage; high r means CPU saturated.",
    "expectedOutput": "0.84 0.92 0.78 2/184 19820\nprocs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----\n r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st\n 1  0      0 421040 120400 1789500    0    0    12    45  142  210  2  1 97  0  0",
    "prerequisites": "procps."
  },
  {
    "id": "diag-socket-buffer-overflows",
    "category": "useful-troubleshooting",
    "categoryLabel": "Useful DevOps Troubl...",
    "title": "Check for TCP Socket Buffer Drops & Overflows",
    "command": "netstat -s 2>/dev/null | grep -i -E \"listen|overflow|dropped\" || ss -s",
    "description": "Audits TCP listen queue drops when web server backlog is overloaded by concurrent connections.",
    "privilege": "user",
    "tags": [
      "troubleshooting",
      "tcp",
      "listen-overflow",
      "backlog"
    ],
    "explanation": "Indicates need to tune net.core.somaxconn and nginx worker_connections.",
    "expectedOutput": "Total: 184\nTCP:   42 (estab 14, closed 12, orphaned 0, timewait 8)\nTransport Total     IP        IPv6\nRAW       0         0         0   \nUDP       6         4         2   \nTCP       30        24        6   ",
    "prerequisites": "net-tools or iproute2."
  }
];
