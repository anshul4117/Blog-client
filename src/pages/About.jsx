// add function about my blog app
import MainLayout from "../components/layout/MainLayout.jsx";

export default function About() {
  return (
    <MainLayout>
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-6">About Our Blog App</h1>
        <p className="max-w-3xl text-center text-lg text-slate-700">
          Our Blog App is a platform designed to empower writers and bloggers to share their stories,
          tutorials, and ideas with a global audience. Built with the MERN stack (MongoDB, Express.js,
          React, Node.js), our application offers a seamless and user-friendly experience for both
          content creators and readers.
        </p>
        <p className="max-w-3xl text-center text-lg text-slate-700 mt-4">
          Whether you're a seasoned blogger or just starting out, our app provides all the tools you need to
          create beautiful, readable posts and reach more readers. Join our community today and start
          sharing your voice with the world!
        </p>
      </section>
    </MainLayout>
  );
}
