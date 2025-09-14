import Link from "next/link";

const BreadcrumbShop = () => {
  return (
    <nav className="mb-5 sm:mb-9">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link href="/" className="text-gray-500 hover:text-black">
            Home
          </Link>
        </li>
        <li className="text-gray-400">/</li>
        <li className="text-black font-medium">Shop</li>
      </ol>
    </nav>
  );
};

export default BreadcrumbShop;