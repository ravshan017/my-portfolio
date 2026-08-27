import { Preloader } from "@/components/preloader";
import { ScrollProgress } from "@/components/scroll-progress";
import { Header } from "@/components/header";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { BlogPreview } from "@/components/sections/blog";
import { Media } from "@/components/sections/media";
import { Contact } from "@/components/sections/contact";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = await getAllPosts();
  return (
    <>
      <ScrollProgress />
      <Preloader />
      <Header />
      <main id="main" className="flex-1">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <BlogPreview posts={posts} />
        <Media />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
