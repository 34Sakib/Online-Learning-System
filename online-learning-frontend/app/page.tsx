import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] font-sans">

      {/* Hero Section */}
      <main className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-20 gap-10 md:gap-16">
        {/* Left Content */}
        <div className="max-w-xl text-center md:text-left animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 drop-shadow-md">
            Unlock Your <br /> Potential
          </h1>
          <p className="text-xl text-gray-800 mb-3">Master new skills with expert-led online courses</p>
          <p className="text-base text-gray-600 mb-8">Flexible learning options. Lifetime access. Learn anytime, anywhere.</p>
          <Link href="/courses">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-xl hover:scale-105 transition duration-300 ease-in-out">
              Get Started
            </button>
          </Link>
        </div>

        {/* Cover Image */}
        <div className="flex-shrink-0 animate-fade-in">
          <img
            src="https://i.postimg.cc/5tNGV2W2/cover.png"
            alt="Online Learning Cover"
            className="rounded-xl shadow-2xl w-[340px] h-[260px] object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
            width={340}
            height={260}
          />
        </div>
      </main>
    </div>
  );
}
