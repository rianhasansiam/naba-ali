// Footer data for the NABA ALI website
export const footerLinksData = [
  {
    id: 1,
    title: "COMPANY",
    children: [
      { id: 10, label: "About", url: "/about" },
      { id: 11, label: "Features", url: "/features" },
      { id: 12, label: "Works", url: "/works" },
      { id: 13, label: "Career", url: "/career" },
    ],
  },
  {
    id: 2,
    title: "HELP",
    children: [
      { id: 20, label: "Customer Support", url: "/support" },
      { id: 21, label: "Delivery Details", url: "/delivery" },
      { id: 22, label: "Terms & Conditions", url: "/terms" },
      { id: 23, label: "Privacy Policy", url: "/privacy" },
    ],
  },
  {
    id: 3,
    title: "FAQ",
    children: [
      { id: 30, label: "Account", url: "/faq/account" },
      { id: 31, label: "Manage Deliveries", url: "/faq/deliveries" },
      { id: 32, label: "Orders", url: "/faq/orders" },
      { id: 33, label: "Payments", url: "/faq/payments" },
    ],
  },
  {
    id: 4,
    title: "RESOURCES",
    children: [
      { id: 40, label: "Free eBooks", url: "/ebooks" },
      { id: 41, label: "Development Tutorial", url: "/tutorial" },
      { id: 42, label: "How to - Blog", url: "/blog" },
      { id: 43, label: "YouTube Playlist", url: "/youtube" },
    ],
  },
];

export const socialsData = [
  {
    id: 1,
    icon: (
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
      </svg>
    ),
    url: "https://twitter.com",
  },
  {
    id: 2,
    icon: (
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    url: "https://facebook.com",
  },
  {
    id: 3,
    icon: (
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.142.662-1.995 1.488-1.995.219 0 .438.16.438.359 0 .219-.139.548-.219.877-.199.957.484 1.797 1.406 1.797 1.687 0 2.984-1.797 2.984-4.388 0-2.297-1.625-3.908-3.949-3.908-2.69 0-4.287 2.018-4.287 4.099 0 .811.312 1.686.703 2.165.077.093.088.174.065.267-.07.295-.23.934-.262 1.065-.044.177-.143.215-.331.129-1.24-.577-2.017-2.394-2.017-3.858 0-3.13 2.274-6.009 6.548-6.009 3.44 0 6.109 2.451 6.109 5.73 0 3.42-2.157 6.175-5.15 6.175-1.006 0-1.954-.525-2.274-1.154l-.618 2.355c-.224.871-.834 1.96-1.244 2.621.937.29 1.931.446 2.962.446 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
      </svg>
    ),
    url: "https://pinterest.com",
  },
  {
    id: 4,
    icon: (
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    url: "https://instagram.com",
  },
  {
    id: 5,
    icon: (
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    url: "https://linkedin.com",
  },
];

export const paymentBadgesData = [
  {
    id: 1,
    srcUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png",
  },
  {
    id: 2,
    srcUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png",
  },
  {
    id: 3,
    srcUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png",
  },
  {
    id: 4,
    srcUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png",
  },
  {
    id: 5,
    srcUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/2560px-Google_Pay_Logo.svg.png",
  },
];