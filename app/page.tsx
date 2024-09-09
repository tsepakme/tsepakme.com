import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1>
      <p className="mb-4">
        {`Hi, my name is Aiusha. With a Master of Engineering background, 
        I bring an analytical and systematic approach to frontend development, 
        ensuring our applications are not only visually appealing but also 
        robust and maintainable. My journey from hydraulics to software 
        engineering underscores my adaptability and eagerness for continuous 
        learning, particularly in React.js and modern web technologies.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
