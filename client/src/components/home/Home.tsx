import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { MessageCircle, Terminal, Network, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "../extra/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";

const Home = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    });
  }, [controls]);

  const features = [
    {
      icon: MessageCircle,
      title: "Instant Tech Chat",
      image: "./undraw_chatting.svg",
      description:
        "Engage in specialized chat rooms for different programming languages, frameworks, and tech domains. Ask questions, share knowledge, and solve coding challenges together.",
    },
    {
      icon: Network,
      title: "Professional Networking",
      image: "./undraw_connected-world.svg",
      description:
        "Build your professional developer profile, showcase your skills, connect with potential mentors, teammates, and explore job opportunities in the tech industry.",
    },
    {
      icon: Share2,
      title: "Tech Post Sharing",
      image: "./undraw_online-connection.svg",
      description:
        "Create and share technical blog posts, tutorials, and insights. Engage with content through comments, likes, and collaborative annotations.",
    },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-white dark:bg-black">
      <div className="fixed top-6 right-6 z-30">
        <ThemeToggle />
      </div>

      <div className="fixed -top-24 -right-24 w-[28rem] h-[28rem] bg-lime-500/30 rounded-full blur-3xl" />
      <div className="fixed top-24 -right-24 w-72 h-72 bg-lime-200/50 rounded-full blur-3xl" />

      <div className="relative w-full min-h-screen flex items-center justify-center z-20">
        <div
          className={`${
            theme === "dark" ? "darkback" : "lightback"
          } flex flex-col justify-center items-center`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            className="text-center max-w-3xl p-8"
          >
            <motion.div
              className="flex items-center justify-center mb-6"
              initial={{ opacity: 0, rotate: -10 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Terminal className="text-lime-600 mr-4" size={48} />
              <motion.h1
                className="text-5xl md:text-8xl font-bold text-black dark:text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Dev<span className="text-lime-500">Connect</span>
              </motion.h1>
            </motion.div>

            <motion.p
              className="text-2xl md:text-3xl font-bold text-lime-500 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Your Ultimate Platform for Developer Collaboration and Growth
            </motion.p>
          </motion.div>
          <motion.div
            className="absolute bottom-12 md:left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="w-6 h-10 border-2 border-lime-500 rounded-full flex justify-center items-start">
              <motion.div
                className="w-2 h-2 bg-lime-500 rounded-full"
                animate={{
                  y: [0, 6, 0],
                  opacity: [1, 0, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
            </div>
            <p className="text-sm text-lime-500 mt-2">Scroll Down</p>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="mt-16 w-full max-w-5xl z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <motion.div className="flex flex-col items-center justify-center">
          <motion.p
            className="text-2xl md:text-5xl font-bold mb-8 text-black dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Join Dev<span className="text-lime-500">Connect</span> Now
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-2lg md:text-4xl text-center font-bold mb-8 text-lime-500"
          >
            Connect with developers, collaborate on projects, share your ideas,
            and build a strong developer community.
          </motion.p>
          <motion.button
            onClick={() => navigate("/auth/signup")}
            className="px-8 py-4 bg-lime-50 text-lime-500 rounded-full border-2 border-lime-500 font-bold text-lg hover:bg-lime-100 transition-all duration-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join <span className="text-black">Dev</span>
            <span className="text-lime-500">Connect</span> Now
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-20 flex flex-col items-center justify-center max-w-3xl z-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-8"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-2xl md:text-5xl font-bold mb-6 text-black dark:text-white"
          >
            Why Choose Dev<span className="text-lime-500">Connect</span>
          </motion.h2>
        </motion.div>
        <div className="space-y-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-lg border-t-4 border-lime-500"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 35px rgba(0,0,0,0.1)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.2, duration: 0.6 }}
            >
              <div className="flex items-center mb-4">
                <feature.icon className="text-lime-700 mr-4" size={36} />
                <h2 className="text-2xl font-semibold text-lime-800">
                  {feature.title}
                </h2>
              </div>
              <p className="text-lime-700">{feature.description}</p>
              <img src={feature.image} alt={feature.title} className="mt-4" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.footer
        className="mt-16 text-center text-lime-700 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        © 2024 DevConnect. Empowering Developer Communities.
      </motion.footer>
    </div>
  );
};

export default Home;
