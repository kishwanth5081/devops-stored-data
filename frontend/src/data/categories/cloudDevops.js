// Image 1: Cloud & DevOps Tools (13 Categories, 132 Commands)
export const CLOUD_DEVOPS_COMMANDS = [
  {
    "id": "gha-run-workflow",
    "category": "github-actions",
    "categoryLabel": "GitHub Actions",
    "title": "Trigger GitHub Actions Workflow via CLI",
    "command": "gh workflow run deploy.yml -f environment=production -f release_tag=v2.4.0",
    "description": "Manually dispatches a workflow_dispatch event to trigger a deployment pipeline.",
    "privilege": "user",
    "tags": [
      "github",
      "actions",
      "ci-cd",
      "dispatch"
    ],
    "explanation": "Sends a workflow dispatch event to the GitHub API with custom input parameters.",
    "expectedOutput": "✓ Created workflow_dispatch event for deploy.yml at main\nTo see runs for this workflow, try: gh run list --workflow=deploy.yml",
    "prerequisites": "GitHub CLI (gh) authenticated with repo workflow write permissions."
  },
  {
    "id": "gha-list-runs",
    "category": "github-actions",
    "categoryLabel": "GitHub Actions",
    "title": "List Recent Workflow Runs",
    "command": "gh run list --limit 10 --workflow=deploy.yml",
    "description": "Displays status, branch, event type, and elapsed time for the latest workflow runs.",
    "privilege": "user",
    "tags": [
      "github",
      "actions",
      "runs",
      "status"
    ],
    "explanation": "Queries the GitHub Actions runs API for the specified workflow definition.",
    "expectedOutput": "STATUS  TITLE                          WORKFLOW  BRANCH  EVENT             ID          ELAPSED\n✓       Production Deployment v2.4.0   Deploy    main    workflow_dispatch 8492019482  3m42s\n✓       Nightly Security Vulnerability Scan Security  main    schedule          8481920192  1m12s\n*       Build and Run Test Suite       CI        main    push              8472918471  2m05s",
    "prerequisites": "GitHub CLI (gh)."
  },
  {
    "id": "gha-view-logs",
    "category": "github-actions",
    "categoryLabel": "GitHub Actions",
    "title": "View Workflow Run Console Logs",
    "command": "gh run view 8492019482 --log",
    "description": "Streams or displays full job logs from a specific workflow execution ID.",
    "privilege": "user",
    "tags": [
      "github",
      "actions",
      "logs",
      "debug"
    ],
    "explanation": "Fetches raw console outputs from all steps in the specified run.",
    "expectedOutput": "deploy\tSet up job\t2026-10-15T10:00:01Z Current runner version: '2.311.0'\ndeploy\tBuild Docker Image\t2026-10-15T10:00:15Z Step 1/12 : FROM node:20-alpine\ndeploy\tDeploy to Kubernetes\t2026-10-15T10:02:40Z deployment.apps/devops-portal configured\ndeploy\tComplete job\t2026-10-15T10:03:43Z Cleaning up orphan processes",
    "prerequisites": "Completed or running workflow run ID."
  },
  {
    "id": "gha-watch-run",
    "category": "github-actions",
    "categoryLabel": "GitHub Actions",
    "title": "Watch Active Workflow Run in Real-Time",
    "command": "gh run watch 8492019482 --interval 5",
    "description": "Polls and renders live progress until all pipeline steps succeed or fail.",
    "privilege": "user",
    "tags": [
      "github",
      "actions",
      "live",
      "watch"
    ],
    "explanation": "Continuously queries run status and step progression with visual checkmarks.",
    "expectedOutput": "✓ Build client bundle (42s)\n✓ Run unit and integration tests (1m 15s)\n* Push container to GitHub Packages (in progress... 18s)\n- Deploy to Production Cluster (pending)",
    "prerequisites": "Active workflow run ID."
  },
  {
    "id": "gha-rerun-failed",
    "category": "github-actions",
    "categoryLabel": "GitHub Actions",
    "title": "Rerun Only Failed Jobs in Workflow",
    "command": "gh run rerun 8492019482 --failed",
    "description": "Restarts only the jobs that failed in a previous run, skipping successful steps.",
    "privilege": "user",
    "tags": [
      "github",
      "actions",
      "rerun",
      "retry"
    ],
    "explanation": "Uses partial rerun feature to save compute minutes and accelerate fixes.",
    "expectedOutput": "✓ Requested rerun of failed jobs for run 8492019482\nNew run link: https://github.com/org/repo/actions/runs/8492019482",
    "prerequisites": "Failed run ID."
  },
  {
    "id": "gha-list-secrets",
    "category": "github-actions",
    "categoryLabel": "GitHub Actions",
    "title": "List Configured Actions Secrets",
    "command": "gh secret list",
    "description": "Lists all repository-level and environment secrets configured for CI/CD.",
    "privilege": "user",
    "tags": [
      "github",
      "actions",
      "secrets",
      "env"
    ],
    "explanation": "Outputs secret names and last update timestamps without exposing plaintext values.",
    "expectedOutput": "NAME                UPDATED\nAWS_ACCESS_KEY_ID   2026-09-12\nAWS_SECRET_KEY      2026-09-12\nKUBECONFIG_DATA     2026-10-01\nSLACK_WEBHOOK_URL   2026-08-20",
    "prerequisites": "Admin or write permissions on repository."
  },
  {
    "id": "gha-download-artifacts",
    "category": "github-actions",
    "categoryLabel": "GitHub Actions",
    "title": "Download Workflow Build Artifacts",
    "command": "gh run download 8492019482 -n release-assets -D ./dist",
    "description": "Retrieves published build artifacts, test summaries, or binaries from GitHub storage.",
    "privilege": "user",
    "tags": [
      "github",
      "actions",
      "artifacts",
      "download"
    ],
    "explanation": "Unzips the uploaded workflow artifact named \"release-assets\" into destination folder.",
    "expectedOutput": "✓ Downloaded artifact release-assets to ./dist\nExtracted 24 files (4.2 MB total).",
    "prerequisites": "Run ID with uploaded artifacts."
  },
  {
    "id": "helm-list-all",
    "category": "helm",
    "categoryLabel": "Helm",
    "title": "List All Helm Releases Across Namespaces",
    "command": "helm list -A --date",
    "description": "Displays all deployed Helm releases across all Kubernetes namespaces sorted by update date.",
    "privilege": "user",
    "tags": [
      "helm",
      "k8s",
      "releases",
      "cluster"
    ],
    "explanation": "Queries Helm release Secret/ConfigMap storage across the whole cluster.",
    "expectedOutput": "NAME            NAMESPACE   REVISION    UPDATED                                 STATUS      CHART                   APP VERSION\ndevops-portal   production  3           2026-10-15 11:20:14.391823 +0000 UTC   deployed    devops-portal-1.4.2     2.4.0      \ningress-nginx   ingress-system 12       2026-09-28 08:14:02.192012 +0000 UTC   deployed    ingress-nginx-4.8.3     1.9.4      \nprometheus      monitoring  5           2026-10-02 14:01:55.912832 +0000 UTC   deployed    kube-prometheus-51.2.0  v0.68.0    ",
    "prerequisites": "Kubernetes cluster context and Helm CLI installed."
  },
  {
    "id": "helm-install-release",
    "category": "helm",
    "categoryLabel": "Helm",
    "title": "Install Chart with Custom Values & Namespace",
    "command": "helm install my-app ./chart -f values-prod.yaml --namespace production --create-namespace",
    "description": "Deploys a new Helm release using customized values file, creating namespace if absent.",
    "privilege": "user",
    "tags": [
      "helm",
      "install",
      "deploy",
      "k8s"
    ],
    "explanation": "Renders templates, packages manifest, and submits declarative objects to Kubernetes API.",
    "expectedOutput": "NAME: my-app\nLAST DEPLOYED: Thu Oct 16 10:20:00 2026\nNAMESPACE: production\nSTATUS: deployed\nREVISION: 1\nTEST SUITE: None\nNOTES:\nThank you for installing my-app. Check status with: kubectl get pods -n production",
    "prerequisites": "Helm chart directory or repo."
  },
  {
    "id": "helm-upgrade-atomic",
    "category": "helm",
    "categoryLabel": "Helm",
    "title": "Upgrade Release with Atomic Rollback & Timeout",
    "command": "helm upgrade --install my-app ./chart -f values-prod.yaml -n production --atomic --timeout 5m",
    "description": "Upgrades an existing release or installs it if absent; automatically rolls back if health checks fail.",
    "privilege": "user",
    "tags": [
      "helm",
      "upgrade",
      "atomic",
      "safe"
    ],
    "explanation": "The --atomic flag waits for Pod readiness probes; rolls back automatically on failure before timeout.",
    "expectedOutput": "Release \"my-app\" has been upgraded. Happy Helming!\nSTATUS: deployed\nREVISION: 4",
    "prerequisites": "Healthy Kubernetes cluster with sufficient compute resources."
  },
  {
    "id": "helm-rollback",
    "category": "helm",
    "categoryLabel": "Helm",
    "title": "Rollback Release to Previous Revision",
    "command": "helm rollback my-app 2 -n production",
    "description": "Rolls back a release to a specific previous revision number instantly.",
    "privilege": "user",
    "tags": [
      "helm",
      "rollback",
      "revert",
      "recovery"
    ],
    "explanation": "Re-applies the Kubernetes manifests archived under revision 2 in Helm release secrets.",
    "expectedOutput": "Rollback was a success! Happy Helming!",
    "prerequisites": "Target revision number must exist in helm history."
  },
  {
    "id": "helm-template-debug",
    "category": "helm",
    "categoryLabel": "Helm",
    "title": "Render Templates Locally for Debugging",
    "command": "helm template my-app ./chart -f values-prod.yaml --debug",
    "description": "Locally evaluates Go templates against values without communicating with any Kubernetes cluster.",
    "privilege": "user",
    "tags": [
      "helm",
      "template",
      "lint",
      "dry-run"
    ],
    "explanation": "Generates final pure Kubernetes YAML to STDOUT to catch indentation or logic errors.",
    "expectedOutput": "--- \n# Source: my-app/templates/deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: my-app\n  labels:\n    app.kubernetes.io/name: my-app\nspec:\n  replicas: 3...",
    "prerequisites": "Helm chart on disk."
  },
  {
    "id": "helm-repo-add-update",
    "category": "helm",
    "categoryLabel": "Helm",
    "title": "Add & Synchronize Helm Repositories",
    "command": "helm repo add bitnami https://charts.bitnami.com/bitnami && helm repo update",
    "description": "Registers remote chart repository and downloads indexed manifest catalogs.",
    "privilege": "user",
    "tags": [
      "helm",
      "repo",
      "update",
      "package"
    ],
    "explanation": "Updates local ~/.cache/helm/repository index files with available versions.",
    "expectedOutput": "\"bitnami\" has been added to your repositories\nHang tight while we grab the latest from your chart repositories...\n...Successfully got an update from the \"bitnami\" chart repository\nUpdate Complete. ⎈Happy Helming!⎈",
    "prerequisites": "Internet access."
  },
  {
    "id": "helm-history",
    "category": "helm",
    "categoryLabel": "Helm",
    "title": "Inspect Release Revision History",
    "command": "helm history my-app -n production",
    "description": "Lists all past revisions, upgrade dates, status, chart version, and description.",
    "privilege": "user",
    "tags": [
      "helm",
      "history",
      "revisions",
      "audit"
    ],
    "explanation": "Reads all revision metadata stored in cluster secrets for this release.",
    "expectedOutput": "REVISION    UPDATED                     STATUS          CHART           APP VERSION DESCRIPTION     \n1           Wed Oct  1 09:12:00 2026    superseded      my-app-1.0.0    1.0.0       Install complete\n2           Mon Oct  6 14:30:21 2026    superseded      my-app-1.1.0    1.1.0       Upgrade values  \n3           Thu Oct 15 11:20:14 2026    deployed        my-app-1.2.0    1.2.0       Upgrade complete",
    "prerequisites": "Installed Helm release."
  },
  {
    "id": "helm-uninstall",
    "category": "helm",
    "categoryLabel": "Helm",
    "title": "Uninstall Release & Purge Resources",
    "command": "helm uninstall my-app -n production",
    "description": "Deletes all Kubernetes objects created by the specified Helm release.",
    "privilege": "user",
    "tags": [
      "helm",
      "uninstall",
      "delete",
      "clean"
    ],
    "explanation": "Deletes associated Deployments, Services, ConfigMaps, and the release secret.",
    "expectedOutput": "release \"my-app\" uninstalled",
    "prerequisites": "Existing release."
  },
  {
    "id": "linux-system-identity",
    "category": "linux-core",
    "categoryLabel": "Linux",
    "title": "Display Kernel & Distribution Release Information",
    "command": "uname -a && cat /etc/os-release",
    "description": "Outputs system kernel version, CPU architecture, hostname, and detailed OS distribution.",
    "privilege": "user",
    "tags": [
      "linux",
      "kernel",
      "os",
      "architecture"
    ],
    "explanation": "Combines uname kernel attributes with standard freedesktop /etc/os-release attributes.",
    "expectedOutput": "Linux devops-srv 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC Wed Sep 11 15:25:05 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux\nPRETTY_NAME=\"Ubuntu 24.04.1 LTS\"\nNAME=\"Ubuntu\"\nVERSION_ID=\"24.04\"\nVERSION=\"24.04.1 LTS (Noble Numbat)\"\nVERSION_CODENAME=noble\nID=ubuntu\nID_LIKE=debian",
    "prerequisites": "POSIX / Linux compatible shell."
  },
  {
    "id": "linux-uptime-load",
    "category": "linux-core",
    "categoryLabel": "Linux",
    "title": "Check Uptime, Active Users & 1/5/15m System Load",
    "command": "uptime && w",
    "description": "Displays current server time, elapsed uptime, total active login sessions, and CPU load averages.",
    "privilege": "user",
    "tags": [
      "linux",
      "uptime",
      "loadavg",
      "sessions"
    ],
    "explanation": "Reads /proc/loadavg and utmp database to inspect concurrency and compute pressure.",
    "expectedOutput": " 12:45:01 up 42 days,  3:18,  2 users,  load average: 0.14, 0.22, 0.18\nUSER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT\nkishwanth pts/0    192.168.0.132    10:15    0.00s  0.12s  0.02s w\nadmin    pts/1    10.0.0.45        09:00    1:42m  0.08s  0.01s vim /etc/hosts",
    "prerequisites": "Standard Linux environment."
  },
  {
    "id": "docker-ps",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "List Active Running Containers",
    "command": "docker ps --format \"table {{.ID}}\\t{{.Image}}\\t{{.Status}}\\t{{.Ports}}\\t{{.Names}}\"",
    "description": "Displays currently running containers formatted cleanly with IDs, image tags, status, and port mappings.",
    "privilege": "user",
    "tags": [
      "docker",
      "containers",
      "status",
      "ps"
    ],
    "explanation": "Queries the local Docker daemon socket /var/run/docker.sock.",
    "expectedOutput": "CONTAINER ID   IMAGE                 STATUS         PORTS                    NAMES\na1b2c3d4e5f6   node:20-alpine        Up 14 hours    0.0.0.0:5000->5000/tcp   devops-backend\nf6e5d4c3b2a1   nginx:alpine          Up 14 hours    0.0.0.0:80->80/tcp       devops-proxy\n9876543210ab   redis:7-alpine        Up 3 days      6379/tcp                 devops-cache",
    "prerequisites": "Docker engine installed and running."
  },
  {
    "id": "docker-ps-all",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "List All Containers (Running & Exited)",
    "command": "docker ps -a --format \"table {{.ID}}\\t{{.Image}}\\t{{.Status}}\\t{{.Names}}\"",
    "description": "Shows all containers on the system including terminated, stopped, and crashed instances.",
    "privilege": "user",
    "tags": [
      "docker",
      "containers",
      "all",
      "exited"
    ],
    "explanation": "Useful for finding failed containers, exit codes, and cleaning up stopped resources.",
    "expectedOutput": "CONTAINER ID   IMAGE                 STATUS                      NAMES\na1b2c3d4e5f6   node:20-alpine        Up 14 hours                 devops-backend\n3f4e5d6c7b8a   postgres:16-alpine    Exited (0) 2 days ago       test-db-migrator\n8a7b6c5d4e3f   python:3.11-slim      Exited (137) 4 hours ago    batch-job-oom",
    "prerequisites": "Docker daemon."
  },
  {
    "id": "docker-build",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "Build Docker Image from Dockerfile",
    "command": "docker build -t devops-portal:v2.4.0 -f Dockerfile .",
    "description": "Packages current project directory into an OCI container image using local Dockerfile.",
    "privilege": "user",
    "tags": [
      "docker",
      "build",
      "image",
      "package"
    ],
    "explanation": "Executes Dockerfile directives sequentially utilizing cached build layers.",
    "expectedOutput": "[+] Building 8.4s (12/12) FINISHED\n => [internal] load build definition from Dockerfile\n => => naming to docker.io/library/devops-portal:v2.4.0\n => DONE 0.0s",
    "prerequisites": "Dockerfile present in root."
  },
  {
    "id": "docker-build-no-cache",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "Force Clean Build Without Cache",
    "command": "docker build --no-cache --pull -t devops-portal:latest .",
    "description": "Rebuilds image from scratch, downloading latest base images and skipping local layer cache.",
    "privilege": "user",
    "tags": [
      "docker",
      "build",
      "no-cache",
      "fresh"
    ],
    "explanation": "Ensures OS security patches and new upstream dependencies are freshly pulled.",
    "expectedOutput": "[+] Building 24.1s (14/14) FINISHED\n => [internal] load .dockerignore\n => [1/8] FROM docker.io/library/node:20-alpine@sha256:7198...\n => => downloading library/node:20-alpine\n => DONE 0.0s",
    "prerequisites": "Dockerfile."
  },
  {
    "id": "docker-run-detached",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "Run Container in Background with Port Mapping",
    "command": "docker run -d --name devops-web -p 8080:80 --restart unless-stopped devops-portal:v2.4.0",
    "description": "Starts container as a daemon in background, maps host port 8080 to container port 80.",
    "privilege": "user",
    "tags": [
      "docker",
      "run",
      "daemon",
      "ports"
    ],
    "explanation": "Allocates container cgroups and namespaces, forwards host TCP port 8080.",
    "expectedOutput": "4e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f",
    "prerequisites": "Container image available locally."
  },
  {
    "id": "docker-run-limits",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "Run Container with Hard Memory & CPU Limits",
    "command": "docker run -d --name worker --memory=\"512m\" --memory-swap=\"1g\" --cpus=\"1.5\" worker:latest",
    "description": "Enforces hard resource boundaries to prevent containers from starving host memory/CPU.",
    "privilege": "user",
    "tags": [
      "docker",
      "cgroups",
      "limits",
      "memory",
      "cpu"
    ],
    "explanation": "Sets Linux kernel cgroup v2 memory.max and cpu.max attributes for the container.",
    "expectedOutput": "b9c8d7e6f5a43210fedcba9876543210abcdef1234567890abcdef1234567890",
    "prerequisites": "Docker cgroups enabled."
  },
  {
    "id": "docker-logs-follow",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "Follow Container Logs with Timestamps",
    "command": "docker logs -f --tail 100 -t devops-backend",
    "description": "Streams live container stdout and stderr prefixed with RFC3339 timestamps.",
    "privilege": "user",
    "tags": [
      "docker",
      "logs",
      "stream",
      "debug"
    ],
    "explanation": "Reads JSON-file or journald log driver ring buffer for the specified container.",
    "expectedOutput": "2026-10-16T12:00:01.491Z [INFO] HTTP GET /api/pocs 200 OK (12ms)\n2026-10-16T12:00:15.918Z [INFO] HTTP GET /api/tasks 200 OK (8ms)\n2026-10-16T12:01:00.002Z [INFO] Background cron sync completed.",
    "prerequisites": "Running or stopped container name."
  },
  {
    "id": "docker-exec-it",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "Open Interactive TTY Shell Inside Container",
    "command": "docker exec -it devops-backend /bin/sh",
    "description": "Enters a running container namespace with an interactive terminal session.",
    "privilege": "user",
    "tags": [
      "docker",
      "exec",
      "tty",
      "shell",
      "debug"
    ],
    "explanation": "Attaches a pseudo-TTY to a new process running within the container namespace.",
    "expectedOutput": "/app # ls -la\ntotal 32\ndrwxr-xr-x    1 node     node          4096 Oct 15 10:00 .\ndrwxr-xr-x    1 root     root          4096 Oct 15 09:50 ..\n-rw-r--r--    1 node     node           820 Oct 15 09:55 package.json\ndrwxr-xr-x    2 node     node          4096 Oct 15 10:00 src\n/app #",
    "prerequisites": "Running container with /bin/sh or /bin/bash available."
  },
  {
    "id": "docker-stop",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "Gracefully Stop Running Container",
    "command": "docker stop -t 15 devops-backend",
    "description": "Sends SIGTERM to PID 1, allows 15s graceful shutdown before sending SIGKILL.",
    "privilege": "user",
    "tags": [
      "docker",
      "stop",
      "sigterm",
      "graceful"
    ],
    "explanation": "Ensures database transactions and HTTP connections terminate cleanly.",
    "expectedOutput": "devops-backend",
    "prerequisites": "Running container."
  },
  {
    "id": "docker-kill",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "Force Kill Unresponsive Container",
    "command": "docker kill devops-backend",
    "description": "Instantly sends SIGKILL to terminate an unresponsive or frozen container.",
    "privilege": "user",
    "tags": [
      "docker",
      "kill",
      "sigkill",
      "force"
    ],
    "explanation": "Bypasses application shutdown handlers to immediately reclaim OS execution.",
    "expectedOutput": "devops-backend",
    "prerequisites": "Stuck container."
  },
  {
    "id": "docker-rm",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "Remove Terminated Container",
    "command": "docker rm -f devops-backend",
    "description": "Deletes container filesystem layer and stops it if currently active.",
    "privilege": "user",
    "tags": [
      "docker",
      "rm",
      "cleanup",
      "delete"
    ],
    "explanation": "Destroys the writeable container layer.",
    "expectedOutput": "devops-backend",
    "prerequisites": "Container ID or name."
  },
  {
    "id": "docker-images",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "List Local Docker Images & Sizes",
    "command": "docker images --format \"table {{.Repository}}\\t{{.Tag}}\\t{{.Size}}\\t{{.CreatedSince}}\"",
    "description": "Lists all cached container images stored in local Docker root directory.",
    "privilege": "user",
    "tags": [
      "docker",
      "images",
      "storage",
      "size"
    ],
    "explanation": "Scans image store and outputs tags, size on disk, and creation age.",
    "expectedOutput": "REPOSITORY       TAG       SIZE      CREATED SINCE\ndevops-portal    v2.4.0    148MB     2 days ago\nnode             20-alpine 141MB     2 weeks ago\nnginx            alpine    42MB      3 weeks ago\nredis            7-alpine  35MB      1 month ago",
    "prerequisites": "Docker daemon."
  },
  {
    "id": "docker-image-prune",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "Remove Dangling & Unused Images",
    "command": "docker image prune -a -f --filter \"until=168h\"",
    "description": "Deletes all images not referenced by any running container older than 7 days.",
    "privilege": "user",
    "tags": [
      "docker",
      "prune",
      "cleanup",
      "disk"
    ],
    "explanation": "Reclaims gigabytes of disk space consumed by superseded build layers.",
    "expectedOutput": "Deleted Images:\nuntagged: devops-portal:v2.3.1\ndeleted: sha256:4f8e9a2b1c...\n\nTotal reclaimed space: 4.821GB",
    "prerequisites": "Docker host with accumulated old images."
  },
  {
    "id": "docker-system-prune",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "Nuclear System Prune (Images, Containers, Networks)",
    "command": "docker system prune -a --volumes -f",
    "description": "Purges ALL stopped containers, unused networks, dangling images, and anonymous volumes.",
    "privilege": "user",
    "tags": [
      "docker",
      "system",
      "prune",
      "nuclear"
    ],
    "explanation": "High-impact cleanup command. Use when disk is critically full.",
    "expectedOutput": "Deleted Containers:\n3a1b2c...\nDeleted Networks:\ncustom_bridge\nDeleted Volumes:\n8a9b0c...\nTotal reclaimed space: 18.42GB",
    "prerequisites": "Caution: ensures unused data volumes are deleted."
  },
  {
    "id": "docker-inspect",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "Inspect Container IP & Network Settings",
    "command": "docker inspect devops-backend | jq \".[0].NetworkSettings.Networks\"",
    "description": "Extracts assigned IP address, gateway, MAC address, and subnet information in JSON.",
    "privilege": "user",
    "tags": [
      "docker",
      "inspect",
      "network",
      "ip",
      "jq"
    ],
    "explanation": "Parses container state JSON structure.",
    "expectedOutput": "{\n  \"bridge\": {\n    \"IPAddress\": \"172.17.0.2\",\n    \"Gateway\": \"172.17.0.1\",\n    \"MacAddress\": \"02:42:ac:11:00:02\"\n  }\n}",
    "prerequisites": "Running container and jq installed."
  },
  {
    "id": "docker-cp",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "Copy Files Between Host and Container",
    "command": "docker cp devops-backend:/app/data/devops_stored.sqlite ./backup_db.sqlite",
    "description": "Transfers files or directories in or out of a running/stopped container.",
    "privilege": "user",
    "tags": [
      "docker",
      "cp",
      "backup",
      "files"
    ],
    "explanation": "Uses Docker stream archive tar protocol to copy files without SSH or volume binds.",
    "expectedOutput": "Successfully copied 2.4MB to ./backup_db.sqlite",
    "prerequisites": "Valid container file path."
  },
  {
    "id": "docker-stats",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "View Real-Time Container CPU, Memory & Network IO",
    "command": "docker stats --no-stream",
    "description": "Prints snapshot table of CPU %, Memory Usage, Memory %, Net I/O, Block I/O, and PIDs.",
    "privilege": "user",
    "tags": [
      "docker",
      "stats",
      "metrics",
      "monitoring"
    ],
    "explanation": "Collects live cgroups metrics across all active container processes.",
    "expectedOutput": "CONTAINER ID   NAME             CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O\na1b2c3d4e5f6   devops-backend   0.24%     94.12MiB / 7.68GiB    1.20%     12.4MB / 8.9MB    45MB / 12MB\nf6e5d4c3b2a1   devops-proxy     0.05%     18.42MiB / 7.68GiB    0.23%     42.1MB / 58.2MB   1.2MB / 0B",
    "prerequisites": "Active containers."
  },
  {
    "id": "docker-tag-push",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "Tag & Push Image to Remote Registry",
    "command": "docker tag devops-portal:v2.4.0 registry.example.com/devops/portal:v2.4.0 && docker push registry.example.com/devops/portal:v2.4.0",
    "description": "Aliases an image with target registry domain and uploads layers to remote repository.",
    "privilege": "user",
    "tags": [
      "docker",
      "tag",
      "push",
      "registry"
    ],
    "explanation": "Authenticates with registry and pushes distinct sha256 blob layers.",
    "expectedOutput": "The push refers to repository [registry.example.com/devops/portal]\n7a8b9c: Pushed\n1a2b3c: Layer already exists\nv2.4.0: digest: sha256:e3b0c442... size: 1782",
    "prerequisites": "docker login completed for registry."
  },
  {
    "id": "docker-pull",
    "category": "docker",
    "categoryLabel": "Docker",
    "title": "Pull Image by SHA or Version Tag",
    "command": "docker pull postgres:16-alpine",
    "description": "Downloads base or dependency container image from Docker Hub or private mirror.",
    "privilege": "user",
    "tags": [
      "docker",
      "pull",
      "download",
      "hub"
    ],
    "explanation": "Fetches manifest list and downloads layers matching host OS and CPU architecture.",
    "expectedOutput": "16-alpine: Pulling from library/postgres\nDigest: sha256:7b9c1d2e...\nStatus: Downloaded newer image for postgres:16-alpine",
    "prerequisites": "Network connectivity."
  },
  {
    "id": "dc-up-detached",
    "category": "docker-compose",
    "categoryLabel": "Docker Compose",
    "title": "Start Full Stack in Background",
    "command": "docker compose up -d",
    "description": "Creates networks, volumes, and starts all declared services as background daemons.",
    "privilege": "user",
    "tags": [
      "docker-compose",
      "up",
      "stack",
      "start"
    ],
    "explanation": "Reads compose.yaml, checks dependencies with depends_on, launches containers in order.",
    "expectedOutput": "[+] Running 4/4\n ✔ Network devops_default     Created\n ✔ Container devops-db-1      Started\n ✔ Container devops-redis-1   Started\n ✔ Container devops-portal-1  Started",
    "prerequisites": "docker-compose.yml or compose.yaml in current directory."
  },
  {
    "id": "dc-up-build",
    "category": "docker-compose",
    "categoryLabel": "Docker Compose",
    "title": "Build and Start Services Simultaneously",
    "command": "docker compose up -d --build --remove-orphans",
    "description": "Forces rebuild of images defined with build contexts and cleans up obsolete containers.",
    "privilege": "user",
    "tags": [
      "docker-compose",
      "build",
      "rebuild",
      "orphans"
    ],
    "explanation": "Compiles new source changes into images before spinning up updated containers.",
    "expectedOutput": "[+] Building 3.2s (8/8) FINISHED\n[+] Running 3/3\n ✔ Container devops-portal-1  Recreated\n ✔ Container devops-proxy-1   Recreated",
    "prerequisites": "Compose file."
  },
  {
    "id": "dc-logs-tail",
    "category": "docker-compose",
    "categoryLabel": "Docker Compose",
    "title": "Stream Aggregated Multi-Service Logs",
    "command": "docker compose logs -f --tail 50 web api",
    "description": "Follows color-coded interleaved log streams for specific services.",
    "privilege": "user",
    "tags": [
      "docker-compose",
      "logs",
      "stream",
      "tail"
    ],
    "explanation": "Streams logs from both web and api services with distinct service prefixes.",
    "expectedOutput": "api-1  | [2026-10-16 12:10] Server listening on port 5000\nweb-1  | 192.168.0.1 - - [16/Oct/2026:12:10:02] \"GET / HTTP/1.1\" 200 1420\napi-1  | [2026-10-16 12:10:03] DB query: SELECT * FROM users LIMIT 1",
    "prerequisites": "Running compose stack."
  },
  {
    "id": "dc-down",
    "category": "docker-compose",
    "categoryLabel": "Docker Compose",
    "title": "Stop & Tear Down Stack",
    "command": "docker compose down",
    "description": "Gracefully stops containers and removes containers and internal bridge networks.",
    "privilege": "user",
    "tags": [
      "docker-compose",
      "down",
      "stop",
      "remove"
    ],
    "explanation": "Preserves named persistent storage volumes while removing execution containers.",
    "expectedOutput": "[+] Running 4/4\n ✔ Container devops-portal-1  Removed\n ✔ Container devops-db-1      Removed\n ✔ Network devops_default     Removed",
    "prerequisites": "Compose stack."
  },
  {
    "id": "dc-down-volumes",
    "category": "docker-compose",
    "categoryLabel": "Docker Compose",
    "title": "Tear Down Stack & Delete Named Volumes",
    "command": "docker compose down -v",
    "description": "Destroys stack AND purges all associated persistent data volumes for clean reset.",
    "privilege": "user",
    "tags": [
      "docker-compose",
      "down",
      "volumes",
      "reset"
    ],
    "explanation": "Removes database files and cached storage for testing clean-slate deployments.",
    "expectedOutput": "[+] Running 5/5\n ✔ Container devops-portal-1  Removed\n ✔ Volume devops_db_data      Removed\n ✔ Network devops_default     Removed",
    "prerequisites": "Caution: deletes database volumes."
  },
  {
    "id": "dc-ps",
    "category": "docker-compose",
    "categoryLabel": "Docker Compose",
    "title": "List Stack Services Status & Health",
    "command": "docker compose ps",
    "description": "Displays state, published ports, and container health check status for stack services.",
    "privilege": "user",
    "tags": [
      "docker-compose",
      "ps",
      "status",
      "health"
    ],
    "explanation": "Filters Docker containers specifically belonging to the current compose project.",
    "expectedOutput": "NAME               IMAGE           COMMAND                  SERVICE   CREATED         STATUS                   PORTS\ndevops-portal-1    devops:latest   \"node src/server.js\"     portal    2 hours ago     Up 2 hours (healthy)     0.0.0.0:5000->5000/tcp\ndevops-db-1        postgres:16     \"docker-entrypoint.s…\"   db        2 hours ago     Up 2 hours               5432/tcp",
    "prerequisites": "Active compose file."
  },
  {
    "id": "dc-restart-service",
    "category": "docker-compose",
    "categoryLabel": "Docker Compose",
    "title": "Restart Single Service Inside Stack",
    "command": "docker compose restart backend",
    "description": "Bounces the backend service container without touching database or proxy containers.",
    "privilege": "user",
    "tags": [
      "docker-compose",
      "restart",
      "bounce",
      "service"
    ],
    "explanation": "Restarts the designated container while maintaining existing network connections.",
    "expectedOutput": "[+] Restarting 1/1\n ✔ Container devops-backend-1  Started",
    "prerequisites": "Service name declared in compose file."
  },
  {
    "id": "dc-exec",
    "category": "docker-compose",
    "categoryLabel": "Docker Compose",
    "title": "Run One-Off Command Inside Stack Service",
    "command": "docker compose exec db psql -U postgres -d devops_stored -c \"\\dt\"",
    "description": "Executes a command directly within the primary container of a defined service.",
    "privilege": "user",
    "tags": [
      "docker-compose",
      "exec",
      "command",
      "sql"
    ],
    "explanation": "Routes the execution to the first replica of the named service.",
    "expectedOutput": "             List of relations\n Schema |     Name      | Type  |  Owner   \n--------+---------------+-------+----------\n public | users         | table | postgres\n public | pocs          | table | postgres\n public | tasks         | table | postgres",
    "prerequisites": "Running service."
  },
  {
    "id": "dc-config-validate",
    "category": "docker-compose",
    "categoryLabel": "Docker Compose",
    "title": "Validate & Print Resolved Compose Config",
    "command": "docker compose config",
    "description": "Parses compose files, interpolates .env variables, and prints normalized YAML.",
    "privilege": "user",
    "tags": [
      "docker-compose",
      "config",
      "validate",
      "env"
    ],
    "explanation": "Validates syntax and verifies environment variable substitution before deployment.",
    "expectedOutput": "name: devops\nservices:\n  portal:\n    environment:\n      PORT: \"5000\"\n      NODE_ENV: \"production\"\n    image: devops-portal:v2.4.0",
    "prerequisites": "compose.yaml file."
  },
  {
    "id": "dc-scale",
    "category": "docker-compose",
    "categoryLabel": "Docker Compose",
    "title": "Scale Replicas for a Stateless Service",
    "command": "docker compose up -d --scale worker=4",
    "description": "Scales the number of running container instances for worker service to 4.",
    "privilege": "user",
    "tags": [
      "docker-compose",
      "scale",
      "replicas",
      "horizontal"
    ],
    "explanation": "Docker engine creates additional containers joined to the same bridge network.",
    "expectedOutput": "[+] Running 3/3\n ✔ Container devops-worker-2  Started\n ✔ Container devops-worker-3  Started\n ✔ Container devops-worker-4  Started",
    "prerequisites": "Stateless service without conflicting host port binds."
  },
  {
    "id": "k8s-get-pods-wide",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "List Pods Across All Namespaces with Node IPs",
    "command": "kubectl get pods -A -o wide",
    "description": "Shows status, restarts, assigned internal IPs, and hosting worker node names for all pods.",
    "privilege": "user",
    "tags": [
      "k8s",
      "pods",
      "wide",
      "nodes"
    ],
    "explanation": "Queries the Kubernetes apiserver /api/v1/pods endpoint.",
    "expectedOutput": "NAMESPACE     NAME                             READY   STATUS    RESTARTS   AGE   IP           NODE          \ndefault       devops-portal-78d85f884c-59hxp   1/1     Running   0          4d    10.244.1.45  worker-node-1 \nkube-system   coredns-76f75df574-x82ld         1/1     Running   0          18d   10.244.0.5   control-plane ",
    "prerequisites": "Valid kubeconfig context."
  },
  {
    "id": "k8s-get-pods-watch",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "Watch Pod State Transitions in Real-Time",
    "command": "kubectl get pods -n production -w",
    "description": "Streams live lifecycle events (ContainerCreating, Running, Terminating) as they happen.",
    "privilege": "user",
    "tags": [
      "k8s",
      "pods",
      "watch",
      "stream"
    ],
    "explanation": "Keeps an open HTTP stream to apiserver watch endpoint.",
    "expectedOutput": "NAME                            READY   STATUS              RESTARTS   AGE\ndevops-portal-689fbf8d8-2xkls   0/1     ContainerCreating   0          2s\ndevops-portal-689fbf8d8-2xkls   1/1     Running             0          7s\ndevops-portal-578fce7c9-94mka   1/1     Terminating         0          3d",
    "prerequisites": "Namespace production."
  },
  {
    "id": "k8s-describe-pod",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "Describe Pod Events & Health Probes",
    "command": "kubectl describe pod devops-portal-78d85f884c-59hxp -n production",
    "description": "Detailed inspection of pod events, scheduling decisions, volume mounts, and probe failures.",
    "privilege": "user",
    "tags": [
      "k8s",
      "describe",
      "events",
      "troubleshoot"
    ],
    "explanation": "Essential for diagnosing ImagePullBackOff, CrashLoopBackOff, or Evicted states.",
    "expectedOutput": "Name:         devops-portal-78d85f884c-59hxp\nNamespace:    production\nNode:         worker-node-1/192.168.1.50\nEvents:\n  Type    Reason     Age   From               Message\n  ----    ------     ----  ----               -------\n  Normal  Scheduled  4d    default-scheduler  Successfully assigned production/devops-portal to worker-node-1\n  Normal  Pulled     4d    kubelet            Container image pulled in 2.1s",
    "prerequisites": "Pod name."
  },
  {
    "id": "k8s-logs-tail",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "Stream Container Logs with Tail",
    "command": "kubectl logs -f deployment/devops-portal -c app -n production --tail=100",
    "description": "Streams stdout/stderr logs from a specific container in a deployment.",
    "privilege": "user",
    "tags": [
      "k8s",
      "logs",
      "stream",
      "tail"
    ],
    "explanation": "Connects to kubelet streaming endpoint for the matching pod.",
    "expectedOutput": "[INFO] Server listening on port 5000\n[INFO] Healthcheck probe responded 200 OK\n[INFO] User kishwanth authenticated successfully",
    "prerequisites": "Running deployment."
  },
  {
    "id": "k8s-logs-previous",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "Read Crash Logs from Previous Terminated Instance",
    "command": "kubectl logs devops-portal-78d85f884c-crash -c app -n production --previous",
    "description": "Retrieves logs from the container that crashed prior to kubelet restart.",
    "privilege": "user",
    "tags": [
      "k8s",
      "logs",
      "previous",
      "crash",
      "postmortem"
    ],
    "explanation": "Reads archived logs from /var/log/pods before the restart.",
    "expectedOutput": "FATAL EXCEPTION: Out of memory\nJavaScript heap out of memory\nKilled (signal 9)",
    "prerequisites": "Pod with restarts > 0."
  },
  {
    "id": "k8s-exec-it",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "Open Interactive Bash Shell Inside Pod",
    "command": "kubectl exec -it devops-portal-78d85f884c-59hxp -c app -n production -- /bin/bash",
    "description": "Opens a live interactive shell session inside the target pod container.",
    "privilege": "user",
    "tags": [
      "k8s",
      "exec",
      "bash",
      "interactive"
    ],
    "explanation": "SPDY/WebSocket connection into container Linux namespaces via kubelet.",
    "expectedOutput": "root@devops-portal-78d85f884c-59hxp:/app# curl localhost:5000/health\n{\"status\":\"healthy\",\"uptime\":34200}",
    "prerequisites": "Pod must contain bash binary."
  },
  {
    "id": "k8s-apply",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "Apply Declarative YAML Manifest",
    "command": "kubectl apply -f ./k8s/deployment.yaml -n production",
    "description": "Applies desired state configurations to cluster using server-side / client-side diff.",
    "privilege": "user",
    "tags": [
      "k8s",
      "apply",
      "declarative",
      "manifest"
    ],
    "explanation": "Updates object metadata and triggers controller reconcile loops.",
    "expectedOutput": "deployment.apps/devops-portal configured\nservice/devops-service unchanged",
    "prerequisites": "YAML manifest file."
  },
  {
    "id": "k8s-delete-f",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "Delete Resources Defined in Manifest",
    "command": "kubectl delete -f ./k8s/deployment.yaml -n production",
    "description": "Tears down all objects matching the definitions in the provided file.",
    "privilege": "user",
    "tags": [
      "k8s",
      "delete",
      "cleanup",
      "manifest"
    ],
    "explanation": "Sends delete requests for each Kind declared in the YAML document.",
    "expectedOutput": "deployment.apps \"devops-portal\" deleted\nservice \"devops-service\" deleted",
    "prerequisites": "Manifest file."
  },
  {
    "id": "k8s-rollout-restart",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "Trigger Zero-Downtime Rolling Restart",
    "command": "kubectl rollout restart deployment/devops-portal -n production",
    "description": "Updates deployment pod template metadata triggering rolling replacement of all replicas.",
    "privilege": "user",
    "tags": [
      "k8s",
      "rollout",
      "restart",
      "rolling"
    ],
    "explanation": "Injects kubectl.kubernetes.io/restartedAt timestamp into PodTemplateSpec.",
    "expectedOutput": "deployment.apps/devops-portal restarted",
    "prerequisites": "Deployment."
  },
  {
    "id": "k8s-rollout-status",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "Track Rollout Progress Until Complete",
    "command": "kubectl rollout status deployment/devops-portal -n production --timeout=3m",
    "description": "Blocks until new replica pods are ready and old pods have safely terminated.",
    "privilege": "user",
    "tags": [
      "k8s",
      "rollout",
      "status",
      "deploy"
    ],
    "explanation": "Monitors DeploymentStatus updatedReplicas and readyReplicas.",
    "expectedOutput": "Waiting for deployment \"devops-portal\" rollout to finish: 1 of 3 updated replicas are available...\nWaiting for deployment \"devops-portal\" rollout to finish: 2 of 3 updated replicas are available...\ndeployment \"devops-portal\" successfully rolled out",
    "prerequisites": "Active deployment rollout."
  },
  {
    "id": "k8s-rollout-undo",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "Instantly Roll Back Deployment to Prior Revision",
    "command": "kubectl rollout undo deployment/devops-portal -n production",
    "description": "Reverts the deployment to its previous ReplicaSet revision.",
    "privilege": "user",
    "tags": [
      "k8s",
      "rollout",
      "undo",
      "rollback"
    ],
    "explanation": "Quick emergency revert when a freshly deployed version throws runtime errors.",
    "expectedOutput": "deployment.apps/devops-portal rolled back",
    "prerequisites": "Deployment with revision history."
  },
  {
    "id": "k8s-port-forward",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "Port-Forward Remote Pod or Service to Localhost",
    "command": "kubectl port-forward svc/devops-portal 8080:5000 -n production",
    "description": "Bridges local port 8080 directly into cluster service port 5000 through kubectl.",
    "privilege": "user",
    "tags": [
      "k8s",
      "port-forward",
      "tunnel",
      "debug"
    ],
    "explanation": "Creates a bidirectional stream via apiserver without needing public ingress.",
    "expectedOutput": "Forwarding from 127.0.0.1:8080 -> 5000\nForwarding from [::1]:8080 -> 5000\nHandling connection for 8080",
    "prerequisites": "Cluster network connectivity."
  },
  {
    "id": "k8s-get-nodes",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "List Cluster Nodes, Roles, Versions & Status",
    "command": "kubectl get nodes -o wide",
    "description": "Displays all worker and control-plane nodes, kernel versions, container runtimes, and status.",
    "privilege": "user",
    "tags": [
      "k8s",
      "nodes",
      "cluster",
      "status"
    ],
    "explanation": "Queries Node API objects and reporting kubelet heartbeats.",
    "expectedOutput": "NAME            STATUS   ROLES           AGE   VERSION   INTERNAL-IP    OS-IMAGE             KERNEL-VERSION\ncontrol-plane   Ready    control-plane   45d   v1.30.2   192.168.1.10   Ubuntu 24.04.1 LTS   6.8.0-45-generic\nworker-node-1   Ready    <none>          45d   v1.30.2   192.168.1.11   Ubuntu 24.04.1 LTS   6.8.0-45-generic\nworker-node-2   Ready    <none>          45d   v1.30.2   192.168.1.12   Ubuntu 24.04.1 LTS   6.8.0-45-generic",
    "prerequisites": "Cluster."
  },
  {
    "id": "k8s-top-metrics",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "View CPU & Memory Utilization of Nodes and Pods",
    "command": "kubectl top nodes && kubectl top pods -n production --sort-by=memory",
    "description": "Queries metrics-server for live hardware consumption figures.",
    "privilege": "user",
    "tags": [
      "k8s",
      "top",
      "metrics",
      "cpu",
      "memory"
    ],
    "explanation": "Retrieves collected cgroups metrics aggregated by Kubernetes Metrics Server.",
    "expectedOutput": "NAME            CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%   \nworker-node-1   320m         8%     3410Mi          44%       \nworker-node-2   180m         4%     2100Mi          27%       \n\nNAME                             CPU(cores)   MEMORY(bytes)   \ndevops-portal-78d85f884c-59hxp   25m          142Mi           \nredis-cluster-0                  10m          48Mi            ",
    "prerequisites": "metrics-server installed in cluster."
  },
  {
    "id": "k8s-get-ingress",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "Inspect Ingress Routing Rules & TLS Hosts",
    "command": "kubectl get ingress -A",
    "description": "Lists all configured ingress HTTP path routers, hostnames, and load balancer endpoints.",
    "privilege": "user",
    "tags": [
      "k8s",
      "ingress",
      "routing",
      "tls"
    ],
    "explanation": "Reads networking.k8s.io/v1 Ingress definitions.",
    "expectedOutput": "NAMESPACE    NAME             CLASS   HOSTS                 ADDRESS          PORTS     AGE\nproduction   portal-ingress   nginx   portal.example.com    192.168.0.132    80, 443   12d",
    "prerequisites": "Ingress controller."
  },
  {
    "id": "k8s-decode-secret",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "Read & Base64 Decode Secret Values",
    "command": "kubectl get secret app-secrets -n production -o jsonpath=\"{.data.JWT_SECRET}\" | base64 -d && echo \"\"",
    "description": "Extracts encoded key from Secret object and decodes plaintext value directly in shell.",
    "privilege": "user",
    "tags": [
      "k8s",
      "secret",
      "base64",
      "jwt"
    ],
    "explanation": "Kubernetes secrets store values in base64 format; jsonpath extracts the specific field.",
    "expectedOutput": "devops_super_secret_jwt_key_2026_xyz!",
    "prerequisites": "Secret access permissions."
  },
  {
    "id": "k8s-drain-node",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "Safely Drain Worker Node for System Upgrades",
    "command": "kubectl drain worker-node-2 --ignore-daemonsets --delete-emptydir-data --force",
    "description": "Evicts all pods safely from a worker node so host kernel/hardware can be serviced.",
    "privilege": "sudo",
    "tags": [
      "k8s",
      "drain",
      "maintenance",
      "cordon"
    ],
    "explanation": "Cordons node preventing new pods and evicts existing pods subject to PodDisruptionBudgets.",
    "expectedOutput": "node/worker-node-2 cordoned\nevicting pod production/devops-portal-78d85f884c-k2m9\npod/devops-portal-78d85f884c-k2m9 evicted\nnode/worker-node-2 drained successfully",
    "prerequisites": "Cluster administrator."
  },
  {
    "id": "k8s-uncordon-node",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "Uncordon Worker Node to Resume Pod Scheduling",
    "command": "kubectl uncordon worker-node-2",
    "description": "Marks a previously drained node as schedulable again once maintenance completes.",
    "privilege": "sudo",
    "tags": [
      "k8s",
      "uncordon",
      "resume",
      "scheduling"
    ],
    "explanation": "Sets node spec.unschedulable = false.",
    "expectedOutput": "node/worker-node-2 uncordoned",
    "prerequisites": "Cordoned node."
  },
  {
    "id": "k8s-cluster-info",
    "category": "kubernetes",
    "categoryLabel": "Kubernetes",
    "title": "Verify Cluster Control Plane & Addon Health",
    "command": "kubectl cluster-info && kubectl get componentstatuses 2>/dev/null || true",
    "description": "Displays the master API endpoint and CoreDNS service URLs.",
    "privilege": "user",
    "tags": [
      "k8s",
      "cluster-info",
      "health",
      "apiserver"
    ],
    "explanation": "Checks apiserver responsiveness.",
    "expectedOutput": "Kubernetes control plane is running at https://192.168.1.10:6443\nCoreDNS is running at https://192.168.1.10:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy\n\nTo further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.",
    "prerequisites": "Kubeconfig."
  },
  {
    "id": "tf-init",
    "category": "terraform",
    "categoryLabel": "Terraform",
    "title": "Initialize Working Directory & Cloud Providers",
    "command": "terraform init",
    "description": "Downloads provider plugins, initializes backend state storage, and checks module dependencies.",
    "privilege": "user",
    "tags": [
      "terraform",
      "init",
      "providers",
      "backend"
    ],
    "explanation": "Scans .tf files, creates .terraform directory, and locks versions in .terraform.lock.hcl.",
    "expectedOutput": "Initializing the backend...\nInitializing provider plugins...\n- Finding hashicorp/aws versions matching \"~> 5.0\"...\n- Installing hashicorp/aws v5.42.0...\n\nTerraform has been successfully initialized!",
    "prerequisites": "Terraform HCL configuration files."
  },
  {
    "id": "tf-init-upgrade",
    "category": "terraform",
    "categoryLabel": "Terraform",
    "title": "Upgrade Providers to Latest Compatible Versions",
    "command": "terraform init -upgrade",
    "description": "Re-evaluates version constraints and updates provider binaries and lock file.",
    "privilege": "user",
    "tags": [
      "terraform",
      "init",
      "upgrade",
      "providers"
    ],
    "explanation": "Allows pulling newly released provider patches within version constraints.",
    "expectedOutput": "Upgrading provider plugins...\n- Upgrading hashicorp/aws to v5.50.0...\nTerraform has been successfully initialized!",
    "prerequisites": "Existing terraform project."
  },
  {
    "id": "tf-fmt",
    "category": "terraform",
    "categoryLabel": "Terraform",
    "title": "Auto-Format Terraform Configuration Files",
    "command": "terraform fmt -recursive",
    "description": "Rewrites HCL files to canonical format and style conventions across submodules.",
    "privilege": "user",
    "tags": [
      "terraform",
      "fmt",
      "style",
      "clean"
    ],
    "explanation": "Ensures standard spacing, alignment, and formatting across all team files.",
    "expectedOutput": "main.tf\nmodules/vpc/variables.tf\noutputs.tf",
    "prerequisites": "Terraform CLI."
  },
  {
    "id": "tf-validate",
    "category": "terraform",
    "categoryLabel": "Terraform",
    "title": "Validate Syntax & Attribute Consistency",
    "command": "terraform validate",
    "description": "Verifies that configuration is syntactically valid and references valid attributes.",
    "privilege": "user",
    "tags": [
      "terraform",
      "validate",
      "syntax",
      "linter"
    ],
    "explanation": "Performs static analysis without accessing remote provider APIs.",
    "expectedOutput": "Success! The configuration is valid.",
    "prerequisites": "Run terraform init first."
  },
  {
    "id": "tf-plan-out",
    "category": "terraform",
    "categoryLabel": "Terraform",
    "title": "Generate & Save Deterministic Execution Plan",
    "command": "terraform plan -out=tfplan",
    "description": "Compares state against cloud API realities and creates binary plan file for review.",
    "privilege": "user",
    "tags": [
      "terraform",
      "plan",
      "diff",
      "safety"
    ],
    "explanation": "Prevents drift between preview and execution stages in CI/CD.",
    "expectedOutput": "Terraform will perform the following actions:\n\n  # aws_instance.web will be created\n  + resource \"aws_instance\" \"web\" {\n      + ami           = \"ami-0c55b159cbfafe1f0\"\n      + instance_type = \"t3.medium\"\n    }\n\nPlan: 1 to add, 0 to change, 0 to destroy.\nSaved the plan to: tfplan",
    "prerequisites": "Configured cloud credentials."
  },
  {
    "id": "tf-apply-plan",
    "category": "terraform",
    "categoryLabel": "Terraform",
    "title": "Apply Pre-Generated Binary Plan",
    "command": "terraform apply tfplan",
    "description": "Executes exact actions calculated during the plan stage without prompting.",
    "privilege": "user",
    "tags": [
      "terraform",
      "apply",
      "execute",
      "immutable"
    ],
    "explanation": "Guarantees that only the approved infrastructure diff is deployed.",
    "expectedOutput": "aws_instance.web: Creating...\naws_instance.web: Still creating... [10s elapsed]\naws_instance.web: Creation complete after 22s [id=i-0123456789abcdef0]\n\nApply complete! Resources: 1 added, 0 changed, 0 destroyed.",
    "prerequisites": "Valid tfplan file."
  },
  {
    "id": "tf-apply-auto-approve",
    "category": "terraform",
    "categoryLabel": "Terraform",
    "title": "Direct Apply with Auto-Approve (CI/CD Pipeline)",
    "command": "terraform apply -auto-approve -var=\"env=production\"",
    "description": "Bypasses interactive confirmation for automated unattended deployment pipelines.",
    "privilege": "user",
    "tags": [
      "terraform",
      "apply",
      "auto-approve",
      "ci-cd"
    ],
    "explanation": "Calculates plan and immediately provisions resources.",
    "expectedOutput": "Apply complete! Resources: 2 added, 0 changed, 0 destroyed.\n\nOutputs:\nportal_url = \"https://portal.devops.example.com\"",
    "prerequisites": "Automated runner with cloud credentials."
  },
  {
    "id": "tf-destroy-auto-approve",
    "category": "terraform",
    "categoryLabel": "Terraform",
    "title": "Tear Down All Managed Cloud Infrastructure",
    "command": "terraform destroy -auto-approve",
    "description": "Destroys every cloud resource recorded in the Terraform state file.",
    "privilege": "user",
    "tags": [
      "terraform",
      "destroy",
      "teardown",
      "danger"
    ],
    "explanation": "Terminates VMs, deletes load balancers, and releases cloud allocations.",
    "expectedOutput": "aws_instance.web: Destroying... [id=i-0123456789abcdef0]\naws_instance.web: Destruction complete after 15s\n\nDestroy complete! Resources: 1 destroyed.",
    "prerequisites": "Caution: irreversible destruction."
  },
  {
    "id": "tf-state-list",
    "category": "terraform",
    "categoryLabel": "Terraform",
    "title": "List All Managed Resources in State File",
    "command": "terraform state list",
    "description": "Outputs names of all resource instances tracked by current state.",
    "privilege": "user",
    "tags": [
      "terraform",
      "state",
      "list",
      "inventory"
    ],
    "explanation": "Queries terraform.tfstate or remote S3/GCS backend state.",
    "expectedOutput": "aws_vpc.main\naws_subnet.public_a\naws_subnet.public_b\naws_security_group.web_sg\naws_instance.web",
    "prerequisites": "Initialized state."
  },
  {
    "id": "tf-state-show",
    "category": "terraform",
    "categoryLabel": "Terraform",
    "title": "Inspect Detailed Attributes of Specific Resource",
    "command": "terraform state show aws_instance.web",
    "description": "Displays all recorded metadata, IDs, IPs, and tags for a given resource instance.",
    "privilege": "user",
    "tags": [
      "terraform",
      "state",
      "show",
      "attributes"
    ],
    "explanation": "Reads cached attributes stored in state without calling cloud API.",
    "expectedOutput": "# aws_instance.web:\nresource \"aws_instance\" \"web\" {\n    ami                          = \"ami-0c55b159cbfafe1f0\"\n    arn                          = \"arn:aws:ec2:us-east-1:123456789012:instance/i-0123456789abcdef0\"\n    id                           = \"i-0123456789abcdef0\"\n    instance_type                = \"t3.medium\"\n    private_ip                   = \"10.0.1.45\"\n    public_ip                    = \"54.210.12.89\"\n}",
    "prerequisites": "Resource in state."
  },
  {
    "id": "tf-refresh-only",
    "category": "terraform",
    "categoryLabel": "Terraform",
    "title": "Reconcile State with Remote Infrastructure",
    "command": "terraform apply -refresh-only -auto-approve",
    "description": "Updates state file with out-of-band changes without modifying real-world resources.",
    "privilege": "user",
    "tags": [
      "terraform",
      "refresh",
      "drift",
      "state"
    ],
    "explanation": "Detects manual cloud console modifications.",
    "expectedOutput": "Note: Objects have changed outside of Terraform\n\nApply complete! State updated successfully.",
    "prerequisites": "Cloud credentials."
  },
  {
    "id": "tf-force-unlock",
    "category": "terraform",
    "categoryLabel": "Terraform",
    "title": "Force Unlock Deadlocked Backend State",
    "command": "terraform force-unlock -force 8a2f4c91-9e20-410a-8d77-c990a421d019",
    "description": "Clears DynamoDB or consul state lock left dangling after a crashed pipeline.",
    "privilege": "user",
    "tags": [
      "terraform",
      "unlock",
      "lock",
      "recovery"
    ],
    "explanation": "Deletes the lock entry allowing subsequent terraform runs.",
    "expectedOutput": "Terraform state has been successfully unlocked!",
    "prerequisites": "Valid Lock ID from error message."
  },
  {
    "id": "tf-output-json",
    "category": "terraform",
    "categoryLabel": "Terraform",
    "title": "Extract Declared Outputs as JSON",
    "command": "terraform output -json | jq .",
    "description": "Parses outputs for consumption by Ansible, shell scripts, or downstream CI/CD.",
    "privilege": "user",
    "tags": [
      "terraform",
      "output",
      "json",
      "automation"
    ],
    "explanation": "Exports variables defined in output blocks.",
    "expectedOutput": "{\n  \"bastion_ip\": {\n    \"sensitive\": false,\n    \"type\": \"string\",\n    \"value\": \"54.210.12.89\"\n  },\n  \"rds_endpoint\": {\n    \"sensitive\": false,\n    \"type\": \"string\",\n    \"value\": \"prod-db.c91823.us-east-1.rds.amazonaws.com\"\n  }\n}",
    "prerequisites": "Outputs declared in configuration."
  },
  {
    "id": "tf-import",
    "category": "terraform",
    "categoryLabel": "Terraform",
    "title": "Import Pre-Existing Cloud Resource Into State",
    "command": "terraform import aws_s3_bucket.media my-existing-media-bucket",
    "description": "Brings manually created cloud resources under Terraform IaC management.",
    "privilege": "user",
    "tags": [
      "terraform",
      "import",
      "iac",
      "migration"
    ],
    "explanation": "Maps real-world resource ID to HCL resource declaration.",
    "expectedOutput": "aws_s3_bucket.media: Importing from ID \"my-existing-media-bucket\"...\naws_s3_bucket.media: Import prepared!\n  Prepared aws_s3_bucket for import\naws_s3_bucket.media: Refreshing state... [id=my-existing-media-bucket]\n\nImport successful!",
    "prerequisites": "Matching HCL block in .tf file."
  },
  {
    "id": "tf-workspace",
    "category": "terraform",
    "categoryLabel": "Terraform",
    "title": "Switch or Create Isolated Environment Workspace",
    "command": "terraform workspace select production || terraform workspace new production",
    "description": "Manages separate state files for dev, staging, and production environments using same code.",
    "privilege": "user",
    "tags": [
      "terraform",
      "workspace",
      "multi-env",
      "isolation"
    ],
    "explanation": "Routes state storage to environment prefix in backend storage bucket.",
    "expectedOutput": "Switched to workspace \"production\".",
    "prerequisites": "Terraform project."
  },
  {
    "id": "aws-sts-whoami",
    "category": "aws",
    "categoryLabel": "AWS",
    "title": "Verify AWS Caller Identity & Active Account",
    "command": "aws sts get-caller-identity --output json",
    "description": "Returns AWS Account ID, IAM User / Role ARN, and User ID for current active credentials.",
    "privilege": "user",
    "tags": [
      "aws",
      "sts",
      "identity",
      "iam",
      "auth"
    ],
    "explanation": "Queries AWS Security Token Service to verify active API keys or assumed roles.",
    "expectedOutput": "{\n    \"UserId\": \"AROA123456789EXAMPLE:session-name\",\n    \"Account\": \"123456789012\",\n    \"Arn\": \"arn:aws:sts::123456789012:assumed-role/DevOpsAdmin/session-name\"\n}",
    "prerequisites": "AWS CLI configured with credentials."
  },
  {
    "id": "aws-ec2-instances",
    "category": "aws",
    "categoryLabel": "AWS",
    "title": "List EC2 Instances with Status & IP Addresses",
    "command": "aws ec2 describe-instances --query \"Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType,PrivateIpAddress,PublicIpAddress,Tags[?Key=='Name'].Value | [0]]\" --output table",
    "description": "Displays tabular summary of all EC2 instances across VPCs in current region.",
    "privilege": "user",
    "tags": [
      "aws",
      "ec2",
      "instances",
      "ips"
    ],
    "explanation": "Uses JMESPath query filter to cleanly format instance metadata.",
    "expectedOutput": "-----------------------------------------------------------------------------------------------------------------\n|                                               DescribeInstances                                               |\n+----------------------+----------+-------------+----------------+----------------+-----------------------------+\n|  i-0123456789abcdef0 |  running |  t3.medium  |  10.0.1.45     |  54.210.12.89  |  prod-portal-web-01         |\n|  i-0fedcba9876543210 |  running |  r6g.large  |  10.0.2.18     |  None          |  prod-redis-cache-01        |\n+----------------------+----------+-------------+----------------+----------------+-----------------------------+",
    "prerequisites": "ec2:DescribeInstances IAM permission."
  },
  {
    "id": "aws-s3-ls",
    "category": "aws",
    "categoryLabel": "AWS",
    "title": "List All S3 Storage Buckets in Account",
    "command": "aws s3 ls",
    "description": "Lists bucket creation timestamps and globally unique bucket names.",
    "privilege": "user",
    "tags": [
      "aws",
      "s3",
      "storage",
      "buckets"
    ],
    "explanation": "Lists all S3 buckets owned by the authenticated AWS account.",
    "expectedOutput": "2026-01-14 09:20:12 devops-tf-state-prod-bucket\n2026-03-22 14:10:05 devops-portal-static-assets\n2026-06-18 18:45:30 devops-db-nightly-backups",
    "prerequisites": "s3:ListAllMyBuckets IAM permission."
  },
  {
    "id": "aws-s3-sync",
    "category": "aws",
    "categoryLabel": "AWS",
    "title": "Synchronize Local Directory with S3 Bucket",
    "command": "aws s3 sync ./dist s3://devops-portal-static-assets/ --delete --acl private",
    "description": "Uploads new and modified files, and deletes deleted local files from the destination bucket.",
    "privilege": "user",
    "tags": [
      "aws",
      "s3",
      "sync",
      "deploy",
      "frontend"
    ],
    "explanation": "Efficient delta synchronization ideal for deploying frontend web assets.",
    "expectedOutput": "upload: dist/assets/index.js to s3://devops-portal-static-assets/assets/index.js\nupload: dist/index.html to s3://devops-portal-static-assets/index.html\ndelete: s3://devops-portal-static-assets/assets/old-bundle.js",
    "prerequisites": "s3:PutObject and s3:DeleteObject."
  },
  {
    "id": "aws-logs-tail",
    "category": "aws",
    "categoryLabel": "AWS",
    "title": "Stream CloudWatch Logs for ECS or Lambda",
    "command": "aws logs tail /aws/ecs/devops-portal --follow --format short",
    "description": "Streams live console log events from a CloudWatch log group directly to terminal.",
    "privilege": "user",
    "tags": [
      "aws",
      "cloudwatch",
      "logs",
      "stream",
      "ecs"
    ],
    "explanation": "Similar to tail -f across distributed containers logging to CloudWatch.",
    "expectedOutput": "2026-10-16T12:20:11.192Z [INFO] HTTP GET /api/auth/verify 200 OK\n2026-10-16T12:20:14.481Z [INFO] SQLite sync daemon finished 0 dirty rows",
    "prerequisites": "logs:FilterLogEvents IAM permission."
  },
  {
    "id": "aws-eks-update-kubeconfig",
    "category": "aws",
    "categoryLabel": "AWS",
    "title": "Configure Local Kubeconfig for Managed EKS Cluster",
    "command": "aws eks update-kubeconfig --region us-east-1 --name prod-cluster --alias prod-eks",
    "description": "Fetches cluster endpoint and CA certificate, configuring ~/.kube/config automatically.",
    "privilege": "user",
    "tags": [
      "aws",
      "eks",
      "kubeconfig",
      "k8s",
      "auth"
    ],
    "explanation": "Configures kubectl to authenticate against EKS using AWS IAM token generator.",
    "expectedOutput": "Added new context prod-eks to /home/kishwanth/.kube/config",
    "prerequisites": "eks:DescribeCluster permission."
  },
  {
    "id": "aws-ssm-get-params",
    "category": "aws",
    "categoryLabel": "AWS",
    "title": "Retrieve Decrypted SSM Parameter Store Secrets",
    "command": "aws ssm get-parameters-by-path --path \"/devops/prod/\" --with-decryption --query \"Parameters[*].[Name,Value]\" --output table",
    "description": "Fetches KMS-encrypted application configuration parameters and decrypts in memory.",
    "privilege": "user",
    "tags": [
      "aws",
      "ssm",
      "secrets",
      "kms",
      "env"
    ],
    "explanation": "Reads hierarchy parameters under /devops/prod/ path.",
    "expectedOutput": "-----------------------------------------------------------------------------\n|                             GetParametersByPath                            |\n+------------------------------------+---------------------------------------+\n|  /devops/prod/DATABASE_URL         |  postgres://user:secpass@db.local     |\n|  /devops/prod/JWT_SECRET           |  devops_super_secret_key_2026         |\n+------------------------------------+---------------------------------------+",
    "prerequisites": "ssm:GetParametersByPath and kms:Decrypt."
  },
  {
    "id": "aws-cloudfront-invalidate",
    "category": "aws",
    "categoryLabel": "AWS",
    "title": "Purge CloudFront CDN Edge Cache",
    "command": "aws cloudfront create-invalidation --distribution-id E12345EXAMPLE --paths \"/*\"",
    "description": "Invalidates all edge-cached files across global points of presence after deploying new web build.",
    "privilege": "user",
    "tags": [
      "aws",
      "cloudfront",
      "cdn",
      "cache",
      "invalidation"
    ],
    "explanation": "Forces CDN edge locations to fetch updated assets from the origin bucket.",
    "expectedOutput": "{\n    \"Location\": \"https://cloudfront.amazonaws.com/2020-05-31/distribution/E12345EXAMPLE/invalidation/I1234567890\",\n    \"Invalidation\": {\n        \"Id\": \"I1234567890\",\n        \"Status\": \"InProgress\",\n        \"CreateTime\": \"2026-10-16T12:22:00.000Z\"\n    }\n}",
    "prerequisites": "cloudfront:CreateInvalidation."
  },
  {
    "id": "aws-rds-describe",
    "category": "aws",
    "categoryLabel": "AWS",
    "title": "Check Managed RDS Database Status & Endpoint",
    "command": "aws rds describe-db-instances --db-instance-identifier prod-db --query \"DBInstances[*].[DBInstanceIdentifier,DBInstanceStatus,Engine,Endpoint.Address,Endpoint.Port]\" --output table",
    "description": "Displays health, engine version, DNS connection string, and port of AWS RDS instance.",
    "privilege": "user",
    "tags": [
      "aws",
      "rds",
      "database",
      "endpoint"
    ],
    "explanation": "Queries Amazon Relational Database Service API.",
    "expectedOutput": "----------------------------------------------------------------------------------------------------------------------------------------\n|                                                         DescribeDBInstances                                                          |\n+---------------------+-------------------+------------+---------------------------------------------------------------------+---------+\n|  prod-db            |  available        |  postgres  |  prod-db.c91823.us-east-1.rds.amazonaws.com                         |  5432   |\n+---------------------+-------------------+------------+---------------------------------------------------------------------+---------+",
    "prerequisites": "rds:DescribeDBInstances."
  },
  {
    "id": "aws-ecr-login",
    "category": "aws",
    "categoryLabel": "AWS",
    "title": "Authenticate Docker with AWS ECR Registry",
    "command": "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com",
    "description": "Generates ephemeral 12-hour authorization token and signs Docker client into private ECR registry.",
    "privilege": "user",
    "tags": [
      "aws",
      "ecr",
      "docker",
      "login",
      "registry"
    ],
    "explanation": "Pipes auth token safely to stdin avoiding shell history credential leaks.",
    "expectedOutput": "Login Succeeded",
    "prerequisites": "ecr:GetAuthorizationToken."
  },
  {
    "id": "az-login-device",
    "category": "azure",
    "categoryLabel": "Azure",
    "title": "Interactive Azure CLI Login via Device Code",
    "command": "az login --use-device-code",
    "description": "Authenticates developer workstation with Azure Active Directory / Entra ID using browser device flow.",
    "privilege": "user",
    "tags": [
      "azure",
      "login",
      "auth",
      "aad",
      "entra"
    ],
    "explanation": "Generates a temporary code to sign in securely from any web browser.",
    "expectedOutput": "To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code C8N2M9K3 to authenticate.",
    "prerequisites": "Azure CLI installed."
  },
  {
    "id": "az-account-show",
    "category": "azure",
    "categoryLabel": "Azure",
    "title": "Show Current Active Subscription & Tenant",
    "command": "az account show --output table",
    "description": "Verifies active subscription ID, account name, tenant ID, and user identity.",
    "privilege": "user",
    "tags": [
      "azure",
      "account",
      "subscription",
      "tenant"
    ],
    "explanation": "Ensures CLI commands are targeting the intended subscription.",
    "expectedOutput": "EnvironmentName    HomeTenantId                          Id                                    IsDefault    Name                  State\n-----------------  ------------------------------------  ------------------------------------  -----------  --------------------  -------\nAzureCloud         72f988bf-86f1-41af-91ab-2d7cd011db47  8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d  True         DevOps-Production-Sub Enabled",
    "prerequisites": "Authenticated session."
  },
  {
    "id": "az-group-list",
    "category": "azure",
    "categoryLabel": "Azure",
    "title": "List Resource Groups and Deployment Regions",
    "command": "az group list --output table",
    "description": "Lists all organizational resource groups and geographic regions in the subscription.",
    "privilege": "user",
    "tags": [
      "azure",
      "resource-group",
      "location"
    ],
    "explanation": "Queries Azure Resource Manager (ARM).",
    "expectedOutput": "Name                  Location    Status\n--------------------  ----------  ---------\nrg-devops-production  eastus2     Succeeded\nrg-network-hub        eastus2     Succeeded\nrg-monitoring-core    centralus   Succeeded",
    "prerequisites": "Reader role."
  },
  {
    "id": "az-vm-list",
    "category": "azure",
    "categoryLabel": "Azure",
    "title": "List Running Virtual Machines & Public IPs",
    "command": "az vm list --show-details --query \"[?powerState=='VM running'].[name,resourceGroup,publicIps,privateIps]\" --output table",
    "description": "Filters and displays power state, network IPs, and resource groups for active Azure VMs.",
    "privilege": "user",
    "tags": [
      "azure",
      "vm",
      "compute",
      "ips"
    ],
    "explanation": "Queries Compute resource provider for VM runtime state.",
    "expectedOutput": "Column1            Column2               Column3        Column4\n-----------------  --------------------  -------------  ----------\nvm-portal-prod-01  rg-devops-production  20.84.142.19   10.1.0.4\nvm-runner-01       rg-devops-production                 10.1.0.8",
    "prerequisites": "Virtual Machines read permissions."
  },
  {
    "id": "az-aks-get-credentials",
    "category": "azure",
    "categoryLabel": "Azure",
    "title": "Download Managed AKS Kubernetes Credentials",
    "command": "az aks get-credentials --resource-group rg-devops-production --name aks-prod-cluster --overwrite-existing",
    "description": "Merges Azure Kubernetes Service cluster credentials into ~/.kube/config.",
    "privilege": "user",
    "tags": [
      "azure",
      "aks",
      "k8s",
      "kubeconfig"
    ],
    "explanation": "Authorizes kubectl access via Azure RBAC or cluster admin credentials.",
    "expectedOutput": "Merged \"aks-prod-cluster\" as current context in /home/kishwanth/.kube/config",
    "prerequisites": "Microsoft.ContainerService/managedClusters/accessByServicePrincipal/action."
  },
  {
    "id": "az-containerapp-logs",
    "category": "azure",
    "categoryLabel": "Azure",
    "title": "Stream Container App Logs in Real-Time",
    "command": "az containerapp logs show --name devops-portal --resource-group rg-devops-production --follow",
    "description": "Streams live console log output from serverless Azure Container Apps environment.",
    "privilege": "user",
    "tags": [
      "azure",
      "containerapp",
      "serverless",
      "logs"
    ],
    "explanation": "Connects directly to Container Apps replica log stream.",
    "expectedOutput": "2026-10-16T12:24:01Z [INFO] App ready and listening on port 5000\n2026-10-16T12:24:02Z [INFO] Initialized SQLite connection: backend/data/devops_stored.sqlite",
    "prerequisites": "Container App running."
  },
  {
    "id": "az-keyvault-secret",
    "category": "azure",
    "categoryLabel": "Azure",
    "title": "Retrieve Secret from Azure Key Vault",
    "command": "az keyvault secret show --vault-name kv-devops-prod --name \"db-password\" --query value -o tsv",
    "description": "Reads plaintext value of an encrypted hardware-security-module backed secret.",
    "privilege": "user",
    "tags": [
      "azure",
      "keyvault",
      "secrets",
      "security"
    ],
    "explanation": "Retrieves secret value using Azure RBAC or Key Vault access policy.",
    "expectedOutput": "SuperSecureProdPassword2026!#",
    "prerequisites": "Key Vault Secrets User role."
  },
  {
    "id": "git-status-short",
    "category": "git-github",
    "categoryLabel": "Git & GitHub",
    "title": "Inspect Working Directory State (Short Format)",
    "command": "git status -s",
    "description": "Concise summary of staged, unstaged, and untracked repository modifications.",
    "privilege": "user",
    "tags": [
      "git",
      "status",
      "short",
      "diff"
    ],
    "explanation": "M = modified, A = added, ?? = untracked file.",
    "expectedOutput": " M frontend/src/pages/Commands.jsx\n M frontend/src/components/Navbar.jsx\n?? frontend/src/data/devopsCommands.js",
    "prerequisites": "Git repository."
  },
  {
    "id": "git-log-graph",
    "category": "git-github",
    "categoryLabel": "Git & GitHub",
    "title": "Visualize Pretty Commit Graph History",
    "command": "git log --oneline --graph --decorate -n 10",
    "description": "Renders ASCII branch branching and merge tree with short hashes and commit messages.",
    "privilege": "user",
    "tags": [
      "git",
      "log",
      "graph",
      "history"
    ],
    "explanation": "Compact overview of branch progression and merge points.",
    "expectedOutput": "* e7a89bc (HEAD -> main, origin/main) Add complete DevOps Commands suite\n* a451b02 Add folders creation tab to PDF viewer\n* 93b218f Enhance dark mode switcher pill icon\n* 482e1aa Enforce username password authentication gate",
    "prerequisites": "Git repo."
  },
  {
    "id": "git-checkout-b",
    "category": "git-github",
    "categoryLabel": "Git & GitHub",
    "title": "Create and Switch to New Feature Branch",
    "command": "git checkout -b feature/devops-commands-hub",
    "description": "Creates a new branch pointing to current commit and switches the working tree to it.",
    "privilege": "user",
    "tags": [
      "git",
      "branch",
      "checkout",
      "feature"
    ],
    "explanation": "Modern git alternative: git switch -c feature/devops-commands-hub.",
    "expectedOutput": "Switched to a new branch 'feature/devops-commands-hub'",
    "prerequisites": "Clean or dirty working tree."
  },
  {
    "id": "git-rebase-interactive",
    "category": "git-github",
    "categoryLabel": "Git & GitHub",
    "title": "Interactive Rebase to Squash and Clean Commits",
    "command": "git rebase -i HEAD~3",
    "description": "Opens editor to squash, reword, edit, or drop the last 3 commits before merging.",
    "privilege": "user",
    "tags": [
      "git",
      "rebase",
      "squash",
      "history-rewrite"
    ],
    "explanation": "Standard DevOps hygiene for producing clean linear git histories.",
    "expectedOutput": "[detached HEAD 8a9b0c1] feat: Add commands catalog and cheat-sheet\n Successfully rebased and updated refs/heads/main.",
    "prerequisites": "Unpushed local commits."
  },
  {
    "id": "git-stash-save",
    "category": "git-github",
    "categoryLabel": "Git & GitHub",
    "title": "Stash Uncommitted Changes with Descriptive Message",
    "command": "git stash save \"WIP: dark mode icon updates\"",
    "description": "Saves dirty working directory and staged index into stash stack and reverts to HEAD.",
    "privilege": "user",
    "tags": [
      "git",
      "stash",
      "wip",
      "save"
    ],
    "explanation": "Allows switching branches cleanly without discarding uncommitted work.",
    "expectedOutput": "Saved working directory and index state On main: WIP: dark mode icon updates\nHEAD is now at e7a89bc Add complete DevOps Commands suite",
    "prerequisites": "Modified tracked files."
  },
  {
    "id": "git-stash-pop",
    "category": "git-github",
    "categoryLabel": "Git & GitHub",
    "title": "Re-Apply Stashed Changes and Drop from Stack",
    "command": "git stash pop",
    "description": "Restores the most recently stashed changes back onto the current working branch.",
    "privilege": "user",
    "tags": [
      "git",
      "stash",
      "pop",
      "restore"
    ],
    "explanation": "Applies diff and removes entry from git stash list.",
    "expectedOutput": "On branch feature/devops-commands-hub\nChanges not staged for commit:\n  modified:   frontend/src/components/Navbar.jsx\nDropped refs/stash@{0} (8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b)",
    "prerequisites": "Non-empty stash stack."
  },
  {
    "id": "git-reset-soft",
    "category": "git-github",
    "categoryLabel": "Git & GitHub",
    "title": "Undo Last Commit Keeping Changes Staged",
    "command": "git reset --soft HEAD~1",
    "description": "Moves HEAD back 1 commit while leaving all code modifications staged in index.",
    "privilege": "user",
    "tags": [
      "git",
      "reset",
      "soft",
      "undo"
    ],
    "explanation": "Ideal when you committed too early or forgot to include an edited file.",
    "expectedOutput": "(HEAD detached at e7a89bc, changes staged for commit)",
    "prerequisites": "At least one commit on branch."
  },
  {
    "id": "git-reset-hard-origin",
    "category": "git-github",
    "categoryLabel": "Git & GitHub",
    "title": "Discard All Local Changes & Align to Origin Main",
    "command": "git fetch origin && git reset --hard origin/main",
    "description": "Nuclear reset: aligns local branch exactly with remote origin, erasing local work.",
    "privilege": "user",
    "tags": [
      "git",
      "reset",
      "hard",
      "sync"
    ],
    "explanation": "Overwrites working tree and staged index with remote tree.",
    "expectedOutput": "HEAD is now at e7a89bc Add complete DevOps Commands suite",
    "prerequisites": "Caution: permanently discards uncommitted work."
  },
  {
    "id": "git-cherry-pick",
    "category": "git-github",
    "categoryLabel": "Git & GitHub",
    "title": "Cherry-Pick Specific Commit onto Current Branch",
    "command": "git cherry-pick a451b02",
    "description": "Applies the exact diff introduced by a specific commit hash onto current branch.",
    "privilege": "user",
    "tags": [
      "git",
      "cherry-pick",
      "hotfix",
      "merge"
    ],
    "explanation": "Great for porting critical hotfixes from dev to release branches.",
    "expectedOutput": "[main 9f8e7d6] Add folders creation tab to PDF viewer\n Author: kishwanth <aderukishu@gmail.com>\n 2 files changed, 142 insertions(+), 8 deletions(-)",
    "prerequisites": "Valid commit hash."
  },
  {
    "id": "git-diff-branches",
    "category": "git-github",
    "categoryLabel": "Git & GitHub",
    "title": "Show File Differences Between Branches",
    "command": "git diff --stat main...feature/devops-commands-hub",
    "description": "Summary of file modifications and line additions/deletions since branch divergence.",
    "privilege": "user",
    "tags": [
      "git",
      "diff",
      "stat",
      "branches"
    ],
    "explanation": "Uses triple-dot syntax to compare from common merge base.",
    "expectedOutput": " frontend/src/data/devopsCommands.js | 450 ++++++++++++++++++++++++++++++++++\n frontend/src/pages/Commands.jsx     |  85 ++++---\n 2 files changed, 502 insertions(+), 33 deletions(-)",
    "prerequisites": "Two branches."
  },
  {
    "id": "gh-pr-create",
    "category": "git-github",
    "categoryLabel": "Git & GitHub",
    "title": "Create Pull Request via GitHub CLI",
    "command": "gh pr create --title \"feat: Add full DevOps commands hub\" --body \"Implements all 40 categories from cheatsheet\" --base main",
    "description": "Dispatches PR creation directly from terminal without navigating to GitHub web UI.",
    "privilege": "user",
    "tags": [
      "github",
      "gh",
      "pr",
      "pull-request"
    ],
    "explanation": "Pushes branch and creates pull request against default target branch.",
    "expectedOutput": "https://github.com/organization/devops-portal/pull/42",
    "prerequisites": "Committed and pushed branch."
  },
  {
    "id": "gh-pr-merge",
    "category": "git-github",
    "categoryLabel": "Git & GitHub",
    "title": "Squash & Merge Pull Request via CLI",
    "command": "gh pr merge 42 --squash --delete-branch --admin",
    "description": "Merges PR into target branch as a single clean commit and deletes remote branch.",
    "privilege": "user",
    "tags": [
      "github",
      "gh",
      "merge",
      "squash"
    ],
    "explanation": "Executes GitHub merge API with branch deletion.",
    "expectedOutput": "✓ Squashed and merged pull request #42 (feat: Add full DevOps commands hub)\n✓ Deleted branch feature/devops-commands-hub on remote",
    "prerequisites": "Authorized user."
  },
  {
    "id": "gitlab-ci-lint",
    "category": "gitlab-ci",
    "categoryLabel": "GitLab CI/CD",
    "title": "Validate .gitlab-ci.yml Pipeline Configuration",
    "command": "glab ci lint .gitlab-ci.yml",
    "description": "Verifies YAML syntax and schema validity of GitLab pipeline against server API.",
    "privilege": "user",
    "tags": [
      "gitlab",
      "ci-cd",
      "lint",
      "validate"
    ],
    "explanation": "Queries the GitLab CI Lint API endpoint.",
    "expectedOutput": "✓ CI/CD YAML is valid!",
    "prerequisites": "glab CLI authenticated."
  },
  {
    "id": "glab-ci-run",
    "category": "gitlab-ci",
    "categoryLabel": "GitLab CI/CD",
    "title": "Trigger Pipeline Run with Custom Variables",
    "command": "glab ci run -b main --variables DEPLOY_ENV:production,NOTIFY_SLACK:true",
    "description": "Triggers a manual pipeline execution on a specific branch with environment parameters.",
    "privilege": "user",
    "tags": [
      "gitlab",
      "ci",
      "pipeline",
      "trigger"
    ],
    "explanation": "Creates a new pipeline instance on the GitLab server.",
    "expectedOutput": "Created pipeline (id: 4892102) on branch 'main'\nWeb URL: https://gitlab.com/org/devops-portal/-/pipelines/4892102",
    "prerequisites": "GitLab repository."
  },
  {
    "id": "glab-ci-status",
    "category": "gitlab-ci",
    "categoryLabel": "GitLab CI/CD",
    "title": "View Current Pipeline Status & Jobs",
    "command": "glab ci status",
    "description": "Shows status, stages, and execution time of the most recent pipeline.",
    "privilege": "user",
    "tags": [
      "gitlab",
      "status",
      "stages",
      "jobs"
    ],
    "explanation": "Displays stages: build, test, package, and deploy.",
    "expectedOutput": "Pipeline #4892102: running\nStages:\n  - build: (passed)\n  - test: (passed)\n  - deploy: (running 1m 14s)",
    "prerequisites": "glab."
  },
  {
    "id": "glab-ci-trace",
    "category": "gitlab-ci",
    "categoryLabel": "GitLab CI/CD",
    "title": "View Pipeline Job Console Output Logs",
    "command": "glab ci trace 891204",
    "description": "Streams raw console logs from a specific runner job ID.",
    "privilege": "user",
    "tags": [
      "gitlab",
      "trace",
      "logs",
      "runner"
    ],
    "explanation": "Displays output from runner container during script block execution.",
    "expectedOutput": "Running with gitlab-runner 16.10.0\nExecuting \"step_script\" stage of the job script...\n$ npm test\n PASS  src/__tests__/auth.test.js\nJob succeeded",
    "prerequisites": "Job ID."
  },
  {
    "id": "glab-ci-retry",
    "category": "gitlab-ci",
    "categoryLabel": "GitLab CI/CD",
    "title": "Retry Failed Pipeline Job",
    "command": "glab ci retry 891204",
    "description": "Re-queues a failed or canceled job in an existing pipeline without rerunning the whole pipeline.",
    "privilege": "user",
    "tags": [
      "gitlab",
      "retry",
      "rerun",
      "job"
    ],
    "explanation": "Saves build time on flaky test runs.",
    "expectedOutput": "Retried job 891204\nNew Job ID: 891240",
    "prerequisites": "Failed job ID."
  },
  {
    "id": "gitlab-runner-list",
    "category": "gitlab-ci",
    "categoryLabel": "GitLab CI/CD",
    "title": "List Configured GitLab Runners on Host",
    "command": "sudo gitlab-runner list",
    "description": "Displays installed CI runners, executor types (docker, shell), and server URLs.",
    "privilege": "sudo",
    "tags": [
      "gitlab",
      "runner",
      "daemon",
      "config"
    ],
    "explanation": "Reads /etc/gitlab-runner/config.toml.",
    "expectedOutput": "Listing configured runners          ConfigFile=/etc/gitlab-runner/config.toml\nprod-docker-runner                  Executor=docker Token=glrt-xxxxxxxx URL=https://gitlab.com/",
    "prerequisites": "gitlab-runner installed."
  },
  {
    "id": "gitlab-runner-verify",
    "category": "gitlab-ci",
    "categoryLabel": "GitLab CI/CD",
    "title": "Verify Runner Registration & Connectivity",
    "command": "sudo gitlab-runner verify",
    "description": "Tests if configured runners can contact the GitLab coordinator and token remains valid.",
    "privilege": "sudo",
    "tags": [
      "gitlab",
      "runner",
      "verify",
      "health"
    ],
    "explanation": "Validates runner communication with remote GitLab API.",
    "expectedOutput": "Verifying runner... is alive            runner=glrt-xxxxxxxx",
    "prerequisites": "gitlab-runner."
  },
  {
    "id": "gitlab-runner-register",
    "category": "gitlab-ci",
    "categoryLabel": "GitLab CI/CD",
    "title": "Register New Docker Executor Runner",
    "command": "sudo gitlab-runner register --non-interactive --url \"https://gitlab.com/\" --registration-token \"TOKEN\" --executor \"docker\" --docker-image \"docker:stable\" --description \"devops-shared-runner\"",
    "description": "Automates runner registration without interactive CLI prompts.",
    "privilege": "sudo",
    "tags": [
      "gitlab",
      "runner",
      "register",
      "automation"
    ],
    "explanation": "Appends new runner configuration block to config.toml.",
    "expectedOutput": "Runner registered successfully. Feel free to start it, but if it's running already the config should be reloaded automatically!",
    "prerequisites": "Registration token from GitLab project/group settings."
  },
  {
    "id": "jenkins-service-status",
    "category": "jenkins",
    "categoryLabel": "Jenkins",
    "title": "Check Jenkins Master Systemd Service Status",
    "command": "sudo systemctl status jenkins",
    "description": "Displays daemon state, active PID, JVM memory consumption, and uptime.",
    "privilege": "sudo",
    "tags": [
      "jenkins",
      "systemd",
      "service",
      "status"
    ],
    "explanation": "Queries systemd unit for Jenkins controller.",
    "expectedOutput": "● jenkins.service - Jenkins Continuous Integration Server\n     Loaded: loaded (/usr/lib/systemd/system/jenkins.service; enabled; preset: enabled)\n     Active: active (running) since Wed 2026-10-15 08:00:12 UTC; 1 day 4h ago\n   Main PID: 1420 (java)",
    "prerequisites": "Jenkins server."
  },
  {
    "id": "jenkins-journalctl-logs",
    "category": "jenkins",
    "categoryLabel": "Jenkins",
    "title": "Tail Live Jenkins Controller Logs",
    "command": "sudo journalctl -u jenkins -f --lines=50",
    "description": "Streams stdout and stderr from the Java JVM hosting Jenkins.",
    "privilege": "sudo",
    "tags": [
      "jenkins",
      "logs",
      "journalctl",
      "debug"
    ],
    "explanation": "Essential for diagnosing failed plugin loads and startup issues.",
    "expectedOutput": "Oct 16 12:00:10 srv jenkins[1420]: INFO: Completed build #142 for job deploy-production\nOct 16 12:01:00 srv jenkins[1420]: INFO: Checking for software updates",
    "prerequisites": "Systemd host."
  },
  {
    "id": "jenkins-curl-build",
    "category": "jenkins",
    "categoryLabel": "Jenkins",
    "title": "Trigger Parameterized Build via REST API & Token",
    "command": "curl -X POST -u \"admin:11a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2\" \"http://localhost:8080/job/deploy-prod/buildWithParameters?BRANCH=main&RELEASE_TAG=v2.4.0\"",
    "description": "Dispatches a parameterized pipeline run using basic auth with API token.",
    "privilege": "user",
    "tags": [
      "jenkins",
      "curl",
      "api",
      "webhook",
      "build"
    ],
    "explanation": "Uses Jenkins REST endpoint to initiate builds programmatically.",
    "expectedOutput": "HTTP/1.1 201 Created\nLocation: http://localhost:8080/queue/item/42/",
    "prerequisites": "API Token generated in Jenkins user profile."
  },
  {
    "id": "jenkins-safe-restart",
    "category": "jenkins",
    "categoryLabel": "Jenkins",
    "title": "Perform Safe Restart Waiting for Jobs to Finish",
    "command": "curl -X POST -u \"admin:API_TOKEN\" \"http://localhost:8080/safeRestart\"",
    "description": "Allows currently executing jobs to finish gracefully before bouncing the JVM.",
    "privilege": "user",
    "tags": [
      "jenkins",
      "safeRestart",
      "restart",
      "admin"
    ],
    "explanation": "Prevents aborting in-flight deployments while updating configuration or plugins.",
    "expectedOutput": "HTTP/1.1 302 Found\nLocation: http://localhost:8080/",
    "prerequisites": "Admin privileges."
  },
  {
    "id": "jenkins-cli-install-plugin",
    "category": "jenkins",
    "categoryLabel": "Jenkins",
    "title": "Install Plugins via Official Jenkins CLI Jar",
    "command": "java -jar jenkins-cli.jar -s http://localhost:8080/ -auth admin:API_TOKEN install-plugin git docker-workflow kubernetes --restart",
    "description": "Installs multiple plugins with dependencies and reboots controller.",
    "privilege": "user",
    "tags": [
      "jenkins",
      "plugins",
      "cli",
      "automation"
    ],
    "explanation": "Automates Jenkins configuration as code plugin provisioning.",
    "expectedOutput": "Installing git (5.2.1)...\nInstalling docker-workflow (572.v730f8a_d...)\nInstalling kubernetes (4214.v...)\nRestarting Jenkins...",
    "prerequisites": "jenkins-cli.jar downloaded from http://<jenkins-url>/jnlpJars/jenkins-cli.jar."
  },
  {
    "id": "jenkins-cli-version",
    "category": "jenkins",
    "categoryLabel": "Jenkins",
    "title": "Query Jenkins Controller Version via CLI",
    "command": "java -jar jenkins-cli.jar -s http://localhost:8080/ -auth admin:API_TOKEN version",
    "description": "Checks running Jenkins version.",
    "privilege": "user",
    "tags": [
      "jenkins",
      "version",
      "cli"
    ],
    "explanation": "Verifies CLI connectivity and server compatibility.",
    "expectedOutput": "2.452.1",
    "prerequisites": "jenkins-cli.jar."
  },
  {
    "id": "jenkins-backup-home",
    "category": "jenkins",
    "categoryLabel": "Jenkins",
    "title": "Create Compressed Backup of Jenkins Home Directory",
    "command": "sudo tar -czvf /backup/jenkins-home-$(date +%F).tar.gz --exclude=\"/var/lib/jenkins/workspace\" /var/lib/jenkins",
    "description": "Backs up job configurations, user data, and credentials while excluding heavy build workspaces.",
    "privilege": "sudo",
    "tags": [
      "jenkins",
      "backup",
      "tar",
      "disaster-recovery"
    ],
    "explanation": "Preserves critical XML job definitions and encryption secrets for fast restore.",
    "expectedOutput": "/var/lib/jenkins/config.xml\n/var/lib/jenkins/secrets/\n/var/lib/jenkins/jobs/\nBackup completed: /backup/jenkins-home-2026-10-16.tar.gz (45MB)",
    "prerequisites": "Root access."
  },
  {
    "id": "jenkins-initial-admin-password",
    "category": "jenkins",
    "categoryLabel": "Jenkins",
    "title": "Retrieve Initial Setup Admin Password",
    "command": "sudo cat /var/lib/jenkins/secrets/initialAdminPassword",
    "description": "Reads the one-time generated hexadecimal master password after fresh Jenkins installation.",
    "privilege": "sudo",
    "tags": [
      "jenkins",
      "password",
      "setup",
      "initial"
    ],
    "explanation": "Required to unlock the Jenkins setup wizard.",
    "expectedOutput": "4f8e9a2b1c3d4e5f6a7b8c9d0e1f2a3b",
    "prerequisites": "Fresh Jenkins install."
  },
  {
    "id": "ansible-ping-all",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "title": "Test SSH Connectivity & Python on All Inventory Hosts",
    "command": "ansible all -i hosts.ini -m ping",
    "description": "Validates that SSH keys work and remote targets have a compatible Python interpreter.",
    "privilege": "user",
    "tags": [
      "ansible",
      "ping",
      "inventory",
      "connectivity"
    ],
    "explanation": "Not an ICMP ping; executes the Ansible ping module over SSH.",
    "expectedOutput": "web-01 | SUCCESS => {\n    \"changed\": false,\n    \"ping\": \"pong\"\n}\ndb-01  | SUCCESS => {\n    \"changed\": false,\n    \"ping\": \"pong\"\n}",
    "prerequisites": "SSH access and inventory file."
  },
  {
    "id": "ansible-adhoc-command",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "title": "Execute Ad-Hoc Shell Command Across Webservers",
    "command": "ansible webservers -i hosts.ini -m shell -a \"uptime && free -h\"",
    "description": "Runs one-line command simultaneously across all nodes in the webservers group.",
    "privilege": "user",
    "tags": [
      "ansible",
      "ad-hoc",
      "shell",
      "fleet"
    ],
    "explanation": "Leverages SSH multiplexing to execute tasks in parallel.",
    "expectedOutput": "web-01 | CHANGED | rc=0 >>\n 12:30:01 up 42 days,  load average: 0.12, 0.18, 0.14\n               total        used        free\nMem:           7.7Gi       1.4Gi       4.8Gi",
    "prerequisites": "Configured inventory."
  },
  {
    "id": "ansible-syntax-check",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "title": "Verify Playbook YAML Syntax Without Running",
    "command": "ansible-playbook -i hosts.ini site.yml --syntax-check",
    "description": "Parses playbook, roles, and task files for indentation or syntax errors.",
    "privilege": "user",
    "tags": [
      "ansible",
      "playbook",
      "syntax-check",
      "lint"
    ],
    "explanation": "Static validation step for CI/CD pipelines before execution.",
    "expectedOutput": "playbook: site.yml",
    "prerequisites": "Ansible playbook."
  },
  {
    "id": "ansible-check-diff",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "title": "Dry-Run Playbook with Configuration Diff Preview",
    "command": "ansible-playbook -i hosts.ini site.yml --check --diff",
    "description": "Simulates execution without altering remote state, showing precise before/after file diffs.",
    "privilege": "user",
    "tags": [
      "ansible",
      "check",
      "diff",
      "dry-run"
    ],
    "explanation": "Crucial for assessing production impact before applying changes.",
    "expectedOutput": "--- before: /etc/nginx/nginx.conf\n+++ after: /etc/nginx/nginx.conf\n@@ -20,3 +20,4 @@\n     gzip on;\n+    keepalive_timeout 65;\n\nPLAY RECAP *************************************************************\nweb-01 : ok=5  changed=1  unreachable=0  failed=0",
    "prerequisites": "Playbook."
  },
  {
    "id": "ansible-playbook-tags",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "title": "Run Specific Tasks Matching Tags",
    "command": "ansible-playbook -i hosts.ini site.yml --tags \"nginx,ssl\" --limit \"production\"",
    "description": "Executes only tasks annotated with nginx or ssl tags against production hosts.",
    "privilege": "user",
    "tags": [
      "ansible",
      "tags",
      "limit",
      "playbook"
    ],
    "explanation": "Skips long-running baseline provisioning when only deploying config updates.",
    "expectedOutput": "TASK [nginx : Ensure Nginx is running] *********************************\nok: [web-01]\n\nTASK [nginx : Reload Nginx service] ************************************\nchanged: [web-01]\n\nPLAY RECAP *************************************************************\nweb-01 : ok=2  changed=1",
    "prerequisites": "Tagged playbook tasks."
  },
  {
    "id": "ansible-vault-encrypt",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "title": "Encrypt Sensitive Variables with Ansible Vault",
    "command": "ansible-vault encrypt group_vars/production/vault.yml",
    "description": "Encrypts YAML file using AES-256 so secrets can be committed safely to Git.",
    "privilege": "user",
    "tags": [
      "ansible",
      "vault",
      "encryption",
      "security"
    ],
    "explanation": "Prompts for vault password and replaces file content with encrypted cipher block.",
    "expectedOutput": "New Vault password: \nConfirm Vault password: \nEncryption successful",
    "prerequisites": "ansible-vault CLI."
  },
  {
    "id": "ansible-vault-view",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "title": "View Decrypted Vault Contents in Terminal",
    "command": "ansible-vault view group_vars/production/vault.yml",
    "description": "Decrypts and displays file in pager/terminal without writing plaintext to disk.",
    "privilege": "user",
    "tags": [
      "ansible",
      "vault",
      "view",
      "secrets"
    ],
    "explanation": "Decrypts in memory using provided vault password.",
    "expectedOutput": "vault_db_password: \"ProdSecretDBPassword2026!\"\nvault_api_key: \"ak_live_891204812\"",
    "prerequisites": "Encrypted vault file and password."
  }
];
