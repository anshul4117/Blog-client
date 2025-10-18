import MainLayout from "../components/layout/MainLayout.jsx";
import PostCard from "../components/blog/PostCard.jsx";

const posts = [
  {
    id: 1,
    title: "Building a MERN Blog App",
    excerpt: "Learn how to build a production-ready MERN stack application step by step.",
    author: "Anshul Kumar",
    date: "Oct 2025",
    image: "https://source.unsplash.com/800x400/?coding,developer",
  },
  {
    id: 2,
    title: "Clean Architecture in Node.js",
    excerpt: "Understanding service layers, repositories, and modular structures.",
    author: "John Doe",
    date: "Oct 2025",
    image: "https://source.unsplash.com/800x400/?javascript,backend",
  },
];

export default function Home() {
  return (
    <MainLayout>
      <section className=" min-h-screen flex items-center relative">
        {/* Decorative bubbles (purely visual) */}
        <div aria-hidden="true" className="absolute left-20 top-10 w-56 h-56 rounded-full bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-300 opacity-40 blur-2xl transform rotate-45" />
        <div aria-hidden="true" className="absolute right-8 top-24 w-72 h-72 rounded-full bg-gradient-to-br from-yellow-200 via-amber-200 to-pink-300 opacity-30 blur-2xl" />
        <div aria-hidden="true" className="absolute right-180 bottom-10 w-64 h-64 rounded-full bg-gradient-to-tl from-cyan-200 via-blue-200 to-indigo-200 opacity-30 blur-2xl" />

        <div className="w-full min-h-screen px-6 py-7 lg:py-10">
          <div className="mx-auto max-w-7xl flex flex-col-reverse lg:flex-row items-center gap-8 min-h-[60vh] lg:min-h-[70vh]">
            {/* Text column */}
            <div className="flex-1 text-center lg:text-left px-4 lg:px-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                Write Your
                <span className="block text-primary">Blogs</span>
                <span className="block">Here</span>
              </h1>

              <p className="mt-6 text-lg text-slate-600 max-w-lg mx-auto lg:mx-0">
                Share your ideas, tutorials and stories with the world. Start writing beautiful,
                readable posts and reach more readers.
              </p>

              <div className="mt-8 flex justify-center lg:justify-start gap-4">
                <button className="px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                  Get Started
                </button>
                <a href="#posts" className="px-6 py-3 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition">
                  Browse Posts
                </a>
              </div>
            </div>

            {/* Image column */}
            <div className="flex-1 flex justify-center lg:justify-end px-4 lg:px-12">
              <div className="relative w-full max-w-3xl h-full flex items-center justify-center">
                {/* framed photo/card */}
                <div className=" -inset-4 bg-white rounded-2xl  transform rotate-1" />

                {/* Blob-clipped image (uses /Woman.jpeg from public/) */}
                <div className="overflow-hidden rounded-2xl relative w-full h-[420px] sm:h-[520px] md:h-[600px]">
                  <svg viewBox="0 0 600 600" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <clipPath id="blobClip">
                        <path d="M421.5 299.5c33.2 41 56.6 93.5 49.8 131.9-6.8 38.3-46.6 61.4-86.9 73.1-40.3 11.7-81.2 12.9-122.6 4.3-41.4-8.6-83.3-27.6-111.2-58.1-27.9-30.5-42.9-74.5-39.8-114.5 3.1-40 23.1-76 49.1-106.1C137 184 177.5 158 219.7 145.9c42.2-12.1 86.9-11.8 128.8 1.8 41.9 13.6 80 39.9 72.9 78.9z" transform="translate(-50 70) scale(1)" />
                      </clipPath>
                    </defs>
                    {/* <image href="././public/Woman.jpeg" x="0" y="0" width="600" height="600" preserveAspectRatio="xMidYMid slice" clipPath="url(#blobClip)" /> */}

                    <g clipPath="url(#blobClip)">
                      <image href="../public/Woman.jpeg" x="0" y="0" width="600" height="600" preserveAspectRatio="xMidYMid slice" />
                    </g>
                  </svg>
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
