import {
  Camera,
  GraduationCap,
  LayoutGrid,
  Leaf,
  ShieldCheck,
  Sprout,
  TestTubes,
} from 'lucide-react'
import TeamSection from './components/TeamSection'
import { team } from './data/team'

const features = [
  {
    icon: LayoutGrid,
    title: 'Organize sua plantação',
    desc: 'Crie plantações e divida o terreno visualmente em slots facilmente gerenciáveis.',
  },
  {
    icon: Sprout,
    title: 'Cadastre suas plantas',
    desc: 'Mantenha o registro de cada planta no seu próprio espaço e acompanhe sua evolução.',
  },
  {
    icon: Camera,
    title: 'Fotografe a folha',
    desc: 'Tire fotos diretamente pelo aplicativo ou envie imagens da sua galeria de forma simples.',
  },
  {
    icon: TestTubes,
    title: 'Diagnostique',
    desc: 'Receba na hora o resultado da análise por IA com o respectivo grau de confiança.',
  },
]

const diseases = [
  'Ferrugem Asiática',
  'Septoria Glycines (Mancha Parda)',
  'Bacterial Blight (Crestamento Bacteriano)',
  'Powdery Mildew (Oídio)',
  'Mosaico Vírus',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-earth-50 font-sans text-slate-800 selection:bg-primary-100 selection:text-primary-900">
      {/* CABEÇALHO */}
      <header className="sticky top-0 z-50 border-b border-earth-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a
            href="#inicio"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary-800"
            aria-label="AgroSlot — página inicial"
          >
            <Sprout className="size-6 text-primary-600" aria-hidden="true" />
            <span>AgroSlot</span>
          </a>

          <div className="hidden items-center gap-2 rounded-full bg-earth-100 px-3 py-1.5 text-sm font-medium text-slate-600 sm:flex">
            <GraduationCap
              className="size-4 text-primary-700"
              aria-hidden="true"
            />
            <span>Trabalho Institucional — IFPE</span>
          </div>
        </div>
      </header>

      <main id="inicio">
        {/* 1. HERO */}
        <section className="relative overflow-hidden pb-24 pt-16 lg:pb-32 lg:pt-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-800 sm:hidden">
                <GraduationCap className="size-4" aria-hidden="true" />
                <span>Trabalho Institucional — IFPE</span>
              </div>

              <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-earth-900 sm:text-5xl lg:text-6xl">
                Plante, fotografe,
                <br />
                <span className="text-primary-600">descubra.</span>
              </h1>

              <p className="mb-8 text-lg leading-relaxed text-slate-600 sm:text-xl">
                Gestão inteligente de plantações de soja com diagnóstico
                automatizado de doenças por visão computacional.
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 scale-105 rotate-3 rounded-3xl bg-gradient-to-tr from-primary-100/40 to-earth-100/40" />

              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-earth-900/5">
                <img
                  src="https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=1200"
                  alt="Plantação agrícola ao pôr do sol"
                  className="size-full object-cover"
                  fetchPriority="high"
                />

                <div className="absolute inset-x-6 bottom-6 flex items-center gap-4 rounded-xl bg-white/90 p-4 shadow-lg ring-1 ring-black/5 backdrop-blur-sm">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <LayoutGrid className="size-6" aria-hidden="true" />
                  </div>

                  <div>
                    <p className="font-bold text-earth-900">
                      Mapeamento em slots
                    </p>
                    <p className="text-xs text-slate-500">
                      Monitoramento preciso por canteiro
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SOBRE O PROJETO */}
        <section
          id="sobre"
          className="border-y border-earth-200 bg-white py-20"
        >
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-earth-900">
              Sobre o projeto
            </h2>

            <div className="space-y-6 text-left text-lg leading-relaxed text-slate-600 sm:text-center">
              <p>
                O manejo eficaz das plantações de soja é constantemente
                desafiado pelo surgimento rápido de doenças foliares, que
                muitas vezes passam despercebidas até comprometerem uma parte
                significativa da safra. O monitoramento tradicional de extensas
                áreas de cultivo é demorado, caro e sujeito a falhas humanas.
              </p>

              <p>
                O <strong>AgroSlot</strong> nasce com a proposta de resolver
                essa dificuldade através de uma matriz de monitoramento.
                Dividimos a área plantada em <em>slots</em> (canteiros ou zonas
                específicas), permitindo que o produtor e a equipe técnica
                tenham controle granular de cada planta ou pequeno grupo delas.
              </p>

              <p>
                Apoiados em inteligência artificial e visão computacional,
                transformamos o upload de uma simples foto em um diagnóstico
                preditivo. Essa união entre organização espacial por slots e
                análise autônoma de imagens oferece precisão, agilidade e
                potencial de salvar safras inteiras através do combate precoce.
              </p>
            </div>
          </div>
        </section>

        {/* 3. COMO FUNCIONA */}
        <section id="funcionalidades" className="bg-earth-50 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-earth-900">
                Como funciona
              </h2>

              <p className="text-lg text-slate-600">
                Uma jornada simplificada, pensada para levar a visão
                computacional do laboratório direto para o campo.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, desc }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-earth-200/60 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-6 flex size-14 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon className="size-7" aria-hidden="true" />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-earth-900">
                    {title}
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-600">
                    {desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. DOENÇAS IDENTIFICADAS */}
        <section className="bg-earth-800 py-24 text-earth-50">
          <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight">
                Doenças mapeadas no MVP
              </h2>

              <p className="mb-8 text-lg leading-relaxed text-earth-200">
                O motor de visão computacional do AgroSlot foi treinado para
                identificar as principais ameaças às plantações de soja. Nosso
                banco de dados está em constante evolução.
              </p>

              <ul className="space-y-4">
                {diseases.map((disease) => (
                  <li
                    key={disease}
                    className="flex items-center gap-4 rounded-xl border border-earth-700/50 bg-earth-900/50 p-4"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-900/50 text-primary-400">
                      <Leaf className="size-5" aria-hidden="true" />
                    </div>

                    <span className="text-lg font-medium">{disease}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-earth-700 bg-earth-900 p-8">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />

              <div className="relative z-10 w-full max-w-sm rotate-2 overflow-hidden rounded-2xl bg-white text-slate-800 shadow-2xl">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1572457224112-06d191bb6d01?auto=format&fit=crop&q=80&w=800"
                    alt="Folha em análise"
                    className="size-full object-cover"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-primary-600/20 mix-blend-multiply" />

                  <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-dashed border-white opacity-80" />
                </div>

                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Resultado da análise
                    </span>

                    <span className="flex items-center gap-1 rounded bg-primary-50 px-2 py-1 text-xs font-bold text-primary-600">
                      <ShieldCheck className="size-3" aria-hidden="true" />
                      94% Precisão
                    </span>
                  </div>

                  <p className="mb-1 text-xl font-bold text-earth-900">
                    Ferrugem Asiática
                  </p>

                  <p className="text-sm text-slate-500">
                    Detectado no Slot C-4, Planta #012
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. EQUIPE */}
        <TeamSection />
      </main>

      {/* 6. RODAPÉ INSTITUCIONAL */}
      <footer className="bg-earth-900 pb-8 pt-16 text-earth-200">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 flex flex-col items-center justify-between gap-8 border-b border-earth-800 pb-12 md:flex-row">
            <div className="max-w-md text-center md:text-left">
              <a
                href="#inicio"
                className="mb-4 inline-flex items-center justify-center gap-2 text-2xl font-bold tracking-tight text-white md:justify-start"
              >
                <Sprout
                  className="size-7 text-primary-500"
                  aria-hidden="true"
                />
                <span>AgroSlot</span>
              </a>

              <p className="mb-6 leading-relaxed text-earth-200">
                Projeto acadêmico com foco na inovação agrícola através da
                aplicação de visão computacional.
              </p>

              <div className="inline-flex items-center gap-3 rounded-lg border border-earth-700 bg-earth-800 px-4 py-3">
                <div className="text-left text-sm text-earth-200">
                  <p className="font-semibold text-white">
                    Instituto Federal de Pernambuco
                  </p>
                  <p className="text-xs">
                    Análise e Desenvolvimento de Sistemas
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 text-sm">
              <div>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
                  Projeto
                </h4>

                <ul className="space-y-3">
                  <li>
                    <a
                      href="#sobre"
                      className="transition-colors hover:text-primary-400"
                    >
                      Sobre
                    </a>
                  </li>
                  <li>
                    <a
                      href="#funcionalidades"
                      className="transition-colors hover:text-primary-400"
                    >
                      Funcionalidades
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
                  Equipe
                </h4>

                <ul className="space-y-3">
                  {team.map((member) => (
                    <li key={member.id}>
                      <a
                        href="#equipe"
                        className="transition-colors hover:text-primary-400"
                      >
                        {member.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 text-xs text-earth-200 md:flex-row">
            <p>
              &copy; {new Date().getFullYear()} AgroSlot. Trabalho acadêmico
              sem fins comerciais.
            </p>

            <span>Desenvolvido no IFPE</span>
          </div>
        </div>
      </footer>
    </div>
  )
}