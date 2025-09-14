import Link from 'next/link';
import { footerLinksData } from './footerData';

function cn(classes) {
  return classes.filter(Boolean).join(' ');
}

export default function LinksSection() {
  return (
    <>
      {footerLinksData.map((item) => (
        <section className="flex flex-col mt-5" key={item.id}>
          <h3 className="font-medium text-sm md:text-base uppercase tracking-widest mb-6 text-white">
            {item.title}
          </h3>
          {item.children.map((link) => (
            <Link
              href={link.url}
              key={link.id}
              className={cn([
                link.id !== 41 && link.id !== 43 && "capitalize",
                "text-white/60 text-sm md:text-base mb-4 w-fit hover:text-white transition-colors duration-200",
              ])}
            >
              {link.label}
            </Link>
          ))}
        </section>
      ))}
    </>
  );
}