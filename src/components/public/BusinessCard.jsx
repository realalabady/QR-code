import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Building2, PhoneCall } from 'lucide-react'
import { downloadVCard } from '../../lib/vcf'
import styles from './BusinessCard.module.css'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
}

function FloatingAction({ icon: Icon, label, href, index }) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      aria-label={label}
      className={styles.fab}
      custom={index}
      variants={fadeUp}
      whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.18)' }}
      whileTap={{ scale: 0.92 }}
    >
      <Icon size={22} strokeWidth={1.7} />
      <span className={styles.fabLabel}>{label}</span>
    </motion.a>
  )
}

function InfoRow({ icon: Icon, label, value, href, extra, index }) {
  const Inner = (
    <div className={styles.rowInner}>
      <div className={styles.rowIconWrap}>
        <Icon size={18} strokeWidth={1.8} className={styles.rowIcon} />
      </div>
      <div className={styles.rowText}>
        <span className={styles.rowLabel}>{label}</span>
        <span className={styles.rowValue}>{value}</span>
        {extra}
      </div>
    </div>
  )

  return (
    <motion.div
      className={styles.row}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="show"
    >
      {href ? (
        <a
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel="noreferrer"
          className={styles.rowLink}
        >
          {Inner}
        </a>
      ) : (
        Inner
      )}
      <div className={styles.rowDivider} />
    </motion.div>
  )
}

export default function BusinessCard({ card }) {
  const phone = card.phones?.[0] || ''
  const whatsappHref = card.whatsapp_number
    ? `https://wa.me/${card.whatsapp_number.replace(/\D/g, '')}`
    : null

  const fabs = [
    phone && { icon: PhoneCall, label: 'Call', href: `tel:${phone}` },
    card.email && { icon: Mail, label: 'Email', href: `mailto:${card.email}` },
    card.location_map_url && { icon: MapPin, label: 'Location', href: card.location_map_url },
  ].filter(Boolean)

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ── HERO ── */}
        <div className={styles.hero}>
          {/* Logo badge */}
          <motion.div
            className={styles.logoBadge}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {card.logo_url ? (
              <img src={card.logo_url} alt={card.company || 'Logo'} className={styles.logoImg} />
            ) : card.profile_photo_url ? (
              <img src={card.profile_photo_url} alt={card.name} className={styles.logoImg} />
            ) : (
              <span className={styles.logoFallback}>
                {card.name?.[0]?.toUpperCase() ?? '?'}
              </span>
            )}
          </motion.div>

          {/* Name + title */}
          <motion.h1
            className={styles.name}
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
          >
            {card.name}
          </motion.h1>
          {card.job_title && (
            <motion.p
              className={styles.role}
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="show"
            >
              {card.job_title}
            </motion.p>
          )}
        </div>

        {/* ── FLOATING ACTION BUTTONS ── */}
        {fabs.length > 0 && (
          <motion.div
            className={styles.fabs}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            animate="show"
          >
            {fabs.map((f, i) => (
              <FloatingAction key={f.label} {...f} index={i} />
            ))}
          </motion.div>
        )}

        {/* ── BODY ── */}
        <div className={styles.body}>
          {/* Tagline */}
          {card.company && (
            <motion.p
              className={styles.tagline}
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="show"
            >
              We design, build and develop trust
            </motion.p>
          )}

          {/* Info rows */}
          <div className={styles.rows}>
            {card.phones?.filter(Boolean).map((p, i) => (
              <InfoRow
                key={i}
                icon={Phone}
                label="Work Phone"
                value={p}
                href={`tel:${p}`}
                index={i}
              />
            ))}

            {card.email && (
              <InfoRow
                icon={Mail}
                label="Email"
                value={card.email}
                href={`mailto:${card.email}`}
                index={2}
              />
            )}

            {card.location_text && (
              <InfoRow
                icon={MapPin}
                label="Location"
                value={card.location_text}
                href={card.location_map_url || undefined}
                index={3}
                extra={
                  card.location_map_url && (
                    <a
                      href={card.location_map_url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.mapPill}
                    >
                      Show on Map
                    </a>
                  )
                }
              />
            )}

            {card.company && (
              <InfoRow
                icon={Building2}
                label={card.company}
                value={card.job_title || ''}
                index={4}
              />
            )}
          </div>

          {/* Social pills */}
          {(card.linkedin_url || whatsappHref) && (
            <motion.div
              className={styles.socials}
              variants={fadeUp}
              custom={5}
              initial="hidden"
              animate="show"
            >
              {card.linkedin_url && (
                <a href={card.linkedin_url} target="_blank" rel="noreferrer" className={`${styles.socialBtn} ${styles.linkedin}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-2.5 3.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-9.5 1h-2v9h2v-9zm1-2.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm4.5 2.5c-1.1 0-1.8.6-2 1.2V7H9v9h2v-4.8c0-1.1.6-1.7 1.5-1.7s1.5.6 1.5 1.7V16h2v-5c0-2-1.2-3-2.5-3z"/>
                  </svg>
                  LinkedIn
                </a>
              )}
              {whatsappHref && (
                <a href={whatsappHref} target="_blank" rel="noreferrer" className={`${styles.socialBtn} ${styles.whatsapp}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.07-1.35A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.93 13.8c-.2.56-1.18 1.08-1.62 1.13-.43.05-.84.2-2.84-.59-2.38-.95-3.9-3.35-4.01-3.5-.12-.16-.97-1.28-.97-2.44 0-1.16.6-1.73.82-1.97.21-.23.46-.29.61-.29h.44c.14 0 .33-.05.52.4l.67 1.63c.06.14.1.3.02.47l-.25.45-.37.4c-.12.12-.25.25-.11.49.14.24.64 1.05 1.37 1.7.94.84 1.73 1.1 1.97 1.22.24.12.38.1.52-.06l.74-.87c.15-.18.3-.12.5-.07l1.56.73c.22.1.37.15.42.23.07.08.07.47-.13 1.04z"/>
                  </svg>
                  WhatsApp
                </a>
              )}
            </motion.div>
          )}

          {/* Add Contact CTA */}
          <motion.div
            variants={fadeUp}
            custom={6}
            initial="hidden"
            animate="show"
          >
            <motion.button
              className={styles.cta}
              onClick={() => downloadVCard(card)}
              whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
              whileTap={{ scale: 0.97 }}
              aria-label="Add contact to phone"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              Add Contact
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}


export default function BusinessCard({ card }) {
  const whatsappHref = card.whatsapp_number
    ? `https://wa.me/${card.whatsapp_number.replace(/\D/g, "")}`
    : null;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Top banner / logo */}
        <div className={styles.banner}>
          {card.logo_url && (
            <img
              src={card.logo_url}
              className={styles.logo}
              alt={`${card.company} logo`}
            />
          )}
        </div>

        {/* Avatar */}
        <div className={styles.avatarWrap}>
          {card.profile_photo_url ? (
            <img
              src={card.profile_photo_url}
              className={styles.avatar}
              alt={card.name}
            />
          ) : (
            <div className={styles.avatarFallback}>
              {card.name ? card.name[0].toUpperCase() : "?"}
            </div>
          )}
        </div>

        {/* Identity */}
        <div className={styles.identity}>
          <h1 className={styles.name}>{card.name}</h1>
          {card.job_title && (
            <p className={styles.jobTitle}>{card.job_title}</p>
          )}
          {card.company && <p className={styles.company}>{card.company}</p>}
        </div>

        {/* Contact details */}
        <div className={styles.details}>
          {card.phones &&
            card.phones.length > 0 &&
            card.phones.map((phone, i) => (
              <a key={i} href={`tel:${phone}`} className={styles.detailRow}>
                <span className={styles.detailIcon}>📞</span>
                <span>{phone}</span>
              </a>
            ))}

          {card.email && (
            <a href={`mailto:${card.email}`} className={styles.detailRow}>
              <span className={styles.detailIcon}>✉️</span>
              <span>{card.email}</span>
            </a>
          )}

          {card.location_text && (
            <a
              href={card.location_map_url || "#"}
              target="_blank"
              rel="noreferrer"
              className={styles.detailRow}
            >
              <span className={styles.detailIcon}>📍</span>
              <span>{card.location_text}</span>
            </a>
          )}
        </div>

        {/* Social buttons */}
        {(card.linkedin_url || whatsappHref) && (
          <div className={styles.socials}>
            {card.linkedin_url && (
              <a
                href={card.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className={`${styles.socialBtn} ${styles.linkedin}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="20"
                  height="20"
                >
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-2.5 3.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-9.5 1h-2v9h2v-9zm1-2.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm4.5 2.5c-1.1 0-1.8.6-2 1.2V7H9v9h2v-4.8c0-1.1.6-1.7 1.5-1.7s1.5.6 1.5 1.7V16h2v-5c0-2-1.2-3-2.5-3z" />
                </svg>
                LinkedIn
              </a>
            )}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className={`${styles.socialBtn} ${styles.whatsapp}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="20"
                  height="20"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.07-1.35A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.93 13.8c-.2.56-1.18 1.08-1.62 1.13-.43.05-.84.2-2.84-.59-2.38-.95-3.9-3.35-4.01-3.5-.12-.16-.97-1.28-.97-2.44 0-1.16.6-1.73.82-1.97.21-.23.46-.29.61-.29h.44c.14 0 .33-.05.52.4l.67 1.63c.06.14.1.3.02.47l-.25.45-.37.4c-.12.12-.25.25-.11.49.14.24.64 1.05 1.37 1.7.94.84 1.73 1.1 1.97 1.22.24.12.38.1.52-.06l.74-.87c.15-.18.3-.12.5-.07l1.56.73c.22.1.37.15.42.23.07.08.07.47-.13 1.04z" />
                </svg>
                WhatsApp
              </a>
            )}
          </div>
        )}

        {/* Add Contact CTA */}
        <div className={styles.cta}>
          <AddContactButton card={card} />
        </div>
      </div>
    </div>
  );
}
