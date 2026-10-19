import React, { useState, useMemo, useRef } from 'react';
import { 
  Boxes, 
  Search, 
  Terminal, 
  Layers, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Server, 
  Cloud, 
  Database, 
  Activity, 
  GitBranch, 
  Lock, 
  Flame,
  FileCode,
  X,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import { ALL_BUILTIN_COMMANDS } from '../data/devopsCommands';

export const TECHNOLOGIES_CATALOG = [
  // Containers & Orchestration
  {
    id: 'kubernetes',
    name: 'Kubernetes (K8s)',
    category: 'Containers & Orchestration',
    categoryKey: 'containers',
    status: 'Core Production',
    version: 'v1.30.x',
    description: 'Enterprise container orchestration for automated deployment, scaling, service discovery, and management of containerized workloads.',
    role: 'Primary Microservices Orchestration Layer',
    icon: Boxes,
    color: 'from-blue-500 to-indigo-600',
    tags: ['Deployment', 'StatefulSet', 'Ingress', 'HPA', 'RBAC'],
    commandsCount: 18,
    pocsCount: 3,
    bestPractice: 'Always define explicit CPU/Memory resource limits and liveness/readiness probes on all containers.',
    quickCommand: 'kubectl get pods -A -o wide --field-selector=status.phase=Running'
  },
  {
    id: 'docker',
    name: 'Docker & Buildx',
    category: 'Containers & Orchestration',
    categoryKey: 'containers',
    status: 'Core Production',
    version: 'v27.x',
    description: 'Standard container runtime and multi-stage image builder facilitating immutable artifacts and isolated application environments.',
    role: 'Application Packaging & Containerization',
    icon: Server,
    color: 'from-cyan-500 to-blue-600',
    tags: ['Multi-Stage', 'BuildKit', 'Namespaces', 'Rootless'],
    commandsCount: 20,
    pocsCount: 4,
    bestPractice: 'Use distroless or minimal alpine base images to minimize attack surface and image size.',
    quickCommand: 'docker system prune -af --volumes'
  },
  {
    id: 'helm',
    name: 'Helm Package Manager',
    category: 'Containers & Orchestration',
    categoryKey: 'containers',
    status: 'Core Production',
    version: 'v3.15.x',
    description: 'The package manager for Kubernetes providing parameterizable templates, versioned releases, and lifecycle rollbacks.',
    role: 'Kubernetes Application Packaging',
    icon: Layers,
    color: 'from-sky-500 to-cyan-600',
    tags: ['Charts', 'Templates', 'Values', 'Rollbacks'],
    commandsCount: 12,
    pocsCount: 2,
    bestPractice: 'Maintain values.yaml overlays per environment (dev, staging, prod) rather than duplicating charts.',
    quickCommand: 'helm list -A --all-namespaces'
  },
  {
    id: 'docker-compose',
    name: 'Docker Compose',
    category: 'Containers & Orchestration',
    categoryKey: 'containers',
    status: 'In Production',
    version: 'v2.29.x',
    description: 'Declarative multi-container orchestration tool defining services, networks, and persistent storage volumes in single YAML specs.',
    role: 'Local Dev Environments & Single-Node Stacks',
    icon: Boxes,
    color: 'from-blue-600 to-cyan-500',
    tags: ['YAML Spec', 'Networks', 'Volumes', 'Healthchecks'],
    commandsCount: 12,
    pocsCount: 2,
    bestPractice: 'Utilize project environment files (.env) and explicit network segmentation.',
    quickCommand: 'docker compose -f docker-compose.yml up -d --build'
  },

  // Infrastructure as Code & Cloud
  {
    id: 'terraform',
    name: 'Terraform & OpenTofu',
    category: 'Cloud & Infrastructure as Code',
    categoryKey: 'cloud-iac',
    status: 'Core Production',
    version: 'v1.9.x',
    description: 'Declarative Infrastructure as Code (IaC) tool for provisioning, modifying, and versioning cloud resources predictably.',
    role: 'Multi-Cloud Infrastructure Provisioning',
    icon: Cpu,
    color: 'from-purple-500 to-indigo-600',
    tags: ['HCL', 'State Locking', 'Modules', 'Drift Detection'],
    commandsCount: 18,
    pocsCount: 3,
    bestPractice: 'Store tfstate remotely in Amazon S3 or Azure Blob with strict DynamoDB state locking enabled.',
    quickCommand: 'terraform plan -out=tfplan.binary && terraform apply tfplan.binary'
  },
  {
    id: 'aws',
    name: 'Amazon Web Services (AWS)',
    category: 'Cloud & Infrastructure as Code',
    categoryKey: 'cloud-iac',
    status: 'Core Production',
    version: 'AWS CLI v2',
    description: 'Global cloud provider powering compute, managed Kubernetes (EKS), object storage (S3), and scalable cloud infrastructure.',
    role: 'Primary Cloud Infrastructure & Object Store',
    icon: Cloud,
    color: 'from-amber-500 to-orange-600',
    tags: ['EKS', 'S3', 'IAM', 'VPC', 'CloudWatch'],
    commandsCount: 24,
    pocsCount: 2,
    bestPractice: 'Enforce Least Privilege IAM roles with temporary STS tokens instead of static long-lived credentials.',
    quickCommand: 'aws sts get-caller-identity && aws s3 ls'
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    category: 'Cloud & Infrastructure as Code',
    categoryKey: 'cloud-iac',
    status: 'In Production',
    version: 'Azure CLI v2',
    description: 'Enterprise cloud services offering Azure Kubernetes Service (AKS), Azure Blob Storage, and integrated Azure Active Directory.',
    role: 'Secondary Cloud & Enterprise Identity Provider',
    icon: Cloud,
    color: 'from-blue-500 to-cyan-600',
    tags: ['AKS', 'Entra ID', 'Blob Storage', 'Virtual Network'],
    commandsCount: 16,
    pocsCount: 1,
    bestPractice: 'Use Managed Identities for AKS and VMs to eliminate password secrets in code.',
    quickCommand: 'az account show --output table'
  },
  {
    id: 'ansible',
    name: 'Ansible Automation',
    category: 'Cloud & Infrastructure as Code',
    categoryKey: 'cloud-iac',
    status: 'In Production',
    version: 'v9.x',
    description: 'Agentless configuration management and provisioning engine utilizing SSH and declarative YAML playbooks.',
    role: 'OS Hardening, Server Configuration & Provisioning',
    icon: FileCode,
    color: 'from-red-500 to-rose-600',
    tags: ['Playbooks', 'Idempotency', 'SSH Keys', 'Ansible Vault'],
    commandsCount: 14,
    pocsCount: 2,
    bestPractice: 'Encrypt sensitive variables, tokens, and private keys using Ansible Vault.',
    quickCommand: 'ansible-playbook -i inventory.ini site.yml --syntax-check'
  },

  // CI/CD & Version Control
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    category: 'CI/CD & Version Control',
    categoryKey: 'cicd',
    status: 'Core Production',
    version: 'Enterprise',
    description: 'Cloud and self-hosted CI/CD automation runner executing build, test, security scans, and deployment pipelines on Git events.',
    role: 'Automated Build, Test & Deployment Engine',
    icon: GitBranch,
    color: 'from-cyan-500 to-emerald-600',
    tags: ['workflow_dispatch', 'Matrix Builds', 'OIDC', 'Secrets'],
    commandsCount: 15,
    pocsCount: 3,
    bestPractice: 'Use OpenID Connect (OIDC) to authenticate directly to AWS/Azure without long-lived credentials.',
    quickCommand: 'gh workflow run deploy.yml -f environment=production -f release_tag=v2.4.0'
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    category: 'CI/CD & Version Control',
    categoryKey: 'cicd',
    status: 'Fundamental',
    version: 'v2.46.x',
    description: 'Distributed version control system managing codebase integrity, trunk-based development, branching, and cryptographic commit history.',
    role: 'Source Code Management & Versioning',
    icon: GitBranch,
    color: 'from-orange-500 to-red-600',
    tags: ['Trunk-Based', 'Cherry-Pick', 'Rebase', 'GPG Signing'],
    commandsCount: 22,
    pocsCount: 5,
    bestPractice: 'Sign commits with GPG/SSH keys and require branch protection rules on main/production branches.',
    quickCommand: 'git log --graph --oneline --decorate --all -n 10'
  },
  {
    id: 'gitlab-ci',
    name: 'GitLab CI/CD',
    category: 'CI/CD & Version Control',
    categoryKey: 'cicd',
    status: 'In Production',
    version: 'v17.x',
    description: 'Integrated DevOps lifecycle platform providing container registries, pipeline DAGs, and Kubernetes cluster integrations.',
    role: 'Alternative CI/CD & Registry Solution',
    icon: GitBranch,
    color: 'from-orange-600 to-amber-500',
    tags: ['.gitlab-ci.yml', 'Runners', 'Artifacts', 'Pipelines'],
    commandsCount: 14,
    pocsCount: 1,
    bestPractice: 'Cache package manager dependencies across jobs to cut pipeline execution times by 60%.',
    quickCommand: 'gitlab-runner status'
  },
  {
    id: 'jenkins',
    name: 'Jenkins Automation Server',
    category: 'CI/CD & Version Control',
    categoryKey: 'cicd',
    status: 'In Production',
    version: 'LTS 2.452.x',
    description: 'Self-hosted open-source automation server supporting hundreds of plugins for legacy and hybrid CI/CD pipeline automation.',
    role: 'Custom On-Prem Pipeline Orchestration',
    icon: Server,
    color: 'from-rose-500 to-red-600',
    tags: ['Jenkinsfile', 'Groovy', 'Agents', 'Shared Libraries'],
    commandsCount: 12,
    pocsCount: 1,
    bestPractice: 'Define pipelines strictly as code via declarative Jenkinsfiles stored in Git.',
    quickCommand: 'java -jar jenkins-cli.jar -s http://localhost:8080/ who-am-i'
  },

  // Web Servers & Networking
  {
    id: 'nginx',
    name: 'Nginx Reverse Proxy',
    category: 'Web Servers & Gateways',
    categoryKey: 'web-networking',
    status: 'Core Production',
    version: 'v1.26.x',
    description: 'High-performance reverse proxy, load balancer, HTTP/2 gateway, and static content cache securing upstream applications.',
    role: 'Edge Ingress & Reverse Proxy Router',
    icon: Server,
    color: 'from-emerald-500 to-teal-600',
    tags: ['Reverse Proxy', 'SSL/TLS', 'Load Balancing', 'gzip', 'Rate Limiting'],
    commandsCount: 18,
    pocsCount: 3,
    bestPractice: 'Always verify configuration syntax with `nginx -t` before reloading running worker processes.',
    quickCommand: 'nginx -t && systemctl reload nginx'
  },
  {
    id: 'ssl-tls',
    name: 'SSL/TLS & Certbot',
    category: 'Web Servers & Gateways',
    categoryKey: 'web-networking',
    status: 'Core Production',
    version: 'TLS 1.3 / Let’s Encrypt',
    description: 'End-to-end cryptographic transport security protocol ensuring data privacy, certificate validation, and automated renewal.',
    role: 'In-Transit Encryption & Public HTTPS',
    icon: Lock,
    color: 'from-cyan-500 to-blue-600',
    tags: ['HTTPS', 'Certbot', 'ACME', 'HSTS', 'OCSP Stapling'],
    commandsCount: 16,
    pocsCount: 3,
    bestPractice: 'Enforce modern TLS 1.3 only, disable deprecated ciphers, and automate cert renewal with certbot timers.',
    quickCommand: 'certbot certificates && certbot renew --dry-run'
  },

  // Monitoring & Observability
  {
    id: 'prometheus',
    name: 'Prometheus Observability',
    category: 'Monitoring & Observability',
    categoryKey: 'monitoring',
    status: 'Core Production',
    version: 'v2.53.x',
    description: 'Leading time-series monitoring system and Alertmanager with multi-dimensional data model and expressive PromQL query language.',
    role: 'Cluster & Application Metrics Collection',
    icon: Activity,
    color: 'from-orange-500 to-rose-600',
    tags: ['PromQL', 'Time Series', 'Scrape Targets', 'Alertmanager'],
    commandsCount: 16,
    pocsCount: 2,
    bestPractice: 'Keep label cardinality under control; avoid recording high-cardinality fields like user IDs as labels.',
    quickCommand: 'curl -s http://localhost:9090/-/healthy'
  },
  {
    id: 'grafana',
    name: 'Grafana Telemetry Dashboards',
    category: 'Monitoring & Observability',
    categoryKey: 'monitoring',
    status: 'Core Production',
    version: 'v11.x',
    description: 'Interactive analytics and visualization platform for querying, visualizing, alerting on, and exploring operational metrics.',
    role: 'Unified Telemetry Visualization & Alerting',
    icon: Activity,
    color: 'from-amber-500 to-orange-500',
    tags: ['Dashboards', 'Panels', 'Prometheus Datasource', 'Alert Rules'],
    commandsCount: 14,
    pocsCount: 2,
    bestPractice: 'Export and commit dashboard JSON models to Git for version-controlled dashboards-as-code.',
    quickCommand: 'curl -s -u admin:admin http://localhost:3000/api/health'
  },

  // Databases & Storage
  {
    id: 'postgresql',
    name: 'PostgreSQL Database',
    category: 'Databases & Storage',
    categoryKey: 'databases',
    status: 'Core Production',
    version: 'v16.x',
    description: 'Enterprise relational SQL database known for reliability, ACID compliance, robust indexing, and JSONB document support.',
    role: 'Primary Persistent Relational Data Store',
    icon: Database,
    color: 'from-blue-600 to-indigo-700',
    tags: ['ACID', 'JSONB', 'WAL', 'Connection Pooling', 'PgBouncer'],
    commandsCount: 18,
    pocsCount: 2,
    bestPractice: 'Deploy connection poolers (PgBouncer) and configure automated WAL backups for point-in-time recovery.',
    quickCommand: 'psql -U postgres -d devops_db -c "SELECT version();"'
  },
  {
    id: 'sqlite',
    name: 'SQLite Embedded DB',
    category: 'Databases & Storage',
    categoryKey: 'databases',
    status: 'Core Production',
    version: 'v3.45.x',
    description: 'High-performance, zero-configuration, serverless embedded database engine running directly inside this platform backend.',
    role: 'Lightweight Serverless Persistent Storage',
    icon: Database,
    color: 'from-cyan-600 to-blue-700',
    tags: ['Zero-Config', 'WAL Mode', 'Single-File', 'VACUUM', 'ACID'],
    commandsCount: 10,
    pocsCount: 1,
    bestPractice: 'Enable Write-Ahead Logging (WAL) mode for concurrent readers and run periodic VACUUM optimizations.',
    quickCommand: 'sqlite3 backend/data/devops_stored.sqlite "PRAGMA integrity_check;"'
  },

  // Operating Systems & Core
  {
    id: 'linux-core',
    name: 'Linux Core & Systemd',
    category: 'Operating Systems & Core',
    categoryKey: 'os-core',
    status: 'Fundamental',
    version: 'Linux Kernel 6.x',
    description: 'Underlying operating system foundation (Ubuntu / Debian / RHEL) providing cgroups, systemd services, networking sockets, and storage.',
    role: 'Production Host & Kernel Infrastructure',
    icon: Terminal,
    color: 'from-emerald-500 to-cyan-600',
    tags: ['systemd', 'journalctl', 'iptables', 'cgroups', 'cron', 'ss'],
    commandsCount: 80,
    pocsCount: 6,
    bestPractice: 'Run services as non-root dedicated service users with minimal systemd capability grants.',
    quickCommand: 'systemctl list-units --type=service --state=running'
  }
];

export default function Technologies({ setActiveTab }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeModalTech, setActiveModalTech] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Terraform Dedicated Section State
  const [isTerraformOpen, setIsTerraformOpen] = useState(true);
  const [terraformFilter, setTerraformFilter] = useState('all');
  const [terraformSearch, setTerraformSearch] = useState('');
  const terraformRef = useRef(null);

  const TERRAFORM_COMMANDS = useMemo(() => {
    return ALL_BUILTIN_COMMANDS.filter((cmd) => cmd.category === 'terraform');
  }, []);

  const filteredTerraformCommands = useMemo(() => {
    return TERRAFORM_COMMANDS.filter((cmd) => {
      if (terraformFilter !== 'all') {
        if (terraformFilter === 'init' && !['tf-init', 'tf-init-upgrade', 'tf-fmt', 'tf-validate'].includes(cmd.id)) return false;
        if (terraformFilter === 'plan-apply' && !['tf-plan-out', 'tf-apply-plan', 'tf-apply-auto-approve', 'tf-destroy-auto-approve'].includes(cmd.id)) return false;
        if (terraformFilter === 'state' && !['tf-state-list', 'tf-state-show', 'tf-refresh-only', 'tf-force-unlock'].includes(cmd.id)) return false;
        if (terraformFilter === 'workspace-import' && !['tf-output-json', 'tf-import', 'tf-workspace'].includes(cmd.id)) return false;
      }
      if (!terraformSearch.trim()) return true;
      const q = terraformSearch.toLowerCase();
      return (
        cmd.title?.toLowerCase().includes(q) ||
        cmd.command?.toLowerCase().includes(q) ||
        cmd.description?.toLowerCase().includes(q) ||
        cmd.tags?.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [TERRAFORM_COMMANDS, terraformFilter, terraformSearch]);

  const modalTechCommands = useMemo(() => {
    if (!activeModalTech) return [];
    return ALL_BUILTIN_COMMANDS.filter((cmd) => {
      if (activeModalTech.id === 'terraform') return cmd.category === 'terraform';
      if (activeModalTech.id === 'kubernetes') return cmd.category === 'kubernetes';
      if (activeModalTech.id === 'docker') return cmd.category === 'docker';
      if (activeModalTech.id === 'docker-compose') return cmd.category === 'docker-compose';
      if (activeModalTech.id === 'helm') return cmd.category === 'helm';
      if (activeModalTech.id === 'aws') return cmd.category === 'aws';
      if (activeModalTech.id === 'azure') return cmd.category === 'azure';
      if (activeModalTech.id === 'ansible') return cmd.category === 'ansible';
      if (activeModalTech.id === 'github-actions') return cmd.category === 'github-actions';
      if (activeModalTech.id === 'nginx') return cmd.category === 'nginx';
      return false;
    });
  }, [activeModalTech]);

  const exportTerraformScript = () => {
    let script = `#!/bin/bash
# ==============================================================================
# TERRAFORM & OPENTOFU PRODUCTION CHEATSHEET
# Generated: ${new Date().toISOString()}
# Total Commands: ${TERRAFORM_COMMANDS.length}
# ==============================================================================

set -e

`;
    TERRAFORM_COMMANDS.forEach((cmd) => {
      script += `# ${cmd.title} [Privilege: ${cmd.privilege.toUpperCase()}]\n`;
      script += `# ${cmd.description}\n`;
      if (cmd.explanation) script += `# Note: ${cmd.explanation}\n`;
      script += `${cmd.command}\n\n`;
    });

    const blob = new Blob([script], { type: 'text/x-shellscript;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'terraform-commands-cheatsheet.sh');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = [
    { id: 'all', label: 'All Technologies' },
    { id: 'containers', label: 'Containers & K8s' },
    { id: 'cloud-iac', label: 'Cloud & IaC' },
    { id: 'cicd', label: 'CI/CD & Git' },
    { id: 'web-networking', label: 'Web & Gateways' },
    { id: 'monitoring', label: 'Monitoring' },
    { id: 'databases', label: 'Databases' },
    { id: 'os-core', label: 'Linux & OS Core' }
  ];

  const statuses = [
    { id: 'all', label: 'All Statuses' },
    { id: 'Core Production', label: 'Core Production' },
    { id: 'In Production', label: 'In Production' },
    { id: 'Fundamental', label: 'Fundamental' }
  ];

  const filteredTechnologies = useMemo(() => {
    return TECHNOLOGIES_CATALOG.filter((tech) => {
      const matchesCategory = selectedCategory === 'all' || tech.categoryKey === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || tech.status === selectedStatus;
      const matchesSearch = !searchTerm.trim() || 
        tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [searchTerm, selectedCategory, selectedStatus]);

  const copyCommand = (command, id, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(command);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-md">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>DevOps Technologies Stack</span>
                <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full">
                  {TECHNOLOGIES_CATALOG.length} STACKS
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Comprehensive directory of core container runtimes, cloud platforms, IaC engines, and observability tooling powering this infrastructure.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Nav Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setIsTerraformOpen(true);
              terraformRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Terraform Commands ({TERRAFORM_COMMANDS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('commands')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>CLI Hub</span>
          </button>
          <button
            onClick={() => setActiveTab('pocs')}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Browse POCs</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Control Bar: Search & Filter Chips */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md space-y-3">
        
        {/* Search input and status dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search technologies, tags (e.g. Kubernetes, S3, OIDC, Helm, PromQL)..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
            >
              {statuses.map((st) => (
                <option key={st.id} value={st.id}>{st.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Technologies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTechnologies.map((tech) => {
          const Icon = tech.icon;

          return (
            <div
              key={tech.id}
              onClick={() => setActiveModalTech(tech)}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:shadow-cyan-950/20"
            >
              <div>
                
                {/* Card Header: Icon, Name & Status Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${tech.color} flex items-center justify-center text-white shadow-md flex-shrink-0 group-hover:scale-105 transition`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition flex items-center gap-1.5">
                        <span>{tech.name}</span>
                      </h3>
                      <span className="text-[11px] font-mono text-cyan-400">
                        {tech.version}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase whitespace-nowrap ${
                    tech.status === 'Core Production'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : tech.status === 'Fundamental'
                      ? 'bg-blue-950 text-blue-400 border border-blue-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {tech.status}
                  </span>
                </div>

                {/* Architecture Role Badge */}
                <div className="mb-2.5">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800/80 block truncate">
                    ROLE: {tech.role}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {tech.description}
                </p>

                {/* Quick Capability Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tech.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950/80 text-slate-400 border border-slate-800/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Quick CLI Syntax Snippet Box */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>EXECUTION SYNTAX:</span>
                    <button
                      onClick={(e) => copyCommand(tech.quickCommand, tech.id, e)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                      title="Copy command syntax"
                    >
                      {copiedId === tech.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-cyan-500/20 font-mono text-[11px] text-cyan-300 truncate shadow-inner">
                    $ {tech.quickCommand}
                  </div>
                </div>

                {/* Terraform Direct Command Launcher */}
                {tech.id === 'terraform' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTerraformOpen(true);
                      terraformRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full mt-1 mb-3 py-2 px-3 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 font-mono text-[11px] font-semibold flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <Terminal className="w-3.5 h-3.5 text-purple-400" />
                    <span>View All {TERRAFORM_COMMANDS.length} Terraform Commands ↓</span>
                  </button>
                )}

              </div>

              {/* Card Footer: Metrics & Details Trigger */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="hover:text-cyan-300 transition" onClick={(e) => { e.stopPropagation(); setActiveTab('commands'); }}>
                    <strong>{tech.commandsCount}</strong> CLI Commands
                  </span>
                  <span>•</span>
                  <span className="hover:text-cyan-300 transition" onClick={(e) => { e.stopPropagation(); setActiveTab('pocs'); }}>
                    <strong>{tech.pocsCount}</strong> POCs
                  </span>
                </div>

                <div className="flex items-center gap-1 text-cyan-400 font-semibold text-xs group-hover:translate-x-0.5 transition">
                  <span>Inspect</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {filteredTechnologies.length === 0 && (
        <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <Boxes className="w-10 h-10 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white">No Technologies Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No technology stacks matched your search filter. Clear your search or change the category filter to view all stacks.
          </p>
        </div>
      )}

      {/* ============================================================ */}
      {/* TERRAFORM & OPENTOFU PRODUCTION COMMANDS SECTION             */}
      {/* ============================================================ */}
      <div 
        ref={terraformRef}
        className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 flex-shrink-0">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Terraform & OpenTofu CLI Commands</span>
                </h2>
                <span className="text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-full">
                  {TERRAFORM_COMMANDS.length} PRODUCTION COMMANDS
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  IaC Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Full lifecycle commands for workspace isolation, provider initialization, plan generation, remote state locks, and drift recovery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <button
              onClick={() => setIsTerraformOpen(!isTerraformOpen)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              {isTerraformOpen ? (
                <>
                  <ChevronUp className="w-4 h-4 text-purple-400" />
                  <span>Collapse Section</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 text-purple-400" />
                  <span>Expand {TERRAFORM_COMMANDS.length} Commands</span>
                </>
              )}
            </button>
            <button
              onClick={exportTerraformScript}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition flex items-center gap-1.5 cursor-pointer"
              title="Download Terraform cheat-sheet as shell script"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Terraform (.sh)</span>
            </button>
          </div>
        </div>

        {isTerraformOpen && (
          <div className="space-y-4 animate-fadeIn">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-thin">
                {[
                  { id: 'all', label: `All (${TERRAFORM_COMMANDS.length})` },
                  { id: 'init', label: 'Init & Lint (4)' },
                  { id: 'plan-apply', label: 'Plan & Apply (4)' },
                  { id: 'state', label: 'State & Locks (4)' },
                  { id: 'workspace-import', label: 'Outputs & Workspaces (3)' }
                ].map((tfCat) => (
                  <button
                    key={tfCat.id}
                    onClick={() => setTerraformFilter(tfCat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border cursor-pointer ${
                      terraformFilter === tfCat.id
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {tfCat.label}
                  </button>
                ))}
              </div>

              {/* Quick Search inside Terraform */}
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={terraformSearch}
                  onChange={(e) => setTerraformSearch(e.target.value)}
                  placeholder="Filter Terraform commands..."
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                {terraformSearch && (
                  <button
                    onClick={() => setTerraformSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Terraform Commands Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTerraformCommands.map((cmd) => (
                <div
                  key={cmd.id}
                  className="bg-slate-950/90 border border-slate-800 hover:border-purple-500/40 rounded-xl p-4 shadow-lg hover:shadow-purple-950/20 transition flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-white text-sm group-hover:text-purple-300 transition flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                        <span>{cmd.title}</span>
                      </h4>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 uppercase flex-shrink-0">
                        {cmd.privilege}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-snug">
                      {cmd.description}
                    </p>
                  </div>

                  {/* Terminal Execution Box */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>COMMAND SYNTAX:</span>
                      <button
                        onClick={(e) => copyCommand(cmd.command, cmd.id, e)}
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition cursor-pointer"
                        title="Copy command"
                      >
                        {copiedId === cmd.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black border border-purple-500/20 font-mono text-xs text-purple-300 overflow-x-auto shadow-inner select-all">
                      $ {cmd.command}
                    </div>
                  </div>

                  {/* Note / Explanation */}
                  {cmd.explanation && (
                    <div className="text-[11px] text-slate-400 bg-slate-900/90 p-2 rounded-lg border border-slate-800/80">
                      <span className="font-semibold text-purple-400 font-mono">Note: </span>
                      {cmd.explanation}
                    </div>
                  )}

                  {/* Tags */}
                  {cmd.tags && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {cmd.tags.map((t) => (
                        <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredTerraformCommands.length === 0 && (
              <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-500 text-xs">
                No Terraform commands match "{terraformSearch}".
              </div>
            )}
          </div>
        )}
      </div>

      {/* Technology Deep Dive Modal */}
      {activeModalTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl space-y-4">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${activeModalTech.color} flex items-center justify-center text-white shadow-md`}>
                  {React.createElement(activeModalTech.icon, { className: 'w-5 h-5 text-white' })}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <span>{activeModalTech.name}</span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {activeModalTech.status}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">{activeModalTech.category}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalTech(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin text-xs">
              
              {/* Architecture Role */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                  ARCHITECTURE &amp; PRODUCTION ROLE:
                </span>
                <p className="text-slate-200 font-medium text-sm">
                  {activeModalTech.role}
                </p>
              </div>

              {/* Full Description */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                  TECHNICAL SPECIFICATION &amp; CAPABILITIES:
                </span>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {activeModalTech.description}
                </p>
              </div>

              {/* Production Best Practice */}
              <div className="bg-emerald-950/40 border border-emerald-800/80 p-3.5 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Production Architectural Best Practice:</span>
                </div>
                <p className="text-emerald-200/90 leading-relaxed font-sans">
                  {activeModalTech.bestPractice}
                </p>
              </div>

              {/* Quick CLI Command with Copy */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-mono text-slate-400">
                  <span className="text-[10px] uppercase font-bold">SAMPLE CLI EXECUTION SYNTAX:</span>
                  <button
                    onClick={() => copyCommand(activeModalTech.quickCommand, 'modal')}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                  >
                    {copiedId === 'modal' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Syntax</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-black/90 rounded-xl border border-cyan-500/30 font-mono text-xs text-cyan-300 whitespace-pre-wrap break-all shadow-inner">
                  $ {activeModalTech.quickCommand}
                </div>
              </div>

              {/* Built-in Commands for this Technology */}
              {modalTechCommands.length > 0 && (
                <div className="space-y-2.5 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>All Production Commands for {activeModalTech.name} ({modalTechCommands.length}):</span>
                    </span>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                    {modalTechCommands.map((tc) => (
                      <div 
                        key={tc.id} 
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-cyan-500/30 transition flex flex-col gap-1.5"
                      >
                        <div className="flex items-start justify-between gap-2 text-xs">
                          <span className="font-bold text-white text-xs">{tc.title}</span>
                          <button
                            onClick={() => copyCommand(tc.command, `modal-${tc.id}`)}
                            className="text-cyan-400 hover:text-cyan-300 text-[10px] font-mono flex items-center gap-1 flex-shrink-0 cursor-pointer"
                          >
                            {copiedId === `modal-${tc.id}` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 font-bold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          {tc.description}
                        </p>
                        <div className="p-2 rounded-lg bg-black font-mono text-[11px] text-cyan-300 overflow-x-auto shadow-inner select-all">
                          $ {tc.command}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveModalTech(null);
                  setActiveTab('commands');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Open {activeModalTech.name} in CLI Hub</span>
              </button>

              <button
                onClick={() => {
                  setActiveModalTech(null);
                  setActiveTab('pocs');
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Browse Related POCs</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
