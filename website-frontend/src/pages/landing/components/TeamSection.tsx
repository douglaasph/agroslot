import { Users } from 'lucide-react'
import { team } from '../data/team'

export default function TeamSection() {
  return (
    <section
      id="equipe"
      className="border-b border-earth-200 bg-white py-24"
      aria-labelledby="team-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2
            id="team-heading"
            className="mb-4 text-3xl font-bold tracking-tight text-earth-900"
          >
            Equipe do projeto
          </h2>

          <p className="text-lg text-slate-600">
            Os desenvolvedores e pesquisadores por trás do AgroSlot.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {team.map((member) => (
            <article
              key={member.id}
              className="flex flex-col items-center rounded-2xl border border-earth-200/60 bg-earth-50 p-8 text-center transition-colors hover:bg-earth-100/50"
            >
              <div className="mb-6 size-32 overflow-hidden rounded-full bg-earth-200 shadow-md ring-4 ring-white">
                <img
                  src={member.photoUrl}
                  alt={`Avatar provisório de ${member.name}`}
                  className="size-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h3 className="mb-1 text-xl font-bold text-earth-900">
                {member.name}
              </h3>

              <p className="text-sm font-medium text-primary-700">
                {member.role}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-slate-500">
          <Users className="size-4 shrink-0" aria-hidden="true" />
          As imagens dos integrantes serão atualizadas com fotos reais
          autorizadas.
        </p>
      </div>
    </section>
  )
}