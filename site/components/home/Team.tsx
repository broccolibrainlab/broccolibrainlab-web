/* eslint-disable @next/next/no-img-element -- photos are plain files in public/team/; the site is a static export */
import { HOME_SECTION } from "@/lib/site";
import { PLACEHOLDER_LINK, TEAM, teamPhoto, type TeamMember } from "@/lib/team";
import { Arrow, PersonIcon } from "../icons";
import { LpAside } from "../landing/LpProcess";

function ProfileLink({ href, label, name }: { href?: string; label: string; name: string }) {
  if (!href) return null;
  // Until the real URL is pasted into lib/team.ts the link stays in place but leads nowhere.
  const external = href !== PLACEHOLDER_LINK;
  return (
    <a
      className="member-link"
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : { "aria-disabled": true })}
    >
      {label}
      <Arrow direction="external" />
      <span className="visually-hidden">
        : {name}
        {external ? " (opens in a new tab)" : " (link coming soon)"}
      </span>
    </a>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  const placeholder = !member.name;
  return (
    <li className={placeholder ? "member is-placeholder" : "member"}>
      <div className="member-photo">
        {member.photo ? (
          <img src={teamPhoto(member.photo)} alt="" width={480} height={600} loading="lazy" decoding="async" />
        ) : (
          <PersonIcon />
        )}
      </div>
      <div className="member-body">
        <h3 className="member-name">{member.name ?? "Coming soon"}</h3>
        {member.degree && (
          <p className="member-degree">
            {member.degree}
            {member.university && <span>{member.university}</span>}
          </p>
        )}
        {member.name && (member.linkedin || member.github) && (
          <p className="member-links">
            <ProfileLink href={member.linkedin} label="LinkedIn" name={member.name} />
            <ProfileLink href={member.github} label="GitHub" name={member.name} />
          </p>
        )}
      </div>
    </li>
  );
}

// The left half of the "How we work together" band: the people who take those steps together, one row each.
export default function Team() {
  return (
    <LpAside id={HOME_SECTION.team} title="The team" lede="The people who keep the lab connected.">
      <ul className="members lp-members" role="list">
        {TEAM.map((member, index) => (
          <MemberCard member={member} key={member.name ?? index} />
        ))}
      </ul>
    </LpAside>
  );
}
