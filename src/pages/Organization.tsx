import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Mail, Phone, User, X } from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';
import { PageHeader } from '../components/PageHeader';
import { SafeImage } from '../components/SafeImage';
import { useAppData } from '../context/AppDataContext';
import type { OrganizationMember } from '../types';
import { groupMembersByTier } from '../utils/logic';

function MemberCard({
  member,
  highlight = false,
  onSelect,
}: {
  member: OrganizationMember;
  highlight?: boolean;
  onSelect: (m: OrganizationMember) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      className={`group w-full text-left rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B3C] ${
        highlight
          ? 'bg-gradient-to-br from-[#0B1F3A] to-[#122D52] text-white border-[#C89B3C]/40 shadow-md hover:border-[#DCB458]'
          : 'bg-white text-[#0F172A] border-slate-200 hover:border-[#C89B3C]/80'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center ring-2 transition-all duration-300 ${
            highlight
              ? 'bg-[#071426] ring-[#C89B3C]/50 group-hover:ring-[#DCB458]'
              : 'bg-[#F6F8FB] ring-slate-200 group-hover:ring-[#C89B3C]/70'
          }`}
        >
          {member.photoUrl ? (
            <SafeImage
              src={member.photoUrl}
              alt={member.fullName}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <User
              className={`w-6 h-6 ${
                highlight ? 'text-[#DCB458]' : 'text-[#0B1F3A]/60'
              }`}
              aria-hidden="true"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`text-xs font-semibold uppercase tracking-wider ${
              highlight ? 'text-[#DCB458]' : 'text-[#A87E26]'
            }`}
          >
            {member.role}
          </p>
          <h3
            className={`font-display font-bold text-base mt-0.5 leading-snug ${
              highlight ? 'text-white' : 'text-[#0B1F3A]'
            }`}
          >
            {member.fullName}
          </h3>
          {member.division !== 'Pengurus Inti' && (
            <p
              className={`text-xs mt-0.5 ${
                highlight ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              {member.division}
            </p>
          )}
        </div>
      </div>

      <p
        className={`mt-4 text-xs sm:text-sm leading-relaxed line-clamp-3 ${
          highlight ? 'text-slate-300' : 'text-slate-600'
        }`}
      >
        {member.description}
      </p>

      {member.contact && (
        <div
          className={`mt-4 pt-3 border-t flex items-center gap-2 text-xs ${
            highlight
              ? 'border-white/10 text-slate-300'
              : 'border-slate-100 text-slate-500'
          }`}
        >
          {member.contact.includes('@') ? (
            <Mail className="w-3.5 h-3.5 text-[#C89B3C]" aria-hidden="true" />
          ) : (
            <Phone className="w-3.5 h-3.5 text-[#C89B3C]" aria-hidden="true" />
          )}
          <span>{member.contact}</span>
        </div>
      )}
    </button>
  );
}

function HierarchyConnector({ delay = 0 }: { delay?: number }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div
      className="hidden md:flex flex-col items-center py-1"
      aria-hidden="true"
    >
      <motion.div
        initial={shouldReduceMotion ? false : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ originY: 0 }}
        className="w-px h-8 bg-gradient-to-b from-[#C89B3C] to-[#C89B3C]/30"
      />
      <motion.div
        initial={shouldReduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55, delay: delay + 0.12, ease: [0.16, 1, 0.3, 1] }}
        className="w-2/3 max-w-2xl h-px bg-gradient-to-r from-transparent via-[#C89B3C]/50 to-transparent"
      />
    </div>
  );
}

export function Organization() {
  const { members, loading } = useAppData();
  const [selectedMember, setSelectedMember] =
    useState<OrganizationMember | null>(null);
  const tiers = groupMembersByTier(members);

  return (
    <div>
      <PageHeader
        eyebrow="Kepengurusan Wilayah"
        title="Struktur Organisasi Komisi Pemuda Pemudi"
        description="Bagan kepengurusan Komisi Pemuda Pemudi GKII Baliem Tengah. Klik kartu pengurus untuk melihat detail peran dan kontak pelayanan."
        breadcrumb="Struktur Organisasi"
      />

      <section className="py-16 sm:py-20 bg-[#F6F8FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-40 rounded-2xl bg-slate-200 animate-pulse" />
              <div className="h-40 rounded-2xl bg-slate-200 animate-pulse" />
            </div>
          ) : members.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center text-slate-600">
              Belum ada data pengurus yang ditambahkan.
            </div>
          ) : (
            <div className="space-y-8">
              {/* Tier 1: Ketua & Wakil Ketua */}
              {tiers.executive.length > 0 && (
                <AnimatedSection variant="scaleIn">
                  <div className="text-center mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A87E26]">
                      Tingkat I · Pimpinan Komisi
                    </p>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B1F3A] mt-1">
                      Ketua
                    </h2>
                  </div>
                  <div
                    className={`mx-auto grid grid-cols-1 gap-6 ${
                      tiers.executive.length === 1
                        ? 'max-w-md'
                        : 'max-w-4xl md:grid-cols-2'
                    }`}
                  >
                    {tiers.executive.map((m) => (
                      <MemberCard
                        key={m.id}
                        member={m}
                        highlight
                        onSelect={setSelectedMember}
                      />
                    ))}
                  </div>
                </AnimatedSection>
              )}

              <HierarchyConnector delay={0.05} />

              {/* Tier 2: Sekretaris & Bendahara */}
              {tiers.secretariatTreasury.length > 0 && (
                <AnimatedSection delay={0.08} variant="fadeUp">
                  <div className="text-center mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A87E26]">
                      Tingkat II · Kesekretariatan & Kebendaharaan
                    </p>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B1F3A] mt-1">
                      Sekretaris & Bendahara
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {tiers.secretariatTreasury.map((m) => (
                      <MemberCard
                        key={m.id}
                        member={m}
                        onSelect={setSelectedMember}
                      />
                    ))}
                  </div>
                </AnimatedSection>
              )}

              <HierarchyConnector delay={0.1} />

              {/* Tier 3: Koordinator Bidang */}
              {tiers.coordinators.length > 0 && (
                <AnimatedSection delay={0.12} variant="fadeUp">
                  <div className="text-center mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A87E26]">
                      Tingkat III · Bidang Pelayanan
                    </p>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B1F3A] mt-1">
                      Koordinator Bidang
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {tiers.coordinators.map((m) => (
                      <MemberCard
                        key={m.id}
                        member={m}
                        onSelect={setSelectedMember}
                      />
                    ))}
                  </div>
                </AnimatedSection>
              )}

              {/* Tier 4: Anggota */}
              {tiers.members.length > 0 && (
                <AnimatedSection delay={0.14} variant="fadeUp">
                  <div className="pt-8 border-t border-slate-200">
                    <div className="text-center mb-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A87E26]">
                        Tingkat IV · Tim Pelaksana
                      </p>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B1F3A] mt-1">
                        Anggota Komisi
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {tiers.members.map((m) => (
                        <MemberCard
                          key={m.id}
                          member={m}
                          onSelect={setSelectedMember}
                        />
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Profile Detail Spotlight Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Detail pengurus ${selectedMember.fullName}`}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071426]/70 backdrop-blur-xs"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
            >
              <div className="bg-[#0B1F3A] p-6 text-white flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#071426] ring-2 ring-[#C89B3C]/60 overflow-hidden flex items-center justify-center shrink-0">
                    {selectedMember.photoUrl ? (
                      <SafeImage
                        src={selectedMember.photoUrl}
                        alt={selectedMember.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-7 h-7 text-[#DCB458]" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#DCB458]">
                      {selectedMember.role}
                    </p>
                    <h3 className="font-display font-bold text-lg leading-snug mt-0.5">
                      {selectedMember.fullName}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {selectedMember.division}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  aria-label="Tutup detail pengurus"
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Tugas & Pelayanan
                  </p>
                  <p className="mt-1.5 text-sm text-slate-700 leading-relaxed">
                    {selectedMember.description ||
                      'Melayani di bawah koordinasi Komisi Pemuda Pemudi GKII Baliem Tengah.'}
                  </p>
                </div>
                {selectedMember.contact && (
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-[#A87E26]" />
                    <span>{selectedMember.contact}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
