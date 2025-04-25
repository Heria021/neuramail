
import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";

const reviews = [
    {
      name: "Ava Patel",
      username: "@ava_startup",
      body: "NeuraMail has transformed how I reply to leads. Feels like I’ve hired a smart assistant who knows my tone!",
      img: "https://avatar.vercel.sh/ava",
    },
    {
      name: "Leo Carter",
      username: "@leocodes",
      body: "No more email anxiety. Replies are clear, fast, and aligned with my docs. Sentinal nailed it.",
      img: "https://avatar.vercel.sh/leo",
    },
    {
      name: "Maya Rao",
      username: "@growthwithmaya",
      body: "Honestly, replying to investor emails used to take me hours. NeuraMail drafts perfect responses in seconds.",
      img: "https://avatar.vercel.sh/maya",
    },
    {
      name: "Noah Kim",
      username: "@noahwrites",
      body: "It's like my co-founder handles my inbox. Context-aware replies are next level. Total game-changer.",
      img: "https://avatar.vercel.sh/noah",
    },
    {
      name: "Zara Ahmed",
      username: "@zaraflows",
      body: "The Sentinal integration is powerful. NeuraMail understands our internal policies and never sounds robotic.",
      img: "https://avatar.vercel.sh/zara",
    },
    {
      name: "Ethan Li",
      username: "@ethan_inboxzero",
      body: "From cold outreach to support replies—this tool saves me hours daily. I'm addicted already.",
      img: "https://avatar.vercel.sh/ethan",
    },
  ];
const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-96 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function Reviews() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden my-8">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
