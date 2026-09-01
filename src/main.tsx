import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, Line, Stars } from "@react-three/drei";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  Braces,
  Cpu,
  Database,
  Github,
  Linkedin,
  Mail,
  Network,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import * as THREE from "three";
import "./styles.css";

const contacts = {
  email: "sagar.singh152810@gmail.com",
  github: "https://github.com/SagarSingh1510",
  linkedin: "https://www.linkedin.com/in/sagar-singh-developer15/",
  resume: "/Sagar-Singh-Resume.pdf",
};

const metrics = [
  { value: "15+", label: "secure APIs delivered" },
  { value: "500+", label: "users supported" },
  { value: "80%+", label: "test coverage" },
  { value: "35%", label: "throughput lift" },
];

const services = [
  { name: "Gateway", position: [0, 0.85, 0], color: "#9fefff" },
  { name: "Auth", position: [-2.3, -0.35, 0.25], color: "#f6bd60" },
  { name: "Workspace", position: [-0.9, -1.3, -0.35], color: "#b2f7ef" },
  { name: "Diagram", position: [1.05, -1.15, 0.2], color: "#a7c7e7" },
  { name: "Kafka", position: [2.45, -0.25, -0.25], color: "#ff8f70" },
  { name: "Postgres", position: [0, -2.15, 0.1], color: "#d9ed92" },
] as const;

const projects = [
  {
    name: "Atlas",
    eyebrow: "Microservices Backend Platform",
    href: "https://github.com/SagarSingh1510/Atlas",
    stack: "Java 21, Spring Boot, Spring Security, PostgreSQL, Kafka, Redis, Docker, Kubernetes, JWT",
    summary:
      "A production-grade backend platform with dedicated Auth, Workspace, Diagram, Deployment, Simulation, and AI Review services routed through a central API gateway.",
    details: [
      "JWT auth, BCrypt password hashing, DTO boundaries, Bean Validation, and service-owned data models.",
      "Synchronous HTTP paths for fast operations and Kafka workflows for long-running deployment pipelines.",
      "Domain-driven boundaries keep shared modules limited to contracts and common utilities.",
    ],
  },
  {
    name: "Student Management API",
    eyebrow: "RESTful API System",
    href: "https://github.com/SagarSingh1510/student-management-api",
    stack: "Java, Spring Boot, Spring Data JPA, Hibernate, PostgreSQL, Docker, JUnit 5, Swagger",
    summary:
      "A clean layered API with CRUD, pagination, sorting, search, centralized exceptions, validation, and OpenAPI documentation.",
    details: [
      "Controller-Service-Repository architecture with explicit business logic boundaries.",
      "20+ documented endpoints and 10+ unit tests covering core behavior with JUnit 5 and Mockito.",
      "PostgreSQL-backed persistence with Dockerized local runtime and Render deployment experience.",
    ],
  },
];

const skillGroups = [
  { title: "Backend Core", items: ["Java", "Spring Boot", "Spring MVC", "Spring Security", "REST APIs"] },
  { title: "Data Layer", items: ["PostgreSQL", "MySQL", "Redis", "JPA", "Hibernate"] },
  { title: "Systems", items: ["Microservices", "Kafka", "JWT", "OAuth 2.0", "DDD"] },
  { title: "Delivery", items: ["Docker", "Kubernetes", "GitHub Actions", "Maven", "Swagger"] },
  { title: "Quality", items: ["JUnit 5", "Mockito", "Integration Tests", "SOLID", "Design Patterns"] },
];

function useScrollScalar() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [value, setValue] = useState(0);

  useEffect(() => scale.on("change", setValue), [scale]);
  return value;
}

function ServiceNode({
  name,
  position,
  color,
}: {
  name: string;
  position: readonly [number, number, number];
  color: string;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.x = t * 0.24 + position[0] * 0.2;
    mesh.current.rotation.y = t * 0.34 + position[1] * 0.2;
  });

  return (
    <group position={position}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.27, 1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.22} roughness={0.28} metalness={0.72} />
      </mesh>
      <mesh scale={1.55}>
        <icosahedronGeometry args={[0.27, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} wireframe />
      </mesh>
      <Html center distanceFactor={8} className="node-label">
        {name}
      </Html>
    </group>
  );
}

function DataRail({ scroll }: { scroll: number }) {
  const group = useRef<THREE.Group>(null);
  const points = useMemo(
    () => services.map((service) => new THREE.Vector3(...service.position)),
    []
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.08 + scroll * 0.8;
    group.current.rotation.x = -0.25 + scroll * 0.45;
    group.current.position.y = scroll * -0.45;
  });

  return (
    <group ref={group}>
      <Line points={[points[0], points[1], points[5], points[3], points[4], points[0], points[2], points[5]]} color="#9fefff" transparent opacity={0.5} lineWidth={1.35} />
      <Line points={[new THREE.Vector3(-3, 0.05, -0.8), new THREE.Vector3(3, 0.05, -0.8)]} color="#f6bd60" transparent opacity={0.34} lineWidth={1} dashed dashSize={0.12} gapSize={0.09} />
      <mesh position={[0, -2.15, -0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.88, 0.012, 12, 96]} />
        <meshBasicMaterial color="#d9ed92" transparent opacity={0.45} />
      </mesh>
      {services.map((service) => (
        <ServiceNode key={service.name} {...service} />
      ))}
    </group>
  );
}

function BackendUniverse({ scroll }: { scroll: number }) {
  const reduced = useReducedMotion();
  const rig = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!rig.current || reduced) return;
    const pointerX = state.pointer.x * 0.22;
    const pointerY = state.pointer.y * 0.12;
    rig.current.rotation.y = pointerX + scroll * 0.85;
    rig.current.rotation.x = -0.15 + pointerY + scroll * 0.18;
  });

  return (
    <>
      <ambientLight intensity={0.58} />
      <pointLight position={[3, 4, 4]} intensity={2.2} color="#9fefff" />
      <pointLight position={[-4, -1.5, 3]} intensity={1.25} color="#f6bd60" />
      <Stars radius={70} depth={24} count={900} factor={4} saturation={0} fade speed={reduced ? 0 : 0.45} />
      <Float speed={reduced ? 0 : 1.2} rotationIntensity={0.18} floatIntensity={0.42}>
        <group ref={rig}>
          <DataRail scroll={scroll} />
          <mesh position={[0, 0.1, -1.35]} rotation={[Math.PI / 2, 0, scroll]}>
            <torusKnotGeometry args={[1.35, 0.018, 180, 8, 2, 5]} />
            <meshStandardMaterial color="#9fefff" emissive="#9fefff" emissiveIntensity={0.16} roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, -0.25, -1.75]}>
            <sphereGeometry args={[2.7, 32, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.025} wireframe />
          </mesh>
        </group>
      </Float>
    </>
  );
}

function Scene() {
  const scroll = useScrollScalar();

  return (
    <div className="scene-shell" aria-hidden="true">
      <Canvas camera={{ position: [0, 0.15, 6.4], fov: 42 }} dpr={[1, 1.65]} gl={{ preserveDrawingBuffer: true }}>
        <Suspense fallback={null}>
          <BackendUniverse scroll={scroll} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <main>
      <Scene />
      <nav className="nav" aria-label="Primary navigation">
        <a href="#top" className="brand">Sagar Singh</a>
        <div className="nav-links">
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Systems</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section id="top" className="hero section">
        <div className="hero-grid">
          <Reveal className="hero-copy">
            <p className="eyebrow">Full-stack backend engineer / Java, Spring Boot, distributed systems</p>
            <h1>Building secure backend systems that feel engineered, not assembled.</h1>
            <p className="hero-text">
              I design production-minded APIs, microservices, event-driven workflows, and deployment pipelines
              with the kind of structure recruiters can trust and engineering teams can extend.
            </p>
            <div className="hero-actions">
              <a href="#projects" className="button primary">
                View systems <ArrowUpRight size={18} />
              </a>
              <a href={contacts.resume} download className="button secondary">
                Download resume <ArrowUpRight size={17} />
              </a>
            </div>
          </Reveal>
          <Reveal className="system-panel">
            <div className="panel-top">
              <span>Live profile signal</span>
              <span>Bengaluru, India</span>
            </div>
            <div className="terminal-lines">
              <p><span>gateway</span> routes secure REST traffic</p>
              <p><span>auth</span> validates JWT + OAuth flows</p>
              <p><span>events</span> move async workloads through Kafka</p>
              <p><span>cache</span> protects sessions and rate limits</p>
            </div>
          </Reveal>
        </div>
        <div className="metric-strip" aria-label="Career highlights">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="experience" className="section narrative">
        <Reveal>
          <p className="eyebrow">Experience</p>
          <h2>Backend delivery under production constraints.</h2>
        </Reveal>
        <div className="experience-band">
          <Reveal className="experience-main">
            <div className="timeline-marker"><ShieldCheck size={22} /></div>
            <p className="date">May 2025 - July 2026</p>
            <h3>Backend Developer at TranquilAI</h3>
            <p>
              Developed 15+ REST APIs across authentication, AI conversations, journaling, and mood tracking
              for 500+ users while improving throughput, test coverage, release speed, and system reliability.
            </p>
          </Reveal>
          <Reveal className="experience-grid">
            <div><strong>Security</strong><span>JWT, OAuth 2.0, Spring Security</span></div>
            <div><strong>Reliability</strong><span>JUnit 5, Mockito, 80%+ coverage</span></div>
            <div><strong>Delivery</strong><span>Docker, Kubernetes, GitHub Actions</span></div>
            <div><strong>Scale</strong><span>Kafka events, Redis caching, rate limits</span></div>
          </Reveal>
        </div>
      </section>

      <section id="projects" className="section projects">
        <Reveal>
          <p className="eyebrow">Featured architecture</p>
          <h2>Projects shown as systems, not screenshots.</h2>
        </Reveal>
        <div className="project-stack">
          {projects.map((project, index) => (
            <Reveal className="project-case" key={project.name}>
              <div className="case-index">0{index + 1}</div>
              <div className="case-content">
                <p className="eyebrow">{project.eyebrow}</p>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
                <ul>
                  {project.details.map((detail) => <li key={detail}>{detail}</li>)}
                </ul>
                <p className="stack-line">{project.stack}</p>
                <a href={project.href} target="_blank" rel="noreferrer" className="text-link">
                  Open GitHub <ArrowUpRight size={16} />
                </a>
              </div>
              <div className="architecture-card" aria-hidden="true">
                <div className="arch-node large"><Cpu size={22} /></div>
                <div className="arch-node left"><ShieldCheck size={19} /></div>
                <div className="arch-node right"><Database size={19} /></div>
                <div className="arch-node bottom"><Network size={19} /></div>
                <span className="arch-line one" />
                <span className="arch-line two" />
                <span className="arch-line three" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="skills" className="section skills">
        <Reveal>
          <p className="eyebrow">Technical map</p>
          <h2>A backend stack organized around shipping durable software.</h2>
        </Reveal>
        <div className="skill-map">
          {skillGroups.map((group, index) => (
            <Reveal className="skill-cluster" key={group.title}>
              <span className="cluster-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{group.title}</h3>
              <div>
                {group.items.map((item) => <span key={item}>{item}</span>)}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section credentials">
        <Reveal className="education">
          <p className="eyebrow">Education</p>
          <h2>Vellore Institute of Technology</h2>
          <p>Bachelor of Technology in Computer Science, CGPA 8.3/10, 2021 - 2025.</p>
        </Reveal>
        <Reveal className="certs">
          <div><Award size={20} /><span>AWS Certified Cloud Practitioner</span></div>
          <div><Braces size={20} /><span>JPMorgan Chase & Co. Software Engineering Job Simulation</span></div>
        </Reveal>
      </section>

      <section id="contact" className="section contact">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h2>Recruiting for backend ownership, full-stack execution, and systems-minded product work.</h2>
          <p>
            Reach out for Java, Spring Boot, microservices, API platform, and production backend roles.
            Phone details are kept inside the resume, not published directly on this page.
          </p>
          <div className="contact-row">
            <a href={`mailto:${contacts.email}`} className="button primary"><Mail size={18} /> Email</a>
            <a href={contacts.github} target="_blank" rel="noreferrer" className="button secondary"><Github size={18} /> GitHub</a>
            <a href={contacts.linkedin} target="_blank" rel="noreferrer" className="button secondary"><Linkedin size={18} /> LinkedIn</a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
