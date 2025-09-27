import NewsLetterSection from './NewsLetterSection';
import LinksSection from './LinksSection';
import LayoutSpacing from './LayoutSpacing';
import Link from 'next/link';
import Image from 'next/image';
import { socialsData, paymentBadgesData } from './footerData';

function cn(classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Footer() {
  return (
    <footer className=" bg-black">
      
      <div className="pt-8 md:pt-[50px] container mx-auto px-4 pb-4 ">
        <div className="max-w-frame mx-auto">
          <nav className="lg:grid lg:grid-cols-12 mb-8">
            <div className="flex flex-col lg:col-span-3 lg:max-w-[248px]">
              <Link href="/" className=" mb-6 flex items-center ">
              <Image
                  src="/logo1.png"
                  alt="Logo"
                  width={100}
                  height={100}
                  className='w-16 h-14'
                  style={{ height: "auto" }}
                />
                <h1 className="text-[28px] lg:text-[32px] font-bold text-white">
                  SkyZonee
                </h1>
              </Link>
              <p className="text-white/60 text-sm mb-9">
                We have clothes that suits your style and which you&apos;re proud to
                wear. From women to men.
              </p>
              <div className="flex items-center">
                {socialsData.map((social) => (
                  <Link
                    href={social.url}
                    key={social.id}
                    className="bg-white hover:bg-gray-200 hover:text-black transition-all mr-3 w-7 h-7 rounded-full border border-white/20 flex items-center justify-center p-1.5 text-black"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden lg:grid col-span-9 lg:grid-cols-4 lg:pl-10">
              <LinksSection />
            </div>
            <div className="grid lg:hidden grid-cols-2 sm:grid-cols-4">
              <LinksSection />
            </div>
          </nav>

          <hr className="h-[1px] border-t-white/10 mb-6" />
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mb-2">
            <p className="text-sm text-center sm:text-left text-white/60 mb-4 sm:mb-0 sm:mr-1">
              SkyZonee © {new Date().getFullYear()} Made by{" "}
              <Link
                href="https://rianhasansiam.me"
                className="text-white font-medium hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Rian Hasan Siam
              </Link>
              {", "}
              All rights reserved.
            </p>
            <div className="flex items-center">
              {paymentBadgesData.map((badge, _, arr) => (
                <span
                  key={badge.id}
                  className={cn([
                    arr.length !== badge.id && "mr-3",
                    "w-[46px] h-[30px] rounded-[5px] border border-[#D6DCE5] bg-white flex items-center justify-center",
                  ])}
                >
                  <Image
                    priority
                    src={badge.srcUrl}
                    width={33}
                    height={100}
                    alt="Payment method"
                    className="max-h-[15px] object-contain"
                    style={{ height: "auto" }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
        <LayoutSpacing />
      </div>
    </footer>
  );
}
