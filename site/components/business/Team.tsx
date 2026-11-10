/* eslint-disable @next/next/no-img-element -- photos are plain files in public/team/; the site is a static export */
import { HOME_SECTION } from "@/lib/site";
import { TEAM, teamPhoto, type TeamMember } from "@/lib/team";
import { Arrow, PersonIcon } from "../icons";

function MemberCard({ member }: { member: TeamMember }) {
  const placeholder = !member.name;
  return (
    <li className={placeholder ? "member is-placeholder" : "member"}>
      <div className="member-photo">
        {member.photo ? (
          <img src={teamPhoto(member.photo)} alt="" width={600} height={750} loading="lazy" />
        ) : (
          <PersonIcon />
        )}
      </div>
      <h3 className="member-name">{member.name ?? "Name coming soon"}</h3>
      <p className="member-role">{member.role ?? "Role to be added"}</p>
      {member.linkedin && (
        <a className="member-link" href={member.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
          <Arrow direction="external" />
          <span className="visually-hidden">: {member.name} (opens in a new tab)</span>
        </a>
      )}
    </li>
  );
}

export default function Team() {
  return (
    <section className="exploring team" id={HOME_SECTION.team} aria-labelledby="team-title">
      <div className="container">
        <div className="section-head">
          <h2 className="exploring-title" id="team-title">
            The team
          </h2>
          <p className="caption" aria-hidden="true">
            People · Skills · Curiosity
          </p>
        </div>
        <p className="team-lede">
          A small team of builders and learners. Full introductions are on their way.
        </p>
        <ul className="members" role="list">
          {TEAM.map((member, index) => (
            <MemberCard member={member} key={member.name ?? index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
