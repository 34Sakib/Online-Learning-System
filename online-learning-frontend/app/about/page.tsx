"use client";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-blue-100">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-4">
            About Our Learning Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering professionals with industry-relevant skills through cutting-edge online education.
          </p>
        </div>

        {/* Mission & Values */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">Our Mission</h2>
            <p className="text-gray-700">
              To bridge the skills gap by providing accessible, high-quality technical education that prepares learners for real-world challenges.
            </p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-500">
            <h2 className="text-2xl font-bold text-indigo-800 mb-3">Our Vision</h2>
            <p className="text-gray-700">
              To become the premier platform for professional upskilling, recognized for our practical curriculum and exceptional learning outcomes.
            </p>
          </div>
        </div>

        {/* Founder Section */}
        <div className="mb-12 p-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Founder's Message</h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-3xl">
              SM
            </div>
            <div>
              <p className="text-gray-700 mb-4">
                "As a passionate educator and developer, I created this platform to democratize access to technical education. Our courses are designed to give you the exact skills employers are looking for."
              </p>
              <p className="font-semibold text-blue-700">— Sakib Al Mahamud, Founder & Lead Instructor</p>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">What We Offer</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Programming", items: ["C/C++", "Python", "JavaScript", "Java"], color: "blue" },
              { title: "Web Development", items: ["HTML/CSS", "React", "Node.js", "Next.js"], color: "indigo" },
              { title: "Data Science", items: ["Pandas", "NumPy", "Visualization", "Machine Learning"], color: "purple" },
              { title: "Databases", items: ["SQL", "MongoDB", "MySQL", "PostgreSQL"], color: "teal" },
              { title: "DevOps", items: ["Docker", "Kubernetes", "AWS", "CI/CD"], color: "cyan" },
              { title: "Soft Skills", items: ["Interview Prep", "Teamwork", "Communication", "Agile"], color: "sky" },
            ].map((category, index) => (
              <div key={index} className={`bg-${category.color}-50 p-4 rounded-lg border-t-4 border-${category.color}-500`}>
                <h3 className={`text-lg font-bold text-${category.color}-800 mb-3`}>{category.title}</h3>
                <ul className="space-y-1">
                  {category.items.map((item, i) => (
                    <li key={i} className="text-gray-700 flex items-center">
                      <span className={`w-2 h-2 bg-${category.color}-500 rounded-full mr-2`}></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Why Choose Our Platform</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🎯", title: "Industry-Aligned", desc: "Curriculum designed with input from tech leaders" },
              { icon: "👨‍🏫", title: "Expert Instructors", desc: "Learn from professionals with real-world experience" },
              { icon: "🛠️", title: "Hands-On Projects", desc: "Build portfolio-worthy projects in every course" },
              { icon: "📅", title: "Flexible Learning", desc: "Study at your own pace, on your schedule" },
              { icon: "📜", title: "Certification", desc: "Earn recognized credentials upon completion" },
              { icon: "🔄", title: "Continuous Updates", desc: "Content regularly refreshed to match industry trends" },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { quote: "This platform helped me transition from marketing to a full-stack developer role in just 6 months.", author: "Sarah K., Software Engineer" },
              { quote: "The project-based approach gave me the confidence to start freelancing immediately after completing the courses.", author: "Michael T., Freelance Developer" },
              { quote: "I doubled my salary after completing the data science specialization and applying what I learned.", author: "Priya M., Data Analyst" },
              { quote: "As a working professional, the flexible schedule allowed me to upskill without quitting my job.", author: "David L., IT Manager" },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                <p className="font-medium text-blue-700">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Transform Your Career?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have accelerated their careers with our courses.
          </p>
          <Link href="/courses" className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-3 px-8 rounded-full hover:shadow-lg transition-all inline-block">
  Explore Courses
</Link>
        </div>
      </div>
    </div>
  );
}