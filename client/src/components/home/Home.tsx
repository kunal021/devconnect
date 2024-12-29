import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import {
  MessageCircle,
  Terminal,
  Network,
  Share2,
  Users,
  Globe,
  Edit,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
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
      description:
        "Engage in specialized chat rooms for different programming languages, frameworks, and tech domains. Ask questions, share knowledge, and solve coding challenges together.",
    },
    {
      icon: Network,
      title: "Professional Networking",
      description:
        "Build your professional developer profile, showcase your skills, connect with potential mentors, teammates, and explore job opportunities in the tech industry.",
    },
    {
      icon: Share2,
      title: "Tech Post Sharing",
      description:
        "Create and share technical blog posts, tutorials, and insights. Engage with content through comments, likes, and collaborative annotations.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-100 to-green-200 flex flex-col items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        className="text-center max-w-3xl"
      >
        <motion.div
          className="flex items-center justify-center mb-6"
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Terminal className="text-green-600 mr-4" size={48} />
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-green-800"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            DevConnect
          </motion.h1>
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl text-green-700 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Your Ultimate Platform for Developer Collaboration and Growth
        </motion.p>

        <motion.button
          onClick={() => navigate("/auth/signup")}
          className="px-8 py-4 bg-lime-500 text-white rounded-full font-semibold text-lg shadow-lg hover:bg-lime-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Join DevConnect Now
        </motion.button>
      </motion.div>

      <motion.div
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-green-500"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 35px rgba(0,0,0,0.1)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.2, duration: 0.6 }}
          >
            <div className="flex items-center mb-4">
              <feature.icon className="text-green-600 mr-4" size={36} />
              <h2 className="text-2xl font-semibold text-green-700">
                {feature.title}
              </h2>
            </div>
            <p className="text-green-600">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-16 w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 400"
          className="w-full h-auto"
        >
          <defs>
            <linearGradient
              id="backgroundGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#d1fae5", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#bbf7d0", stopOpacity: 1 }}
              />
            </linearGradient>
            <clipPath id="postClip">
              <rect x="200" y="100" width="400" height="200" rx="10" />
            </clipPath>
          </defs>

          <rect width="800" height="400" fill="url(#backgroundGradient)" />

          {/* Post Creation Visualization */}
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <rect
              x="200"
              y="100"
              width="400"
              height="200"
              fill="white"
              rx="10"
              stroke="#10b981"
              strokeWidth="3"
            />

            <motion.rect
              x="220"
              y="120"
              width="360"
              height="40"
              fill="#e5e7eb"
              rx="5"
              initial={{ width: 0 }}
              animate={{ width: 360 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />

            <motion.rect
              x="220"
              y="170"
              width="360"
              height="100"
              fill="#f3f4f6"
              rx="5"
              initial={{ height: 0 }}
              animate={{ height: 100 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            />
          </motion.g>

          {/* Floating Icons */}
          <motion.circle
            cx="150"
            cy="200"
            r="40"
            fill="#10b981"
            initial={{ scale: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              rotate: [0, 20, -20, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Edit className="text-white" />
          </motion.circle>

          <motion.circle
            cx="650"
            cy="200"
            r="40"
            fill="#10b981"
            initial={{ scale: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              rotate: [0, -20, 20, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Share2 className="text-white" />
          </motion.circle>

          <text
            x="400"
            y="350"
            textAnchor="middle"
            fontSize="24"
            fill="#065f46"
          >
            Share, Collaborate, Inspire
          </text>
        </svg>
      </motion.div>

      {/* Post Lifecycle Visualization */}
      <motion.div
        className="mt-16 w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 300"
          className="w-full h-auto"
        >
          <defs>
            <linearGradient
              id="postLifecycleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#ecfdf5", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#d1fae5", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>

          <rect width="800" height="300" fill="url(#postLifecycleGradient)" />

          {/* Post Lifecycle Stages */}
          {[
            { x: 100, icon: Edit, label: "Create" },
            { x: 300, icon: Users, label: "Collaborate" },
            { x: 500, icon: Globe, label: "Publish" },
            { x: 700, icon: Share2, label: "Amplify" },
          ].map((stage, index) => (
            <motion.g key={stage.label}>
              <motion.circle
                cx={stage.x}
                cy="150"
                r="50"
                fill="#10b981"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.3,
                }}
              />
              <motion.text
                x={stage.x}
                y="150"
                textAnchor="middle"
                fill="white"
                fontSize="16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.3 + 0.3,
                }}
              >
                <stage.icon size={24} strokeWidth={2} />
              </motion.text>
              <motion.text
                x={stage.x}
                y="250"
                textAnchor="middle"
                fill="#065f46"
                fontSize="18"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.3 + 0.6,
                }}
              >
                {stage.label}
              </motion.text>
            </motion.g>
          ))}
        </svg>
      </motion.div>

      <motion.footer
        className="mt-16 text-center text-green-700"
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
