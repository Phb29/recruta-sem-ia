// Dados de exemplo (fictícios) usados na primeira vez que o app abre.
export const ETAPAS = ["Triagem", "Entrevista", "Teste técnico", "Proposta", "Contratado", "Reprovado"];

export const VAGAS_SEED = [
  {
    id: "v1", titulo: "Desenvolvedor(a) Java Pleno", area: "Backend", senioridade: "Pleno", modelo: "Remoto",
    salario: "R$ 9.000 a R$ 12.000",
    obrigatorios: ["java", "spring boot", "sql", "api rest"],
    desejaveis: ["docker", "kafka", "aws", "testes automatizados"],
    descricao: "Construir e manter APIs REST em Java 21 com Spring Boot para a plataforma de pagamentos. Trabalhar com banco relacional (PostgreSQL), mensageria e deploy em containers.",
  },
  {
    id: "v2", titulo: "Desenvolvedor(a) Front-end Angular", area: "Frontend", senioridade: "Pleno", modelo: "Híbrido (São Paulo)",
    salario: "R$ 8.000 a R$ 11.000",
    obrigatorios: ["angular", "typescript", "html", "css"],
    desejaveis: ["rxjs", "testes automatizados", "acessibilidade", "figma"],
    descricao: "Criar telas do painel do cliente em Angular 17+, componentes reutilizáveis, integração com APIs e foco em acessibilidade.",
  },
  {
    id: "v3", titulo: "Engenheiro(a) de Dados Sênior", area: "Dados", senioridade: "Sênior", modelo: "Remoto",
    salario: "R$ 15.000 a R$ 19.000",
    obrigatorios: ["python", "sql", "spark", "airflow"],
    desejaveis: ["aws", "dbt", "kafka", "docker"],
    descricao: "Desenhar pipelines de dados em lote e streaming, modelagem de data lake e governança de dados.",
  },
  {
    id: "v4", titulo: "Analista de Suporte N1", area: "Suporte", senioridade: "Júnior", modelo: "Presencial (Campinas)",
    salario: "R$ 2.800 a R$ 3.500",
    obrigatorios: ["atendimento ao cliente", "windows", "redes"],
    desejaveis: ["sql", "itil", "inglês"],
    descricao: "Atender chamados de clientes por telefone e chat, resolver problemas de acesso e encaminhar casos complexos.",
  },
  {
    id: "v5", titulo: "DevOps / SRE Pleno", area: "Infra", senioridade: "Pleno", modelo: "Remoto",
    salario: "R$ 11.000 a R$ 14.000",
    obrigatorios: ["docker", "kubernetes", "linux", "ci/cd"],
    desejaveis: ["aws", "terraform", "observabilidade", "python"],
    descricao: "Manter clusters Kubernetes, pipelines de CI/CD, monitoramento e resposta a incidentes.",
  },
];

export const CANDIDATOS_SEED = [
  {
    id: "c1", nome: "Marina Lopes", email: "marina.lopes@email.com", vagaId: "v1", etapa: "Triagem", criadoEm: "2026-11-18",
    curriculo: "Desenvolvedora backend com 5 anos de experiência. Java 17 e 21, Spring Boot, Spring Data JPA, PostgreSQL e MySQL. Criei APIs REST para um banco digital, com testes automatizados (JUnit e Mockito). Experiência com Docker e mensageria Kafka. Inglês avançado. Moro em Recife, 31 anos, casada.",
  },
  {
    id: "c2", nome: "Rafael Souza", email: "rafael.souza@email.com", vagaId: "v1", etapa: "Triagem", criadoEm: "2026-11-19",
    curriculo: "Programador há 2 anos. Trabalho com Java e um pouco de Spring Boot em projetos internos. Conheço SQL básico. Fiz cursos de AWS Cloud Practitioner. Procuro primeira vaga pleno.",
  },
  {
    id: "c3", nome: "Juliana Pereira", email: "juliana.p@email.com", vagaId: "v2", etapa: "Triagem", criadoEm: "2026-11-19",
    curriculo: "Front-end com 4 anos de experiência em Angular (versões 12 a 17), TypeScript, RxJS, HTML5 e CSS3/SASS. Preocupação com acessibilidade (WCAG). Testes com Jest e Cypress. Uso Figma para conversar com o time de design. Inglês intermediário.",
  },
  {
    id: "c4", nome: "Carlos Mendes", email: "carlos.m@email.com", vagaId: "v3", etapa: "Entrevista", criadoEm: "2026-11-15",
    curriculo: "Engenheiro de dados com 7 anos de experiência. Python, SQL avançado, Apache Spark (PySpark), Airflow para orquestração, dbt e AWS (S3, Glue, EMR). Já montei data lake do zero e pipelines de streaming com Kafka. Liderei time de 4 pessoas.",
  },
  {
    id: "c5", nome: "Beatriz Lima", email: "bia.lima@email.com", vagaId: "v4", etapa: "Triagem", criadoEm: "2026-11-20",
    curriculo: "1 ano de experiência em atendimento ao cliente em call center. Conhecimentos em Windows 10/11, configuração de impressoras e noções de redes (IP, DNS, Wi-Fi). Cursando Análise e Desenvolvimento de Sistemas. Inglês básico.",
  },
  {
    id: "c6", nome: "Diego Ramos", email: "diego.ramos@email.com", vagaId: "v5", etapa: "Triagem", criadoEm: "2026-11-20",
    curriculo: "SRE com 4 anos de experiência. Docker, Kubernetes (EKS e GKE), Linux, Terraform e pipelines de CI/CD com GitHub Actions e GitLab CI. Observabilidade com Prometheus e Grafana. Scripts em Python e Bash. AWS certificado.",
  },
  {
    id: "c7", nome: "Fernanda Alves", email: "fe.alves@email.com", vagaId: "v2", etapa: "Triagem", criadoEm: "2026-11-21",
    curriculo: "Desenvolvedora React há 3 anos, JavaScript e TypeScript, HTML e CSS. Nunca trabalhei com Angular mas aprendo rápido. Experiência com Figma e Storybook.",
  },
  {
    id: "c8", nome: "Thiago Nunes", email: "thiago.n@email.com", vagaId: "v1", etapa: "Teste técnico", criadoEm: "2026-11-12",
    curriculo: "Desenvolvedor Java com 6 anos. Spring Boot, microsserviços, API REST, SQL Server e Oracle. Docker e Kubernetes no dia a dia, filas com RabbitMQ. Testes automatizados e TDD.",
  },
  {
    id: "c9", nome: "Larissa Costa", email: "larissa.c@email.com", vagaId: "v3", etapa: "Triagem", criadoEm: "2026-11-21",
    curriculo: "Analista de BI com 3 anos. SQL, Power BI e Python para análises. Estudando Spark e Airflow. Experiência com modelagem dimensional.",
  },
  {
    id: "c10", nome: "Pedro Henrique Dias", email: "pedro.dias@email.com", vagaId: "v4", etapa: "Triagem", criadoEm: "2026-11-22",
    curriculo: "Administrador de sistemas Linux há 5 anos. Docker, Ansible, Jenkins para CI/CD e um pouco de Kubernetes em laboratório. Monitoramento com Zabbix. Conhecimento em redes.",
  },
];
