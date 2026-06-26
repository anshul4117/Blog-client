// High-fidelity client-side Mock Database utilizing LocalStorage for persistence

const MOCK_INITIAL_BLOGS = [
  {
    _id: "mock-blog-1",
    title: "Optimizing React v19 Concurrent Rendering Protocols",
    content: "React 19 concurrent updates and transition helper hooks are redefining frontend metrics. Let's inspect how to maximize performance under low-memory systems. By leveraging the new useTransition and useDeferredValue APIs, we can defer expensive updates and keep the main thread responsive. Furthermore, server-side caching and streaming HTML allow pages to boot instantly, optimizing Largest Contentful Paint (LCP) and interaction metrics across mobile networks.",
    createdAt: "2026-06-04T10:00:00.000Z",
    tags: ["React19", "Vite", "Performance"],
    likes: 42,
    likeCount: 42,
    comments: 8,
    commentCount: 8,
    bookmarks: 5,
    bookmarkCount: 5,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    userId: {
      _id: "mock-user-123",
      name: "Demo Visionary",
      username: "demouser",
      profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80"
    },
    author: {
      name: "Demo Visionary",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80"
    }
  },
  {
    _id: "mock-blog-2",
    title: "A Case for Glassmorphism in Modern Typography Layouts",
    content: "Blending frosted-glass properties with carefully mapped variable fonts creates a premium layout hierarchy that is both highly readable and futuristic. Glassmorphism relies heavily on background-blur, borders with low opacity, and harmonic shadow ranges to establish deep vertical layers. When paired with high-contrast font weights and dynamic typography scaling, the resulting interfaces feel premium, responsive, and tactile.",
    createdAt: "2026-06-02T14:30:00.000Z",
    tags: ["Glassmorphism", "CSS", "Design"],
    likes: 89,
    likeCount: 89,
    comments: 12,
    commentCount: 12,
    bookmarks: 10,
    bookmarkCount: 10,
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
    userId: {
      _id: "mock-user-admin",
      name: "Anshul",
      username: "anshul4117",
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80"
    },
    author: {
      name: "Anshul",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80"
    }
  },
  {
    _id: "mock-blog-3",
    title: "The Future of AI in Web Development and Autonomic Coding",
    content: "Developer experience (DX) and velocity are changing forever. Autonomic coding agents, real-time context injections, and predictive UI component design are no longer science fiction. We analyze how next-generation large language models integrate directly into development workflows to handle boilerplate, optimize security rules, and generate layout systems, freeing developers to focus purely on complex system design.",
    createdAt: "2026-05-29T08:15:00.000Z",
    tags: ["AI", "Autonomic", "Future"],
    likes: 124,
    likeCount: 124,
    comments: 15,
    commentCount: 15,
    bookmarks: 18,
    bookmarkCount: 18,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    userId: {
      _id: "mock-user-123",
      name: "Demo Visionary",
      username: "demouser",
      profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80"
    },
    author: {
      name: "Demo Visionary",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80"
    }
  }
];

const MOCK_DEFAULT_USER = {
  _id: "mock-user-123",
  name: "Demo Visionary",
  username: "demouser",
  email: "demo@example.com",
  password: "password123",
  role: "Lead Creator",
  profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80",
  location: "Neo-Tokyo, Earth",
  profession: "Lead UI Architect & Creator",
  bio: "Pioneering high-fidelity user experiences and digital products. Architecting clean code and beautiful user interfaces on the decentralized web.",
  followersCount: 1420,
  followingCount: 680,
  dateOfJoin: "2024-12-15T00:00:00.000Z",
  socialLinks: {
    github: "https://github.com",
    twitter: "https://twitter.com",
    website: "https://xdrop.dev"
  },
  interests: ["React 19", "Vite", "Tailwind v4", "Framer Motion", "Autonomic systems"]
};

const MOCK_INITIAL_DRAFTS = [
  {
    _id: "mock-draft-1",
    title: "Draft: Optimizing LCP in Concurrent React 19 Applications",
    content: "Concurrent mode in React 19 introduces automated batching and transitions. But how do we optimize Largest Contentful Paint (LCP) for slower 3G connections? In this article, we dive deep into server-side HTML streaming, lazy loading secondary UI components, and caching expensive calculation fragments.",
    tags: "React19, LCP, WebPerf",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
  },
  {
    _id: "mock-draft-2",
    title: "Draft: Designing Harmonious Dark Mode Interfaces",
    content: "Dark mode is more than just flipping light backgrounds to black. We need to construct custom color maps (e.g. HSL tailored Forest Green), design fine borders with 10% opacity, and layer glassmorphic cards with smooth shadows to maintain visual depth and accessibility.",
    tags: "Design, CSS, UI/UX",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
  }
];

// Initialize DB if not exists
export function initMockDb() {
  if (!localStorage.getItem("mock_db_initialized")) {
    localStorage.setItem("mock_db_blogs", JSON.stringify(MOCK_INITIAL_BLOGS));
    localStorage.setItem("mock_db_users", JSON.stringify([MOCK_DEFAULT_USER]));
    localStorage.setItem("mock_db_initialized", "true");
    console.log("Mock Database initialized successfully in LocalStorage.");
  }
  // Initialize mock drafts if they don't exist
  if (!localStorage.getItem("mock_db_drafts")) {
    localStorage.setItem("mock_db_drafts", JSON.stringify(MOCK_INITIAL_DRAFTS));
    console.log("Mock Drafts seeded in LocalStorage.");
  }
}

// Helper: read lists from storage
const getBlogs = () => {
  initMockDb();
  return JSON.parse(localStorage.getItem("mock_db_blogs") || "[]");
};

const saveBlogs = (blogs) => {
  localStorage.setItem("mock_db_blogs", JSON.stringify(blogs));
};

const getUsers = () => {
  initMockDb();
  let users = [];
  try {
    users = JSON.parse(localStorage.getItem("mock_db_users") || "[]");
  } catch {
    users = [];
  }
  if (!users.some(u => u.email === "demo@example.com")) {
    users.push(MOCK_DEFAULT_USER);
    localStorage.setItem("mock_db_users", JSON.stringify(users));
  }
  return users;
};

const saveUsers = (users) => {
  localStorage.setItem("mock_db_users", JSON.stringify(users));
};

const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Main Mock REST Router
export async function handleMockRequest(config) {
  // Simulate network latency (250ms)
  await new Promise((resolve) => setTimeout(resolve, 250));

  const { url, method, data: rawData } = config;
  const data = typeof rawData === "string" ? JSON.parse(rawData) : rawData;

  console.log(`[Mock DB Router] Intercepted: ${method.toUpperCase()} ${url}`, data);

  // Normalize URL paths by stripping domain / base prefixes
  let path = url;
  if (url.startsWith("http")) {
    try {
      const parsedUrl = new URL(url);
      path = parsedUrl.pathname + parsedUrl.search;
    } catch {
      // fallback if parsing fails
    }
  }
  // Strip any API version prefixes (e.g. /api/v1.2)
  path = path.replace(/^\/api\/v1\.\d+/, "").replace(/^\/api/, "");

  // ROUTER:
  
  // 1. POST: /users/login
  if (path === "/users/login" && method.toLowerCase() === "post") {
    const { email, password } = data || {};
    const users = getUsers();
    const match = users.find(u => u.email === email && u.password === password);

    if (match) {
      // Strip password from returned payload
      const { password: _, ...userPayload } = match;
      return {
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        data: {
          user: userPayload,
          accessToken: "mock-access-token-" + Date.now(),
          refreshToken: "mock-refresh-token-" + Date.now()
        }
      };
    } else {
      return Promise.reject({
        response: {
          status: 401,
          data: { message: "Invalid email or password ❌" }
        }
      });
    }
  }

  // 2. POST: /users/create (Register)
  if (path === "/users/create" && method.toLowerCase() === "post") {
    const { name, email, password, username } = data || {};
    const users = getUsers();
    
    if (users.some(u => u.email === email)) {
      return Promise.reject({
        response: {
          status: 400,
          data: { message: "Account with this email already exists." }
        }
      });
    }

    const newUser = {
      _id: "mock-user-" + Date.now(),
      name: name || "Anonymous User",
      username: username || "user_" + Math.floor(Math.random()*1000),
      email,
      password: password || "password123",
      role: "Creator Level 1",
      profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80",
      location: "Earth Sector",
      profession: "Independent Broadcast Node",
      bio: "Joined XDrop to share signals and write thoughts.",
      followersCount: 0,
      followingCount: 0,
      dateOfJoin: new Date().toISOString(),
      socialLinks: { github: "", twitter: "", website: "" },
      interests: []
    };

    saveUsers([...users, newUser]);

    return {
      status: 201,
      statusText: "Created",
      headers: {},
      config,
      data: {
        success: true,
        message: "Registration successful! You can now log in.",
        user: newUser
      }
    };
  }

  // 3. GET: /users/profile (Current Profile or Other Profile)
  if (path.startsWith("/users/profile") && method.toLowerCase() === "get") {
    const urlObj = new URL(url, "http://localhost");
    const queryUserId = urlObj.searchParams.get("userId");
    const users = getUsers();

    if (queryUserId) {
      // Check if it is a system mock user
      let profile = users.find(u => u._id === queryUserId);
      if (!profile) {
        const sysUsers = [
          {
            _id: "mock-user-admin",
            name: "Anshul",
            username: "anshul4117",
            profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
            role: "Founder & Architect",
            bio: "Creator of XDrop platform. Exploring next-gen user experience models."
          },
          {
            _id: "mock-user-elara",
            name: "Elara Vance",
            username: "elaravance",
            profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80",
            role: "Lead Typographer",
            bio: "Obsessed with variable type scales and responsive spacing curves."
          },
          {
            _id: "mock-user-kaelen",
            name: "Kaelen Voss",
            username: "kaelenvoss",
            profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
            role: "Systems Engineer",
            bio: "Optimizing Vite runtimes and concurrent React compilation layers."
          },
          {
            _id: "mock-user-lyra",
            name: "Lyra Sterling",
            username: "lyrasterling",
            profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=250&q=80",
            role: "UX Researcher",
            bio: "Studying cognitive load in highly animated, dark-mode interfaces."
          },
          {
            _id: "mock-user-soren",
            name: "Soren Thorne",
            username: "sorenthorne",
            profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
            role: "Security Cryptographer",
            bio: "Fusing decentralized identity concepts into standard web tokens."
          }
        ];
        const sysUser = sysUsers.find(u => u._id === queryUserId);
        if (sysUser) {
          profile = {
            ...sysUser,
            followersCount: 142,
            followingCount: 95,
            location: "Network Node",
            profession: sysUser.role,
            techStack: ["React 19", "CSS", "Design"],
            interests: ["Design Systems", "Web UI", "Typography"],
            socialLinks: { github: "https://github.com", twitter: "https://twitter.com", website: "https://xdrop.dev" }
          };
        }
      }
      if (profile) {
        return {
          status: 200,
          statusText: "OK",
          headers: {},
          config,
          data: {
            getProfile: profile
          }
        };
      }
    }

    const currentSession = getCurrentUser();
    if (!currentSession) {
      return Promise.reject({
        response: { status: 401, data: { message: "Access token expired or missing." } }
      });
    }

    const profile = users.find(u => u._id === currentSession._id || u.email === currentSession.email) || MOCK_DEFAULT_USER;
    
    return {
      status: 200,
      statusText: "OK",
      headers: {},
      config,
      data: {
        getProfile: profile
      }
    };
  }

  // 4. PATCH: /users/update-user-profile
  if (path === "/users/update-user-profile" && method.toLowerCase() === "patch") {
    const currentSession = getCurrentUser();
    if (!currentSession) {
      return Promise.reject({
        response: { status: 401, data: { message: "Unauthorized profile update." } }
      });
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u._id === currentSession._id || u.email === currentSession.email);

    if (userIndex !== -1) {
      // Merge values
      const updatedUser = {
        ...users[userIndex],
        ...data,
        // merge socialLinks and interests if passed nested
        socialLinks: {
          ...users[userIndex].socialLinks,
          ...(data.socialLinks || {})
        }
      };

      users[userIndex] = updatedUser;
      saveUsers(users);

      // Also update local storage session
      localStorage.setItem("currentUser", JSON.stringify({
        ...currentSession,
        ...updatedUser
      }));

      return {
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        data: {
          success: true,
          user: updatedUser
        }
      };
    }
  }

  // 5. GET: /blogs/allblogs
  if (path === "/blogs/allblogs" && method.toLowerCase() === "get") {
    const blogs = getBlogs();
    return {
      status: 200,
      statusText: "OK",
      headers: {},
      config,
      data: {
        data: {
          blogs: blogs
        }
      }
    };
  }

  // 6. GET: /blogs/myblogs
  if (path.startsWith("/blogs/myblogs") && method.toLowerCase() === "get") {
    const urlObj = new URL(url, "http://localhost");
    const queryUserId = urlObj.searchParams.get("userId");
    const blogs = getBlogs();

    if (queryUserId) {
      // Filter blogs authored by the requested user
      const userBlogs = blogs.filter(b => 
        b.userId?._id === queryUserId || 
        b.userId?.username === queryUserId ||
        (queryUserId === "mock-user-admin" && b.userId?._id === "mock-user-admin")
      );
      return {
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        data: {
          blogs: userBlogs
        }
      };
    }

    const currentSession = getCurrentUser();
    // Filter blogs authored by logged-in user
    const userBlogs = blogs.filter(b => 
      b.userId?._id === currentSession?._id || 
      b.userId?.username === currentSession?.username ||
      b.author?.name === currentSession?.name
    );

    return {
      status: 200,
      statusText: "OK",
      headers: {},
      config,
      data: {
        blogs: userBlogs
      }
    };
  }

  // 7. GET: /blogs/post/:id (Single post lookup)
  if (path.startsWith("/blogs/post/") && method.toLowerCase() === "get") {
    const id = path.split("/").pop();
    const blogs = getBlogs();
    const blog = blogs.find(b => b._id === id);

    if (blog) {
      return {
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        data: {
          blog: blog
        }
      };
    } else {
      return Promise.reject({
        response: { status: 404, data: { message: "Publication signal not found." } }
      });
    }
  }

  // 8. POST: /blogs/create
  if (path === "/blogs/create" && method.toLowerCase() === "post") {
    const currentSession = getCurrentUser();
    const blogs = getBlogs();
    const { title, content, tags, image } = data || {};

    const newBlog = {
      _id: "blog-" + Date.now(),
      title: title || "Untitled Draft Transmission",
      content: content || "",
      createdAt: new Date().toISOString(),
      tags: tags || [],
      likes: 0,
      likeCount: 0,
      comments: 0,
      commentCount: 0,
      bookmarks: 0,
      bookmarkCount: 0,
      image: image || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
      userId: {
        _id: currentSession?._id || "mock-user-123",
        name: currentSession?.name || "Demo User",
        username: currentSession?.username || "demouser",
        profilePicture: currentSession?.profilePicture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80"
      },
      author: {
        name: currentSession?.name || "Demo User",
        avatar: currentSession?.profilePicture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80"
      }
    };

    saveBlogs([newBlog, ...blogs]);

    return {
      status: 200,
      statusText: "OK",
      headers: {},
      config,
      data: {
        success: true,
        blog: newBlog
      }
    };
  }

  // 9. PUT: /blogs/update/:id (Edit/Update a blog)
  if (path.startsWith("/blogs/update/") && method.toLowerCase() === "put") {
    const id = path.split("/").pop();
    const blogs = getBlogs();
    const blogIndex = blogs.findIndex(b => b._id === id);

    if (blogIndex !== -1) {
      const { title, content, tags, image } = data || {};
      const updatedBlog = {
        ...blogs[blogIndex],
        title: title || blogs[blogIndex].title,
        content: content || blogs[blogIndex].content,
        tags: tags || blogs[blogIndex].tags,
        image: image !== undefined ? image : blogs[blogIndex].image,
        updatedAt: new Date().toISOString(),
      };

      blogs[blogIndex] = updatedBlog;
      saveBlogs(blogs);

      return {
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        data: {
          success: true,
          blog: updatedBlog,
          message: "Broadcast signal updated successfully."
        }
      };
    } else {
      return Promise.reject({
        response: { status: 404, data: { message: "Signal not found for update." } }
      });
    }
  }

  // 10. DELETE: /blogs/del-blog/:id
  if (path.startsWith("/blogs/del-blog/") && method.toLowerCase() === "delete") {
    const id = path.split("/").pop();
    const blogs = getBlogs();
    const filtered = blogs.filter(b => b._id !== id);

    if (filtered.length < blogs.length) {
      saveBlogs(filtered);
      return {
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        data: {
          success: true,
          message: "Broadcast terminated."
        }
      };
    } else {
      return Promise.reject({
        response: { status: 404, data: { message: "Failed to delete: signal not found." } }
      });
    }
  }

  // Fallback for unmocked routes
  return Promise.reject({
    response: {
      status: 404,
      data: { message: `Route ${method.toUpperCase()} ${path} not implemented in Sandbox Mock DB.` }
    }
  });
}
