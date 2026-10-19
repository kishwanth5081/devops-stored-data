import { CLOUD_DEVOPS_COMMANDS } from './categories/cloudDevops.js';
import { WEB_LINUX_CORE_COMMANDS } from './categories/webLinuxCore.js';
import { SYSTEMS_OPS_COMMANDS } from './categories/systemsOps.js';

export const DEVOPS_CATEGORIES = [
  // Special views
  { id: 'all', label: 'All Commands', group: 'All' },
  { id: 'custom', label: 'Custom User Commands', group: 'Custom' },

  // Screenshot 1: Cloud & DevOps Tools (1-13)
  { id: 'github-actions', label: 'GitHub Actions', group: 'Cloud & CI/CD' },
  { id: 'helm', label: 'Helm', group: 'Cloud & CI/CD' },
  { id: 'linux-core', label: 'Linux', group: 'Linux Administration' },
  { id: 'docker', label: 'Docker', group: 'Containers & Cloud' },
  { id: 'docker-compose', label: 'Docker Compose', group: 'Containers & Cloud' },
  { id: 'kubernetes', label: 'Kubernetes', group: 'Containers & Cloud' },
  { id: 'terraform', label: 'Terraform', group: 'Infrastructure as Code' },
  { id: 'aws', label: 'AWS', group: 'Cloud Providers' },
  { id: 'azure', label: 'Azure', group: 'Cloud Providers' },
  { id: 'git-github', label: 'Git & GitHub', group: 'Version Control & CI/CD' },
  { id: 'gitlab-ci', label: 'GitLab CI/CD', group: 'Version Control & CI/CD' },
  { id: 'jenkins', label: 'Jenkins', group: 'Version Control & CI/CD' },
  { id: 'ansible', label: 'Ansible', group: 'Infrastructure as Code' },

  // Screenshot 2: Web, Monitoring & Linux Essentials (14-26)
  { id: 'nginx', label: 'Nginx', group: 'Web & Reverse Proxy' },
  { id: 'networking-dns', label: 'Networking & DNS', group: 'Networking' },
  { id: 'ssl-tls', label: 'SSL/TLS & Cloud...', group: 'Security & Certs' },
  { id: 'prometheus-grafana', label: 'Prometheus & Gr...', group: 'Monitoring & Observability' },
  { id: 'security-troubleshooting', label: 'Security & Troubl...', group: 'Security & Hardening' },
  { id: 'postgresql-databases', label: 'PostgreSQL & Da...', group: 'Databases & Storage' },
  { id: 'scripting-automation', label: 'Scripting & Auto...', group: 'Automation' },
  { id: 'basic-commands', label: 'Basic Commands', group: 'Linux Core' },
  { id: 'files-directories', label: 'Files and Direct...', group: 'Linux Core' },
  { id: 'read-edit-files', label: 'Read and Edit Fi...', group: 'Linux Core' },
  { id: 'search-text', label: 'Search and Text...', group: 'Linux Core' },
  { id: 'permissions-ownership', label: 'Permissions an...', group: 'Linux Security' },
  { id: 'users-groups', label: 'Users and Groups', group: 'Linux Administration' },

  // Screenshot 3: Systems, Network & Ops (27-40)
  { id: 'processes', label: 'Processes', group: 'Linux Systems' },
  { id: 'services-systemd', label: 'Services and Systemd', group: 'Linux Administration' },
  { id: 'disk-storage', label: 'Disk and Storage', group: 'Linux Systems' },
  { id: 'networking', label: 'Networking', group: 'Networking' },
  { id: 'ssh-file-transfer', label: 'SSH and File Transfer', group: 'Remote Access & Transfer' },
  { id: 'package-mgmt-apt', label: 'Package Management: ...', group: 'Package Managers' }, // APT
  { id: 'package-mgmt-yum', label: 'Package Management: ...', group: 'Package Managers' }, // YUM
  { id: 'archives-compression', label: 'Archives and Compre...', group: 'Linux Core' },
  { id: 'environment-shell', label: 'Environment and Shell', group: 'Linux Core' },
  { id: 'scheduling-automation', label: 'Scheduling and Autom...', group: 'Automation' },
  { id: 'system-information', label: 'System Information', group: 'Linux Systems' },
  { id: 'firewall-security', label: 'Firewall and Security', group: 'Linux Security' },
  { id: 'bash-scripting', label: 'Bash Scripting', group: 'Automation' },
  { id: 'useful-troubleshooting', label: 'Useful DevOps Troubl...', group: 'Troubleshooting' }
];

export const ALL_BUILTIN_COMMANDS = [
  ...CLOUD_DEVOPS_COMMANDS,
  ...WEB_LINUX_CORE_COMMANDS,
  ...SYSTEMS_OPS_COMMANDS
];
