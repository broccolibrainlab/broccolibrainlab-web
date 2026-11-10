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
      <h3 className="member-name">{member.name ?? "Coming soon"}</h3>
      {member.role && <p className="member-role">{member.role}</p>}
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
    <section className="lp-areas lp-team" id={HOME_SECTION.team} aria-labelledby="team-title">
      <div className="lp-wrap">
        <div className="lp-head">
          <div>
            <h2 className="lp-big" id="team-title">
              The team
            </h2>
            <p className="lp-big lp-head-lede">The people who keep the lab connected.</p>
          </div>
        </div>
        <ul className="members lp-members" role="list">
          {TEAM.map((member, index) => (
            <MemberCard member={member} key={member.name ?? index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
